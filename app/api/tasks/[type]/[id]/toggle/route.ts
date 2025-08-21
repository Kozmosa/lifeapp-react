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