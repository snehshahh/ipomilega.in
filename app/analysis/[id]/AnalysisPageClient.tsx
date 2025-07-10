"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeftCircle,
  Target,
  Coins,
  LineChart,
  Sparkles,
  Landmark,
  Building2,
  ShieldCheck,
  TrendingUp,
  Gauge,
  CalendarClock,
  PieChart,
  Share2,
} from "lucide-react";
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis";
import { cn } from "@/lib/utils";
import { useProgressRouter } from "@/components/Progressbar/useProgressRouter";

interface AnalysisPageClientProps {
  analysis: IpoComprehensiveAnalysis;
  logo: string | null;
}

export default function AnalysisPageClient({ analysis, logo }: AnalysisPageClientProps) {
  const router = useProgressRouter();

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return "text-red-600 dark:text-red-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  const overallScore = (analysis.summary_metrics.fundamentals_score + analysis.summary_metrics.performance_score) / 2;

  const formatDate = (date: string | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${analysis.company_name} IPO Analysis`,
          text: `Check out this comprehensive IPO analysis of ${analysis.company_name}. Score: ${overallScore.toFixed(1)}/10`,
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                className="border-primary/20 hover:bg-primary/10 h-10 w-10"
                aria-label="Go back"
              >
                <ArrowLeftCircle className="h-5 w-5 text-primary" />
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={logo || undefined} alt={analysis.company_name} />
                  <AvatarFallback>
                    <Building2 className="h-8 w-8 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-primary truncate">
                    {analysis.company_name} IPO Analysis
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Comprehensive Investment Review & Rating
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="border-primary/20 hover:bg-primary/10"
                aria-label="Share analysis"
              >
                <Share2 className="h-4 w-4 mr-2 text-primary" />
                Share
              </Button>
              <Button
                onClick={() => router.push("/admin")}
                variant="outline"
                className="border-primary/20 hover:bg-primary/10"
              >
                <ArrowLeftCircle className="mr-2 h-4 w-4 text-primary" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Key Metrics Overview */}
        <section aria-labelledby="key-metrics-heading">
          <h2 id="key-metrics-heading" className="sr-only">Key Investment Metrics</h2>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Overall Investment Score",
                value: overallScore.toFixed(1) + "/10",
                icon: Target,
                color: getScoreColor(overallScore),
                description: "Combined fundamentals and performance rating",
              },
              {
                label: "Issue Size",
                value: analysis.ipo_details.issue_size,
                icon: Coins,
                color: "text-foreground",
                description: "Total IPO offering amount",
              },
              {
                label: "Price Band",
                value: analysis.ipo_details.price_band,
                icon: LineChart,
                color: "text-foreground",
                description: "IPO price range per share",
              },
              {
                label: "Potential Gains",
                value: `~${analysis.ipo_details.approximate_gains_potential}%`,
                icon: Sparkles,
                color: "text-green-600 dark:text-green-400",
                description: "Expected listing gains percentage",
              },
            ].map((metric, index) => (
              <Card
                key={index}
                className="bg-background/60 backdrop-blur-sm border hover:bg-muted/50 transition-colors"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className={cn("text-2xl sm:text-3xl font-bold", metric.color)}>
                        {metric.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1" title={metric.description}>
                        {metric.description}
                      </p>
                    </div>
                    <metric.icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" aria-hidden="true" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Analysis Tabs */}
        <section aria-labelledby="analysis-sections-heading">
          <h2 id="analysis-sections-heading" className="sr-only">Detailed Analysis Sections</h2>
          <Tabs defaultValue="timeline" className="space-y-6">
            <TabsList className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-muted/30">
              <TabsTrigger value="timeline" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-background">
                Timeline
              </TabsTrigger>
              <TabsTrigger value="risk" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-background">
                Risk Assessment
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-background">
                Performance
              </TabsTrigger>
              <TabsTrigger value="flexibility" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-background">
                Flexibility
              </TabsTrigger>
              <TabsTrigger value="fundamentals" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-background">
                Fundamentals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="bg-background/60 backdrop-blur-sm border">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <CalendarClock className="mr-3 h-6 w-6 text-primary" />
                      Timeline
                      <Badge className={cn("ml-auto text-lg", getScoreColor(analysis.time.score))}>
                        {analysis.time.score}/10
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {analysis.time.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Issue Dates</p>
                        <p className="text-base sm:text-lg font-medium text-foreground">
                          {formatDate(analysis.time.issue_dates.opening)} - {formatDate(analysis.time.issue_dates.closing)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Expected Listing</p>
                        <p className="text-base sm:text-lg font-medium text-foreground">
                          {formatDate(analysis.time.listing_details.expected_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Exchanges</p>
                        <p className="text-base sm:text-lg font-medium text-foreground">
                          {analysis.time.listing_details.exchanges.join(", ")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background/60 backdrop-blur-sm border">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <PieChart className="mr-3 h-6 w-6 text-primary" />
                      IPO Allocation
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Share allocation breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { label: "Retail Investors", value: analysis.ipo_details.allocation_details.retail },
                      { label: "QIB", value: analysis.ipo_details.allocation_details.qib },
                      { label: "NII", value: analysis.ipo_details.allocation_details.nii },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <span className="text-sm font-medium text-foreground">{item.value}%</span>
                        </div>
                        <Progress value={item.value} className="h-3 bg-muted/50" />
                      </div>
                    ))}
                    <div className="pt-4 border-t border-primary/20">
                      <p className="text-sm text-muted-foreground">Lot Size</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">
                        {analysis.ipo_details.lot_size} shares
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="risk">
              <Card className="bg-background/60 backdrop-blur-sm border">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <ShieldCheck className="mr-3 h-6 w-6 text-primary" />
                    Risk Assessment & Analysis
                    <Badge className={cn("ml-auto text-lg", getRiskColor(analysis.risk_meter.score))}>
                      {analysis.risk_meter.score}/10 Risk
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {analysis.risk_meter.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(analysis.risk_meter.risk_categories).map(([category, risks]) => (
                    <div key={category} className="border border-primary/20 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium text-foreground capitalize mb-2">
                        {category.replace("_", " ")}
                      </h4>
                      <ul className="space-y-1">
                        {(risks as string[]).slice(0, 3).map((risk, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start">
                            <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {analysis.risk_meter.risk_mitigation && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Risk Mitigation Strategies</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        {analysis.risk_meter.risk_mitigation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card className="bg-background/60 backdrop-blur-sm border">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <TrendingUp className="mr-3 h-6 w-6 text-primary" />
                    Company Performance Analysis
                    <Badge className={cn("ml-auto text-lg", getScoreColor(analysis.performance.score))}>
                      {analysis.performance.score}/10
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {analysis.performance.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Management Quality Assessment</h4>
                    <div className="flex items-center space-x-3 mb-2">
                      <Progress
                        value={analysis.performance.management_quality.score * 10}
                        className="flex-1 h-3 bg-muted/50"
                      />
                      <span className="text-sm font-medium text-foreground">
                        {analysis.performance.management_quality.score}/10
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Experience:</strong> {analysis.performance.management_quality.experience}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Track Record:</strong> {analysis.performance.management_quality.track_record}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Key Business Achievements</h4>
                    <ul className="space-y-2">
                      {analysis.performance.key_achievements.slice(0, 5).map((achievement, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {analysis.performance.market_comparison && (
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Market Comparison</h4>
                      <p className="text-sm text-muted-foreground">{analysis.performance.market_comparison}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="flexibility">
              <Card className="bg-background/60 backdrop-blur-sm border">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Gauge className="mr-3 h-6 w-6 text-primary" />
                    Business Flexibility & Adaptability
                    <Badge className={cn("ml-auto text-lg", getScoreColor(analysis.flexibility.score))}>
                      {analysis.flexibility.score}/10
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {analysis.flexibility.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      label: "Market Adaptability",
                      score: analysis.flexibility.market_adaptability.score,
                      description: analysis.flexibility.market_adaptability.description,
                    },
                    {
                      label: "Financial Stability",
                      score: analysis.flexibility.financial_stability.score || 0,
                      description: analysis.flexibility.financial_stability.description || "Not available",
                    },
                    {
                      label: "Operational Agility",
                      score: analysis.flexibility.operational_agility.score,
                      description: analysis.flexibility.operational_agility.description,
                    },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                        <span className="text-sm font-medium text-foreground">{item.score}/10</span>
                      </div>
                      <Progress value={item.score * 10} className="h-3 bg-muted/50" />
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  ))}

                  {analysis.flexibility.product_diversification && (
                    <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Product Diversification Strategy</h4>
                      <p className="text-sm text-muted-foreground">{analysis.flexibility.product_diversification}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fundamentals">
              <Card className="bg-background/60 backdrop-blur-sm border">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Landmark className="mr-3 h-6 w-6 text-primary" />
                    Financial Fundamentals Analysis
                    <Badge className={cn("ml-auto text-lg", getScoreColor(analysis.fundamentals.score))}>
                      {analysis.fundamentals.score}/10
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {analysis.fundamentals.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {analysis.fundamentals.revenue_details.total_revenue !== 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground">Total Revenue (Latest FY)</p>
                        <p className="text-xl sm:text-2xl font-bold text-foreground">
                          ₹{(analysis.fundamentals.revenue_details.total_revenue / 10000000).toFixed(1)} Cr
                        </p>
                        <p className="text-xs text-muted-foreground">
                          CAGR: {analysis.fundamentals.revenue_details.revenue_cagr !== 0 && `${analysis.fundamentals.revenue_details.revenue_cagr}%`}
                        </p>
                      </div>
                    )}
                    {analysis.fundamentals.revenue_details.revenue_cagr !== 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue Growth (CAGR)</p>
                        <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                          {analysis.fundamentals.revenue_details.revenue_cagr}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {analysis.fundamentals.revenue_details.revenue_trend}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Net Profit (Latest FY)</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">
                        ₹{(analysis.fundamentals.profit_analysis.net_profit / 10000000).toFixed(1)} Cr
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {analysis.fundamentals.profit_analysis.profit_trend}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Profit Margin</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                        {analysis.fundamentals.profit_analysis.profit_margin}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Industry comparison metric
                      </p>
                    </div>
                  </div>

                  {analysis.fundamentals.assets_and_liabilities.debt_to_equity_ratio && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Debt to Equity Ratio</p>
                      <div className="flex items-center space-x-3">
                        <Progress
                          value={Math.min((analysis.fundamentals.assets_and_liabilities.debt_to_equity_ratio || 0) * 20, 100)}
                          className="flex-1 h-3 bg-muted/50"
                        />
                        <span className="text-sm font-medium text-foreground">
                          {analysis.fundamentals.assets_and_liabilities.debt_to_equity_ratio}x
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Lower ratios indicate better financial health
                      </p>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Business Model & Market Position</h4>
                    <p className="text-sm text-muted-foreground mb-2">{analysis.fundamentals.business_model}</p>
                    <p className="text-sm text-muted-foreground">{analysis.fundamentals.market_position}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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
                <p className={cn("text-3xl sm:text-4xl font-bold", getScoreColor(analysis.ipo_details.profitability_of_allotment.score))}>
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