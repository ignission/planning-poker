"use client";

import { FirebaseAppProviders } from "@/lib/firebase/firebase";


export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col">
        <FirebaseAppProviders>
            {children}
        </FirebaseAppProviders>
        <footer className="w-full h-20 flex items-center justify-center border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-300">
            © {new Date().getFullYear()} Ignission G.K. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
};
