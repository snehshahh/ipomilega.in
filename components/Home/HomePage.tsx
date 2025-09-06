'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BlogSection } from './BlogSection';
import { PastIposSection } from './PastIposSection';
import { LiveIposSection } from './LiveIposSection';
import { HomePageIpoProps } from '@/app/types/homepage';
import { Blog } from '@/app/models/ipo';
import { UpcomingIposSection } from './UpcomingIpos';

interface HomePageProps {
  blogs: Blog[];
  pastIpos: HomePageIpoProps[];
  upcomingIpos: HomePageIpoProps[];
  liveIpos: HomePageIpoProps[];
  pastIposCount: number;
  upcomingIposCount: number;
  liveIposCount: number;
}

export function HomePage({
  blogs,
  pastIpos,
  upcomingIpos,
  liveIpos,
  pastIposCount,
  upcomingIposCount,
  liveIposCount,
}: HomePageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Define scroll ranges for each section's visibility
  const sectionCount = 4; // LiveIpos, UpcomingIpos, PastIpos, Blog
  const sectionProgress = 1 / sectionCount;

  // Opacity transformations for each section
  const liveOpacity = useTransform(scrollYProgress, [0, sectionProgress], [1, 0]);
  const upcomingOpacity = useTransform(scrollYProgress, [sectionProgress, sectionProgress * 2], [0, 1]);
  const pastOpacity = useTransform(scrollYProgress, [sectionProgress * 2, sectionProgress * 3], [0, 1]);
  const blogOpacity = useTransform(scrollYProgress, [sectionProgress * 3, 1], [0, 1]);

  // Scale transformations for subtle zoom effect
  const liveScale = useTransform(scrollYProgress, [0, sectionProgress], [1, 0.95]);
  const upcomingScale = useTransform(scrollYProgress, [sectionProgress, sectionProgress * 2], [0.95, 1]);
  const pastScale = useTransform(scrollYProgress, [sectionProgress * 2, sectionProgress * 3], [0.95, 1]);
  const blogScale = useTransform(scrollYProgress, [sectionProgress * 3, 1], [0.95, 1]);

  // Ensure smooth scroll behavior
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.scrollSnapType = 'y mandatory';
      container.style.overflowY = 'auto';
      container.style.height = '100vh';
    }
  }, []);

  return (
    <div ref={containerRef} className="h-screen overflow-y-auto scroll-smooth">
      <motion.div
        className="fixed inset-0 min-h-screen w-full"
        style={{ opacity: liveOpacity, scale: liveScale }}
      >
        <LiveIposSection ipos={liveIpos} count={liveIposCount} />
      </motion.div>
      <motion.div
        className="fixed inset-0 min-h-screen w-full"
        style={{ opacity: upcomingOpacity, scale: upcomingScale }}
      >
        <UpcomingIposSection ipos={upcomingIpos} count={upcomingIposCount} />
      </motion.div>
      <motion.div
        className="fixed inset-0 min-h-screen w-full"
        style={{ opacity: pastOpacity, scale: pastScale }}
      >
        <PastIposSection ipos={pastIpos} count={pastIposCount} />
      </motion.div>
      <motion.div
        className="fixed inset-0 min-h-screen w-full"
        style={{ opacity: blogOpacity, scale: blogScale }}
      >
        <BlogSection blogs={blogs} />
      </motion.div>
      {/* Spacer to allow scrolling through all sections */}
      <div style={{ height: `${sectionCount * 100}vh` }} />
    </div>
  );
}