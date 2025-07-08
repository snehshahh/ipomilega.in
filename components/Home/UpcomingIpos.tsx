'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { HomePageIpoProps, IpoSectionProps } from '@/app/types/homepage';
import { UpcomingIpoCard } from '@/components/Home/IpoCard';

export function UpcomingIposSection({ ipos, count }: IpoSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Responsive items per page
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Handle responsive items per page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2); // Tablet: 2 cards
      } else {
        setItemsPerPage(3); // Desktop: 3 cards
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(ipos.length / itemsPerPage);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (!isPlaying || ipos.length <= itemsPerPage) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, totalPages, ipos.length, itemsPerPage]);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + totalPages) % totalPages);
  };

  // Reset current index when items per page changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerPage]);

  return (
    <section className="py-12 sm:py-16 lg:py-24 relative">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 mb-2 flex items-center justify-center sm:justify-start gap-2 lg:gap-3 font-ibm-plex">
              <div className="relative flex items-center justify-center">
                <span className="text-green-500 font-bold text-lg sm:text-xl lg:text-2xl animate-[slideRight_1.5s_ease-in-out_infinite]" style={{ animationDelay: '0s' }}>&gt;</span>
                <span className="text-green-500 font-bold text-lg sm:text-xl lg:text-2xl animate-[slideRight_1.5s_ease-in-out_infinite] -ml-1" style={{ animationDelay: '0.2s' }}>&gt;</span>
                <span className="text-green-500 font-bold text-lg sm:text-xl lg:text-2xl animate-[slideRight_1.5s_ease-in-out_infinite] -ml-1" style={{ animationDelay: '0.4s' }}>&gt;</span>
              </div>
              Upcoming IPOs
            </h2>
            <style jsx>{`
              @keyframes slideRight {
                0%, 100% { transform: translateX(0px); opacity: 1; }
                50% { transform: translateX(8px); opacity: 0.7; }
              }
            `}</style>
            <p className="text-gray-600 text-sm sm:text-base font-medium font-ibm-plex">Get ready for these upcoming opportunities</p>
          </div>
          <Link
            href="/ipos?filter=upcoming"
            className="text-[#0073E6] font-ibm-plex hover:text-[#0073E6] font-bold flex items-center justify-center sm:justify-start space-x-2 group text-sm sm:text-base bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-200 self-center sm:self-auto"
          >
            <span>View All ({count})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* IPOs Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {ipos.length === 0 ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="text-center py-6 sm:py-8 lg:py-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 max-w-sm sm:max-w-md w-full mx-4">
              <CalendarDays className="w-10 sm:w-12 h-10 sm:h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-base sm:text-lg font-medium font-ibm-plex">No upcoming IPOs at the moment</p>
              <p className="text-gray-400 text-sm mt-2 font-ibm-plex">Check back soon for new opportunities!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Carousel Container */}
            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setIsPlaying(false)}
              onMouseLeave={() => setIsPlaying(true)}
            >
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {Array.from({ length: totalPages }).map((_, pageIndex) => (
                  <div key={pageIndex} className="w-full flex-shrink-0 px-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center py-5">
                      {ipos.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((ipo: HomePageIpoProps) => (
                        <div
                          key={ipo._id}
                          className="transition-all duration-300 hover:scale-105 w-full max-w-sm"
                        >
                          <div className="h-full rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <UpcomingIpoCard ipo={ipo.ipo} analysis={ipo.analysis || null} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Navigation Section */}
            {ipos.length > itemsPerPage && (
              <div className="flex items-center justify-center space-x-6">
                {/* Left Arrow */}
                <button
                  onClick={prevSlide}
                  className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
                  aria-label="Previous IPOs"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Pagination Dots */}
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentIndex
                          ? 'bg-blue-600 scale-125 shadow-md'
                          : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Right Arrow */}
                <button
                  onClick={nextSlide}
                  className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
                  aria-label="Next IPOs"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}