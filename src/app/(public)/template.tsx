import React from "react";
import { Toaster } from "sonner";

type Props = {
  children: React.ReactNode;
};

export default function PublicTemplate({ children }: Props) {
  return (
    <main className="bg-sidebar dark:bg-background w-full h-screen flex items-center justify-center">
      <div className="flex-1">{children}</div>
      <Toaster position="bottom-right" theme="system" />
    </main>
  );
}
