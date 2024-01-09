import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-grow">
      <main className="flex flex-1 flex-col items-center justify-center py-20 md:py-32 lg:py-48 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-300 dark:to-blue-400">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          プランニングポーカー
        </h1>
        <p className="text-xl md:text-2xl text-white mb-8 px-4 md:px-0">
          リアルタイムにプランニングポーカーができます。
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/create">
            <Button className="bg-white text-blue-500 px-6 py-2 rounded-md hover:bg-blue-500 hover:text-white dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-800">
              作成する
            </Button>
          </Link>
          <Link href="/join">
            <Button className="bg-white border-2 border-blue-500 text-blue-500 px-6 py-2 rounded-md hover:bg-blue-500 hover:text-white dark:bg-gray-800 dark:border-blue-300 dark:text-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-800">
              参加する
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
