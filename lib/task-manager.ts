import { TaskDataProvider } from './task-provider';
import { Task, TaskType, TaskCompletionState } from './types';
import { JSONFileTaskProvider } from './json-file-provider';

export class TaskManager {
  private provider: TaskDataProvider;
  private taskCompletionCallbacks: Array<(type: TaskType) => void> = [];
  private allTasksCompletionCallbacks: Array<(type: TaskType) => void> = [];

  constructor(provider?: TaskDataProvider) {
    // 根据环境变量决定使用哪个提供者
    if (process.env.DATA_PROVIDER === 'postgresql' && provider === undefined && typeof window === 'undefined') {
      // 初始设置为JSON provider，然后异步切换到PostgreSQL
      this.provider = new JSONFileTaskProvider();
      // 动态导入PostgreSQL provider只在服务器端
      import('./postgresql-provider').then(({ PostgreSQLTaskProvider }) => {
        this.provider = new PostgreSQLTaskProvider();
      }).catch(() => {
        // 保持使用JSON provider
      });
    } else {
      this.provider = provider || new JSONFileTaskProvider();
    }
  }

  async loadTasks(type: TaskType): Promise<Task[]> {
    const tasks = await this.provider.loadTasks(type);
    const completionState = await this.provider.loadCompletionState(type);
    
    return tasks.map(task => ({
      ...task,
      completed: completionState[task.id.toString()] || task.completed
    }));
  }

  async saveTasks(type: TaskType, tasks: Task[]): Promise<void> {
    await this.provider.saveTasks(type, tasks);
    
    const completionState: TaskCompletionState = {};
    tasks.forEach(task => {
      completionState[task.id.toString()] = task.completed;
    });
    
    await this.provider.saveCompletionState(type, completionState);
  }

  async toggleTask(type: TaskType, taskId: number): Promise<Task[]> {
    const tasks = await this.loadTasks(type);
    let toggledTask: Task | undefined;
    
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        toggledTask = { ...task, completed: !task.completed };
        return toggledTask;
      }
      return task;
    });

    await this.saveTasks(type, updatedTasks);

    // Check if task was just completed
    if (toggledTask && toggledTask.completed) {
      this.notifyTaskCompletion(type);
      
      // Check if all tasks are completed
      const allCompleted = updatedTasks.every(task => task.completed);
      if (allCompleted) {
        this.notifyAllTasksCompletion(type);
      }
    }

    return updatedTasks;
  }

  onTaskCompletion(callback: (type: TaskType) => void): void {
    this.taskCompletionCallbacks.push(callback);
  }

  onAllTasksCompletion(callback: (type: TaskType) => void): void {
    this.allTasksCompletionCallbacks.push(callback);
  }

  private notifyTaskCompletion(type: TaskType): void {
    this.taskCompletionCallbacks.forEach(callback => callback(type));
  }

  private notifyAllTasksCompletion(type: TaskType): void {
    this.allTasksCompletionCallbacks.forEach(callback => callback(type));
  }
  
  // 切换数据提供者的函数
  switchDataProvider(providerType: 'json' | 'postgresql'): void {
    if (providerType === 'postgresql' && typeof window === 'undefined') {
      import('./postgresql-provider').then(({ PostgreSQLTaskProvider }) => {
        this.provider = new PostgreSQLTaskProvider();
      }).catch(() => {
        this.provider = new JSONFileTaskProvider();
      });
    } else {
      this.provider = new JSONFileTaskProvider();
    }
  }
}

// Global instance
export const taskManager = new TaskManager();