import { Pool } from 'pg';
import { TaskDataProvider } from './task-provider';
import { Task, TaskType, TaskCompletionState, DailyTask, WeeklyTask, MonthlyTask } from './types';

export class PostgreSQLTaskProvider extends TaskDataProvider {
  private pool: Pool;

  constructor() {
    super();
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/lifeapp',
    });
  }

  async loadTasks(type: TaskType): Promise&lt;Task[]&gt; {
    const query = `
      SELECT task_id as id, title, description, category, priority
      FROM tasks 
      WHERE type = $1
      ORDER BY task_id
    `;
    
    const result = await this.pool.query(query, [type]);
    
    return result.rows.map(row =&gt; {
      const baseTask = {
        id: row.id,
        title: row.title,
        completed: false  // 默认未完成，将由 completion state 覆盖
      };
      
      switch (type) {
        case 'daily':
          return baseTask as DailyTask;
        case 'weekly':
          return { ...baseTask, category: row.category } as WeeklyTask;
        case 'monthly':
          return { 
            ...baseTask, 
            description: row.description || '',
            category: row.category || '',
            priority: row.priority || '中'
          } as MonthlyTask;
        default:
          return baseTask as Task;
      }
    });
  }

  async saveTasks(_type: TaskType, _tasks: Task[]): Promise&lt;void&gt; {
    // 任务定义存储在数据库中，不需要通过此方法保存
    // 实际的任务完成状态通过 saveCompletionState 处理
  }

  async loadCompletionState(type: TaskType): Promise&lt;TaskCompletionState&gt; {
    const query = `
      SELECT task_id, completed
      FROM task_completions
      WHERE user_id = $1 AND type = $2
    `;
    
    const result = await this.pool.query(query, ['default_user', type]);
    
    const state: TaskCompletionState = {};
    result.rows.forEach(row =&gt; {
      state[row.task_id] = row.completed;
    });
    
    return state;
  }

  async saveCompletionState(type: TaskType, state: TaskCompletionState): Promise&lt;void&gt; {
    // 使用 PostgreSQL 的 UPSERT 功能
    const query = `
      INSERT INTO task_completions (user_id, type, task_id, completed, completed_at)
      VALUES ($1, $2, $3, $4, CASE WHEN $4 THEN CURRENT_TIMESTAMP ELSE NULL END)
      ON CONFLICT (user_id, type, task_id)
      DO UPDATE SET 
        completed = EXCLUDED.completed,
        completed_at = CASE WHEN EXCLUDED.completed THEN CURRENT_TIMESTAMP ELSE NULL END,
        updated_at = CURRENT_TIMESTAMP
    `;
    
    // 为每个状态项执行查询
    for (const [taskId, completed] of Object.entries(state)) {
      await this.pool.query(query, ['default_user', type, parseInt(taskId), completed]);
    }
  }
  
  // 确保在应用关闭时正确关闭连接池
  async close(): Promise&lt;void&gt; {
    await this.pool.end();
  }
}