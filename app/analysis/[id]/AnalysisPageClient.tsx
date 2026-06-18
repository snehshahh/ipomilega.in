"use client";
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeftCircle, Share2, Loader2, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis";
import { Ipo } from "@/app/models/ipo";
import "@/app/styles/analysis.css";
import { InvestorSplitPieChart } from "@/components/charts/InvestorSplitPieChart"; // Adjust path if needed
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Props for the main component
interface AnalysisPageClientProps {
  analysis: IpoComprehensiveAnalysis;
  ipo: Ipo;
}

interface IPOInvestorSplit {
  application: string;
  lot_size: string;
  shares: string;
  amount: string;
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
  const strokeDashoffset = circumference - (cappedValue / 10) * circumference;

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
  const [editedAnalysis, setEditedAnalysis] = useState<IpoComprehensiveAnalysis>(analysis);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const session = useSession();
  const isAdmin = !session.isPending && ["admin@gmail.com", "snehshah7634@gmail.com", "shahvraj114@gmail.com", "devanshisoni2004@gmail.com", "devanshisoni2311@gmail.com"].includes(
    session?.data?.user?.email || ""
  );

  const updateField = (path: string, value: any) => {
    setEditedAnalysis((prev) => {
      const copy = { ...prev };
      const parts = path.split(".");
      let current: any = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current[parts[i]] = { ...current[parts[i]] };
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      setHasUnsavedChanges(true);
      return copy;
    });
  };

  const updateArrayField = (path: string, newlineString: string) => {
    const arr = newlineString.split("\n").filter((item) => item.trim() !== "");
    updateField(path, arr);
  };

  const handleSave = async (silent = false) => {
    if (isSaving) return;
    setIsSaving(true);

    const fundamentalsScore = Number(editedAnalysis.fundamentals?.score ?? 0);
    const performanceScore = Number(editedAnalysis.performance?.score ?? 0);
    const riskScore = Number(editedAnalysis.risk_meter?.score ?? 0);
    const flexibilityScore = Number(editedAnalysis.flexibility?.score ?? 0);
    const timeScore = Number(editedAnalysis.time?.score ?? 0);
    const gainsPotential = Number(editedAnalysis.ipo_details?.approximate_gains_potential ?? 0);
    const allotmentScore = Number(editedAnalysis.ipo_details?.profitability_of_allotment?.score ?? 0);
    const totalRevenue = Number(editedAnalysis.fundamentals?.revenue_details?.total_revenue ?? 0);
    const netProfit = Number(editedAnalysis.fundamentals?.profit_analysis?.net_profit ?? 0);
    const totalAssets = Number(editedAnalysis.fundamentals?.assets_and_liabilities?.total_assets ?? 0);

    const payload = {
      ipo_table_id: editedAnalysis.ipo_table_id,
      company_name: editedAnalysis.company_name,
      slug: editedAnalysis.slug,
      image_url: editedAnalysis.image_url || ipo.image_url || "",
      investorSplit: editedAnalysis.investorSplit || [],
      financialReport: editedAnalysis.financialReport || [],
      fundamentals: editedAnalysis.fundamentals,
      risk_meter: editedAnalysis.risk_meter,
      flexibility: editedAnalysis.flexibility,
      time: editedAnalysis.time,
      performance: editedAnalysis.performance,
      ipo_details: editedAnalysis.ipo_details,
      summary_metrics: {
        fundamentals_score: fundamentalsScore,
        risk_meter: riskScore,
        flexibility_score: flexibilityScore,
        time_score: timeScore,
        performance_score: performanceScore,
        approximate_gains_potential: gainsPotential,
        profitability_of_allotment: allotmentScore,
        total_revenue: totalRevenue,
        net_profit: netProfit,
        total_assets: totalAssets,
      },
    };

    let toastId = null;
    if (!silent) {
      toastId = toast.loading("Saving changes...");
    }

    try {
      const response = await fetch("/api/analysis/manipulate-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to save analysis");

      if (toastId) {
        toast.success("Analysis saved successfully!", { id: toastId });
      } else {
        toast.success("Analysis auto-saved successfully!");
      }
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Save error:", error);
      const errMsg = error instanceof Error ? error.message : "Error saving updates";
      if (toastId) {
        toast.error(errMsg, { id: toastId });
      } else {
        toast.error(`Auto-save failed: ${errMsg}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlur = () => {
    if (hasUnsavedChanges) {
      handleSave(true);
    }
  };

  const [activeTab, setActiveTab] = useState("performance");
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "performance",
    "fundamentals",
    "risk",
    "flexibility",
    "investor_split",
  ]);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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
    ((editedAnalysis.fundamentals?.score ?? 0) +
      (editedAnalysis.performance?.score ?? 0)) /
    2;

  // Helper function to get the upper price from the price band
  const getDisplayPrice = () => {
    const priceBand = editedAnalysis.ipo_details?.price_band;
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
  const timelineData = {
    opening: editedAnalysis.time?.issue_dates?.opening || "",
    closing: editedAnalysis.time?.issue_dates?.closing || "",
    allotment: editedAnalysis.time?.allotment_timeline?.date || "",
    today: new Date().toISOString().split("T")[0],
    listing: editedAnalysis.time?.listing_details?.expected_date || "",
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

    if (totalDuration > 0) {
      isTimelineValid = true;

      const calculatePosition = (dateString: string): number => {
        const date = parseDate(dateString);
        if (!date) return 0;
        const position = ((date.getTime() - openingTime) / totalDuration) * 100;
        return Math.max(0, Math.min(100, position));
      };

      positions = {
        opening: 0,
        closing: calculatePosition(timelineData.closing),
        allotment: calculatePosition(timelineData.allotment),
        today: calculatePosition(timelineData.today),
        listing: 100,
      };

      const openingColor = "#00914D";
      const subscriptionColor = "#B4292E";
      const processingColor = "#E4CA28";
      const listingColor = "#0073E6";

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
  const priceBoxPosition = `${(positions.opening + positions.closing) / 2}%`;

  // Helper to parse percentages
  const parsePercentage = (value: string): number => {
    if (!value) return 0;
    const match = value.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Data for investor allocation split
  const investorData = [
    {
      label: "Retail Investor",
      value: editedAnalysis.ipo_details?.allocation_details?.retail || parsePercentage(ipo.ipo_details?.retail_quota || "35"),
    },
    {
      label: "NII",
      value: editedAnalysis.ipo_details?.allocation_details?.nii || parsePercentage(ipo.ipo_details?.nii_quota || "15"),
    },
    {
      label: "QIB",
      value: editedAnalysis.ipo_details?.allocation_details?.qib || parsePercentage(ipo.ipo_details?.qib_quota || "50"),
    },
    {
      label: "Total",
      value: 100,
    },
  ];

  // Prepare data for the pie chart
  const pieChartData = investorData
    .filter((d) => d.label !== "Total")
    .map((item) => ({
      name: item.label,
      value: item.value,
    }));

  // Prepare data for the table, pulling from the analysis object
  const investorTableData = editedAnalysis.investorSplit?.filter(
    (row) => row.application.toLowerCase() !== "application"
  ) || [];

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${editedAnalysis.company_name} IPO Analysis`,
          text: `Check out this comprehensive IPO analysis of ${editedAnalysis.company_name
            }. Score: ${overallScore.toFixed(1)}/10`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
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
    <div 
      className="min-h-screen font-ibm-plex pt-[89px]"
      onDoubleClick={(e) => {
        if (!isAdmin) return;
        const target = e.target as HTMLElement;
        if (
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "BUTTON" ||
          target.tagName === "SELECT" ||
          target.isContentEditable ||
          target.closest("button") ||
          target.closest("a")
        ) {
          return;
        }
        
        setIsEditing((prev) => {
          const next = !prev;
          if (next) {
            toast.success("Edit Mode Activated!", {
              description: "You can now edit details inline. Double-click empty space to toggle.",
            });
          } else {
            toast.info("Edit Mode Deactivated.", {
              description: "Review details. Unsaved changes are draft until saved.",
            });
          }
          return next;
        });
      }}
    >
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
                      alt={`${editedAnalysis.company_name} logo`}
                    />
                  ) : (
                    <AvatarFallback className="text-white bg-black border-black border-2 text-xs font-medium">
                      {getInitials(editedAnalysis.company_name || "")}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="heading-main text-lg md:text-xl lg:text-2xl text-primary truncate">
                  {editedAnalysis.company_name} IPO Analysis
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

      {/* Section 1: Key Metrics & Timeline */}
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
                  isScore: true,
                },
                {
                  label: "Issue Size",
                  value: editedAnalysis.ipo_details?.issue_size || "N/A",
                  color: "text-foreground",
                  description: "Total offering amount",
                  path: "ipo_details.issue_size",
                },
                {
                  label: "Price Band",
                  value: editedAnalysis.ipo_details?.price_band.includes("₹") ? editedAnalysis.ipo_details?.price_band : "₹" + editedAnalysis.ipo_details?.price_band || "N/A",
                  color: "text-foreground",
                  description: "Price per share",
                  path: "ipo_details.price_band",
                },
                {
                  label: "Potential Gains",
                  value: `${editedAnalysis.ipo_details?.gains_rationale.includes("₹") ? editedAnalysis.ipo_details?.gains_rationale : "₹" + editedAnalysis.ipo_details?.gains_rationale}`,
                  color: "text-green-600 dark:text-green-400",
                  description: "Expected listing gains",
                  path: "ipo_details.gains_rationale",
                  isGains: true,
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="bg-white/70 backdrop-blur-sm border p-4 sm:p-6 text-center rounded-lg flex flex-col justify-center min-h-[120px]"
                >
                  <p className="metric-card-label mb-2 text-base font-ibm-plex">
                    {metric.label}
                  </p>
                  {isAdmin && isEditing && !metric.isScore ? (
                    metric.isGains ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={editedAnalysis.ipo_details?.gains_rationale || ""}
                          onChange={(e) => updateField("ipo_details.gains_rationale", e.target.value)}
                          onBlur={handleBlur}
                          placeholder="Gains rationale (e.g. ₹20-30)"
                          className="w-full text-center border-b border-dashed border-gray-300 focus:border-blue-500 outline-none bg-transparent font-ibm-plex text-xl font-bold py-1 text-green-600"
                        />
                        <div className="flex items-center gap-1 justify-center text-xs">
                          <span className="text-gray-500 font-semibold">Gains %:</span>
                          <input
                            type="number"
                            value={editedAnalysis.ipo_details?.approximate_gains_potential ?? 0}
                            onChange={(e) => updateField("ipo_details.approximate_gains_potential", parseFloat(e.target.value) || 0)}
                            onBlur={handleBlur}
                            className="w-12 text-center border-b border-dashed border-gray-300 focus:border-blue-500 outline-none bg-transparent font-ibm-plex text-xs font-bold text-green-600"
                          />
                          <span className="text-green-600 font-bold">%</span>
                        </div>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={metric.path ? (metric.path.split('.').reduce((obj: any, key) => obj?.[key], editedAnalysis) || "") : ""}
                        onChange={(e) => metric.path && updateField(metric.path, e.target.value)}
                        onBlur={handleBlur}
                        className="w-full text-center border-b border-dashed border-gray-300 focus:border-blue-500 outline-none bg-transparent font-ibm-plex text-xl font-bold py-1"
                      />
                    )
                  ) : (
                    <p
                      className={`metric-card-value ${metric.color} text-xl font-ibm-plex`}
                    >
                      {metric.value}
                    </p>
                  )}
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
              {isAdmin && isEditing && (
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl mb-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-600">Opening Date</label>
                    <input
                      type="date"
                      value={timelineData.opening ? timelineData.opening.split('T')[0] : ""}
                      onChange={(e) => updateField("time.issue_dates.opening", e.target.value)}
                      onBlur={handleBlur}
                      className="bg-white border rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-600">Closing Date</label>
                    <input
                      type="date"
                      value={timelineData.closing ? timelineData.closing.split('T')[0] : ""}
                      onChange={(e) => updateField("time.issue_dates.closing", e.target.value)}
                      onBlur={handleBlur}
                      className="bg-white border rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-600">Allotment Date</label>
                    <input
                      type="date"
                      value={timelineData.allotment ? timelineData.allotment.split('T')[0] : ""}
                      onChange={(e) => updateField("time.allotment_timeline.date", e.target.value)}
                      onBlur={handleBlur}
                      className="bg-white border rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-600">Listing Date</label>
                    <input
                      type="date"
                      value={timelineData.listing ? timelineData.listing.split('T')[0] : ""}
                      onChange={(e) => updateField("time.listing_details.expected_date", e.target.value)}
                      onBlur={handleBlur}
                      className="bg-white border rounded px-2 py-1 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-600">Timing Score (1-10)</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={editedAnalysis.time?.score ?? 5}
                      onChange={(e) => updateField("time.score", parseInt(e.target.value) || 0)}
                      onBlur={handleBlur}
                      className="bg-white border rounded px-2 py-1 text-sm outline-none focus:border-blue-500 font-bold"
                    />
                  </div>
                </div>
              )}
              {isTimelineValid ? (
                <div className="relative h-24 sm:h-12">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-full h-3 rounded-full"
                    style={gradientStyle}
                  />
                  <div
                    className="absolute top-1/2 h-8 w-1 bg-gray-800 rounded-full -translate-y-1/2 -translate-x-1/2"
                    style={{ left: `${positions.today}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold whitespace-nowrap">
                      Today
                    </div>
                  </div>
                  {showPriceBox && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#B4292E] text-white font-semibold text-sm px-3 py-1 rounded-md shadow-lg z-10 font-ibm-plex"
                      style={{ left: priceBoxPosition }}
                    >
                      {displayPrice}
                    </div>
                  )}
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
          </section>
        </div>
      </section>
      <section className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="backdrop-blur-sm border shadow-lg">
            <CardHeader>
              <CardTitle className="heading-card-title text-foreground pt-4 text-2xl sm:text-lg font-ibm-plex">
                Financial Performance Trend
              </CardTitle>
              <i className="text-muted-foreground text-sm">(Amount ₹ in Crores)</i>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={editedAnalysis.financialReport?.map(report => ({
                      year: `FY ${report.period_ended}`,
                      Revenue: parseFloat(report.revenue || "0"),
                      Expense: parseFloat(report.expense || "0"),
                      "Profit After Tax": parseFloat(report.profit_after_tax || "0")
                    })) || []}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" className="font-ibm-plex text-sm" />
                    <YAxis
                      className="font-ibm-plex text-sm"
                      label={{ value: "Amount (CR)", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip contentStyle={{ backgroundColor: "white", borderRadius: "8px" }} />
                    <Legend wrapperStyle={{ fontFamily: "IBM Plex Sans, sans-serif" }} />

                    <Bar
                      dataKey="Revenue"
                      fill="#0073E6"
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={true}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    />
                    <Bar
                      dataKey="Expense"
                      fill="#B4292E"
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={true}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                    <Bar
                      dataKey="Profit After Tax"
                      fill="#00914D"
                      radius={[4, 4, 0, 0]}
                      isAnimationActive={true}
                      animationDuration={1400}
                      animationEasing="ease-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 3: Investment Summary */}
      <section className="main-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-white/80 backdrop-blur-sm border shadow-lg">
            <CardHeader>
              <CardTitle className="heading-card-title text-foreground pt-4 text-2xl sm:text-lg font-ibm-plex">
                Investment Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 grid-cols-2 sm:grid-cols-2 text-center px-6">
              <div>
                <p className="summary-score-label mb-2 text-base font-ibm-plex">
                  Profitability Score
                </p>
                {isAdmin && isEditing ? (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={editedAnalysis.ipo_details?.profitability_of_allotment?.score ?? 0}
                      onChange={(e) => updateField("ipo_details.profitability_of_allotment.score", parseInt(e.target.value) || 0)}
                      onBlur={handleBlur}
                      className="w-16 text-center border rounded p-1 font-bold text-lg bg-white"
                    />
                    <span className="text-lg font-bold">/10</span>
                  </div>
                ) : (
                  <p
                    className={`summary-score-value mt-4 text-lg font-ibm-plex ${getScoreColor(
                      editedAnalysis.ipo_details.profitability_of_allotment.score
                    )}`}
                  >
                    {editedAnalysis.ipo_details.profitability_of_allotment.score}/10
                  </p>
                )}
              </div>
              <div>
                <p className="summary-score-label mb-2 text-base font-ibm-plex">
                  Assessment
                </p>
                {isAdmin && isEditing ? (
                  <textarea
                    value={editedAnalysis.ipo_details?.profitability_of_allotment?.assessment ?? ""}
                    onChange={(e) => updateField("ipo_details.profitability_of_allotment.assessment", e.target.value)}
                    onBlur={handleBlur}
                    rows={2}
                    className="w-full border rounded p-2 text-sm text-gray-800 bg-white"
                    placeholder="Allotment assessment recommendation..."
                  />
                ) : (
                  <p
                    className={`summary-assessment-text mt-4 text-sm font-ibm-plex ${getScoreColor(
                      editedAnalysis.ipo_details.profitability_of_allotment.score
                    )}`}
                  >
                    {editedAnalysis.ipo_details.profitability_of_allotment.assessment}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 2: Analysis Sections */}
      <section className="main-background">
        <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sticky Navigation */}
          <div className="sticky  top-[89px] z-40 py-6">
            <div
              className="grid w-full grid-cols-2 sm:grid-cols-5 gap-1 p-1 bg-[#E6F4FE] backdrop-blur-sm rounded-full border border-gray-200"
            >
              {[
                "performance",
                "fundamentals",
                "risk",
                "flexibility",
                "investor_split",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`sticky-tab-button text-sm py-2 px-2 sm:px-3 transition-colors capitalize font-medium font-ibm-plex ${activeTab === tab
                    ? "bg-[#99CCFF] text-[#0073E6] shadow-md"
                    : "hover:bg-[#99CCFF]/50 text-[#0073E6]"
                    }`}
                >
                  {tab.replace("_", " ")}
                </button>
              ))}
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
                  {tab === "performance" && editedAnalysis.performance && (
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="heading-section text-blue-600">
                          Performance
                        </h3>
                        {isAdmin && isEditing && (
                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 animate-in fade-in duration-200">
                            <span className="text-sm font-bold text-blue-700">Section Score:</span>
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={editedAnalysis.performance?.score ?? 0}
                              onChange={(e) => updateField("performance.score", parseInt(e.target.value) || 0)}
                              onBlur={handleBlur}
                              className="w-12 text-center font-bold border rounded p-0.5 text-sm bg-white"
                            />
                            <span className="text-sm font-bold text-blue-700">/10</span>
                          </div>
                        )}
                      </div>
                      <ul className="space-y-6 list-disc list-outside pl-5">
                        <li>
                          <h4 className="heading-subsection">
                            Company Performance
                          </h4>
                          {isAdmin && isEditing ? (
                            <textarea
                              value={editedAnalysis.performance.summary}
                              onChange={(e) => updateField("performance.summary", e.target.value)}
                              onBlur={handleBlur}
                              className="w-full p-2 border rounded-md text-sm min-h-[100px] bg-white"
                            />
                          ) : (
                            <p className="text-body">
                              {editedAnalysis.performance.summary}
                            </p>
                          )}
                        </li>
                        {editedAnalysis.performance.management_quality && (
                          <li>
                            <h4 className="heading-subsection">
                              Management Quality
                            </h4>
                            {isAdmin && isEditing ? (
                              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full mt-2">
                                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg border min-w-[120px]">
                                  <label className="text-xs font-bold text-gray-600 mb-1">Mgmt Score</label>
                                  <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={editedAnalysis.performance.management_quality.score ?? 0}
                                    onChange={(e) => updateField("performance.management_quality.score", parseInt(e.target.value) || 0)}
                                    onBlur={handleBlur}
                                    className="w-16 text-center font-bold border rounded p-1 text-base bg-white"
                                  />
                                  <span className="text-xs text-gray-400 mt-1">out of 10</span>
                                </div>
                                <div className="flex-1 space-y-3">
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-600">Experience</label>
                                    <textarea
                                      value={editedAnalysis.performance.management_quality.experience || ""}
                                      onChange={(e) => updateField("performance.management_quality.experience", e.target.value)}
                                      onBlur={handleBlur}
                                      className="w-full p-2 border rounded text-sm min-h-[60px] bg-white"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-gray-600">Track Record</label>
                                    <textarea
                                      value={editedAnalysis.performance.management_quality.track_record || ""}
                                      onChange={(e) => updateField("performance.management_quality.track_record", e.target.value)}
                                      onBlur={handleBlur}
                                      className="w-full p-2 border rounded text-sm min-h-[60px] bg-white"
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                                <div className="flex-shrink-0">
                                  <ProgressCircle
                                    label="Mgmt Score"
                                    value={
                                      editedAnalysis.performance.management_quality.score
                                    }
                                  />
                                </div>
                                <div className="flex-1 space-y-2 text-body-sm">
                                  <p>
                                    <strong>Experience:</strong>{" "}
                                    {
                                      editedAnalysis.performance.management_quality
                                        .experience
                                    }
                                  </p>
                                  <p>
                                    <strong>Track Record:</strong>{" "}
                                    {
                                      editedAnalysis.performance.management_quality
                                        .track_record
                                    }
                                  </p>
                                </div>
                              </div>
                            )}
                          </li>
                        )}
                        {editedAnalysis.performance.key_achievements && (
                          <li>
                            <h4 className="heading-subsection">
                              Key Achievements
                            </h4>
                            {isAdmin && isEditing ? (
                              <div className="flex flex-col gap-1 mt-2">
                                <label className="text-xs font-bold text-gray-600">Key Achievements (One per line)</label>
                                <textarea
                                  value={editedAnalysis.performance.key_achievements.join("\n")}
                                  onChange={(e) => updateArrayField("performance.key_achievements", e.target.value)}
                                  onBlur={handleBlur}
                                  className="w-full p-2 border rounded text-sm min-h-[100px] bg-white"
                                  placeholder="Achievement 1&#10;Achievement 2"
                                />
                              </div>
                            ) : (
                              <div className="space-y-2 text-body-sm">
                                {editedAnalysis.performance.key_achievements
                                  .slice(0, 3)
                                  .map((achievement, index) => (
                                    <p key={index}>{achievement}</p>
                                  ))}
                              </div>
                            )}
                          </li>
                        )}
                        {editedAnalysis.performance.market_comparison && (
                          <li>
                            <h4 className="heading-subsection">
                              Market Comparison
                            </h4>
                            {isAdmin && isEditing ? (
                              <textarea
                                value={editedAnalysis.performance.market_comparison}
                                onChange={(e) => updateField("performance.market_comparison", e.target.value)}
                                onBlur={handleBlur}
                                className="w-full p-2 border rounded text-sm min-h-[80px] mt-2 bg-white"
                              />
                            ) : (
                              <p className="text-body">
                                {editedAnalysis.performance.market_comparison}
                              </p>
                            )}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {tab === "fundamentals" && editedAnalysis.fundamentals && (
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="heading-section text-blue-600">
                          Fundamentals
                        </h3>
                        {isAdmin && isEditing && (
                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 animate-in fade-in duration-200">
                            <span className="text-sm font-bold text-blue-700">Section Score:</span>
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={editedAnalysis.fundamentals?.score ?? 0}
                              onChange={(e) => updateField("fundamentals.score", parseInt(e.target.value) || 0)}
                              onBlur={handleBlur}
                              className="w-12 text-center font-bold border rounded p-0.5 text-sm bg-white"
                            />
                            <span className="text-sm font-bold text-blue-700">/10</span>
                          </div>
                        )}
                      </div>
                      <ul className="space-y-6 list-disc list-outside pl-5">
                        <li>
                          <h4 className="heading-subsection">
                            Financial Fundamentals
                          </h4>
                          {isAdmin && isEditing ? (
                            <textarea
                              value={editedAnalysis.fundamentals.summary}
                              onChange={(e) => updateField("fundamentals.summary", e.target.value)}
                              onBlur={handleBlur}
                              className="w-full p-2 border rounded-md text-sm min-h-[120px] bg-white"
                            />
                          ) : (
                            <p className="text-body mb-6">
                              {editedAnalysis.fundamentals.summary}
                            </p>
                          )}
                        </li>
                      </ul>
                    </div>
                  )}

                  {tab === "risk" && editedAnalysis.risk_meter && (
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="heading-section text-blue-600">
                          Risk Assessment
                        </h3>
                        {isAdmin && isEditing && (
                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 animate-in fade-in duration-200">
                            <span className="text-sm font-bold text-blue-700">Section Score:</span>
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={editedAnalysis.risk_meter?.score ?? 0}
                              onChange={(e) => updateField("risk_meter.score", parseInt(e.target.value) || 0)}
                              onBlur={handleBlur}
                              className="w-12 text-center font-bold border rounded p-0.5 text-sm bg-white"
                            />
                            <span className="text-sm font-bold text-blue-700">/10</span>
                          </div>
                        )}
                      </div>
                      {isAdmin && isEditing ? (
                        <textarea
                          value={editedAnalysis.risk_meter.summary}
                          onChange={(e) => updateField("risk_meter.summary", e.target.value)}
                          onBlur={handleBlur}
                          className="w-full p-2 border rounded-md text-sm min-h-[100px] mb-6 bg-white"
                        />
                      ) : (
                        <p className="text-body mb-8">
                          {editedAnalysis.risk_meter.summary}
                        </p>
                      )}
                      {editedAnalysis.risk_meter.risk_categories && (
                        isAdmin && isEditing ? (
                          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                            {Object.entries(editedAnalysis.risk_meter.risk_categories).map(
                              ([category, risks]) => (
                                <Card key={category}>
                                  <CardHeader>
                                    <CardTitle
                                      className={`capitalize text-xl font-semibold font-ibm-plex ${riskCategoryColors[category] || riskCategoryColors.default
                                        }`}
                                    >
                                      {category.replace(/_/g, " ")}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <textarea
                                      value={(risks as string[]).join("\n")}
                                      onChange={(e) => {
                                        const arr = e.target.value.split("\n").filter((item) => item.trim() !== "");
                                        updateField(`risk_meter.risk_categories.${category}`, arr);
                                      }}
                                      onBlur={handleBlur}
                                      className="w-full p-2 border rounded text-sm min-h-[120px] bg-white"
                                      placeholder={`One risk per line...`}
                                    />
                                  </CardContent>
                                </Card>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                            {Object.entries(editedAnalysis.risk_meter.risk_categories).map(
                              ([category, risks]) => (
                                <Card key={category}>
                                  <CardHeader>
                                    <CardTitle
                                      className={`capitalize text-xl font-semibold font-ibm-plex ${riskCategoryColors[category] || riskCategoryColors.default
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
                        )
                      )}
                    </div>
                  )}

                  {tab === "flexibility" && editedAnalysis.flexibility && (
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="heading-section text-blue-600">
                          Business Flexibility & Adaptability
                        </h3>
                        {isAdmin && isEditing && (
                          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 animate-in fade-in duration-200">
                            <span className="text-sm font-bold text-blue-700">Section Score:</span>
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={editedAnalysis.flexibility?.score ?? 0}
                              onChange={(e) => updateField("flexibility.score", parseInt(e.target.value) || 0)}
                              onBlur={handleBlur}
                              className="w-12 text-center font-bold border rounded p-0.5 text-sm bg-white"
                            />
                            <span className="text-sm font-bold text-blue-700">/10</span>
                          </div>
                        )}
                      </div>
                      <div className="mb-12">
                        <ul className="space-y-6 list-disc list-outside pl-5">
                          <li>
                            <h4 className="heading-subsection">
                              Flexibility and Adaptability Insights
                            </h4>
                            {isAdmin && isEditing ? (
                              <textarea
                                value={editedAnalysis.flexibility.summary}
                                onChange={(e) => updateField("flexibility.summary", e.target.value)}
                                onBlur={handleBlur}
                                className="w-full p-2 border rounded-md text-sm min-h-[100px] bg-white"
                              />
                            ) : (
                              <p className="text-body">
                                {editedAnalysis.flexibility.summary}
                              </p>
                            )}
                          </li>
                        </ul>
                      </div>
                      {isAdmin && isEditing ? (
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 mt-6">
                          {[
                            {
                              label: "Market Adaptability",
                              metric: editedAnalysis.flexibility.market_adaptability,
                              path: "flexibility.market_adaptability"
                            },
                            {
                              label: "Financial Stability",
                              metric: editedAnalysis.flexibility.financial_stability,
                              path: "flexibility.financial_stability"
                            },
                            {
                              label: "Operational Agility",
                              metric: editedAnalysis.flexibility.operational_agility,
                              path: "flexibility.operational_agility"
                            },
                          ].map(({ label, metric, path }) => {
                            if (!metric) return null;
                            return (
                              <div key={label} className="bg-white p-4 rounded-xl border flex flex-col gap-3 shadow-sm">
                                <div className="flex items-center justify-between border-b pb-2">
                                  <span className="font-bold text-sm text-gray-800">{label}</span>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      min={1}
                                      max={10}
                                      value={metric.score ?? 0}
                                      onChange={(e) => updateField(`${path}.score`, parseInt(e.target.value) || 0)}
                                      onBlur={handleBlur}
                                      className="w-12 text-center border rounded font-bold text-sm bg-white"
                                    />
                                    <span className="text-xs text-gray-500">/10</span>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label className="text-xs font-semibold text-gray-500">Description</label>
                                  <textarea
                                    value={metric.description ?? ""}
                                    onChange={(e) => updateField(`${path}.description`, e.target.value)}
                                    onBlur={handleBlur}
                                    className="w-full p-2 border rounded text-xs min-h-[60px] bg-white"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="grid gap-8 grid-cols-1 sm:grid-cols-3 justify-items-center">
                          {[
                            {
                              label: "Market Adaptability",
                              metric: editedAnalysis.flexibility.market_adaptability,
                            },
                            {
                              label: "Financial Stability",
                              metric: editedAnalysis.flexibility.financial_stability,
                            },
                            {
                              label: "Operational Agility",
                              metric: editedAnalysis.flexibility.operational_agility,
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
                      )}
                    </div>
                  )}

                  {tab === "investor_split" && (
                    <div className="p-4 sm:p-6">
                      <h3 className="heading-section text-blue-600 mb-6">
                        Investor Split & Application Details
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="w-full h-full">
                          <h4 className="heading-subsection text-center mb-4">
                            Allocation Quota
                          </h4>
                          <InvestorSplitPieChart data={pieChartData} />
                        </div>

                        <div className="w-full">
                          <h4 className="heading-subsection text-center mb-4">
                            Application Size
                          </h4>
                          {investorTableData.length > 0 ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Application</TableHead>
                                  <TableHead>Lot Size</TableHead>
                                  <TableHead>Amount</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {investorTableData.map((row: IPOInvestorSplit, index: number) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">{row.application || "-"}</TableCell>
                                    <TableCell>{row.lot_size || "-"}</TableCell>
                                    <TableCell>{row.amount || "-"}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <p className="text-center text-muted-foreground mt-8">
                              Application details are not available.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </section>
          </div>
        </div>
      </section>

      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-white/95 backdrop-blur-md border border-blue-200 p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-500">Administrative Actions</span>
            <span className="text-sm font-semibold text-gray-800">
              {isEditing ? "✏️ Edit Mode" : "👁️ View Mode"} {hasUnsavedChanges && "(Draft)"}
            </span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5">Double-click empty space to toggle</span>
          </div>
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              if (!isEditing) {
                toast.success("Edit Mode Activated!", {
                  description: "You can now edit details inline.",
                });
              } else {
                toast.info("Edit Mode Deactivated.");
              }
            }}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition-all ${
              isEditing 
                ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100" 
                : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            }`}
          >
            {isEditing ? "View Mode" : "Edit Mode"}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${hasUnsavedChanges
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}