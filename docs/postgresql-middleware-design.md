# PostgreSQL 数据中间层设计方案

## 1. 概述

本方案旨在为 LifeApp React 应用提供一个基于 PostgreSQL 的数据中间层，替代当前使用 JSON 文件 + localStorage 的数据存储方案。该方案需要实现与现有系统无缝切换的能力，同时提供更好的数据持久性和扩展性。

## 2. 数据库表结构设计

### 2.1 任务表 (tasks)

存储所有类型任务的基本信息：

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10) NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
    task_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    priority VARCHAR(10) CHECK (priority IN ('高', '中', '低')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_tasks_type_task_id ON tasks(type, task_id);
```

### 2.2 任务完成状态表 (task_completions)

存储用户任务完成状态：

```sql
CREATE TABLE task_completions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL DEFAULT 'default_user',  -- 简化实现，实际项目中应为用户系统ID
    type VARCHAR(10) NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
    task_id INTEGER NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_completions_user_type ON task_completions(user_id, type);
CREATE INDEX idx_completions_user_type_task ON task_completions(user_id, type, task_id);
CREATE UNIQUE INDEX idx_completions_unique ON task_completions(user_id, type, task_id);
```

### 2.3 数据表说明

1. `tasks` 表存储任务的定义信息，包括标题、描述、分类和优先级等。这些信息是系统预定义的，不随用户而变化。
2. `task_completions` 表存储用户的任务完成状态，关联用户ID、任务类型和任务ID。
3. 通过 `type` 字段区分 daily、weekly、monthly 三种任务类型。
4. 使用 `user_id` 字段支持多用户（当前简化为默认用户）。

## 3. 初始化数据库SQL命令

```sql
-- 创建数据库（如果需要）
-- CREATE DATABASE lifeapp;

-- 连接到数据库
-- \c lifeapp;

-- 创建 tasks 表
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10) NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
    task_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    priority VARCHAR(10) CHECK (priority IN ('高', '中', '低')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_tasks_type ON tasks(type);
CREATE INDEX idx_tasks_type_task_id ON tasks(type, task_id);

-- 创建 task_completions 表
CREATE TABLE task_completions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL DEFAULT 'default_user',
    type VARCHAR(10) NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
    task_id INTEGER NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_completions_user_type ON task_completions(user_id, type);
CREATE INDEX idx_completions_user_type_task ON task_completions(user_id, type, task_id);
CREATE UNIQUE INDEX idx_completions_unique ON task_completions(user_id, type, task_id);

-- 插入默认的每日任务
INSERT INTO tasks (type, task_id, title) VALUES
('daily', 1, '晨间锻炼 30 分钟'),
('daily', 2, '阅读 20 页书籍'),
('daily', 3, '写日记总结今天'),
('daily', 4, '学习新技能 1 小时'),
('daily', 5, '与家人/朋友沟通'),
('daily', 6, '整理工作/学习笔记');

-- 插入默认的每周任务
INSERT INTO tasks (type, task_id, title, category) VALUES
('weekly', 1, '完成重要项目的规划', '工作'),
('weekly', 2, '深度阅读 2 本书', '学习'),
('weekly', 3, '与朋友聚会或深度交流', '社交'),
('weekly', 4, '尝试新的运动或活动', '健康'),
('weekly', 5, '整理和清洁生活空间', '生活'),
('weekly', 6, '学习新技能或课程', '学习'),
('weekly', 7, '回顾和规划下周目标', '规划'),
('weekly', 8, '进行创意项目或爱好', '创造');

-- 插入默认的每月任务
INSERT INTO tasks (type, task_id, title, description, category, priority) VALUES
('monthly', 1, '完成重要技能认证', '获得专业领域的认证或证书', '职业发展', '高'),
('monthly', 2, '建立新的人际关系', '结识新朋友或扩展专业网络', '人际关系', '中'),
('monthly', 3, '完成创意项目', '开始并完成一个个人创作项目', '个人成长', '中'),
('monthly', 4, '健康体检和调整', '进行全面体检并制定健康计划', '健康管理', '高'),
('monthly', 5, '财务规划和投资', '回顾财务状况并制定投资计划', '财务管理', '高'),
('monthly', 6, '深度学习新领域', '系统学习一个全新的知识领域', '学习成长', '中'),
('monthly', 7, '家庭关系维护', '加强与家人的联系和沟通', '家庭生活', '高'),
('monthly', 8, '制定下月目标', '回顾本月成果并规划下月计划', '规划总结', '中');
```

## 4. 后端实现方案

### 4.1 API 接口设计

创建以下 RESTful API 接口：

1. `GET /api/tasks/:type` - 获取指定类型的任务列表
2. `POST /api/tasks/:type/:id/toggle` - 切换任务完成状态
3. `GET /api/tasks/:type/completion` - 获取指定类型任务的完成状态

### 4.2 PostgreSQL 数据提供者实现

创建一个新的 `PostgreSQLTaskProvider` 类，实现 `ITaskDataProvider` 接口：

```typescript
// lib/postgresql-provider.ts
import { Pool, QueryResult } from 'pg';
import { TaskDataProvider } from './task-provider';
import { Task, TaskType, TaskCompletionState, DailyTask, WeeklyTask, MonthlyTask } from './types';

export class PostgreSQLTaskProvider extends TaskDataProvider {
  private pool: Pool;

  constructor() {
    super();
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // 或者使用详细配置：
      // host: process.env.DB_HOST,
      // port: parseInt(process.env.DB_PORT || '5432'),
      // database: process.env.DB_NAME,
      // user: process.env.DB_USER,
      // password: process.env.DB_PASSWORD,
    });
  }

  async loadTasks(type: TaskType): Promise<Task[]> {
    const query = `
      SELECT task_id as id, title, description, category, priority
      FROM tasks 
      WHERE type = $1
      ORDER BY task_id
    `;
    
    const result = await this.pool.query(query, [type]);
    
    return result.rows.map(row => {
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
            description: row.description,
            category: row.category,
            priority: row.priority
          } as MonthlyTask;
        default:
          return baseTask as Task;
      }
    });
  }

  async saveTasks(_type: TaskType, _tasks: Task[]): Promise<void> {
    // 任务定义存储在数据库中，不需要通过此方法保存
    // 实际的任务完成状态通过 saveCompletionState 处理
  }

  async loadCompletionState(type: TaskType): Promise<TaskCompletionState> {
    const query = `
      SELECT task_id, completed
      FROM task_completions
      WHERE user_id = $1 AND type = $2
    `;
    
    const result = await this.pool.query(query, ['default_user', type]);
    
    const state: TaskCompletionState = {};
    result.rows.forEach(row => {
      state[row.task_id] = row.completed;
    });
    
    return state;
  }

  async saveCompletionState(type: TaskType, state: TaskCompletionState): Promise<void> {
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
}
```

### 4.3 API 路由实现

创建 Next.js API 路由来处理前端请求：

```typescript
// app/api/tasks/[type]/route.ts
import { NextResponse } from 'next/server';
import { taskManager } from '@/lib/task-manager';
import { TaskType } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;
    
    // 验证任务类型
    if (!['daily', 'weekly', 'monthly'].includes(type)) {
      return NextResponse.json({ error: 'Invalid task type' }, { status: 400 });
    }
    
    const tasks = await taskManager.loadTasks(type as TaskType);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return NextResponse.json({ error: 'Failed to load tasks' }, { status: 500 });
  }
}
```

```typescript
// app/api/tasks/[type]/[id]/toggle/route.ts
import { NextResponse } from 'next/server';
import { taskManager } from '@/lib/task-manager';
import { TaskType } from '@/lib/types';

export async function POST(
  request: Request,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const { type, id } = params;
    
    // 验证任务类型和ID
    if (!['daily', 'weekly', 'monthly'].includes(type)) {
      return NextResponse.json({ error: 'Invalid task type' }, { status: 400 });
    }
    
    const taskId = parseInt(id);
    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }
    
    const updatedTasks = await taskManager.toggleTask(type as TaskType, taskId);
    return NextResponse.json(updatedTasks);
  } catch (error) {
    console.error('Failed to toggle task:', error);
    return NextResponse.json({ error: 'Failed to toggle task' }, { status: 500 });
  }
}
```

```typescript
// app/api/tasks/[type]/completion/route.ts
import { NextResponse } from 'next/server';
import { taskManager } from '@/lib/task-manager';
import { TaskType } from '@/lib/types';

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;
    
    // 验证任务类型
    if (!['daily', 'weekly', 'monthly'].includes(type)) {
      return NextResponse.json({ error: 'Invalid task type' }, { status: 400 });
    }
    
    // 注意：这个接口主要是为了兼容性，实际完成状态在 loadTasks 中一并获取
    const tasks = await taskManager.loadTasks(type as TaskType);
    const completionState: Record<number, boolean> = {};
    
    tasks.forEach(task => {
      completionState[task.id] = task.completed;
    });
    
    return NextResponse.json(completionState);
  } catch (error) {
    console.error('Failed to load completion state:', error);
    return NextResponse.json({ error: 'Failed to load completion state' }, { status: 500 });
  }
}
```

## 5. 与现有系统的无缝切换

### 5.1 依赖安装

首先安装 PostgreSQL 客户端：

```bash
npm install pg
npm install @types/pg --save-dev
```

### 5.2 环境变量配置

在项目根目录创建 `.env.local` 文件：

```env
# PostgreSQL 连接配置
DATABASE_URL=postgresql://username:password@localhost:5432/lifeapp
# 或者使用详细配置
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=lifeapp
# DB_USER=username
# DB_PASSWORD=password
```

### 5.3 任务管理器修改

修改 `lib/task-manager.ts` 以支持运行时切换提供者：

```typescript
// lib/task-manager.ts (修改后的部分)
import { TaskDataProvider } from './task-provider';
import { Task, TaskType, TaskCompletionState } from './types';
import { JSONFileTaskProvider } from './json-file-provider';
import { PostgreSQLTaskProvider } from './postgresql-provider';

export class TaskManager {
  private provider: TaskDataProvider;
  private taskCompletionCallbacks: Array<(type: TaskType) => void> = [];
  private allTasksCompletionCallbacks: Array<(type: TaskType) => void> = [];

  constructor(provider?: TaskDataProvider) {
    // 根据环境变量决定使用哪个提供者
    if (process.env.DATA_PROVIDER === 'postgresql' && provider === undefined) {
      this.provider = new PostgreSQLTaskProvider();
    } else {
      this.provider = provider || new JSONFileTaskProvider();
    }
  }

  // ... 其余代码保持不变
}

// 支持运行时切换的全局实例
let currentTaskManager: TaskManager | null = null;

export function getTaskManager(): TaskManager {
  if (!currentTaskManager) {
    currentTaskManager = new TaskManager();
  }
  return currentTaskManager;
}

// 切换数据提供者的函数
export function switchDataProvider(providerType: 'json' | 'postgresql'): void {
  if (providerType === 'postgresql') {
    process.env.DATA_PROVIDER = 'postgresql';
  } else {
    delete process.env.DATA_PROVIDER;
  }
  currentTaskManager = null; // 重置实例，下次获取时会使用新的提供者
}

export const taskManager = getTaskManager();
```

### 5.4 使用方式

1. 默认情况下，系统继续使用 JSON 文件 + localStorage 方案。
2. 要切换到 PostgreSQL 方案，设置环境变量：
   ```bash
   export DATA_PROVIDER=postgresql
   npm run dev
   ```
3. 也可以在代码中动态切换：
   ```typescript
   import { switchDataProvider } from '@/lib/task-manager';
   
   // 切换到 PostgreSQL
   switchDataProvider('postgresql');
   
   // 切换回 JSON
   switchDataProvider('json');
   ```

## 6. 部署和运维

### 6.1 数据库部署

1. 安装 PostgreSQL 数据库服务器
2. 创建数据库和用户：
   ```sql
   CREATE USER lifeapp_user WITH PASSWORD 'your_password';
   CREATE DATABASE lifeapp OWNER lifeapp_user;
   ```
3. 执行初始化 SQL 脚本创建表结构和默认数据

### 6.2 应用部署

1. 确保应用服务器可以访问 PostgreSQL 数据库
2. 配置正确的环境变量
3. 构建和部署 Next.js 应用

## 7. 安全考虑

1. 数据库连接使用环境变量存储敏感信息
2. 使用连接池管理数据库连接
3. 对 API 输入进行验证和清理
4. 在生产环境中使用 SSL/TLS 加密数据库连接

## 8. 性能优化

1. 合理使用数据库索引
2. 使用连接池避免频繁创建/销毁连接
3. 对频繁访问的数据考虑使用缓存机制
4. 查询优化，避免 N+1 查询问题

## 9. 测试方案

1. 单元测试：测试 PostgreSQLTaskProvider 的各个方法
2. 集成测试：测试 API 路由与数据库的交互
3. 端到端测试：模拟用户操作验证功能完整性