"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeftCircle,
  Target,
  Coins,
  LineChart,
  Sparkles,
  Landmark,
  ShieldCheck,
  TrendingUp,
  Gauge,
  CalendarClock,
  PieChart,
} from "lucide-react"
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis"
import { cn } from "@/lib/utils"

export default function AnalysisPage() {
  const { id } = useParams()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<IpoComprehensiveAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`/api/analysis/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setAnalysis(data.ipos_analysis)
      } catch (err) {
        console.error('Error fetching analysis:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchAnalysis()
    }
  }, [id])

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400'
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600 dark:text-red-400'
    if (score >= 6) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-green-600 dark:text-green-400'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 sm:p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full bg-muted/50" />
            <Skeleton className="h-10 w-48 bg-muted/50" />
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg bg-muted/50" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 sm:p-6 text-center">
          <Card className="max-w-2xl mx-auto bg-background/60 backdrop-blur-sm border">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Error
              </CardTitle>
              <CardDescription className="text-muted-foreground">{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary/90 text-foreground"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4 sm:p-6 text-center">
          <Card className="max-w-2xl mx-auto bg-background/60 backdrop-blur-sm border">
            <CardHeader>
              <CardTitle className="text-foreground">Analysis Not Found</CardTitle>
              <CardDescription className="text-muted-foreground">
                The requested analysis could not be found.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push('/admin')}
                className="bg-primary hover:bg-primary/90 text-foreground"
              >
                <ArrowLeftCircle className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
                className="border-primary/20 hover:bg-primary/10 h-10 w-10"
              >
                <ArrowLeftCircle className="h-5 w-5 text-primary" />
              </Button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-primary truncate">
                  {analysis.company_name}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Comprehensive IPO Analysis
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push('/admin')}
              variant="outline"
              className="hidden sm:flex border-primary/20 hover:bg-primary/10"
            >
              <ArrowLeftCircle className="mr-2 h-4 w-4 text-primary" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Key Metrics Overview */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Overall Score",
              value: ((analysis.summary_metrics.fundamentals_score + analysis.summary_metrics.performance_score) / 2).toFixed(1) + "/10",
              icon: Target,
              color: getScoreColor((analysis.summary_metrics.fundamentals_score + analysis.summary_metrics.performance_score) / 2),
            },
            {
              label: "Issue Size",
              value: analysis.ipo_details.issue_size,
              icon: Coins,
              color: "text-foreground",
            },
            {
              label: "Price Band",
              value: analysis.ipo_details.price_band,
              icon: LineChart,
              color: "text-foreground",
            },
            {
              label: "Gains Potential",
              value: `${analysis.ipo_details.approximate_gains_potential}%`,
              icon: Sparkles,
              color: "text-green-600 dark:text-green-400",
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
                  </div>
                  <metric.icon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Analysis Tabs */}
        <Tabs defaultValue="fundamentals" className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-muted/30">
            <TabsTrigger value="fundamentals" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-background">
              Fundamentals
            </TabsTrigger>
            <TabsTrigger value="risk" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-background">
              Risk Meter
            </TabsTrigger>
            <TabsTrigger value="performance" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-background">
              Performance
            </TabsTrigger>
            <TabsTrigger value="flexibility" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-background">
              Flexibility
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-foreground data-[state=active]:bg-primary data-[state=active]:text-background">
              Timeline & Allocation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fundamentals">
            <Card className="bg-background/60 backdrop-blur-sm border">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Landmark className="mr-3 h-6 w-6 text-primary" />
                  Fundamentals
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
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      ₹{(analysis.fundamentals.revenue_details.total_revenue / 10000000).toFixed(1)}Cr
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue CAGR</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                      {analysis.fundamentals.revenue_details.revenue_cagr}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Net Profit</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      ₹{(analysis.fundamentals.profit_analysis.net_profit / 10000000).toFixed(1)}Cr
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profit Margin</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                      {analysis.fundamentals.profit_analysis.profit_margin}%
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Debt to Equity</p>
                  <div className="flex items-center space-x-3">
                    <Progress
                      value={Math.min((analysis.fundamentals.assets_and_liabilities.debt_to_equity_ratio || 0) * 20, 100)}
                      className="flex-1 h-3 bg-muted/50"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {analysis.fundamentals.assets_and_liabilities.debt_to_equity_ratio}x
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk">
            <Card className="bg-background/60 backdrop-blur-sm border">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <ShieldCheck className="mr-3 h-6 w-6 text-primary" />
                  Risk Meter
                  <Badge className={cn("ml-auto text-lg", getRiskColor(analysis.risk_meter.score))}>
                    {analysis.risk_meter.score}/10
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
                      {category.replace('_', ' ')}
                    </h4>
                    <ul className="space-y-1">
                      {risks.slice(0, 3).map((risk, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start">
                          <span className="text-red-600 dark:text-red-400 mr-2">•</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card className="bg-background/60 backdrop-blur-sm border">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <TrendingUp className="mr-3 h-6 w-6 text-primary" />
                  Performance
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
                  <h4 className="font-medium text-foreground mb-2">Management Quality</h4>
                  <div className="flex items-center space-x-3 mb-2">
                    <Progress
                      value={analysis.performance.management_quality.score * 10}
                      className="flex-1 h-3 bg-muted/50"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {analysis.performance.management_quality.score}/10
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {analysis.performance.management_quality.experience}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Key Achievements</h4>
                  <ul className="space-y-2">
                    {analysis.performance.key_achievements.slice(0, 3).map((achievement, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flexibility">
            <Card className="bg-background/60 backdrop-blur-sm border">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Gauge className="mr-3 h-6 w-6 text-primary" />
                  Flexibility
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
                  { label: "Market Adaptability", score: analysis.flexibility.market_adaptability.score },
                  { label: "Financial Stability", score: analysis.flexibility.financial_stability.score },
                  { label: "Operational Agility", score: analysis.flexibility.operational_agility.score },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-medium text-foreground">{item.score}/10</span>
                    </div>
                    <Progress value={item.score || 0 * 10} className="h-3 bg-muted/50" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

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
                        {analysis.time.issue_dates.opening} - {analysis.time.issue_dates.closing}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expected Listing</p>
                      <p className="text-base sm:text-lg font-medium text-foreground">
                        {analysis.time.listing_details.expected_date}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Exchanges</p>
                      <p className="text-base sm:text-lg font-medium text-foreground">
                        {analysis.time.listing_details.exchanges.join(', ')}
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
                  <div className="pt-4 border-t border-t">
                    <p className="text-sm text-muted-foreground">Lot Size</p>
                    <p className="text-xl sm:text-2xl font-bold text-foreground">
                      {analysis.ipo_details.lot_size} shares
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
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
      </div>
    </div>
  )
}
