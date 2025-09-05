"use client";
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeftCircle, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis";
import { Ipo } from "@/app/models/ipo";
import "@/app/styles/analysis.css";

// Props for the main component
interface AnalysisPageClientProps {
  analysis: IpoComprehensiveAnalysis;
  ipo: Ipo;
}

// Helper component for timeline markers
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
  let alignmentClass = "items-center text-center -translate-x-1/2";
  if (alignment === "left") alignmentClass = "items-start text-left";
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
      <p className="text-lg font-medium -translate-y-8 font-ibm-plex">
        {label}
      </p>
      <p className="text-lg font-semibold translate-y-8 font-ibm-plex">
        {formattedDate}
      </p>
    </div>
  );
};

// Helper component for circular progress indicators
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
      <h4 className="progress-circle-label mb-2 sm:mb-4 text-base font-semibold font-ibm-plex">
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
          <text
            x="18"
            y="21"
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
        <p className="text-sm mt-2 sm:mt-4 max-w-[290px] sm:max-w-[200px] font-ibm-plex text-body-sm">
          {description}
        </p>
      )}
    </div>
  );
};

// Helper function to get initials from a company name
const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((word: string) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Main component for the analysis page
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

  // Return early if no data is available
  if (!analysis || !ipo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground font-ibm-plex">
          No analysis data available.
        </p>
      </div>
    );
  }

  // Helper function to determine score color
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

  const overallScore =
    ((analysis.summary_metrics?.fundamentals_score ?? 0) +
      (analysis.summary_metrics?.performance_score ?? 0)) /
    2;

  // Helper function to get the upper price from the price band
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
  
  // --- DYNAMIC Timeline Calculation ---
  // This new block calculates positions based on actual dates, making it fully dynamic.

  const timelineData = {
    opening: analysis.time?.issue_dates?.opening || "",
    closing: analysis.time?.issue_dates?.closing || "",
    allotment: analysis.time?.allotment_timeline?.date || "",
    today: new Date().toISOString().split("T")[0],
    listing: analysis.time?.listing_details?.expected_date || "",
  };

  // Helper to safely parse dates and check validity
  const parseDate = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const openingDate = parseDate(timelineData.opening);
  const listingDate = parseDate(timelineData.listing);

  let isTimelineValid = false;
  let positions = {
    opening: 0,
    closing: 0,
    allotment: 0,
    today: 0,
    listing: 100,
  };
  let gradientStyle = {};

  if (openingDate && listingDate) {
    const openingTime = openingDate.getTime();
    const listingTime = listingDate.getTime();
    const totalDuration = listingTime - openingTime;

    // Ensure we don't divide by zero if dates are the same
    if (totalDuration > 0) {
      isTimelineValid = true;

      // Helper function to calculate a date's percentage position on the timeline
      const calculatePosition = (dateString: string): number => {
        const date = parseDate(dateString);
        if (!date) return 0;
        const position = ((date.getTime() - openingTime) / totalDuration) * 100;
        // Clamp the position between 0% and 100%
        return Math.max(0, Math.min(100, position));
      };

      positions = {
        opening: 0,
        closing: calculatePosition(timelineData.closing),
        allotment: calculatePosition(timelineData.allotment),
        today: calculatePosition(timelineData.today),
        listing: 100,
      };

      // Define colors for different phases
      const openingColor = "#00914D"; // Green
      const subscriptionColor = "#B4292E"; // Red
      const processingColor = "#E4CA28"; // Yellow
      const listingColor = "#0073E6"; // Blue

      // Create a dynamic linear-gradient based on the date positions
      gradientStyle = {
        background: `linear-gradient(to right,
          ${openingColor} ${positions.opening}%,
          ${subscriptionColor} ${positions.closing}%,
          ${processingColor} ${positions.allotment}%,
          ${listingColor} ${positions.listing}%
        )`,
      };
    }
  }

  const displayPrice = getDisplayPrice();
  const showPriceBox = displayPrice !== "N/A";
  // Position the price box dynamically between opening and closing
  const priceBoxPosition = `${(positions.opening + positions.closing) / 2}%`;

  // Helper to parse percentages, used in the investor data fallback
  const parsePercentage = (value: string): number => {
    if (!value) return 0;
    const match = value.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };
  
  // Data for investor allocation split
  const investorData = [
    {
      label: "Retail Investor",
      value: analysis.ipo_details?.allocation_details?.retail || parsePercentage(ipo.ipo_details?.retail_quota || "35"),
    },
    {
      label: "NII",
      value: analysis.ipo_details?.allocation_details?.nii || parsePercentage(ipo.ipo_details?.nii_quota || "15"),
    },
    {
      label: "QIB",
      value: analysis.ipo_details?.allocation_details?.qib || parsePercentage(ipo.ipo_details?.qib_quota || "50"),
    },
    {
      label: "Total",
      value: 100, // Total is always 100%
    },
  ];

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${analysis.company_name} IPO Analysis`,
          text: `Check out this comprehensive IPO analysis of ${
            analysis.company_name
          }. Score: ${overallScore.toFixed(1)}/10`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      // Use a more modern notification system in a real app
      alert("Link copied to clipboard");
    }
  };

  // Handle tab clicks for smooth scrolling
  const handleTabClick = (value: string) => {
    setActiveTab(value);
    setSectionOrder((prev) => [value, ...prev.filter((tab) => tab !== value)]);
    setTimeout(() => {
      const section = sectionRefs.current[value];
      if (section)
        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return (
    <div className="min-h-screen font-ibm-plex pt-[89px]">
      {/* Header */}
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
                  {ipo.image_url?.trim() ? (
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
                <h1 className="heading-main text-lg md:text-xl lg:text-2xl text-primary truncate">
                  {analysis.company_name} IPO Analysis
                </h1>
                <p className="text-sm text-muted-foreground font-ibm-plex">
                  Comprehensive Investment Review
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleShare}
                className="border border-primary/20 hover:bg-primary/10 px-3 py-2 rounded-md text-sm flex items-center justify-center w-full sm:w-auto font-ibm-plex"
                aria-label="Share analysis"
              >
                <Share2 className="h-4 w-4 mr-2 text-primary" />
                Share
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Section 1: Key Metrics & Timeline - Blue Mesh Background */}
      <section className="main-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* Key Metrics */}
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
                  <p className="metric-card-label mb-2 text-base font-ibm-plex">
                    {metric.label}
                  </p>
                  <p
                    className={`metric-card-value ${metric.color} text-xl font-ibm-plex`}
                  >
                    {metric.value}
                  </p>
                  <p className="metric-card-description mt-1 text-sm font-ibm-plex">
                    {metric.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline & Investor Split */}
          <section className="p-4 sm:p-6">
            <h2 className="heading-section text-gray-800 mb-12 text-center sm:text-left">
              Timeline & Split
            </h2>
            <div className="w-full mb-16">
              {isTimelineValid ? (
                <div className="relative h-24 sm:h-12">
                  {/* Dynamic Timeline Bar */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-full h-3 rounded-full"
                    style={gradientStyle}
                  />

                  {/* Today's Date Marker */}
                  <div
                    className="absolute top-1/2 h-8 w-1 bg-gray-800 rounded-full -translate-y-1/2 -translate-x-1/2"
                    style={{ left: `${positions.today}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold whitespace-nowrap">
                      Today
                    </div>
                  </div>

                  {/* Price Box */}
                  {showPriceBox && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#B4292E] text-white font-semibold text-sm px-3 py-1 rounded-md shadow-lg z-10 font-ibm-plex"
                      style={{ left: priceBoxPosition }}
                    >
                      {displayPrice}
                    </div>
                  )}

                  {/* Event Markers */}
                  <div className="absolute inset-0">
                    <TimelineMarker
                      label="Opening"
                      date={timelineData.opening}
                      position={`${positions.opening}%`}
                      alignment="left"
                    />
                    <TimelineMarker
                      label="Closing"
                      date={timelineData.closing}
                      position={`${positions.closing}%`}
                      alignment="center"
                    />
                    <TimelineMarker
                      label="Allotment"
                      date={timelineData.allotment}
                      position={`${positions.allotment}%`}
                      alignment="center"
                    />
                    <TimelineMarker
                      label="Listing"
                      date={timelineData.listing}
                      position={`${positions.listing}%`}
                      alignment="right"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground font-ibm-plex py-8">
                  IPO timeline will be displayed once opening and listing dates are available.
                </div>
              )}
            </div>
            <hr className="my-8 border-t border-gray-200" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-4 justify-items-center">
              {investorData.map((item, i) => (
                <ProgressCircle key={i} label={item.label} value={item.value} />
              ))}
            </div>
          </section>
        </div>
      </section>

      {/* Section 3: Investment Summary - Gradient Background */}
      <section className="main-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-white/80 backdrop-blur-sm border shadow-lg">
            <CardHeader>
              <CardTitle className="heading-card-title text-foreground pt-4 text-2xl sm:text-lg font-ibm-plex">
                Investment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-3 text-center px-6">
              <div className="mb-2">
                <p className="summary-score-label mb-2 text-base font-ibm-plex">
                  Profitability Score
                </p>
                <p
                  className={`summary-score-value mt-4 text-lg font-ibm-plex ${getScoreColor(
                    analysis.ipo_details.profitability_of_allotment.score
                  )}`}
                >
                  {analysis.ipo_details.profitability_of_allotment.score}/10
                </p>
              </div>
              <div className="mb-2">
                <p className="summary-score-label mb-2 text-base font-ibm-plex">
                  Potential Gains
                </p>
                <p
                  className={`summary-score-value mt-4 text-lg font-ibm-plex ${getScoreColor(
                    analysis.ipo_details.profitability_of_allotment.score
                  )}`}
                >
                  {analysis.ipo_details.gains_rationale.includes("%") ? analysis.ipo_details.gains_rationale : `${analysis.ipo_details.gains_rationale}%`}
                </p>
              </div>
              <div className="mb-2">
                <p className="summary-score-label mb-2 text-base font-ibm-plex">
                  Assessment
                </p>
                <p
                  className={`summary-assessment-text mt-4 text-sm font-ibm-plex ${getScoreColor(
                    analysis.ipo_details.profitability_of_allotment.score
                  )}`}
                >
                  {analysis.ipo_details.profitability_of_allotment.assessment}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 2: Analysis Sections - White Background */}
      <section className="main-background">
        <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sticky Navigation */}
          <div className="sticky  top-[89px] z-40 py-6">
            <div
              className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 p-1 bg-[#E6F4FE] backdrop-blur-sm rounded-full border border-gray-200"
            >
              {["performance", "fundamentals", "risk", "flexibility"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`sticky-tab-button text-sm py-2 px-2 sm:px-3 transition-colors capitalize font-medium font-ibm-plex ${
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

          {/* Analysis Content */}
          <div className="pb-8">
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
                  className="scroll-mt-[300px] sm:scroll-mt-[150px] mb-8"
                >
                  {tab === "performance" && analysis.performance && (
                    <div className="p-4 sm:p-6">
                      <h3 className="heading-section text-blue-600 mb-6">
                        Performance
                      </h3>
                      <ul className="space-y-6 list-disc list-outside pl-5">
                        <li>
                          <h4 className="heading-subsection">
                            Company Performance
                          </h4>
                          <p className="text-body">
                            {analysis.performance.summary}
                          </p>
                        </li>
                        {analysis.performance.management_quality && (
                          <li>
                            <h4 className="heading-subsection">
                              Management Quality
                            </h4>
                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                              <div className="flex-shrink-0">
                                <ProgressCircle
                                  label="Mgmt Score"
                                  value={
                                    analysis.performance.management_quality.score
                                  }
                                />
                              </div>
                              <div className="flex-1 space-y-2 text-body-sm">
                                <p>
                                  <strong>Experience:</strong>{" "}
                                  {
                                    analysis.performance.management_quality
                                      .experience
                                  }
                                </p>
                                <p>
                                  <strong>Track Record:</strong>{" "}
                                  {
                                    analysis.performance.management_quality
                                      .track_record
                                  }
                                </p>
                              </div>
                            </div>
                          </li>
                        )}
                        {analysis.performance.key_achievements && (
                          <li>
                            <h4 className="heading-subsection">
                              Key Achievements
                            </h4>
                            <div className="space-y-2 text-body-sm">
                              {analysis.performance.key_achievements
                                .slice(0, 3)
                                .map((achievement, index) => (
                                  <p key={index}>{achievement}</p>
                                ))}
                            </div>
                          </li>
                        )}
                        {analysis.performance.market_comparison && (
                          <li>
                            <h4 className="heading-subsection">
                              Market Comparison
                            </h4>
                            <p className="text-body">
                              {analysis.performance.market_comparison}
                            </p>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {tab === "fundamentals" && analysis.fundamentals && (
                    <div className="p-4 sm:p-6">
                      <h3 className="heading-section text-blue-600 mb-6">
                        Fundamentals
                      </h3>
                      <ul className="space-y-6 list-disc list-outside pl-5">
                        <li>
                          <h4 className="heading-subsection">
                            Financial Fundamentals
                          </h4>
                          <p className="text-body mb-6">
                            {analysis.fundamentals.summary}
                          </p>
                          <div className="w-full sm:w-[70%] grid gap-4 grid-cols-1 sm:grid-cols-2 mx-auto">
                            {analysis.fundamentals.revenue_details?.total_revenue && (
                              <div className="bg-[#ffffff] rounded-[8px] shadow-[0px_0px_6px_#0000000c] p-4 sm:p-6 flex flex-col items-center w-full">
                                <p className="text-base font-medium font-ibm-plex text-[#4f4c4c]">
                                  Total Revenue
                                </p>
                                <span className="text-xl font-semibold font-ibm-plex mt-3 text-[#212121]">
                                  INR{" "}
                                  {(
                                    analysis.fundamentals.revenue_details.total_revenue / 10000000
                                  ).toFixed(0)}{" "}
                                  CR
                                </span>
                                <span className="text-sm font-medium font-ibm-plex text-[#4f4c4c] mt-1">
                                  Latest FY
                                </span>
                              </div>
                            )}
                            {analysis.fundamentals.profit_analysis?.net_profit && (
                              <div className="bg-[#ffffff] rounded-[8px] shadow-[0px_0px_6px_#0000000c] p-4 sm:p-6 flex flex-col items-center w-full">
                                <p className="text-base font-medium font-ibm-plex text-[#4f4c4c]">
                                  Net Profit
                                </p>
                                <span className="text-xl font-semibold font-ibm-plex mt-3 text-[#212121]">
                                  INR{" "}
                                  {(
                                    analysis.fundamentals.profit_analysis.net_profit / 10000000
                                  ).toFixed(0)}{" "}
                                  CR
                                </span>
                                <span className="text-sm font-medium font-ibm-plex text-[#4f4c4c] mt-1">
                                  Latest FY
                                </span>
                              </div>
                            )}
                            {analysis.fundamentals.revenue_details?.revenue_cagr && (
                              <div className="bg-[#ffffff] rounded-[8px] shadow-[0px_0px_6px_#0000000c] p-4 sm:p-6 flex flex-col items-center w-full">
                                <p className="text-base font-medium font-ibm-plex text-[#4f4c4c]">
                                  Revenue Growth
                                </p>
                                <span className="text-xl font-semibold font-ibm-plex mt-3 text-[#00914d]">
                                  {analysis.fundamentals.revenue_details.revenue_cagr}%
                                </span>
                                <span className="text-sm font-medium font-ibm-plex text-[#4f4c4c] mt-1">
                                  Current Growth
                                </span>
                              </div>
                            )}
                            {analysis.fundamentals.profit_analysis?.profit_margin && (
                              <div className="bg-[#ffffff] rounded-[8px] shadow-[0px_0px_6px_#0000000c] p-4 sm:p-6 flex flex-col items-center w-full">
                                <p className="text-base font-medium font-ibm-plex text-[#4f4c4c]">
                                  Profit Margin
                                </p>
                                <span className="text-xl font-semibold font-ibm-plex mt-3 text-[#00914d]">
                                  {analysis.fundamentals.profit_analysis.profit_margin}%
                                </span>
                                <span className="text-sm font-medium font-ibm-plex text-[#4f4c4c] mt-1">
                                  Current Margin
                                </span>
                              </div>
                            )}
                          </div>
                        </li>
                      </ul>
                    </div>
                  )}

                  {tab === "risk" && analysis.risk_meter && (
                    <div className="p-4 sm:p-6">
                      <h3 className="heading-section text-blue-600 mb-4">
                        Risk Assessment
                      </h3>
                      <p className="text-body mb-8">
                        {analysis.risk_meter.summary}
                      </p>
                      {analysis.risk_meter.risk_categories && (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                          {Object.entries(analysis.risk_meter.risk_categories).map(
                            ([category, risks]) => (
                              <Card key={category}>
                                <CardHeader>
                                  <CardTitle
                                    className={`capitalize text-xl font-semibold font-ibm-plex ${
                                      riskCategoryColors[category] || riskCategoryColors.default
                                    }`}
                                  >
                                    {category.replace(/_/g, " ")}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="list-disc list-outside space-y-2 pl-5 text-body-sm">
                                    {(risks as string[])
                                      .slice(0, 3)
                                      .map((risk, i) => (
                                        <li key={i} className="text-gray-800">
                                          {risk}
                                        </li>
                                      ))}
                                  </ul>
                                </CardContent>
                              </Card>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {tab === "flexibility" && analysis.flexibility && (
                    <div className="p-4 sm:p-6">
                      <h3 className="heading-section text-blue-600 mb-6">
                        Business Flexibility & Adaptability
                      </h3>
                      <div className="mb-12">
                        <ul className="space-y-6 list-disc list-outside pl-5">
                          <li>
                            <h4 className="heading-subsection">
                              Flexibility and Adaptability Insights
                            </h4>
                            <p className="text-body">
                              {analysis.flexibility.summary}
                            </p>
                          </li>
                        </ul>
                      </div>
                      <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 justify-items-center">
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
                              description={metric.description || ""}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}