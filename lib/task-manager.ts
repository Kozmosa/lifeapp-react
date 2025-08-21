import { TaskDataProvider } from './task-provider';
import { Task, TaskType, TaskCompletionState } from './types';
import { JSONFileTaskProvider } from './json-file-provider';
import { PostgreSQLTaskProvider } from './postgresql-provider';

export class TaskManager {
  private provider: TaskDataProvider;
  private taskCompletionCallbacks: Array&lt;(type: TaskType) =&gt; void&gt; = [];
  private allTasksCompletionCallbacks: Array&lt;(type: TaskType) =&gt; void&gt; = [];

  constructor(provider?: TaskDataProvider) {
    // 根据环境变量决定使用哪个提供者
    if (process.env.DATA_PROVIDER === 'postgresql' &amp;&amp; provider === undefined) {
      this.provider = new PostgreSQLTaskProvider();
    } else {
      this.provider = provider || new JSONFileTaskProvider();
    }
  }

  async loadTasks(type: TaskType): Promise&lt;Task[]&gt; {
    const tasks = await this.provider.loadTasks(type);
    const completionState = await this.provider.loadCompletionState(type);
    
    return tasks.map(task =&gt; ({
      ...task,
      completed: completionState[task.id.toString()] || task.completed
    }));
  }

  async saveTasks(type: TaskType, tasks: Task[]): Promise&lt;void&gt; {
    await this.provider.saveTasks(type, tasks);
    
    const completionState: TaskCompletionState = {};
    tasks.forEach(task =&gt; {
      completionState[task.id.toString()] = task.completed;
    });
    
    await this.provider.saveCompletionState(type, completionState);
  }

  async toggleTask(type: TaskType, taskId: number): Promise&lt;Task[]&gt; {
    const tasks = await this.loadTasks(type);
    let toggledTask: Task | undefined;
    
    const updatedTasks = tasks.map(task =&gt; {
      if (task.id === taskId) {
        toggledTask = { ...task, completed: !task.completed };
        return toggledTask;
      }
      return task;
    });

    await this.saveTasks(type, updatedTasks);

    // Check if task was just completed
    if (toggledTask &amp;&amp; toggledTask.completed) {
      this.notifyTaskCompletion(type);
      
      // Check if all tasks are completed
      const allCompleted = updatedTasks.every(task =&gt; task.completed);
      if (allCompleted) {
        this.notifyAllTasksCompletion(type);
      }
    }

    return updatedTasks;
  }

  onTaskCompletion(callback: (type: TaskType) =&gt; void): void {
    this.taskCompletionCallbacks.push(callback);
  }

  onAllTasksCompletion(callback: (type: TaskType) =&gt; void): void {
    this.allTasksCompletionCallbacks.push(callback);
  }

  private notifyTaskCompletion(type: TaskType): void {
    this.taskCompletionCallbacks.forEach(callback =&gt; callback(type));
  }

  private notifyAllTasksCompletion(type: TaskType): void {
    this.allTasksCompletionCallbacks.forEach(callback =&gt; callback(type));
  }
  
  // 切换数据提供者的函数
  switchDataProvider(providerType: 'json' | 'postgresql'): void {
    if (providerType === 'postgresql') {
      this.provider = new PostgreSQLTaskProvider();
    } else {
      this.provider = new JSONFileTaskProvider();
    }
  }
}

// Global instance
export const taskManager = new TaskManager();