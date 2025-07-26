import React, { useRef, useState, useEffect } from "react";
import { LiveIpoCard } from "./Home/IpoCard";
import { Ipo } from "@/app/models/ipo";

interface HomePageIpoProps {
  ipo: Ipo;
  analysis: any;
}

interface MasonrySliderProps {
  items: HomePageIpoProps[];
}

const MasonrySlider = ({ items }: MasonrySliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Handle mouse down or touch start
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  // Handle mouse move or touch move
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - startX;
    if (sliderRef.current) {
      sliderRef.current.scrollLeft = scrollLeft - deltaX;
    }
  };

  // Handle mouse up or touch end
  const handleEnd = () => {
    setIsDragging(false);
  };

  // Smooth scrolling behavior
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.style.scrollBehavior = "smooth";
    }
  }, []);

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={sliderRef}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        {items.map((ipo, index) => (
          <div
            key={index}
            className="flex-shrink-0 snap-center w-[90%] sm:w-[320px] mx-2 transform transition-all duration-700"
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
    </div>
  );
};

export default MasonrySlider;
