"use client";

import { useState, useEffect, useCallback } from 'react';
import { taskManager, audioManager, notificationManager, Task, TaskType } from '../lib';

export function useTasks(type: TaskType) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const loadedTasks = await taskManager.loadTasks(type);
        setTasks(loadedTasks);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [type]);

  useEffect(() => {
    // Setup audio and notification callbacks
    const handleTaskCompletion = () => {
      audioManager.playTaskCompletionSound();
      notificationManager.showTaskCompletionNotification(type);
    };

    const handleAllTasksCompletion = () => {
      audioManager.playAllTasksCompletionSound();
      notificationManager.showAllTasksCompletionNotification(type);
    };

    taskManager.onTaskCompletion(handleTaskCompletion);
    taskManager.onAllTasksCompletion(handleAllTasksCompletion);

    // Request notification permission on first load
    notificationManager.requestPermission();
  }, [type]);

  const toggleTask = useCallback(async (taskId: number) => {
    try {
      const updatedTasks = await taskManager.toggleTask(type, taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  }, [type]);

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return {
    tasks,
    loading,
    toggleTask,
    completedCount,
    totalCount
  };
}