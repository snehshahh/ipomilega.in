// LiveIposSection.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { IpoSectionProps, HomePageIpoProps } from '@/app/types/homepage'; // Assuming this path
import { LiveIpoCard } from './IpoCard'; // Assuming this path

export function LiveIposSection({ ipos, count }: IpoSectionProps) {
  const [visibleIpos, setVisibleIpos] = useState(6);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // State for Mobile Carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Effect to check for mobile screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Carousel Navigation Functions
  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % ipos.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + ipos.length) % ipos.length);
  };

  // Swipe Gesture Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) { // Swiped left
      nextSlide();
    }
    if (touchStartX.current - touchEndX.current < -50) { // Swiped right
      prevSlide();
    }
  };

  const handleLoadMore = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setVisibleIpos(prev => Math.min(prev + 6, ipos.length));
      setIsAnimating(false);
    }, 300);
  };

  // Masonry Grid for desktop view
  const MasonryGrid = ({ items }: { items: HomePageIpoProps[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((ipo, index) => (
        <div
          key={ipo._id}
          className={`transform transition-all duration-700 hover:scale-105 ${isAnimating ? 'scale-95 opacity-60' : 'scale-100 opacity-100'}`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 h-full w-full max-w-sm mx-auto">
            <LiveIpoCard ipo={ipo.ipo} analysis={ipo.analysis} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section>
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 font-ibm-plex flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-[#B4292E] rounded-full animate-pulse shadow-lg"></span>
              <div>
                <div>Live IPOs</div>
                <div className="text-gray-600 mt-1 text-sm sm:text-base font-medium font-ibm-plex">Current IPOs open for Investment</div>
              </div>
            </h2>
          </div>
          <div className="flex justify-center sm:justify-end">
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
      <div className="max-w-7xl mx-auto">
        {ipos.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center py-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 max-w-sm w-full mx-4">
              <Clock className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-base font-medium font-ibm-plex">No live IPOs at the moment</p>
              <p className="text-gray-400 text-sm mt-2 font-ibm-plex">Check back soon for new opportunities!</p>
            </div>
          </div>
        ) : isMobile ? (
          // Mobile Carousel View
          <div className="space-y-6">
            <div
              className="relative overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {ipos.map((ipo: HomePageIpoProps) => (
                  <div key={ipo._id} className="w-full flex-shrink-0 px-2">
                    <div className="h-full rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <LiveIpoCard ipo={ipo.ipo} analysis={ipo.analysis} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {ipos.length > 1 && (
              <div className="flex items-center justify-center space-x-6">
                <button
                  onClick={prevSlide}
                  className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
                  aria-label="Previous IPO"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex space-x-2">
                  {ipos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${index === currentIndex ? 'bg-[#B4292E] scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextSlide}
                  className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
                  aria-label="Next IPO"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          // Desktop Grid View
          <div className="space-y-8">
            <MasonryGrid items={ipos.slice(0, visibleIpos)} />
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
    </section>
  );
}