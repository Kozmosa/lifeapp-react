"use client";

import Link from "next/link";
import { useTasks } from "../../hooks/use-tasks";
import { WeeklyTask } from "../../lib/types";

export default function WeeklyTasks() {
  const { tasks, loading, toggleTask, completedCount, totalCount } = useTasks('weekly');

  if (loading) {
    return (
      <div className="font-sans min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600 dark:text-gray-400">加载中...</div>
          </div>
        </div>
      </div>
    );
  }

  const weeklyTasks = tasks as WeeklyTask[];

  const categories = Array.from(new Set(weeklyTasks.map(task => task.category)));
  const categoryColors: { [key: string]: string } = {
    "工作": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "学习": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "社交": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    "健康": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    "生活": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    "规划": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    "创造": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-3xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 font-medium"
          >
            ← 返回主页
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">每周任务</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {completedCount}/{totalCount} 已完成
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>本周进度</span>
            <span>{Math.round((completedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 分类统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => {
            const categoryTasks = weeklyTasks.filter(task => task.category === category);
            const categoryCompleted = categoryTasks.filter(task => task.completed).length;
            return (
              <div key={category} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${categoryColors[category]}`}>
                  {category}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {categoryCompleted}/{categoryTasks.length} 完成
                </div>
              </div>
            );
          })}
        </div>

        {/* 任务列表 */}
        <div className="space-y-4">
          {weeklyTasks.map((task) => (
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
                      : "border-gray-300 dark:border-gray-600 hover:border-green-500"
                  }`}
                >
                  {task.completed && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <span
                    className={`text-lg block ${
                      task.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {task.title}
                  </span>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${categoryColors[task.category]}`}>
                    {task.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 鼓励信息 */}
        <div className="mt-8 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
          {completedCount === totalCount ? (
            <p className="text-green-800 dark:text-green-200 font-medium">
              🌟 太棒了！你已完成本周的所有目标！
            </p>
          ) : (
            <p className="text-green-700 dark:text-green-300">
              本周还有 {totalCount - completedCount} 个目标待完成，加油！
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
