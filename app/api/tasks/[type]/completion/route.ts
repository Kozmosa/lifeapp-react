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