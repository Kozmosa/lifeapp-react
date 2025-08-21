"use client";

import Link from "next/link";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  priority: "高" | "中" | "低";
}

export default function MonthlyTasks() {
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      title: "完成重要技能认证", 
      description: "获得专业领域的认证或证书",
      completed: false, 
      category: "职业发展",
      priority: "高"
    },
    { 
      id: 2, 
      title: "建立新的人际关系", 
      description: "结识新朋友或扩展专业网络",
      completed: false, 
      category: "人际关系",
      priority: "中"
    },
    { 
      id: 3, 
      title: "完成创意项目", 
      description: "开始并完成一个个人创作项目",
      completed: false, 
      category: "个人成长",
      priority: "中"
    },
    { 
      id: 4, 
      title: "健康体检和调整", 
      description: "进行全面体检并制定健康计划",
      completed: false, 
      category: "健康管理",
      priority: "高"
    },
    { 
      id: 5, 
      title: "财务规划和投资", 
      description: "回顾财务状况并制定投资计划",
      completed: false, 
      category: "财务管理",
      priority: "高"
    },
    { 
      id: 6, 
      title: "深度学习新领域", 
      description: "系统学习一个全新的知识领域",
      completed: false, 
      category: "学习成长",
      priority: "中"
    },
    { 
      id: 7, 
      title: "家庭关系维护", 
      description: "加强与家人的联系和沟通",
      completed: false, 
      category: "家庭生活",
      priority: "高"
    },
    { 
      id: 8, 
      title: "制定下月目标", 
      description: "回顾本月成果并规划下月计划",
      completed: false, 
      category: "规划总结",
      priority: "中"
    },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  const categories = Array.from(new Set(tasks.map(task => task.category)));
  const categoryColors: { [key: string]: string } = {
    "职业发展": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "人际关系": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "个人成长": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    "健康管理": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    "财务管理": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    "学习成长": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    "家庭生活": "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    "规划总结": "bg-gray-100 text-gray-800 dark:bg-gray-600/30 dark:text-gray-300",
  };

  const priorityColors: { [key: string]: string } = {
    "高": "bg-red-500 text-white",
    "中": "bg-yellow-500 text-white",
    "低": "bg-green-500 text-white",
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
          >
            ← 返回主页
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">每月任务</h1>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {completedCount}/{totalCount} 已完成
          </div>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>本月进度</span>
            <span>{Math.round((completedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div 
              className="bg-purple-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* 优先级统计 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {["高", "中", "低"].map((priority) => {
            const priorityTasks = tasks.filter(task => task.priority === priority);
            const priorityCompleted = priorityTasks.filter(task => task.completed).length;
            return (
              <div key={priority} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <div className={`inline-block px-3 py-1 rounded text-sm font-medium mb-2 ${priorityColors[priority]}`}>
                  {priority}优先级
                </div>
                <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                  {priorityCompleted}/{priorityTasks.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">已完成</div>
              </div>
            );
          })}
        </div>

        {/* 任务列表 */}
        <div className="grid gap-6 md:grid-cols-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                task.completed
                  ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700"
                  : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-600"
              }`}
              onClick={() => toggleTask(task.id)}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-1 ${
                    task.completed
                      ? "bg-purple-500 border-purple-500"
                      : "border-gray-300 dark:border-gray-600 hover:border-purple-500"
                  }`}
                >
                  {task.completed && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      task.completed
                        ? "line-through text-gray-500 dark:text-gray-400"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className={`text-sm mb-3 ${
                    task.completed
                      ? "text-gray-400 dark:text-gray-500"
                      : "text-gray-600 dark:text-gray-400"
                  }`}>
                    {task.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${categoryColors[task.category]}`}>
                      {task.category}
                    </span>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
                      {task.priority}优先级
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 鼓励信息 */}
        <div className="mt-8 p-6 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-center">
          {completedCount === totalCount ? (
            <div>
              <p className="text-purple-800 dark:text-purple-200 font-medium text-lg mb-2">
                🎯 完美！你已完成本月的所有重要目标！
              </p>
              <p className="text-purple-700 dark:text-purple-300 text-sm">
                这个月的成就将成为你人生路上重要的里程碑
              </p>
            </div>
          ) : (
            <div>
              <p className="text-purple-700 dark:text-purple-300 font-medium mb-2">
                本月还有 {totalCount - completedCount} 个重要目标待完成
              </p>
              <p className="text-purple-600 dark:text-purple-400 text-sm">
                坚持下去，每一步都在让你变得更好！
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
