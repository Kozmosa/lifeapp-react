import { ITaskDataProvider, Task, TaskType, TaskCompletionState } from './types';

export abstract class TaskDataProvider implements ITaskDataProvider {
  abstract loadTasks(type: TaskType): Promise<Task[]>;
  abstract saveTasks(type: TaskType, tasks: Task[]): Promise<void>;
  abstract loadCompletionState(type: TaskType): Promise<TaskCompletionState>;
  abstract saveCompletionState(type: TaskType, state: TaskCompletionState): Promise<void>;

  protected getStorageKey(type: TaskType, suffix: string = ''): string {
    return `tasks_${type}${suffix}`;
  }
}