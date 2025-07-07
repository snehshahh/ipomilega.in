// LiveIposSection.tsx - Updated with extended hero background
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { HomePageIpoProps, IpoSectionProps } from '@/app/types/homepage';
import Image from 'next/image';
import heroSection from '@/public/HeroSection.svg';
import { LiveIpoCard } from './IpoCard';

export function LiveIposSection({ ipos, count }: IpoSectionProps) {
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
    <div className="relative py-8">
      {/* Extended Background Container */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Hero background that extends into Live IPO section */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"
          style={{
            height: 'calc(100vh + 50vh)', // Full hero height + half of Live IPO section
            background: `
              linear-gradient(135deg, 
                rgba(219, 234, 254, 0.8) 0%, 
                rgba(255, 255, 255, 0.9) 50%, 
                rgba(219, 234, 254, 0.8) 100%
              )
            `
          }}
        />
        
        {/* Extended Hero Image */}
        <div 
          className="absolute top-0 right-0 w-full h-full pointer-events-none"
          style={{
            height: 'calc(100vh + 50vh)', // Match the background height
            background: `url('/HeroSection.svg') no-repeat`,
            backgroundSize: 'contain',
            backgroundPosition: 'center right',
            opacity: 0.1,
            transform: 'scale(1.2)', // Slightly scale up for better coverage
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
                  <span className="text-red-500 font-black">Risk.</span>
                  <br />
                  Predict The{' '}
                  <span className="text-green-500 font-black">Return.</span>
                  <br />
                  Invest{' '}
                  <span className="text-yellow-500 font-black">Smarter.</span>
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
                  <Link
                    href="/analysis"
                    className="text-[#0073E6] px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:bg-[#0073E6] hover:text-white border border-[#0073E6] transition-colors text-center text-sm sm:text-base"
                  >
                    Try Return Predictor
                  </Link>
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

        {/* Live IPOs Section - Better spacing and responsive layout */}
        <section className="py-12 sm:py-16 lg:py-24 relative">
          {/* Transition overlay for smooth color change */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-gray-50"
            style={{
              top: '50%', // Start the transition at 50% of the section height
            }}
          />
          
          {/* Section Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 mb-2 flex items-center justify-center sm:justify-start gap-2 lg:gap-3 font-ibm-plex">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-red-500 rounded-full animate-pulse shadow-lg"></span>
                    Live IPOs
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base font-medium font-ibm-plex">Current IPOs open for Investment</p>
                </div>
                <Link
                  href="/ipos?filter=live"
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
                    <Clock className="w-10 sm:w-12 h-10 sm:h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-base sm:text-lg font-medium font-ibm-plex">No live IPOs at the moment</p>
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
                                  <LiveIpoCard ipo={ipo.ipo} analysis={ipo.analysis} />
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
          </div>
        </section>
      </div>
    </div>
  );
}