"use client";

import { useRouter } from "next/navigation";
import { useProgress } from "./ProgressProvider";

export const useProgressRouter = () => {
  const router = useRouter();
  const { startProgress } = useProgress();

  const push = async (href: string) => {
    startProgress();
    try {
      await router.push(href);
    } finally {
      // completeProgress();
    }
  };

  const replace = async (href: string) => {
    startProgress();
    try {
      await router.replace(href);
    } finally {
      // completeProgress();
    }
  };

  const back = () => {
    startProgress();
    try {
      router.back();
    } finally {
      // completeProgress();
    }
  };

  const forward = () => {
    startProgress();
    try {
      router.forward();
    } finally {
      // completeProgress();
    }
  };

  return {
    push,
    replace,
    back,
    forward,
    refresh: router.refresh,
  };
};
