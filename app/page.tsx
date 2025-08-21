import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center gap-12 max-w-2xl mx-auto text-center">
        {/* 主要图标 */}
        <div className="flex flex-col items-center gap-6">
          <Image
            className="dark:invert drop-shadow-lg"
            src="/next.svg"
            alt="Life App Logo"
            width={240}
            height={60}
            priority
          />
          
          {/* 格言 */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 tracking-wide">
            给时光以生命
          </h1>
        </div>

        {/* 三个按钮 */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Link
            href="/daily"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105 shadow-lg"
          >
            每日任务
          </Link>
          
          <Link
            href="/weekly"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105 shadow-lg"
          >
            每周任务
          </Link>
          
          <Link
            href="/monthly"
            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 transform hover:scale-105 shadow-lg"
          >
            每月任务
          </Link>
        </div>
      </main>
    </div>
  );
}
