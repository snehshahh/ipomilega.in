"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  CalendarClock,
  LineChart,
  TrendingUp,
  ArrowRight,
  FileText,
  Clock,
  User,
  ChevronRight,
  Calendar,
  Target,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis";
import { cn } from "@/lib/utils";

export default function AllIPOsPage() {
  const [ipos, setIpos] = useState<IpoComprehensiveAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllIPOs() {
      setIsLoading(true);
      try {
        
        const response = await fetch(`/api/analysis`,
            {
                method: 'GET'
            }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIpos(data.ipos_analysis);
      } catch (err) {
        console.error("Error fetching IPOs:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllIPOs();
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getStatusBadge = (ipo: IpoComprehensiveAnalysis) => {
    const isUpcoming = new Date(ipo.time?.issue_dates?.opening).toISOString() > new Date().toISOString();
    return isUpcoming ? (
      <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20">
        Upcoming
      </Badge>
    ) : (
      <Badge className="bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20">
        Closed
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="mb-12">
            <Skeleton className="h-10 w-48 bg-muted/50 mb-2" />
            <Skeleton className="h-6 w-96 bg-muted/50" />
          </div>
          <div className="space-y-4">
            {Array(8).fill(0).map((_, index) => (
              <div key={index} className="bg-background/60 backdrop-blur-sm border border-muted/50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <Skeleton className="h-12 w-12 rounded-full bg-muted/50" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-48 mb-2 bg-muted/50" />
                      <Skeleton className="h-4 w-64 bg-muted/50" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <Skeleton className="h-4 w-16 mb-1 bg-muted/50" />
                      <Skeleton className="h-5 w-20 bg-muted/50" />
                    </div>
                    <div className="text-center">
                      <Skeleton className="h-4 w-16 mb-1 bg-muted/50" />
                      <Skeleton className="h-5 w-20 bg-muted/50" />
                    </div>
                    <div className="text-center">
                      <Skeleton className="h-4 w-20 mb-1 bg-muted/50" />
                      <Skeleton className="h-5 w-24 bg-muted/50" />
                    </div>
                    <Skeleton className="h-6 w-16 bg-muted/50" />
                    <Skeleton className="h-5 w-5 bg-muted/50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 sm:py-8 text-center">
          <Card className="max-w-2xl mx-auto bg-background/60 backdrop-blur-sm border border-muted/50">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                <FileText className="h-5 w-5" />
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
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                All IPO Analysis
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Explore comprehensive insights and analysis for all available IPOs
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="border-primary/20 hover:bg-primary/10 text-primary"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {ipos.length === 0 ? (
          <Card className="max-w-2xl mx-auto bg-background/60 backdrop-blur-sm border border-muted/50">
            <CardHeader>
              <CardTitle className="text-foreground">No IPOs Available</CardTitle>
              <CardDescription className="text-muted-foreground">
                There are currently no IPOs with analysis available. Check back later for updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                asChild
                className="border-primary/20 hover:bg-primary/10 text-primary"
              >
                <Link href="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {ipos.map((ipo, index) => (
              <Link key={ipo._id} href={`/analysis/${ipo.ipo_table_id}`} className="group block">
                <div className="bg-background/95 backdrop-blur-sm border border-muted/50 rounded-xl p-6 group-hover:shadow-xl group-hover:border-primary/30 transition-all duration-300 hover:scale-[1.01] hover:bg-background/100">
                  <div className="flex items-center justify-between">
                    {/* Left Section - Company Info */}
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                          <Building2 className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse opacity-75"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                          {ipo.company_name}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {ipo.ipo_details?.issue_size} • {ipo.ipo_details?.price_band}
                        </p>
                      </div>
                    </div>

                    {/* Middle Section - Key Metrics */}
                    <div className="hidden md:flex items-center space-x-8">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground mb-1">
                          <Calendar className="h-3 w-3" />
                          <span>Opens</span>
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                          {ipo.time?.issue_dates?.opening || "N/A"}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground mb-1">
                          <Clock className="h-3 w-3" />
                          <span>Closes</span>
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                          {ipo.time?.issue_dates?.closing || "N/A"}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground mb-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>GMP Potential</span>
                        </div>
                        <div className={cn("text-sm font-bold", getScoreColor(ipo.ipo_details?.approximate_gains_potential || 0))}>
                          {ipo.ipo_details?.approximate_gains_potential ? `+${ipo.ipo_details.approximate_gains_potential}%` : "N/A"}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground mb-1">
                          <Target className="h-3 w-3" />
                          <span>Risk Score</span>
                        </div>
                        <div className={cn("text-sm font-bold", getScoreColor(ipo.summary_metrics?.risk_meter || 0))}>
                          {ipo.summary_metrics?.risk_meter ? `${ipo.summary_metrics.risk_meter}/100` : "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Status & Action */}
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(ipo)}
                      
                      <div className="flex items-center text-primary/70 group-hover:text-primary transition-colors duration-200">
                        <span className="hidden sm:inline text-sm font-medium mr-2">View Analysis</span>
                        <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>

                  {/* Mobile View - Additional Info */}
                  <div className="md:hidden mt-4 pt-4 border-t border-muted/20">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground text-xs">Opens: </span>
                        <span className="font-medium text-foreground">
                          {ipo.time?.issue_dates?.opening || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">Closes: </span>
                        <span className="font-medium text-foreground">
                          {ipo.time?.issue_dates?.closing || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">GMP Potential: </span>
                        <span className={cn("font-bold", getScoreColor(ipo.ipo_details?.approximate_gains_potential || 0))}>
                          {ipo.ipo_details?.approximate_gains_potential ? `+${ipo.ipo_details.approximate_gains_potential}%` : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">Risk Score: </span>
                        <span className={cn("font-bold", getScoreColor(ipo.summary_metrics?.risk_meter || 0))}>
                          {ipo.summary_metrics?.risk_meter ? `${ipo.summary_metrics.risk_meter}/100` : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}