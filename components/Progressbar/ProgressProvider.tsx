"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface ProgressContextType {
  startProgress: () => void;
  completeProgress: () => void;
  isLoading: boolean;
  progress: number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

// Progress Bar Component
const ProgressBar = () => {
  const { isLoading, progress } = useProgress();

  if (!isLoading) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[100] h-1.5 bg-[#0073E6] transition-all duration-200 ease-out"
      style={{
        width: `${progress}%`,
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
      }}
    />
  );
};

// Extend Window interface to include our custom property
declare global {
  interface Window {
    progressInterval?: NodeJS.Timeout;
  }
}

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  // Track route changes using pathname
  useEffect(() => {
    setIsLoading(false);
    setProgress(0);
  }, [pathname]);

  const startProgress = () => {
    setIsLoading(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 100);

    // Store interval reference for cleanup
    window.progressInterval = interval;
  };

  const completeProgress = () => {
    // Clear any existing interval
    if (window.progressInterval) {
      clearInterval(window.progressInterval);
      window.progressInterval = undefined;
    }
    
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 200);
  };

  return (
    <ProgressContext.Provider value={{ startProgress, completeProgress, isLoading, progress }}>
      <ProgressBar />
      {children}
    </ProgressContext.Provider>
  );
};