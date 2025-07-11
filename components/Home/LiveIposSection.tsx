// LiveIposSection.tsx - Creative Grid Layout with Flexible Columns
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { HomePageIpoProps, IpoSectionProps } from '@/app/types/homepage';
import Image from 'next/image';
import heroSection from '@/public/HeroSection.svg';
import { LiveIpoCard } from './IpoCard';
import AllotmentPredictor from './AllotmentPredictor';

export function LiveIposSection({ ipos, count }: IpoSectionProps) {
  const [liveIpoSectionHeight, setLiveIpoSectionHeight] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Removed viewMode state - only using masonry view
  const [visibleIpos, setVisibleIpos] = useState(6);
  const [isAnimating, setIsAnimating] = useState(false);

  // Refs for measuring heights
  const liveIpoSectionRef = useRef<HTMLDivElement>(null);

  // Measure Live IPO section height
  useEffect(() => {
    const measureHeight = () => {
      if (liveIpoSectionRef.current) {
        const height = liveIpoSectionRef.current.offsetHeight;
        setLiveIpoSectionHeight(height);
      }
    };

    // Measure initially
    measureHeight();

    // Create ResizeObserver to watch for height changes
    const resizeObserver = new ResizeObserver(measureHeight);
    if (liveIpoSectionRef.current) {
      resizeObserver.observe(liveIpoSectionRef.current);
    }

    // Also listen to window resize
    window.addEventListener('resize', measureHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measureHeight);
    };
      }, [ipos.length]); // Removed viewMode dependency

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  const handleLoadMore = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setVisibleIpos(prev => Math.min(prev + 6, ipos.length));
      setIsAnimating(false);
    }, 300);
  };

  // Removed handleViewModeChange function

  // Simple 3-column grid layout using full width
  const MasonryGrid = ({ items }: { items: HomePageIpoProps[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((ipo, index) => (
        <div
          key={ipo._id}
          className={`transform transition-all duration-700 ${
            isAnimating ? 'scale-95 opacity-60' : 'scale-100 opacity-100'
          }`}
          style={{
            transitionDelay: `${index * 100}ms`,
          }}
        >
          <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 h-full">
            <LiveIpoCard ipo={ipo.ipo} analysis={ipo.analysis} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative py-8">
      {/* Extended Background Container */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Hero background that extends into half of Live IPO section */}
        <div
          className="absolute inset-0"
          style={{
            height: `calc(100vh + ${liveIpoSectionHeight / 2}px)`, // Full hero height + half of Live IPO section
            background: `
              linear-gradient(135deg, 
                rgba(224, 242, 254, 1) 0%,      /* Very light blue, top-left */
                rgba(191, 230, 255, 1) 30%,     /* Slightly deeper sky blue */
                rgba(255, 255, 255, 0.7) 60%,  /* Hint of white, semi-transparent */
                rgba(173, 216, 230, 1) 80%,     /* Muted blue */
                rgba(240, 248, 255, 1) 100%     /* Alice Blue, bottom-right */
              )
            `
          }}
        />

        {/* Light blue background for the bottom half of Live IPO section */}
        <div
          className="absolute left-0 right-0"
          style={{
            top: `calc(100vh + ${liveIpoSectionHeight / 2}px)`,
            height: `${liveIpoSectionHeight / 2}px`,
            background: `
              linear-gradient(135deg, 
                rgba(240, 248, 255, 1) 0%,     /* Alice Blue */
                rgba(230, 245, 255, 1) 30%,    /* Slightly deeper alice blue */
                rgba(220, 240, 255, 1) 60%,    /* Light sky blue */
                rgba(235, 247, 255, 1) 100%    /* Very light blue */
              )
            `
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10">
        {/* Hero Section - Responsive heights and spacing */}
        <section className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              {/* Text Content */}
              <div className="text-center lg:text-left space-y-4 sm:space-y-6">
                <h1 className="text-2xl font-dm-serif sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight font-black">
                  Know The{' '}
                  <span className="text-[#B4292E] font-black">Risk.</span>
                  <br />
                  Predict The{' '}
                  <span className="text-[#00914D] font-black">Return.</span>
                  <br />
                  Invest{' '}
                  <span className="text-[#D59527] font-black">Smarter.</span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-[#858585] font-medium font-ibm-plex max-w-2xl mx-auto lg:mx-0">
                  IPO Milega helps you make informed IPO decisions by showing real-time risk levels and predicting returns based on your investment.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-sm sm:max-w-md mx-auto lg:mx-0">
                  <Link
                    href="/ipos"
                    className="bg-[#0073E6] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-[#0073E6] transition-colors text-center text-sm sm:text-base"
                  >
                    Explore IPOs
                  </Link>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-[#0073E6] px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-[#0073E6] hover:text-white border border-[#0073E6] transition-colors text-center text-sm sm:text-base"
                  >
                    Find IPO Chance of Allotment
                  </button>
                </div>
              </div>

              {/* Hero Image */}
              <div className="flex justify-center order-first lg:order-last">
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                  <Image
                    src={heroSection}
                    alt="Hero Section"
                    width={500}
                    height={500}
                    className="w-full h-auto relative z-10"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live IPOs Section - Creative Layout */}
        <section ref={liveIpoSectionRef} className="py-10 sm:py-16 lg:py-24 relative">
          {/* Section Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 mb-2 font-ibm-plex">
                    <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3">
                      <span className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-[#B4292E] rounded-full animate-pulse shadow-lg"></span>
                      <div>
                        <div>Live IPOs</div>
                        <div className="text-gray-600 mt-1 text-sm sm:text-base font-medium font-ibm-plex">Current IPOs open for Investment</div>
                      </div>
                    </div>
                  </h2>
                </div>
                
                {/* Controls */}
                <div className="flex justify-center lg:justify-end">
                  {/* View All Link */}
                  <Link
                    href="/ipos?filter=live"
                    className="text-[#B4292E] font-ibm-plex hover:text-[#B4292E] font-bold flex items-center justify-center space-x-2 group text-sm sm:text-base bg-white hover:bg-gray-50 px-4 py-2 rounded-lg transition-all duration-200 shadow-md border border-gray-200"
                  >
                    <span>View All ({count})</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* IPOs Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {ipos.length === 0 ? (
                <div className="flex items-center justify-center py-8 sm:py-12">
                  <div className="text-center py-6 sm:py-8 lg:py-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 max-w-sm sm:max-w-md w-full mx-4">
                    <Clock className="w-10 sm:w-12 h-10 sm:h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-base sm:text-lg font-medium font-ibm-plex">No live IPOs at the moment</p>
                    <p className="text-gray-400 text-sm mt-2 font-ibm-plex">Check back soon for new opportunities!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* 3-Column Masonry Grid */}
                  <MasonryGrid items={ipos.slice(0, visibleIpos)} />

                  {/* Load More Button */}
                  {visibleIpos < ipos.length && (
                    <div className="flex justify-center pt-8">
                      <button
                        onClick={handleLoadMore}
                        disabled={isAnimating}
                        className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAnimating ? 'Loading...' : `Load More (${ipos.length - visibleIpos} remaining)`}
                      </button>
                    </div>
                  )}

                  {/* Show All Button */}
                  {visibleIpos >= ipos.length && ipos.length > 6 && (
                    <div className="flex justify-center pt-8">
                      <div className="text-center">
                        <p className="text-gray-500 font-medium mb-4">You&apos;ve seen all live IPOs!</p>
                        <Link
                          href="/ipos?filter=live"
                          className="bg-[#B4292E] hover:bg-[#9d1f24] text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Explore All IPOs
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* AllotmentPredictor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Body */}
          <div className="p-6">
            <AllotmentPredictor
              ipos={ipos}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}