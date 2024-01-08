import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'プランニングポーカー',
  description: 'プランニングポーカー',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        {children}
        <footer className="w-full h-20 flex items-center justify-center border-t border-gray-200 dark:border-gray-800">
        <p className="text-gray-500 dark:text-gray-300">
          © {new Date().getFullYear()} Ignission G.K. All rights reserved.
        </p>
      </footer>
      </body>
    </html>
  )
}
