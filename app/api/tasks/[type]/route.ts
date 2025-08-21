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