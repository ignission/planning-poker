"use client";

import { DatabaseProvider, useFirebaseApp } from "reactfire";
import { getDatabase } from "firebase/database";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const app = useFirebaseApp();
  const database = getDatabase(app);

  return (
    <DatabaseProvider sdk={database}>
      {children}
    </DatabaseProvider>
  );
}
