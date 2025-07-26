"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { HomePageIpoProps, IpoSectionProps } from "@/app/types/homepage";
import Image from "next/image";
import heroSection from "@/public/HeroSection.svg";
import { LiveIpoCard } from "./IpoCard";
import AllotmentPredictor from "./AllotmentPredictor";
import MasonrySlider from "../MasonrySlider";

export function LiveIposSection({ ipos, count }: IpoSectionProps) {
  const [liveIpoSectionHeight, setLiveIpoSectionHeight] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleIpos, setVisibleIpos] = useState(6);
  const [isAnimating, setIsAnimating] = useState(false);
  const liveIpoSectionRef = useRef<HTMLDivElement>(null);

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
    window.addEventListener("resize", measureHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureHeight);
    };
  }, [ipos.length]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const handleLoadMore = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setVisibleIpos((prev) => Math.min(prev + 6, ipos.length));
      setIsAnimating(false);
    }, 300);
  };

  const MasonryGrid = ({ items }: { items: HomePageIpoProps[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((ipo, index) => (
        <div
          key={ipo._id}
          className={`transform transition-all duration-700 ${
            isAnimating ? "scale-95 opacity-60" : "scale-100 opacity-100"
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
    <div className="relative py-10">
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
            backgroundColor: "#e6f4fe",
            filter: "blur(50px)",
          }}
        />
        <div
          className="absolute left-0 right-0"
          style={{
            top: `calc(100vh + ${liveIpoSectionHeight * 0.8}px)`,
            height: `${liveIpoSectionHeight * 0.3}px`,
            backgroundColor: "#EEF9FF",
          }}
        />
      </div>
      <div className="relative z-10">
        <section className="min-h-screen flex items-center px-4 sm:px-6 md:px-12 lg:px-30">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="text-center lg:text-left space-y-4">
                <h1 className="text-2xl font-dm-serif sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight font-black">
                  Know The{" "}
                  <span className="text-[#B4292E] font-black">Risk.</span>
                  <br />
                  Predict The{" "}
                  <span className="text-[#00914D] font-black">Return.</span>
                  <br />
                  Invest{" "}
                  <span className="text-[#D59527] font-black">Smarter.</span>
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-[#858585] font-medium font-ibm-plex max-w-2xl mx-auto lg:mx-0">
                  IPO Milega helps you make informed IPO decisions by showing
                  real-time risk levels and predicting returns based on your
                  investment.
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
        <section ref={liveIpoSectionRef} className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-30 mb-8">
            <div className="flex flex-col items-center sm:items-start sm:flex-row sm:justify-between gap-4">
              <div className="text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 mb-2 font-ibm-plex">
                  <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-[#B4292E] rounded-full animate-pulse shadow-lg"></span>
                    <div>
                      <div>Live IPOs</div>
                      <div className="text-gray-600 mt-1 text-sm sm:text-base font-medium font-ibm-plex">
                        Current IPOs open for Investment
                      </div>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-30">
            {ipos.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center py-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 max-w-sm w-full mx-4">
                  <Clock className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-base font-medium font-ibm-plex">
                    No live IPOs at the moment
                  </p>
                  <p className="text-gray-400 text-sm mt-2 font-ibm-plex">
                    Check back soon for new opportunities!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Mobile view: show MasonrySlider */}
                <div className="block lg:hidden">
                  <MasonrySlider items={ipos.slice(0, visibleIpos)} />
                </div>

                {/* Desktop view: show MasonryGrid */}
                <div className="hidden lg:block">
                  <MasonryGrid items={ipos.slice(0, visibleIpos)} />
                </div>

                {visibleIpos < ipos.length && (
                  <div className="flex justify-center pt-8">
                    <button
                      onClick={handleLoadMore}
                      disabled={isAnimating}
                      className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnimating
                        ? "Loading..."
                        : `Load More (${ipos.length - visibleIpos} remaining)`}
                    </button>
                  </div>
                )}
                {visibleIpos >= ipos.length && ipos.length > 6 && (
                  <div className="flex justify-center pt-8">
                    <div className="text-center">
                      <p className="text-gray-500 font-medium mb-4">
                        You&apos;ve seen all live IPOs!
                      </p>
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
