// HeroSection.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import heroSection from '@/public/HeroSection.svg';
import AllotmentPredictor from './AllotmentPredictor'; // Assuming this path
import { HomePageIpoProps } from '@/app/types/homepage'; // Assuming this path

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

// Main Hero Section Component
export function HeroSection({ ipos }: { ipos: HomePageIpoProps[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Effect to handle closing modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  // Effect to prevent background scrolling when modal is open
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

  return (
    <>
      <section>
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-6 items-center">
            {/* Hero Image - Appears first on mobile */}
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

            {/* Hero Content - Appears second on mobile */}
            <div className="text-center md:text-left space-y-6 order-2 md:order-1 w-full md:flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight font-black font-dm-serif text-center md:text-left">
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
                  style={{ borderRadius: '8px', borderWidth: '1px' }}
                >
                  Explore IPOs
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-[#0073E6] px-6 py-2 rounded-xl font-bold hover:bg-[#0073E6] hover:text-white border-2 border-[#0073E6] transition-all duration-300 transform hover:scale-105 text-center text-base shadow-lg hover:shadow-xl"
                  style={{ borderRadius: '8px', borderWidth: '1px' }}
                >
                  Find Allotment Chance
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Allotment Predictor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="p-4 sm:p-6 w-full max-w-md sm:max-w-lg md:max-w-2xl relative z-20">
            <AllotmentPredictor
              ipos={ipos}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}