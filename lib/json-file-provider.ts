import { TaskDataProvider } from './task-provider';
import { Task, TaskType, TaskCompletionState, DailyTask, WeeklyTask, MonthlyTask } from './types';

const defaultTasks = {
  daily: [
    { id: 1, title: "晨间锻炼 30 分钟", completed: false },
    { id: 2, title: "阅读 20 页书籍", completed: false },
    { id: 3, title: "写日记总结今天", completed: false },
    { id: 4, title: "学习新技能 1 小时", completed: false },
    { id: 5, title: "与家人/朋友沟通", completed: false },
    { id: 6, title: "整理工作/学习笔记", completed: false },
  ] as DailyTask[],
  
  weekly: [
    { id: 1, title: "完成重要项目的规划", completed: false, category: "工作" },
    { id: 2, title: "深度阅读 2 本书", completed: false, category: "学习" },
    { id: 3, title: "与朋友聚会或深度交流", completed: false, category: "社交" },
    { id: 4, title: "尝试新的运动或活动", completed: false, category: "健康" },
    { id: 5, title: "整理和清洁生活空间", completed: false, category: "生活" },
    { id: 6, title: "学习新技能或课程", completed: false, category: "学习" },
    { id: 7, title: "回顾和规划下周目标", completed: false, category: "规划" },
    { id: 8, title: "进行创意项目或爱好", completed: false, category: "创造" },
  ] as WeeklyTask[],
  
  monthly: [
    { 
      id: 1, 
      title: "完成重要技能认证", 
      description: "获得专业领域的认证或证书",
      completed: false, 
      category: "职业发展",
      priority: "高" as const
    },
    { 
      id: 2, 
      title: "建立新的人际关系", 
      description: "结识新朋友或扩展专业网络",
      completed: false, 
      category: "人际关系",
      priority: "中" as const
    },
    { 
      id: 3, 
      title: "完成创意项目", 
      description: "开始并完成一个个人创作项目",
      completed: false, 
      category: "个人成长",
      priority: "中" as const
    },
    { 
      id: 4, 
      title: "健康体检和调整", 
      description: "进行全面体检并制定健康计划",
      completed: false, 
      category: "健康管理",
      priority: "高" as const
    },
    { 
      id: 5, 
      title: "财务规划和投资", 
      description: "回顾财务状况并制定投资计划",
      completed: false, 
      category: "财务管理",
      priority: "高" as const
    },
    { 
      id: 6, 
      title: "深度学习新领域", 
      description: "系统学习一个全新的知识领域",
      completed: false, 
      category: "学习成长",
      priority: "中" as const
    },
    { 
      id: 7, 
      title: "家庭关系维护", 
      description: "加强与家人的联系和沟通",
      completed: false, 
      category: "家庭生活",
      priority: "高" as const
    },
    { 
      id: 8, 
      title: "制定下月目标", 
      description: "回顾本月成果并规划下月计划",
      completed: false, 
      category: "规划总结",
      priority: "中" as const
    },
  ] as MonthlyTask[]
};

export class JSONFileTaskProvider extends TaskDataProvider {
  async loadTasks(type: TaskType): Promise<Task[]> {
    return defaultTasks[type];
  }

  async saveTasks(_type: TaskType, _tasks: Task[]): Promise<void> {
    // JSON file is read-only, no saving needed for task definitions
  }

  async loadCompletionState(type: TaskType): Promise<TaskCompletionState> {
    const key = this.getStorageKey(type, '_completion');
    if (typeof window === 'undefined') return {};
    
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : {};
  }

  async saveCompletionState(type: TaskType, state: TaskCompletionState): Promise<void> {
    const key = this.getStorageKey(type, '_completion');
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(key, JSON.stringify(state));
  }
}