export interface BaseTask {
  id: number;
  title: string;
  completed: boolean;
}

export type DailyTask = BaseTask;

export interface WeeklyTask extends BaseTask {
  category: string;
}

export interface MonthlyTask extends BaseTask {
  description: string;
  category: string;
  priority: "高" | "中" | "低";
}

export type TaskType = "daily" | "weekly" | "monthly";
export type Task = DailyTask | WeeklyTask | MonthlyTask;

export interface TaskData {
  daily: DailyTask[];
  weekly: WeeklyTask[];
  monthly: MonthlyTask[];
}

export interface TaskCompletionState {
  [key: string]: boolean;
}

export interface ITaskDataProvider {
  loadTasks(type: TaskType): Promise<Task[]>;
  saveTasks(type: TaskType, tasks: Task[]): Promise<void>;
  loadCompletionState(type: TaskType): Promise<TaskCompletionState>;
  saveCompletionState(type: TaskType, state: TaskCompletionState): Promise<void>;
}