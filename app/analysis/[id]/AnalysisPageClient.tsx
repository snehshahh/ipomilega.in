

"use client";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeftCircle,
  Share2,
} from "lucide-react";
import React from 'react';
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis";
import { Ipo } from "@/app/models/ipo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// --- HELPER COMPONENTS (hoisted for performance) ---

// MODIFIED: TimelineMarker now formats the date
const TimelineMarker = ({ label, date, position, alignment = 'center' }: { label: string, date: string, position: string, alignment?: 'left' | 'center' | 'right' }) => {
  let alignmentClass = 'items-center text-center -translate-x-1/2';
  if (alignment === 'left') alignmentClass = 'items-start text-left';
  if (alignment === 'right') alignmentClass = 'items-end text-right -translate-x-full';

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'N/A';
    try {
      const dateObj = new Date(dateString);
      // Check for invalid date
      if (isNaN(dateObj.getTime())) return 'N/A';
      // Format to 'DD MMM' (e.g., '17 Jul')
      return dateObj.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'N/A';
    }
  };

  const formattedDate = formatDate(date);

  return (
    <div
      className={`absolute top-0 h-full flex flex-col justify-between ${alignmentClass}`}
      style={{ left: position }}
    >
      <p className="text-sm font-semibold text-gray-800 -translate-y-8">{label}</p>
      <p className="text-xs font-medium text-gray-600 translate-y-8">{formattedDate}</p>
    </div>
  );
};



const ProgressCircle = ({ label, value }: { label: string, value: number }) => {
  const cappedValue = Math.min(value, 100);
  const strokeWidth = 4;

  // Radius for the outer progress arc
  const progressRadius = 16;

  // Radius for the inner filled circle
  const innerRadius = progressRadius - strokeWidth / 2; // This will be 14

  const circumference = 2 * Math.PI * progressRadius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (cappedValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg width="100" height="100" viewBox="0 0 36 36" className="w-24 h-24">
          {/* Background circle (filled) - NOW SMALLER */}
          <circle
            cx="18"
            cy="18"
            r={innerRadius} // Use the smaller radius
            fill="#2563eb"   // Deep blue
          />

          {/* Progress circle - SITS OUTSIDE THE FILLED CIRCLE */}
          <circle
            cx="18"
            cy="18"
            r={progressRadius} // Use the larger radius for the arc
            fill="none"
            stroke="#93c5fd" // Light blue for progress
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 18 18)" // Start from top
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out'
            }}
          />

          {/* Value Text */}
          <text
            x="18"
            y="22"
            textAnchor="middle"
            fill="white"
            fontSize="8"
            fontWeight="bold"
            fontFamily="IBM Plex Sans, sans-serif"
          >
            {cappedValue.toFixed(0)}
          </text>
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-700 text-center mt-2">{label}</p>
    </div>
  );
};



// --- MAIN PAGE COMPONENT ---

interface AnalysisPageClientProps {
  analysis: IpoComprehensiveAnalysis;
  ipo: Ipo;
}

const getInitials = (name: string) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((word: string) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export default function AnalysisPageClient({ analysis, ipo }: AnalysisPageClientProps) {
  const [activeTab, setActiveTab] = useState("performance");
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "performance",
    "fundamentals",
    "risk",
    "flexibility"
  ]);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const riskCategoryColors: { [key: string]: string } = {
    market_risks: "text-red-600",
    financial_risks: "text-orange-500", // Using a standard Tailwind orange
    operational_risks: "text-gray-600",
    regulatory_risks: "text-blue-600",
    default: "text-gray-600",
  };


  const overallScore = analysis ? (analysis.summary_metrics?.fundamentals_score + analysis.summary_metrics?.performance_score) / 2 : 0;

  // --- Timeline & Split Data Configuration ---
  const dotSegments = { opening: 10, closing: 15, listing: 8, allotment: 12 };
  const totalDots = Object.values(dotSegments).reduce((a, b) => a + b, 0);
  const markerPositions = {
    opening: '0%',
    closing: `${(dotSegments.opening / totalDots) * 100}%`,
    listing: `${((dotSegments.opening + dotSegments.closing) / totalDots) * 100}%`,
    allotment: `${((dotSegments.opening + dotSegments.closing + dotSegments.listing) / totalDots) * 100}%`,
  };
  const priceBoxPosition = `${((dotSegments.opening + dotSegments.closing / 2) / totalDots) * 100}%`;

  const timelineData = {
    opening: analysis?.time?.issue_dates?.opening || "N/A",
    closing: analysis?.time?.issue_dates?.closing || "N/A",
    listing: analysis?.time?.listing_details?.expected_date || "N/A",
    allotment: analysis?.time?.allotment_timeline?.date || "N/A",
  };

  // MODIFIED: Added helper function for dot color
  const getDotColorClass = (index: number) => {
    if (index >= dotSegments.opening && index < dotSegments.opening + dotSegments.closing) return "bg-[#B4292E]";
    if (index >= dotSegments.opening + dotSegments.closing && index < totalDots - dotSegments.allotment) return "bg-[#E4CA28]";
    if (index >= totalDots - dotSegments.allotment) return "bg-[#0073E6]";
    return "bg-[#00914D]"; // Default color
  };

  // MODIFIED: Added robust function for displaying the price
  const getDisplayPrice = () => {
    const priceBand = analysis.ipo_details?.price_band;
    if (priceBand && typeof priceBand === 'string' && priceBand.includes(' - ')) {
      const parts = priceBand.split(' - ');
      const upperPrice = parts[1]?.trim();
      // Ensure the upper price is a valid number
      if (upperPrice && !isNaN(parseFloat(upperPrice))) {
        return `₹${upperPrice}`;
      }
    }
    return 'N/A'; // Fallback if format is wrong or no upper band exists
  };

  const displayPrice = getDisplayPrice();

  const investorData = [
    { label: "Retail Investor", value: parseFloat(analysis?.ipo_details?.allocation_details?.retail.toString() || "0") },
    { label: "NII", value: parseFloat(analysis?.ipo_details?.allocation_details?.nii.toString() || "0") },
    { label: "QIB", value: parseFloat(analysis?.ipo_details?.allocation_details?.qib.toString() || "0") },
    { label: "Total", value: parseFloat((analysis?.ipo_details?.allocation_details?.retail + analysis?.ipo_details?.allocation_details?.nii + analysis?.ipo_details?.allocation_details?.qib).toString() || "0") },
  ];
  // --- End Data Configuration ---

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${analysis?.company_name || 'IPO'} Analysis`,
          text: `Check out this comprehensive IPO analysis of ${analysis?.company_name || 'Company'}. Score: ${overallScore.toFixed(1)}/10`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: "-150px 0px 0px 0px", threshold: 0.5 }
    );

    const currentRefs = sectionRefs.current;
    Object.values(currentRefs).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(currentRefs).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [sectionOrder]);

  const handleTabClick = (value: string) => {
    setSectionOrder((prev) => {
      const newOrder = prev.filter((tab) => tab !== value);
      return [value, ...newOrder];
    });
    setTimeout(() => {
      const section = sectionRefs.current[value];
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No analysis data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-ibm-plex" style={{
      background: `
      radial-gradient(circle at 20% 30%, rgba(240, 248, 255, 1), rgba(240, 248, 255, 0) 40%),
      radial-gradient(circle at 70% 20%, rgba(173, 216, 230, 0.6), rgba(173, 216, 230, 0) 50%),
      radial-gradient(circle at 30% 80%, rgba(135, 206, 250, 0.5), rgba(135, 206, 250, 0) 50%),
      radial-gradient(circle at 90% 70%, rgba(173, 216, 250, 0.5), rgba(173, 216, 250, 0) 60%)
    `,
      backgroundColor: '#e6f4fe'
    }}>
      {/* Header */}
      <header className="border-b  backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <button
                onClick={() => window.history.back()}
                className="border border-primary/20 hover:bg-primary/10 h-10 w-10 flex-shrink-0 rounded-md flex items-center justify-center"
                aria-label="Go back"
              >
                <ArrowLeftCircle className="h-5 w-5 text-primary" />
              </button>
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <Avatar className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                  {ipo?.image_url.trim() !== ""  && ipo?.image_url != null  && ipo?.image_url != undefined && ipo?.image_url != " "  ? (
                    <AvatarImage src={ipo?.image_url} alt={`${analysis.company_name} logo`} />
                  ) : (
                    <AvatarFallback className="text-white bg-black border-black border-2 text-xs font-medium"> 
                      {getInitials(analysis.company_name || '')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary truncate">
                    {analysis.company_name} IPO Analysis
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Comprehensive Investment Review
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleShare}
                className="border border-primary/20 hover:bg-primary/10 flex-1 sm:flex-none px-3 py-2 rounded-md text-sm flex items-center justify-center"
                aria-label="Share analysis"
              >
                <Share2 className="h-4 w-4 mr-2 text-primary" />
                Share
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Key Metrics Overview */}
        <section aria-labelledby="key-metrics-heading">
          <h2 id="key-metrics-heading" className="sr-only">Key Investment Metrics</h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Overall Score", value: `${overallScore.toFixed(1)}/10`, color: getScoreColor(overallScore), description: "Combined rating" },
              { label: "Issue Size", value: analysis.ipo_details?.issue_size || "N/A", color: "text-foreground", description: "Total offering amount" },
              { label: "Price Band", value: analysis.ipo_details?.price_band || "N/A", color: "text-foreground", description: "Price per share" },
              { label: "Potential Gains", value: `~${analysis.ipo_details?.approximate_gains_potential || 0}%`, color: "text-green-600 dark:text-green-400", description: "Expected listing gains" },
            ].map((metric) => (
              <div
                key={metric.label}
                className="bg-background/60 backdrop-blur-sm border rounded-lg p-4 text-center hover:bg-muted/50 transition-colors"
              >
                <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                <p className={`text-3xl font-semibold ${metric.color}`}>{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline & Investor Split Section */}
        <section className="p-4 sm:p-6 ">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#0073E6] mb-12" style={{
            fontFamily: 'IBM Plex Sans',
            fontWeight: '600',
            color: '#0073E6',
            fontStyle: 'SemiBold',
            fontSize: '36px',
            lineHeight: '100%',
            letterSpacing: '0%',
          }}>
            Timeline & Split
          </h2>
          <div className="w-full mb-16">
            <div className="relative h-12">
              <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
                {/* MODIFIED: Dot rendering logic */}
                {Array.from({ length: totalDots }).map((_, i) => {
                  const colorClass = getDotColorClass(i);
                  const prevColorClass = i > 0 ? getDotColorClass(i - 1) : null;
                  // First dot or dots where color changes are bigger
                  const sizeClass = (i === 0 || colorClass !== prevColorClass) ? 'w-4 h-4' : 'w-3 h-3';

                  return <div key={i} className={`rounded-full transition-all ${sizeClass} ${colorClass}`} />;
                })}
              </div>
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#B4292E] text-white font-bold text-sm px-3 py-1 rounded-md shadow-lg"
                style={{ left: priceBoxPosition }}
              >
                {/* MODIFIED: Uses the new robust price variable */}
                {displayPrice}
              </div>
              <div className="absolute inset-0">
                <TimelineMarker label="Opening" date={timelineData.opening} position={markerPositions.opening} alignment="left" />
                <TimelineMarker label="Closing" date={timelineData.closing} position={markerPositions.closing} />
                <TimelineMarker label="Listing" date={timelineData.listing} position={markerPositions.listing} />
                <TimelineMarker label="Allotment" date={timelineData.allotment} position={markerPositions.allotment} />
              </div>
            </div>
          </div>
          <hr className="my-8 border-t border-gray-200" />
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4 justify-items-center">
              {investorData.map((item, i) => (
                <ProgressCircle key={i} label={item.label} value={item.value} />
              ))}
            </div>
          </div>
        </section>

        {/* The rest of your component remains the same... */}
        {/* ... (Sticky Tab Navigation, Analysis Sections, Investment Summary, etc.) ... */}
        <div className="sticky top-[89px] z-40 backdrop-blur py-2">
          <div className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 rounded-full shadow-md">
            {["performance", "fundamentals", "risk", "flexibility"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`text-sm py-2 px-3 rounded-full transition-colors capitalize ${activeTab === tab
                  ? 'bg-[#99CCFF] text-[#0073E6] font-semibold'
                  : 'hover:bg-gray-100 text-primary'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <section aria-labelledby="analysis-sections-heading">
          <h2 id="analysis-sections-heading" className="sr-only">Detailed Analysis Sections</h2>
          {sectionOrder.map((tab) => (
            <div
              key={tab}
              ref={(el) => { sectionRefs.current[tab] = el; }}
              id={tab}
              className="scroll-mt-[150px] mb-8"
            >
              {tab === "performance" && (
                <div className="p-6">
                  <h3 className="text-2xl lg:text-3xl font-semibold text-[#0073E6]  mb-6" style={{
                    fontFamily: 'IBM Plex Sans',
                    fontWeight: '600',
                    color: '#0073E6',
                    fontStyle: 'SemiBold',
                    fontSize: '36px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                  }}>Performance</h3>
                  <div>
                    {/* CORRECTED LIST */}
                    <ul className="space-y-6 list-disc list-outside pl-5">
                      <li>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">Company Performance</h4>
                          <p className="text-muted-foreground" style={{
                            fontFamily: 'IBM Plex Sans',
                            fontWeight: '400',
                            color: '#212121',
                            fontStyle: 'Regular',
                            fontSize: '18px',
                            lineHeight: '150%', // Adjusted for better readability
                            letterSpacing: '0%',
                          }}>
                            {analysis.performance?.summary || "Performance analysis not available"}
                          </p>
                        </div>
                      </li>

                      {analysis.performance?.management_quality && (
                        <li>
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">Management Quality</h4>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                              <div className="flex-shrink-0">
                                <ProgressCircle
                                  label="Management Score"
                                  value={analysis.performance.management_quality.score || 0}
                                />
                              </div>
                              <div className="flex-1 space-y-2"
                                style={{
                                  fontFamily: 'IBM Plex Sans',
                                  fontWeight: '400',
                                  color: '#212121',
                                  fontStyle: 'Regular',
                                  fontSize: '18px',
                                  lineHeight: '150%', // Adjusted
                                  letterSpacing: '0%',
                                }}>
                                <p className="text-sm">
                                  <strong>Experience:</strong> {analysis.performance.management_quality.experience || "N/A"}
                                </p>
                                <p className="text-sm">
                                  <strong>Track Record:</strong> {analysis.performance.management_quality.track_record || "N/A"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}

                      {analysis.performance?.key_achievements && (
                        <li>
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">Key Achievements</h4>
                            <div className="space-y-2 text-muted-foreground"
                              style={{
                                fontFamily: 'IBM Plex Sans',
                                fontWeight: '400', // Adjusted from 600 for body text
                                color: '#212121',
                                fontStyle: 'Regular',
                                fontSize: '18px',
                                lineHeight: '150%', // Adjusted
                                letterSpacing: '0%',
                              }}>
                              {analysis.performance.key_achievements.slice(0, 3).map((achievement: string, index: number) => (
                                <p key={index} className="text-sm">{achievement}</p>
                              ))}
                            </div>
                          </div>
                        </li>
                      )}

                      {analysis.performance?.market_comparison && (
                        <li>
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Market Comparison</h4>
                            <p className="text-sm"
                              style={{
                                fontFamily: 'IBM Plex Sans',
                                fontWeight: '400',
                                color: '#212121',
                                fontStyle: 'Regular',
                                fontSize: '18px',
                                lineHeight: '150%', // Adjusted
                                letterSpacing: '0%',
                              }}>
                              {analysis.performance.market_comparison}
                            </p>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {tab === "fundamentals" && (
                <div className="p-6">
                  <h3 className="text-2xl lg:text-3xl font-semibold text-[#0073E6]  mb-6" style={{
                    fontFamily: 'IBM Plex Sans',
                    fontWeight: '600',
                    color: '#0073E6',
                    fontStyle: 'SemiBold',
                    fontSize: '36px',
                    lineHeight: '100%',
                    letterSpacing: '0%',
                  }}>Financial Fundamentals</h3>
                  <div>
                    <p className="text-muted-foreground mb-6">
                      {analysis.fundamentals?.summary || "Financial analysis not available"}
                    </p>
                    {analysis.fundamentals && (
                      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                        {analysis.fundamentals.revenue_details?.total_revenue && (
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                            <p className="text-xl sm:text-2xl font-bold text-foreground">
                              INR {(analysis.fundamentals.revenue_details.total_revenue / 10000000).toFixed(0)} CR
                            </p>
                            <p className="text-xs text-muted-foreground">Latest FY</p>
                          </div>
                        )}
                        {analysis.fundamentals.profit_analysis?.net_profit && (
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Net Profit</p>
                            <p className="text-xl sm:text-2xl font-bold text-foreground">
                              INR {(analysis.fundamentals.profit_analysis.net_profit / 10000000).toFixed(0)} CR
                            </p>
                            <p className="text-xs text-muted-foreground">Latest FY</p>
                          </div>
                        )}
                        {analysis.fundamentals.revenue_details?.revenue_cagr && (
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Revenue Growth</p>
                            <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                              {analysis.fundamentals.revenue_details.revenue_cagr}%
                            </p>
                            <p className="text-xs text-muted-foreground">Current Growth</p>
                          </div>
                        )}
                        {analysis.fundamentals.profit_analysis?.profit_margin && (
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Profit Margin</p>
                            <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                              {analysis.fundamentals.profit_analysis.profit_margin}%
                            </p>
                            <p className="text-xs text-muted-foreground">Current Margin</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tab === "risk" && (
                <div className="p-6">
                  <h3 className="text-3xl font-semibold  text-[#0073E6] mb-4">
                    Risk Assessment
                  </h3>
                  <p className="text-muted-foreground mb-8 text-base ">
                    {analysis.risk_meter?.summary || "Risk analysis not available"}
                  </p>

                  {analysis.risk_meter?.risk_categories && (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {Object.entries(analysis.risk_meter.risk_categories).map(([category, risks]) => {
                        // Get a deterministic color from the map
                        const colorClass = riskCategoryColors[category as keyof typeof riskCategoryColors] || riskCategoryColors.default;

                        return (
                          // REMOVED flex classes from the Card
                          <Card key={category}>
                            {/* FIX 1: Set explicit vertical padding. p-6 is default, so we reduce it. */}
                            <CardHeader className="p-6 pb-4">
                              <CardTitle className={`capitalize text-xl font-semibold  ${colorClass}`}>
                                {category.replace(/_/g, " ")}
                              </CardTitle>
                            </CardHeader>

                            {/* FIX 2: Remove top padding and adjust horizontal/bottom padding */}
                            <CardContent className="px-6 pb-6 pt-0">
                              <ul className="list-disc list-outside space-y-2 pl-5">
                                {(risks as string[]).slice(0, 3).map((risk, i) => (
                                  <li key={i} className="text-sm  text-gray-800">
                                    {risk}
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}


              {tab === "flexibility" && (
                <div className="p-6">
                  <h3 className="text-3xl font-semibold  text-[#0073E6] mb-4">
                    Business Flexibility & Adaptability
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    {analysis.flexibility?.summary || "Flexibility analysis not available"}
                  </p>

                  {analysis.flexibility && (
                    <>
                      {/* This first grid of progress circles remains unchanged */}
                      <div className="grid gap-6 sm:grid-cols-3 justify-items-center mb-12">
                        {analysis.flexibility.market_adaptability && (
                          <ProgressCircle
                            label="Market Adaptability"
                            value={analysis.flexibility.market_adaptability.score || 0}
                          />
                        )}
                        {analysis.flexibility.financial_stability && (
                          <ProgressCircle
                            label="Financial Stability"
                            value={analysis.flexibility.financial_stability.score || 0}
                          />
                        )}
                        {analysis.flexibility.operational_agility && (
                          <ProgressCircle
                            label="Operational Agility"
                            value={analysis.flexibility.operational_agility.score || 0}
                          />
                        )}
                      </div>

                      {/* REFACTORED: Descriptions are now in a styled list for consistency */}
                      <ul className="space-y-6 list-disc list-outside pl-5">
                        {analysis.flexibility.market_adaptability && (
                          <li>
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">Market Adaptability</h4>
                              <p className="text-sm text-muted-foreground">
                                {analysis.flexibility.market_adaptability.description || "N/A"}
                              </p>
                            </div>
                          </li>
                        )}
                        {analysis.flexibility.financial_stability && (
                          <li>
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">Financial Stability</h4>
                              <p className="text-sm text-muted-foreground">
                                {analysis.flexibility.financial_stability.description || "N/A"}
                              </p>
                            </div>
                          </li>
                        )}
                        {analysis.flexibility.operational_agility && (
                          <li>
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">Operational Agility</h4>
                              <p className="text-sm text-muted-foreground">
                                {analysis.flexibility.operational_agility.description || "N/A"}
                              </p>
                            </div>
                          </li>
                        )}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </section>

        <section>
          {/* Investment Summary */}
          <Card className="bg-gradient-to-r from-background to-muted border">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl text-foreground">Investment Summary</CardTitle>
              <CardDescription className="text-muted-foreground">
                {analysis.ipo_details.gains_rationale}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Profitability Score</p>
                <p className={`text-3xl sm:text-4xl font-bold ${getScoreColor(analysis.ipo_details.profitability_of_allotment.score)}`}>
                  {analysis.ipo_details.profitability_of_allotment.score}/10
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Potential Gains</p>
                <p className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400">
                  {analysis.ipo_details.approximate_gains_potential}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Assessment</p>
                <p className="text-base sm:text-lg font-medium text-foreground">
                  {analysis.ipo_details.profitability_of_allotment.assessment}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}