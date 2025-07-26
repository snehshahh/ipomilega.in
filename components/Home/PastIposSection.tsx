"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { HomePageIpoProps, IpoSectionProps } from "@/app/types/homepage";
import { PastIpoCard } from "./IpoCard";

export function PastIposSection({ ipos, count }: IpoSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(ipos.length / itemsPerPage);

  useEffect(() => {
    if (!isPlaying || ipos.length <= itemsPerPage) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, totalPages, ipos.length, itemsPerPage]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerPage]);

  return (
    <section className="bg-[#EEF9FF] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-30 mb-8">
        <div className="flex flex-col items-center sm:items-start sm:flex-row sm:justify-between gap-4">
          <div className="text-left">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 mb-2 flex items-start justify-center sm:justify-start gap-2 lg:gap-3 font-ibm-plex">
              <div className="flex items-center justify-center mt-4">
                <span
                  className="text-[#D59527] font-bold text-lg sm:text-xl lg:text-2xl animate-[slideLeft_1.5s_ease-in-out_infinite]"
                  style={{ animationDelay: "0s" }}
                >
                  &lt;
                </span>
                <span
                  className="text-[#D59527] font-bold text-lg sm:text-xl lg:text-2xl animate-[slideLeft_1.5s_ease-in-out_infinite] -ml-1"
                  style={{ animationDelay: "0.2s" }}
                >
                  &lt;
                </span>
                <span
                  className="text-[#D59527] font-bold text-lg sm:text-xl lg:text-2xl animate-[slideLeft_1.5s_ease-in-out_infinite] -ml-1"
                  style={{ animationDelay: "0.4s" }}
                >
                  &lt;
                </span>
              </div>
              <div>
                <div>Past IPOs</div>
                <div className="text-gray-600 mt-1 text-sm sm:text-base font-medium font-ibm-plex">
                  Review completed IPO opportunities
                </div>
              </div>
            </h2>
            <style jsx>{`
              @keyframes slideLeft {
                0%,
                100% {
                  transform: translateX(0px);
                  opacity: 1;
                }
                50% {
                  transform: translateX(-8px);
                  opacity: 0.7;
                }
              }
            `}</style>
          </div>
          <Link
            href="/ipos?filter=past"
            className="text-[#D59527] font-ibm-plex hover:text-[#D59527] font-bold flex items-center justify-center sm:justify-start space-x-2 group text-sm sm:text-base bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all duration-200 self-center sm:self-auto"
          >
            <span>View All ({count})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-30">
        {ipos.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center py-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 max-w-sm w-full mx-4">
              <CalendarDays className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-base font-medium font-ibm-plex">
                No past IPOs at the moment
              </p>
              <p className="text-gray-400 text-sm mt-2 font-ibm-plex">
                Check back soon for new opportunities!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
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
                  <div key={pageIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center py-5">
                      {ipos
                        .slice(
                          pageIndex * itemsPerPage,
                          (pageIndex + 1) * itemsPerPage
                        )
                        .map((ipo: HomePageIpoProps) => (
                          <div
                            key={ipo._id}
                            className="transition-all duration-300 hover:scale-105 w-full max-w-sm mx-auto"
                          >
                            <div className="h-full rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                              <PastIpoCard
                                ipo={ipo.ipo}
                                analysis={ipo.analysis || null}
                              />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {ipos.length > itemsPerPage && (
              <div className="flex items-center justify-center space-x-6">
                <button
                  onClick={prevSlide}
                  className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
                  aria-label="Previous IPOs"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === currentIndex
                          ? "bg-[#D59527] scale-125 shadow-md"
                          : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
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
