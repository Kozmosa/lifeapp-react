import { TaskType } from './types';

export class NotificationManager {
  private hasPermission = false;

  async requestPermission(): Promise<boolean> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      return this.hasPermission;
    }

    return false;
  }

  async showTaskCompletionNotification(taskType: TaskType): Promise<void> {
    if (!this.hasPermission) {
      await this.requestPermission();
    }

    if (this.hasPermission) {
      const typeNames = {
        daily: '每日',
        weekly: '每周',  
        monthly: '每月'
      };

      new Notification(`${typeNames[taskType]}任务完成`, {
        body: '恭喜！你完成了一个任务！',
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  }

  async showAllTasksCompletionNotification(taskType: TaskType): Promise<void> {
    if (!this.hasPermission) {
      await this.requestPermission();
    }

    if (this.hasPermission) {
      const typeNames = {
        daily: '每日',
        weekly: '每周',
        monthly: '每月'
      };

      new Notification(`🎉 ${typeNames[taskType]}任务全部完成！`, {
        body: `太棒了！你已经完成了所有${typeNames[taskType]}任务！`,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: true
      });
    }
  }
}

export const notificationManager = new NotificationManager();