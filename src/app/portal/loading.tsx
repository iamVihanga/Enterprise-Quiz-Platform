"use client";

import { Logo } from "@/components/app-logo";
import { Progress } from "@/components/ui/progress";
import React from "react";
import { useEffect, useState } from "react";

export default function PortalLoading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start with 0% and gradually increase to 95% over 3.8 seconds
    // The remaining 5% will be filled quickly when the page is actually ready
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prevProgress + 1;
        });
      }, 40); // ~3.8 seconds to reach 95%

      return () => clearInterval(interval);
    }, 200);

    // When component is about to unmount, quickly complete the progress bar
    return () => {
      clearTimeout(timer);
      setProgress(100);
    };
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center flex-col gap-8 bg-portal-accent">
      <Logo className="animate-pulse text-white text-3xl" />
      <div className="w-64">
        <Progress
          value={progress}
          className="h-1 bg-white/30"
          indicatorColor="bg-white/80"
        />
      </div>
    </div>
  );
}
