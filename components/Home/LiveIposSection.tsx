'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { HomePageIpoProps, IpoSectionProps } from '@/app/types/homepage';
import Image from 'next/image';
import heroSection from '@/public/HeroSection.svg';
import { LiveIpoCard } from './IpoCard';
import AllotmentPredictor from './AllotmentPredictor';

// FlipWord Component for animated text
const FlipWord = ({ words, className = "" }: { words: string[], className?: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 2500); // Change word every 2.5 seconds

    return () => clearInterval(interval);
  }, [words.length]);

  // Find the longest word to set consistent width
  const longestWord = words.reduce((longest, current) => 
    current.length > longest.length ? current : longest, words[0]
  );

  return (
    <span className={`inline-block relative ${className}`} style={{ minWidth: 'fit-content' }}>
      {words.map((word, index) => (
        <span
          key={word}
          className={`absolute top-0 left-0 whitespace-nowrap transition-all duration-700 ease-in-out transform ${
            index === currentIndex
              ? 'opacity-100 rotateX-0 translate-y-0'
              : index === (currentIndex - 1 + words.length) % words.length
              ? 'opacity-0 -rotateX-90 -translate-y-2'
              : 'opacity-0 rotateX-90 translate-y-2'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: index === currentIndex 
              ? 'perspective(400px) rotateX(0deg) translateY(0px)' 
              : index === (currentIndex - 1 + words.length) % words.length
              ? 'perspective(400px) rotateX(-90deg) translateY(-8px)'
              : 'perspective(400px) rotateX(90deg) translateY(8px)'
          }}
        >
          {word}
        </span>
      ))}
      {/* Invisible placeholder to maintain consistent layout space */}
      <span className="opacity-0 pointer-events-none whitespace-nowrap">
        {longestWord}
      </span>
    </span>
  );
};

export function LiveIposSection({ ipos, count }: IpoSectionProps) {
  const [liveIpoSectionHeight, setLiveIpoSectionHeight] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleIpos, setVisibleIpos] = useState(6);
  const [isAnimating, setIsAnimating] = useState(false);
  const liveIpoSectionRef = useRef<HTMLDivElement>(null);

  // --- New State for Mobile Carousel ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // --- Effect to check for mobile screen size ---
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind's 'md' breakpoint
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const measureHeight = () => {
      if (liveIpoSectionRef.current) {
        const height = liveIpoSectionRef.current.offsetHeight;
        setLiveIpoSectionHeight(height + 200);
      }
    };

    measureHeight();
    const resizeObserver = new ResizeObserver(measureHeight);
    if (liveIpoSectionRef.current) {
      resizeObserver.observe(liveIpoSectionRef.current);
    }
    window.addEventListener('resize', measureHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', measureHeight);
    };
  }, [ipos.length]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

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

  // --- Carousel Navigation Functions ---
  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % ipos.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + ipos.length) % ipos.length);
  };

  // --- Swipe Gesture Handlers ---
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swiped left
      nextSlide();
    }

    if (touchStartX.current - touchEndX.current < -50) {
      // Swiped right
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

  const MasonryGrid = ({ items }: { items: HomePageIpoProps[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((ipo, index) => (
        <div
          key={ipo._id}
          className={`transform transition-all duration-700 hover:scale-105 ${isAnimating ? 'scale-95 opacity-60' : 'scale-100 opacity-100'
            }`}
          style={{
            transitionDelay: `${index * 100}ms`,
          }}
        >
          <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 h-full w-full max-w-sm mx-auto">
            <LiveIpoCard ipo={ipo.ipo} analysis={ipo.analysis} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative py-5 app-container">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            height: `calc(100vh + ${liveIpoSectionHeight * 0.5}px)`,
            background: `
              radial-gradient(circle at 20% 30%, rgba(240, 248, 255, 1), rgba(240, 248, 255, 0) 40%),
              radial-gradient(circle at 70% 20%, rgba(173, 216, 230, 0.6), rgba(173, 216, 230, 0) 50%),
              radial-gradient(circle at 30% 80%, rgba(135, 206, 250, 0.5), rgba(135, 206, 250, 0) 50%),
              radial-gradient(circle at 90% 70%, rgba(173, 216, 250, 0.5), rgba(173, 216, 250, 0) 60%)
            `,
            backgroundColor: '#e6f4fe',
            filter: 'blur(50px)'
          }}
        />
        <div
          className="absolute left-0 right-0"
          style={{
            top: `calc(100vh + ${liveIpoSectionHeight * 0.8}px)`,
            height: `${liveIpoSectionHeight * 0.3}px`,
            backgroundColor: '#EEF9FF'
          }}
        />
      </div>
      <div className="relative z-10">
        <section className="min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto w-full">
            {/* Mobile Layout: Image first, then content */}
            <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-6 items-center">
              {/* Hero Image - First on mobile, second on desktop */}
              <div className="flex justify-center order-1 md:order-2 motion-safe:animate-fadeIn w-full md:w-auto">
                <div className="relative">
                  <Image
                    src={heroSection}
                    alt="Hero Section"
                    width={466}
                    height={466}
                    className="w-full max-w-sm md:max-w-none h-auto relative z-10"
                    priority
                  />
                </div>
              </div>

              {/* Hero Content - Second on mobile, first on desktop */}
              <div className="text-center md:text-left space-y-6 order-2 md:order-1 w-full md:flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight font-black font-dm-serif">
                  Know The{' '}
                  <FlipWord 
                    words={['Risk.', 'Market.', 'Facts.']} 
                    className="text-[#B4292E] font-black"
                  />
                  <br />
                  Predict The{' '}
                  <FlipWord 
                    words={['Return.', 'Growth.', 'Profit.']} 
                    className="text-[#00914D] font-black"
                  />
                  <br />
                  Invest{' '}
                  <FlipWord 
                    words={['Smarter.', 'Better.', 'Wisely.']} 
                    className="text-[#D59527] font-black"
                  />
                </h1>
                
                <p className="text-[#858585] max-w-xl mx-auto md:mx-0 text-base md:text-lg font-medium leading-relaxed">
                  IPO Milega helps you make informed IPO decisions by showing real-time risk levels and predicting returns based on your investment.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto md:mx-0">
                  <Link
                    href="/ipos"
                    className="bg-[#0073E6] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#005cb8] transition-all duration-300 transform hover:scale-105 text-center text-base shadow-lg hover:shadow-xl"
                    style={{
                      borderRadius: '8px',
                      borderWidth: '1px',
                    }}
                  >
                    Explore IPOs
                  </Link>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-[#0073E6] px-6 py-2 rounded-xl font-bold hover:bg-[#0073E6] hover:text-white border-2 border-[#0073E6] transition-all duration-300 transform hover:scale-105 text-center text-base shadow-lg hover:shadow-xl"
                    style={{
                      borderRadius: '8px',
                      borderWidth: '1px',
                    }}
                  >
                    Find Allotment Chance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section ref={liveIpoSectionRef} className="py-10">
          <div className="max-w-7xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 font-ibm-plex">
                  <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-[#B4292E] rounded-full animate-pulse shadow-lg"></span>
                    <div>
                      <div>Live IPOs</div>
                      <div className="text-gray-600 mt-1 text-sm sm:text-base font-medium font-ibm-plex">Current IPOs open for Investment</div>
                    </div>
                  </div>
                </h2>
              </div>
              <div className="flex justify-center lg:justify-end">
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
            ) : (
              // --- Conditional Rendering Logic ---
              isMobile ? (
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
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${index === currentIndex
                              ? 'bg-[#B4292E] scale-125'
                              : 'bg-gray-300 hover:bg-gray-400'
                              }`}
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
              )
            )}
          </div>
        </section>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="p-4 sm:p-6 w-full max-w-md sm:max-w-lg md:max-w-2xl">
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