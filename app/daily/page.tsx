"use client";

import Link from "next/link";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function DailyTasks() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "晨间锻炼 30 分钟", completed: false },
    { id: 2, title: "阅读 20 页书籍", completed: false },
    { id: 3, title: "写日记总结今天", completed: false },
    { id: 4, title: "学习新技能 1 小时", completed: false },
    { id: 5, title: "与家人/朋友沟通", completed: false },
    { id: 6, title: "整理工作/学习笔记", completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            ← 返回主页
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">每日任务</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {completedCount}/{totalCount} 已完成
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>今日进度</span>
            <span>{Math.round((completedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 任务列表 */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                task.completed
                  ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700"
                  : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-600"
              }`}
              onClick={() => toggleTask(task.id)}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    task.completed
                      ? "bg-green-500 border-green-500"
                      : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
                  }`}
                >
                  {task.completed && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-lg ${
                    task.completed
                      ? "line-through text-gray-500 dark:text-gray-400"
                      : "text-gray-800 dark:text-gray-200"
                  }`}
                >
                  {task.title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 鼓励信息 */}
        <div className="mt-8 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center">
          {completedCount === totalCount ? (
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              🎉 恭喜！你已完成今天的所有任务！
            </p>
          ) : (
            <p className="text-blue-700 dark:text-blue-300">
              继续努力！还有 {totalCount - completedCount} 个任务等待完成
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
