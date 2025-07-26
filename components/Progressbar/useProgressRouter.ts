"use client";

import { useRouter } from 'next/navigation';
import { useProgress } from './ProgressProvider';

export const useProgressRouter = () => {
  const router = useRouter();
  const { startProgress } = useProgress();

  const push = (href: string) => {
    startProgress();
    router.push(href);
    // Don't call completeProgress here - let the ProgressProvider handle it
    // when the route actually changes
  };

  const replace = (href: string) => {
    startProgress();
    router.replace(href);
    // Don't call completeProgress here
  };

  const back = () => {
    startProgress();
    router.back();
    // Don't call completeProgress here
  };

  const forward = () => {
    startProgress();
    router.forward();
    // Don't call completeProgress here
  };

  return {
    push,
    replace,
    back,
    forward,
    refresh: router.refresh,
  };
};