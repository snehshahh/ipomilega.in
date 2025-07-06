// components/AnimatedBackground.tsx
'use client';

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Multiple gradient layers for smooth color transitions */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100 via-blue-50 to-white animate-pulse duration-[15000ms]"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-white via-cyan-50 to-sky-200 opacity-60 animate-pulse duration-[20000ms] delay-[5000ms]"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-blue-100 via-sky-50 to-cyan-50 opacity-50 animate-pulse duration-[25000ms] delay-[10000ms]"></div>
      
      {/* Floating elements for subtle movement */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-sky-100/30 to-transparent rounded-full animate-bounce duration-[8000ms]"></div>
      <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-radial from-blue-100/20 to-transparent rounded-full animate-bounce duration-[12000ms] delay-[4000ms]"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-radial from-cyan-100/25 to-transparent rounded-full animate-bounce duration-[10000ms] delay-[8000ms] transform -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Subtle animated overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent animate-pulse duration-[18000ms] delay-[3000ms]"></div>
    </div>
  );
}