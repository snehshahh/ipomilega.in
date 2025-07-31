"use client";
import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeftCircle, Share2 } from "lucide-react";
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis";
import { Ipo } from "@/app/models/ipo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "@/app/styles/analysis.css";

const TimelineMarker = ({
  label,
  date,
  position,
  alignment = "center",
}: {
  label: string;
  date: string;
  position: string;
  alignment?: "left" | "center" | "right";
}) => {
  let alignmentClass = "items-center text-center -translate-x-1/2"; // Default for 'center'
  if (alignment === "left") alignmentClass = "items-start text-left"; // No x-translation for left alignment
  if (alignment === "right")
    alignmentClass = "items-end text-right -translate-x-full";

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className={`absolute top-0 h-full flex flex-col justify-between ${alignmentClass}`}
      style={{ left: position }}
    >
      <p
        className="text-lg font-medium -translate-y-8"
        style={{
          fontFamily: "IBM Plex Sans",
          fontWeight: 400,
          fontStyle: "Regular",
          fontSize: 18,
        }}
      >
        {label}
      </p>
      <p
        className="text-lg font-semibold translate-y-8"
        style={{
          fontFamily: "IBM Plex Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: 18,
        }}
      >
        {formattedDate}
      </p>
    </div>
  );
};

const TimelineMarkerMobileUpper = ({
  label,
  date,
  position,
  alignment = "center",
}: {
  label: string;
  date: string;
  position: string;
  alignment?: "left" | "center" | "right";
}) => {
  let alignmentClass = "items-center text-center -translate-x-1/2"; // Default for 'center'
  if (alignment === "left") alignmentClass = "items-start text-left"; // No x-translation for left alignment
  if (alignment === "right")
    alignmentClass = "items-end text-right -translate-x-full";

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className={`absolute top-0 h-full flex flex-col justify-between ${alignmentClass}`}
      style={{ left: position }}
    >
      <p
        className="text-lg font-medium -translate-y-8"
        style={{
          fontFamily: "IBM Plex Sans",
          fontWeight: 400,
          fontStyle: "Regular",
          fontSize: 18,
        }}
      >
        {label}
      </p>
      <p
        className="text-lg font-semibold translate-y-8"
        style={{
          fontFamily: "IBM Plex Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: 18,
        }}
      >
        {formattedDate}
      </p>
    </div>
  );
};

const TimelineMarkerMobileLower = ({
  label,
  date,
  position,
  alignment = "center",
}: {
  label: string;
  date: string;
  position: string;
  alignment?: "left" | "center" | "right";
}) => {
  let alignmentClass = "items-center text-center -translate-x-1/2"; // Default for 'center'
  if (alignment === "left") alignmentClass = "items-start text-left"; // No x-translation for left alignment
  if (alignment === "right")
    alignmentClass = "items-end text-right -translate-x-full";

  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className={`absolute top-0 h-full flex flex-col justify-between ${alignmentClass}`}
      style={{ left: position }}
    >
      <p
        className="text-lg font-medium -translate-y-8"
        style={{
          fontFamily: "IBM Plex Sans",
          fontWeight: 400,
          fontStyle: "Regular",
          fontSize: 18,
        }}
      >
        {label}
      </p>
      <p
        className="text-lg font-semibold translate-y-8"
        style={{
          fontFamily: "IBM Plex Sans",
          fontWeight: 600,
          fontStyle: "SemiBold",
          fontSize: 18,
        }}
      >
        {formattedDate}
      </p>
    </div>
  );
};

const ProgressCircle = ({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description?: string;
}) => {
  const cappedValue = Math.min(value, 100);
  const strokeWidth = 4;
  const progressRadius = 16;
  const innerRadius = progressRadius - strokeWidth / 2;
  const circumference = 2 * Math.PI * progressRadius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (cappedValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <h4 className="progress-circle-label mb-2 sm:mb-4 text-sm sm:text-base">
        {label}
      </h4>
      <div className="relative w-20 h-20 sm:w-24 sm:h-24">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 36 36"
          className="w-full h-full"
        >
          <circle cx="18" cy="18" r={innerRadius} fill="#2563eb" />
          <circle
            cx="18"
            cy="18"
            r={progressRadius}
            fill="none"
            stroke="#93c5fd"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 18 18)"
            style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
          />
          {/* FIX: Manually adjusted 'y' for perfect visual centering */}
          <text
            x="18"
            y="21" // Nudged down slightly from the geometric center
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
      {description && (
        <p className="text-xs sm:text-sm mt-2 sm:mt-4 max-w-[290px] sm:max-w-[200px]">
          {description}
        </p>
      )}
    </div>
  );
};
interface AnalysisPageClientProps {
  analysis: IpoComprehensiveAnalysis;
  ipo: Ipo;
}

const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word: string) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function AnalysisPageClient({
  analysis,
  ipo,
}: AnalysisPageClientProps) {
  const [activeTab, setActiveTab] = useState("performance");
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "performance",
    "fundamentals",
    "risk",
    "flexibility",
  ]);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const riskCategoryColors: { [key: string]: string } = {
    market_risks: "text-red-600",
    financial_risks: "text-orange-500",
    operational_risks: "text-gray-600",
    regulatory_risks: "text-blue-600",
    default: "text-gray-600",
  };

  const overallScore = analysis
    ? (analysis.summary_metrics?.fundamentals_score +
        analysis.summary_metrics?.performance_score) /
      2
    : 0;

  const getDisplayPrice = () => {
    const priceBand = analysis.ipo_details?.price_band;
    if (
      priceBand &&
      typeof priceBand === "string" &&
      priceBand.includes(" - ")
    ) {
      const parts = priceBand.split(" - ");
      const upperPrice = parts[1]?.trim();
      if (upperPrice && !isNaN(parseFloat(upperPrice))) return `₹${upperPrice}`;
    }
    return "N/A";
  };

  const dotSegments = { opening: 10, closing: 15, listing: 8, allotment: 12 };
  const totalDots = Object.values(dotSegments).reduce((a, b) => a + b, 0);
  const markerPositions = {
    opening: "0%",
    closing: `${(dotSegments.opening / totalDots) * 100}%`,
    listing: `${
      ((dotSegments.opening + dotSegments.closing) / totalDots) * 100
    }%`,
    allotment: `${
      ((dotSegments.opening + dotSegments.closing + dotSegments.listing) /
        totalDots) *
      100
    }%`,
  };
  const displayPrice = getDisplayPrice();
  const showPriceBox = displayPrice !== "N/A";
  const priceBoxPosition = `${
    ((dotSegments.opening + dotSegments.closing / 2) / totalDots) * 100
  }%`;

  const timelineData = {
    opening: analysis?.time?.issue_dates?.opening || "N/A",
    closing: analysis?.time?.issue_dates?.closing || "N/A",
    listing: analysis?.time?.listing_details?.expected_date || "N/A",
    allotment: analysis?.time?.allotment_timeline?.date || "N/A",
  };

  const getDotColorClass = (index: number) => {
    if (
      index >= dotSegments.opening &&
      index < dotSegments.opening + dotSegments.closing
    )
      return "bg-[#B4292E]";
    if (
      index >= dotSegments.opening + dotSegments.closing &&
      index < totalDots - dotSegments.allotment
    )
      return "bg-[#E4CA28]";
    if (index >= totalDots - dotSegments.allotment) return "bg-[#0073E6]";
    return "bg-[#00914D]";
  };

  const investorData = [
    {
      label: "Retail Investor",
      value: parseFloat(
        analysis?.ipo_details?.allocation_details?.retail.toString() || "0"
      ),
    },
    {
      label: "NII",
      value: parseFloat(
        analysis?.ipo_details?.allocation_details?.nii.toString() || "0"
      ),
    },
    {
      label: "QIB",
      value: parseFloat(
        analysis?.ipo_details?.allocation_details?.qib.toString() || "0"
      ),
    },
    {
      label: "Total",
      value: parseFloat(
        (
          analysis?.ipo_details?.allocation_details?.retail +
          analysis?.ipo_details?.allocation_details?.nii +
          analysis?.ipo_details?.allocation_details?.qib
        ).toString() || "0"
      ),
    },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${analysis?.company_name || "IPO"} Analysis`,
          text: `Check out this comprehensive IPO analysis of ${
            analysis?.company_name || "Company"
          }. Score: ${overallScore.toFixed(1)}/10`,
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
          if (entry.isIntersecting) setActiveTab(entry.target.id);
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

  // FIX START: Added direct state update for active tab
  const handleTabClick = (value: string) => {
    setActiveTab(value); // Instantly update active tab for immediate feedback
    setSectionOrder((prev) => [value, ...prev.filter((tab) => tab !== value)]);
    setTimeout(() => {
      const section = sectionRefs.current[value];
      if (section)
        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };
  // FIX END

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-base sm:text-lg text-muted-foreground">
          No analysis data available
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-ibm-plex main-background mt-20">
      <header className="sticky top-0 z-50 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 w-full">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.history.back()}
                  className="border border-primary/20 hover:bg-primary/10 h-10 w-10 rounded-md flex items-center justify-center"
                  aria-label="Go back"
                >
                  <ArrowLeftCircle className="h-5 w-5 text-primary" />
                </button>
                <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                  {ipo?.image_url?.trim() ? (
                    <AvatarImage
                      src={ipo.image_url}
                      alt={`${analysis.company_name} logo`}
                    />
                  ) : (
                    <AvatarFallback className="text-white bg-black border-black border-2 text-xs font-medium">
                      {getInitials(analysis.company_name || "")}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-primary truncate">
                  {analysis.company_name} IPO Analysis
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Comprehensive Investment Review
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleShare}
                className="border border-primary/20 hover:bg-primary/10 px-3 py-2 rounded-md text-sm flex items-center justify-center w-full sm:w-auto"
                aria-label="Share analysis"
              >
                <Share2 className="h-4 w-4 mr-2 text-primary" />
                Share
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <section aria-labelledby="key-metrics-heading">
          <h2 id="key-metrics-heading" className="sr-only">
            Key Investment Metrics
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Overall Score",
                value: `${overallScore.toFixed(1)}/10`,
                color: getScoreColor(overallScore),
                description: "Combined rating",
              },
              {
                label: "Issue Size",
                value: analysis.ipo_details?.issue_size || "N/A",
                color: "text-foreground",
                description: "Total offering amount",
              },
              {
                label: "Price Band",
                value: analysis.ipo_details?.price_band || "N/A",
                color: "text-foreground",
                description: "Price per share",
              },
              {
                label: "Potential Gains",
                value: `~${
                  analysis.ipo_details?.approximate_gains_potential || 0
                }%`,
                color: "text-green-600 dark:text-green-400",
                description: "Expected listing gains",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="bg-white/70 backdrop-blur-sm border p-4 sm:p-6 text-center rounded-lg flex flex-col justify-center"
              >
                <p className="metric-card-label mb-2 text-sm sm:text-base">
                  {metric.label}
                </p>
                <p
                  className={`metric-card-value ${metric.color} text-lg sm:text-xl`}
                >
                  {metric.value}
                </p>
                <p className="text-muted-foreground metric-card-description mt-1 text-xs sm:text-sm">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline & Investor Split Section */}
        <section className="p-4 sm:p-6">
          <h2 className="heading-section text-center sm:text-left text-gray-800 mb-12">
            Timeline & Split
          </h2>
          <div className="w-full mb-16">
            <div className="hidden sm:block">
              <div className="relative h-12">
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
                  {Array.from({ length: totalDots }).map((_, i) => {
                    const colorClass = getDotColorClass(i);
                    const prevColorClass =
                      i > 0 ? getDotColorClass(i - 1) : null;
                    const sizeClass =
                      i === 0 || colorClass !== prevColorClass
                        ? "w-7 h-7 animate-pulse p-1"
                        : "w-5 h-5 mt-1";
                    return (
                      <div
                        key={i}
                        className={`rounded-full transition-all ${sizeClass} ${colorClass}`}
                      />
                    );
                  })}
                </div>

                {/* Only show price box if price is not N/A */}
                {showPriceBox && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#B4292E] text-white font-bold text-sm px-3 py-1 rounded-md shadow-lg z-10"
                    style={{ left: priceBoxPosition }}
                  >
                    {displayPrice}
                  </div>
                )}

                <div className="absolute inset-0">
                  <TimelineMarker
                    label="Opening"
                    date={timelineData.opening}
                    position={markerPositions.opening}
                    alignment="left"
                  />
                  <TimelineMarker
                    label="Closing"
                    date={timelineData.closing}
                    position={markerPositions.closing}
                    alignment="left"
                  />
                  <TimelineMarker
                    label="Listing"
                    date={timelineData.listing}
                    position={markerPositions.listing}
                    alignment="left"
                  />
                  <TimelineMarker
                    label="Allotment"
                    date={timelineData.allotment}
                    position={markerPositions.allotment}
                    alignment="left"
                  />
                </div>
              </div>
            </div>

            <div className="block sm:hidden">
              <div className="relative h-12">
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
                  {Array.from({ length: totalDots / 2 }).map((_, i) => {
                    const index = i;
                    const colorClass = getDotColorClass(index);
                    const prevColorClass =
                      index > 0 ? getDotColorClass(index - 1) : null;
                    const sizeClass =
                      index === 0 || colorClass !== prevColorClass
                        ? "w-7 h-7 animate-pulse p-1"
                        : "w-5 h-5 mt-1";
                    return (
                      <div
                        key={index}
                        className={`rounded-full transition-all ${sizeClass} ${colorClass}`}
                      />
                    );
                  })}
                </div>

                {/* Only show price box if price is not N/A */}
                {showPriceBox && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#B4292E] text-white font-bold text-sm px-3 py-1 rounded-md shadow-lg z-10"
                    style={{ left: priceBoxPosition }}
                  >
                    {displayPrice}
                  </div>
                )}

                <div className="absolute inset-0">
                  <TimelineMarkerMobileUpper
                    label="Opening"
                    date={timelineData.opening}
                    position={markerPositions.opening}
                    alignment="left"
                  />
                  <TimelineMarkerMobileUpper
                    label="Closing"
                    date={timelineData.closing}
                    position={`${parseFloat(markerPositions.closing) + 22}%`}
                    alignment="left"
                  />
                </div>
              </div>

              <div className="relative h-12 mt-24">
                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
                  {Array.from({ length: totalDots / 2 }).map((_, i) => {
                    const index = i + totalDots / 2;
                    const colorClass = getDotColorClass(index);
                    const prevColorClass =
                      index > 0 ? getDotColorClass(index - 1) : null;
                    const sizeClass =
                      colorClass !== prevColorClass
                        ? "w-7 h-7 animate-pulse p-1"
                        : "w-5 h-5 mt-1";
                    return (
                      <div
                        key={index}
                        className={`rounded-full transition-all ${sizeClass} ${colorClass}`}
                      />
                    );
                  })}
                </div>

                {/* Only show price box if price is not N/A */}
                {showPriceBox && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#B4292E] text-white font-bold text-sm px-3 py-1 rounded-md shadow-lg z-10"
                    style={{ left: priceBoxPosition }}
                  >
                    {displayPrice}
                  </div>
                )}

                <div className="absolute inset-0">
                  <TimelineMarkerMobileLower
                    label="Listing"
                    date={timelineData.listing}
                    position={`${parseFloat(markerPositions.listing) - 42}%`}
                    alignment="left"
                  />
                  <TimelineMarkerMobileLower
                    label="Allotment"
                    date={timelineData.allotment}
                    position={`${parseFloat(markerPositions.allotment) - 22}%`}
                    alignment="left"
                  />
                </div>
              </div>
            </div>
          </div>
          <hr className="my-8 border-t border-gray-200" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-4 justify-items-center">
            {investorData.map((item, i) => (
              <ProgressCircle key={i} label={item.label} value={item.value} />
            ))}
          </div>
        </section>

        <div className="sticky top-[180px] sm:top-[89px] z-40 mb-6 sm:mb-7">
          <div
            className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-white backdrop-blur-sm rounded-full sm:rounded-md"
            style={{ borderRadius: "2rem" }}
          >
            {["performance", "fundamentals", "risk", "flexibility"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`sticky-tab-button text-xs sm:text-sm py-2 px-2 sm:px-3 transition-colors capitalize ${
                    activeTab === tab
                      ? "bg-[#99CCFF] text-[#0073E6] shadow-md"
                      : "hover:bg-[#99CCFF]/50 text-[#0073E6]"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>

        <section aria-labelledby="analysis-sections-heading">
          <h2 id="analysis-sections-heading" className="sr-only">
            Detailed Analysis Sections
          </h2>
          {sectionOrder.map((tab) => (
            <div
              key={tab}
              ref={(el) => {
                sectionRefs.current[tab] = el;
              }}
              id={tab}
              className="scroll-mt-[300px] sm:scroll-mt-[150px] mb-6 sm:mb-8"
            >
              {tab === "performance" && (
                <div className="p-4 sm:p-6">
                  <h3 className="heading-section text-blue-600 mb-4 sm:mb-6">
                    Performance
                  </h3>
                  <ul className="space-y-6 list-disc list-outside pl-5">
                    <li>
                      <h4 className="heading-subsection text-sm sm:text-base">
                        Company Performance
                      </h4>
                      <p className="text-body text-xs sm:text-sm">
                        {analysis.performance?.summary ||
                          "Performance analysis not available"}
                      </p>
                    </li>
                    {analysis.performance?.management_quality && (
                      <li>
                        <h4 className="heading-subsection text-sm sm:text-base">
                          Management Quality
                        </h4>
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                          <div className="flex-shrink-0">
                            <ProgressCircle
                              label="Mgmt Score"
                              value={
                                analysis.performance.management_quality.score ||
                                0
                              }
                            />
                          </div>
                          <div className="flex-1 space-y-2 text-xs sm:text-sm">
                            <p>
                              <strong>Experience:</strong>{" "}
                              {analysis.performance.management_quality
                                .experience || "N/A"}
                            </p>
                            <p>
                              <strong>Track Record:</strong>{" "}
                              {analysis.performance.management_quality
                                .track_record || "N/A"}
                            </p>
                          </div>
                        </div>
                      </li>
                    )}
                    {analysis.performance?.key_achievements && (
                      <li>
                        <h4 className="heading-subsection text-sm sm:text-base">
                          Key Achievements
                        </h4>
                        <div className="space-y-2 text-xs sm:text-sm">
                          {analysis.performance.key_achievements
                            .slice(0, 3)
                            .map((achievement: string, index: number) => (
                              <p key={index}>{achievement}</p>
                            ))}
                        </div>
                      </li>
                    )}
                    {analysis.performance?.market_comparison && (
                      <li>
                        <h4 className="heading-subsection text-sm sm:text-base">
                          Market Comparison
                        </h4>
                        <p className="text-body text-xs sm:text-sm">
                          {analysis.performance.market_comparison}
                        </p>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {tab === "fundamentals" && (
                <div className="p-4 sm:p-6">
                  <h3 className="heading-section text-blue-600 mb-4 sm:mb-6">
                    Fundamentals
                  </h3>
                  <ul className="space-y-6 list-disc list-outside pl-5">
                    <li>
                      <h4 className="heading-subsection text-sm sm:text-base">
                        Financial Fundamentals
                      </h4>
                      <p className="text-body text-xs sm:text-sm mb-4 sm:mb-6">
                        {analysis.fundamentals?.summary ||
                          "Financial analysis not available"}
                      </p>
                      {analysis.fundamentals && (
                        /* FIX START: Centered the cards container */
                        <div className="w-full sm:w-[70%] grid gap-4 grid-cols-1 sm:grid-cols-2 mx-auto">
                        {/* FIX END */}
                          {analysis.fundamentals.revenue_details
                            ?.total_revenue && (
                            <div className="bg-[#ffffff] rounded-[8px] shadow-[0px_0px_6px_#0000000c] pt-[9px] pr-[9px] pb-[9px] pl-[9px] sm:pt-[13px] sm:pr-[13px] sm:pb-[13px] sm:pl-[13px] md:pt-[18px] md:pr-[18px] md:pb-[18px] md:pl-[18px] flex flex-col items-center w-full">
                              <p className="text-[12px] sm:text-[15px] md:text-[18px] font-ibm-plex font-medium leading-[16px] sm:leading-[20px] md:leading-[24px] text-[#4f4c4c]">
                                Total Revenue
                              </p>
                              <span
                                className={`text-[16px] sm:text-[20px] md:text-[24px] font-ibm-plex font-semibold leading-[21px] sm:leading-[26px] md:leading-[32px] mt-[6px] sm:mt-[9px] md:mt-[12px] ${"text-[#212121]"}`}
                              >
                                INR{" "}
                                {(
                                  analysis.fundamentals.revenue_details
                                    .total_revenue / 10000000
                                ).toFixed(0)}{" "}
                                CR
                              </span>
                              <span className="text-[8px] sm:text-[10px] md:text-[12px] font-ibm-plex font-medium leading-[11px] sm:leading-[13px] md:leading-[16px] text-[#4f4c4c] mt-[2px] sm:mt-[3px] md:mt-[4px]">
                                Latest FY
                              </span>
                            </div>
                          )}
                          {analysis.fundamentals.profit_analysis
                            ?.net_profit && (
                            <div className="bg-[#ffffff] rounded-[8px] shadow-[0px_0px_6px_#0000000c] pt-[9px] pr-[9px] pb-[9px] pl-[9px] sm:pt-[13px] sm:pr-[13px] sm:pb-[13px] sm:pl-[13px] md:pt-[18px] md:pr-[18px] md:pb-[18px] md:pl-[18px] flex flex-col items-center w-full">
                              <p className="text-[12px] sm:text-[15px] md:text-[18px] font-ibm-plex font-medium leading-[16px] sm:leading-[20px] md:leading-[24px] text-[#4f4c4c]">
                                Net Profit
                              </p>
                              <span
                                className={`text-[16px] sm:text-[20px] md:text-[24px] font-ibm-plex font-semibold leading-[21px] sm:leading-[26px] md:leading-[32px] mt-[6px] sm:mt-[9px] md:mt-[12px] ${"text-[#212121]"}`}
                              >
                                INR{" "}
                                {(
                                  analysis.fundamentals.profit_analysis
                                    .net_profit / 10000000
                                ).toFixed(0)}{" "}
                                CR
                              </span>
                              <span className="text-[8px] sm:text-[10px] md:text-[12px] font-ibm-plex font-medium leading-[11px] sm:leading-[13px] md:leading-[16px] text-[#4f4c4c] mt-[2px] sm:mt-[3px] md:mt-[4px]">
                                Latest FY
                              </span>
                            </div>
                          )}
                          {analysis.fundamentals.revenue_details
                            ?.revenue_cagr && (
                            <div className="bg-[#ffffff] rounded-[8px] shadow-[0px_0px_6px_#0000000c] pt-[9px] pr-[9px] pb-[9px] pl-[9px] sm:pt-[13px] sm:pr-[13px] sm:pb-[13px] sm:pl-[13px] md:pt-[18px] md:pr-[18px] md:pb-[18px] md:pl-[18px] flex flex-col items-center w-full">
                              <p className="text-[12px] sm:text-[15px] md:text-[18px] font-ibm-plex font-medium leading-[16px] sm:leading-[20px] md:leading-[24px] text-[#4f4c4c]">
                                Revenue Growth
                              </p>
                              <span
                                className={`text-[16px] sm:text-[20px] md:text-[24px] font-ibm-plex font-semibold leading-[21px] sm:leading-[26px] md:leading-[32px] mt-[6px] sm:mt-[9px] md:mt-[12px] ${"text-[#00914d]"}`}
                              >
                                {
                                  analysis.fundamentals.revenue_details
                                    .revenue_cagr
                                }
                                %
                              </span>
                              <span className="text-[8px] sm:text-[10px] md:text-[12px] font-ibm-plex font-medium leading-[11px] sm:leading-[13px] md:leading-[16px] text-[#4f4c4c] mt-[2px] sm:mt-[3px] md:mt-[4px]">
                                Current Growth
                              </span>
                            </div>
                          )}
                          {analysis.fundamentals.profit_analysis
                            ?.profit_margin && (
                            <div className="bg-[#ffffff] rounded-[8px] shadow-[0px_0px_6px_#0000000c] pt-[9px] pr-[9px] pb-[9px] pl-[9px] sm:pt-[13px] sm:pr-[13px] sm:pb-[13px] sm:pl-[13px] md:pt-[18px] md:pr-[18px] md:pb-[18px] md:pl-[18px] flex flex-col items-center w-full">
                              <p className="text-[12px] sm:text-[15px] md:text-[18px] font-ibm-plex font-medium leading-[16px] sm:leading-[20px] md:leading-[24px] text-[#4f4c4c]">
                                Profit Margin
                              </p>
                              <span
                                className={`text-[16px] sm:text-[20px] md:text-[24px] font-ibm-plex font-semibold leading-[21px] sm:leading-[26px] md:leading-[32px] mt-[6px] sm:mt-[9px] md:mt-[12px] ${"text-[#00914d]"}`}
                              >
                                {
                                  analysis.fundamentals.profit_analysis
                                    .profit_margin
                                }
                                %
                              </span>
                              <span className="text-[8px] sm:text-[10px] md:text-[12px] font-ibm-plex font-medium leading-[11px] sm:leading-[13px] md:leading-[16px] text-[#4f4c4c] mt-[2px] sm:mt-[3px] md:mt-[4px]">
                                Current Margin
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                    <li>
                      <h4 className="heading-subsection text-sm sm:text-base">
                        Debt to Equity Ratio
                      </h4>
                      <p className="text-body text-xs sm:text-sm">Demo</p>
                    </li>
                    <li>
                      <h4 className="heading-subsection text-sm sm:text-base">
                        Business Model & Market Positioning
                      </h4>
                      <p className="text-body text-xs sm:text-sm">Demo</p>
                    </li>
                  </ul>
                </div>
              )}

              {tab === "risk" && (
                <div className="p-4 sm:p-6">
                  <h3 className="heading-section text-blue-600 mb-4">
                    Risk Assessment
                  </h3>
                  <p className="text-body text-xs sm:text-sm mb-6 sm:mb-8">
                    {analysis.risk_meter?.summary ||
                      "Risk analysis not available"}
                  </p>
                  {analysis.risk_meter?.risk_categories && (
                    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                      {Object.entries(analysis.risk_meter.risk_categories).map(
                        ([category, risks]) => {
                          const colorClass =
                            riskCategoryColors[
                              category as keyof typeof riskCategoryColors
                            ] || riskCategoryColors.default;
                          return (
                            <Card key={category}>
                              <CardHeader>
                                <CardTitle
                                  className={`capitalize text-base sm:text-xl font-semibold ${colorClass}`}
                                >
                                  {category.replace(/_/g, " ")}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul
                                  className="list-disc list-outside space-y-2 pl-5 text-xs sm:text-sm"
                                  style={{
                                    paddingTop: "0px",
                                  }}
                                >
                                  {(risks as string[])
                                    .slice(0, 3)
                                    .map((risk, i) => (
                                      <li
                                        key={i}
                                        className="text-gray-800"
                                        style={{
                                          marginTop: "-10px",
                                        }}
                                      >
                                        {risk}
                                      </li>
                                    ))}
                                </ul>
                              </CardContent>
                            </Card>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              )}

              {tab === "flexibility" && (
                <div className="p-4 sm:p-6">
                  <h3 className="heading-section text-blue-600 mb-4 sm:mb-6">
                    Business Flexibility & Adaptability
                  </h3>
                  <div className="mb-8 sm:mb-12">
                    <ul className="space-y-6 list-disc list-outside pl-5">
                      <li>
                        <h4 className="heading-subsection text-sm sm:text-base">
                          Flexibility and Adaptability Insights
                        </h4>
                        <p className="text-body text-xs sm:text-sm">
                          {analysis.flexibility?.summary ||
                            "Flexibility analysis not available"}
                        </p>
                      </li>
                    </ul>
                  </div>
                  {analysis.flexibility && (
                    <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-3 justify-items-center">
                      {[
                        {
                          label: "Market Adaptability",
                          metric: analysis.flexibility.market_adaptability,
                        },
                        {
                          label: "Financial Stability",
                          metric: analysis.flexibility.financial_stability,
                        },
                        {
                          label: "Operational Agility",
                          metric: analysis.flexibility.operational_agility,
                        },
                      ].map(({ label, metric }) => {
                        if (!metric) return null;
                        return (
                          <ProgressCircle
                            key={label}
                            label={label}
                            value={metric.score || 0}
                            description={
                              metric.description || "No description available."
                            }
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </section>

        <section>
          <Card className="bg-gradient-to-r from-background to-muted border">
            <CardHeader>
              <CardTitle className="heading-card-title text-foreground pt-4 text-[30px] sm:text-lg">
                Investment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 text-center px-4 sm:px-6">
              <div className="mb-2">
                <p className="summary-score-label mb-2 text-sm sm:text-base">
                  Profitability Score
                </p>
                <p
                  className={`summary-score-value mt-2 sm:mt-4 text-green-600 ${getScoreColor(
                    analysis.ipo_details.profitability_of_allotment.score
                  )} text-base sm:text-lg`}
                >
                  {analysis.ipo_details.profitability_of_allotment.score}/10
                </p>
              </div>
              <div className="mb-2">
                <p className="summary-score-label mb-2 text-sm sm:text-base">
                  Potential Gains
                </p>
                <p
                  className={`summary-score-value mt-2 sm:mt-4 text-green-600 ${getScoreColor(
                    analysis.ipo_details.profitability_of_allotment.score
                  )} text-base sm:text-lg`}
                >
                  {analysis.ipo_details.approximate_gains_potential}%
                </p>
              </div>
              <div className="mb-2">
                <p className="summary-score-label mb-2 text-sm sm:text-base">
                  Assessment
                </p>
                <p
                  className={`summary-assessment-text mt-2 sm:mt-4 ${getScoreColor(
                    analysis.ipo_details.profitability_of_allotment.score
                  )} text-xs sm:text-sm`}
                >
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