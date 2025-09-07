"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Eye,
  FileText,
} from "lucide-react";

import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis";
import { cn } from "@/lib/utils"; // Make sure you have this utility file
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Utility function to format date to "10 August 2025" format
const formatDateToReadable = (dateInput: string | undefined | null): string => {
  if (!dateInput) return "N/A";
  
  try {
    let date: Date;
    
    date = new Date(dateInput);
    
    if (isNaN(date.getTime())) {
      const cleanedInput = dateInput.trim();
      const ddmmyyyyRegex = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
      const ddmmyyyyMatch = cleanedInput.match(ddmmyyyyRegex);
      if (ddmmyyyyMatch) {
        const [, day, month, year] = ddmmyyyyMatch;
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        return dateInput;
      }
    }
    
    if (isNaN(date.getTime())) {
      return dateInput;
    }
    
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    
    return date.toLocaleDateString('en-GB', options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateInput;
  }
};

// Utility function to parse date for calculations (returns Date object or null)
const parseDate = (dateInput: string | undefined | null): Date | null => {
  if (!dateInput) return null;
  
  try {
    let date = new Date(dateInput);
    
    if (isNaN(date.getTime())) {
      const cleanedInput = dateInput.trim();
      const ddmmyyyyRegex = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/;
      const ddmmyyyyMatch = cleanedInput.match(ddmmyyyyRegex);
      
      if (ddmmyyyyMatch) {
        const [, day, month, year] = ddmmyyyyMatch;
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      }
    }
    
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};

export default function AllIPOsPage() {
  const [ipos, setIpos] = useState<IpoComprehensiveAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllIPOs() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/analysis`, {
          method: 'GET'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setIpos(data.ipos_analysis || []);
      } catch (err) {
        console.error("Error fetching IPOs:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAllIPOs();
  }, []);

  // FIXED: Risk color logic now aligns with a 1-10 score.
  // Lower score is better (less risk).
  const getRiskColor = (score: number) => {
    if (score > 7) return "text-red-600 dark:text-red-400"; // High Risk
    if (score > 6) return "text-yellow-600 dark:text-yellow-400"; // Medium Risk
    return "text-green-600 dark:text-green-400"; // Low Risk
  }

  // Updated status badge function using the new date parsing utility
  const getStatusBadge = (ipo: IpoComprehensiveAnalysis) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const openingDate = parseDate(ipo.time?.issue_dates?.opening);
    const closingDate = parseDate(ipo.time?.issue_dates?.closing);

    if (!openingDate || !closingDate) {
      return <Badge variant="secondary">Status Unknown</Badge>;
    }
    
    openingDate.setHours(0, 0, 0, 0);
    closingDate.setHours(0, 0, 0, 0);

    if (today > closingDate) {
      return <Badge variant="secondary">Closed</Badge>;
    }
    if (today >= openingDate && today <= closingDate) {
      if (today.getTime() === closingDate.getTime()) {
        return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20 animate-pulse">Closing Today</Badge>;
      }
      const daysLeft = Math.ceil((closingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
       if (daysLeft === 1) {
         return <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20">Closing Tomorrow</Badge>;
       }
      return <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20">{`Open (Closes in ${daysLeft} days)`}</Badge>;
    }
    if (today < openingDate) {
      const daysToOpen = Math.ceil((openingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysToOpen === 0) {
        return <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/20 animate-pulse">Opening Today</Badge>;
      }
      if (daysToOpen === 1) {
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20">Opening Tomorrow</Badge>;
      }
      return <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20">{`Upcoming in ${daysToOpen} days`}</Badge>;
    }
    
    return <Badge variant="secondary">Status Unknown</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
          <div className="mb-8 sm:mb-12">
            <Skeleton className="h-8 sm:h-10 w-40 sm:w-48 bg-muted/50 mb-2" />
            <Skeleton className="h-5 sm:h-6 w-80 sm:w-96 bg-muted/50" />
          </div>
          <div className="hidden lg:block bg-background/60 backdrop-blur-sm border border-muted/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/20 border-b border-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left"><Skeleton className="h-4 w-20 bg-muted/50" /></th>
                    <th className="px-4 py-3 text-left"><Skeleton className="h-4 w-16 bg-muted/50" /></th>
                    <th className="px-4 py-3 text-center"><Skeleton className="h-4 w-20 bg-muted/50" /></th>
                    <th className="px-4 py-3 text-center"><Skeleton className="h-4 w-20 bg-muted/50" /></th>
                    <th className="px-4 py-3 text-center"><Skeleton className="h-4 w-24 bg-muted/50" /></th>
                    <th className="px-4 py-3 text-center"><Skeleton className="h-4 w-20 bg-muted/50" /></th>
                    <th className="px-4 py-3 text-center"><Skeleton className="h-4 w-16 bg-muted/50" /></th>
                    <th className="px-4 py-3 text-center"><Skeleton className="h-4 w-16 bg-muted/50" /></th>
                  </tr>
                </thead>
                <tbody>
                  {Array(8).fill(0).map((_, index) => (
                    <tr key={index} className="border-b border-muted/20">
                      <td className="px-4 py-4"><div className="flex items-center space-x-3"><Skeleton className="h-10 w-10 rounded-full bg-muted/50" /><Skeleton className="h-5 w-32 bg-muted/50" /></div></td>
                      <td className="px-4 py-4"><Skeleton className="h-4 w-16 bg-muted/50" /></td>
                      <td className="px-4 py-4 text-center"><Skeleton className="h-4 w-20 bg-muted/50 mx-auto" /></td>
                      <td className="px-4 py-4 text-center"><Skeleton className="h-4 w-20 bg-muted/50 mx-auto" /></td>
                      <td className="px-4 py-4 text-center"><Skeleton className="h-4 w-16 bg-muted/50 mx-auto" /></td>
                      <td className="px-4 py-4 text-center"><Skeleton className="h-4 w-16 bg-muted/50 mx-auto" /></td>
                      <td className="px-4 py-4 text-center"><Skeleton className="h-6 w-20 bg-muted/50 mx-auto" /></td>
                      <td className="px-4 py-4 text-center"><Skeleton className="h-8 w-16 bg-muted/50 mx-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="md:hidden space-y-3">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-background/60 backdrop-blur-sm border border-muted/50 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1">
                    <Skeleton className="h-10 w-10 rounded-full bg-muted/50" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1 bg-muted/50" />
                      <Skeleton className="h-3 w-24 bg-muted/50" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 bg-muted/50" />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Skeleton className="h-8 bg-muted/50" />
                  <Skeleton className="h-8 bg-muted/50" />
                  <Skeleton className="h-8 bg-muted/50" />
                  <Skeleton className="h-8 bg-muted/50" />
                </div>
                <div className="pt-3 border-t border-muted/20">
                  <Skeleton className="h-8 w-full bg-muted/50" />
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 text-center">
          <Card className="max-w-2xl mx-auto bg-background/60 backdrop-blur-sm border border-destructive/50">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
                <FileText className="h-5 w-5" />
                Failed to Load Data
              </CardTitle>
              <CardDescription className="text-muted-foreground">{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background mt-20 font-ibm-plex app-container"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(240, 248, 255, 1), rgba(240, 248, 255, 0) 40%),
          radial-gradient(circle at 70% 20%, rgba(173, 216, 230, 0.6), rgba(173, 216, 230, 0) 50%),
          radial-gradient(circle at 30% 80%, rgba(135, 206, 250, 0.5), rgba(135, 206, 250, 0) 50%),
          radial-gradient(circle at 90% 70%, rgba(173, 216, 250, 0.5), rgba(173, 216, 250, 0) 60%)
        `,
        backgroundColor: '#e6f4fe',
      }}>
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 lg:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary truncate">
                All IPO Analysis
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground hidden sm:block">
                Explore comprehensive insights and analysis for all available IPOs
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {ipos.length === 0 ? (
          <Card className="max-w-2xl mx-auto bg-background/60 backdrop-blur-sm border border-muted/50">
            <CardHeader>
              <CardTitle className="text-foreground">No IPOs Available</CardTitle>
              <CardDescription className="text-muted-foreground">
                There are currently no IPOs with analysis available. Check back later for updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="hidden lg:block bg-background/95 backdrop-blur-sm border border-muted/50 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/20 border-b border-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Company</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Issue Size</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Opening Date</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Closing Date</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Price Band</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">GMP Potential</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Risk Score</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Status</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ipos.map((ipo, index) => (
                      <tr
                        key={ipo._id}
                        className={cn(
                          "border-b border-muted/20 hover:bg-muted/10 transition-colors duration-200",
                          index % 2 === 0 ? "bg-background/50" : "bg-background/30"
                        )}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center space-x-3"><Avatar className="h-10 w-10 ring-2 ring-primary/10"><AvatarImage src={ipo.image_url} alt={`${ipo.company_name || 'Company'} logo`} className="object-cover" /><AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10"><Building2 className="h-5 w-5 text-primary" /></AvatarFallback></Avatar><div className="min-w-0"><div className="text-sm font-semibold text-foreground truncate">{ipo.company_name}</div></div></div>
                        </td>
                        <td className="px-4 py-4"><div className="text-sm font-medium text-foreground">{ipo.ipo_details?.issue_size || "N/A"}</div></td>
                        <td className="px-4 py-4 text-center"><div className="text-sm text-foreground">{formatDateToReadable(ipo.time?.issue_dates?.opening)}</div></td>
                        <td className="px-4 py-4 text-center"><div className="text-sm text-foreground">{formatDateToReadable(ipo.time?.issue_dates?.closing)}</div></td>
                        <td className="px-4 py-4 text-center"><div className="text-sm text-foreground">{ipo.ipo_details?.price_band || "N/A"}</div></td>
                        <td className="px-4 py-4 text-center"><div className="text-sm font-bold text-green-600">{ipo.ipo_details?.gains_rationale || "N/A"}</div></td>
                        {/* FIXED: Displaying risk score out of 10 and using corrected color logic */}
                        <td className="px-4 py-4 text-center"><div className={cn("text-sm font-bold", getRiskColor(ipo.summary_metrics?.risk_meter || 0))}>{ipo.summary_metrics?.risk_meter ? `${ipo.summary_metrics.risk_meter}/10` : "N/A"}</div></td>
                        <td className="px-4 py-4 text-center">{getStatusBadge(ipo)}</td>
                        <td className="px-4 py-4 text-center"><Link href={`/analysis/${ipo.slug}`}><Button size="sm" variant="outline" className="border-primary/20 hover:bg-primary/10 text-primary hover:border-primary/40 transition-all duration-200"><Eye className="h-4 w-4 mr-1" />View</Button></Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-3">
              {ipos.map((ipo) => (
                <div key={ipo._id} className="bg-background/95 backdrop-blur-sm border border-muted/50 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0"><Avatar className="h-10 w-10 ring-2 ring-primary/10 flex-shrink-0"><AvatarImage src={ipo.image_url} alt={`${ipo.company_name || 'Company'} logo`} className="object-cover" /><AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10"><Building2 className="h-5 w-5 text-primary" /></AvatarFallback></Avatar><div className="min-w-0 flex-1"><h3 className="text-sm font-semibold text-foreground truncate">{ipo.company_name}</h3><p className="text-xs text-muted-foreground">{ipo.ipo_details?.issue_size || "N/A"}</p></div></div>
                    {getStatusBadge(ipo)}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                    <div><div className="text-muted-foreground mb-1">Opening</div><div className="font-medium text-foreground">{formatDateToReadable(ipo.time?.issue_dates?.opening)}</div></div>
                    <div><div className="text-muted-foreground mb-1">Closing</div><div className="font-medium text-foreground">{formatDateToReadable(ipo.time?.issue_dates?.closing)}</div></div>
                    <div><div className="text-muted-foreground mb-1">Price Band</div><div className="font-medium text-foreground">{ipo.ipo_details?.price_band || "N/A"}</div></div>
                    <div><div className="text-muted-foreground mb-1">GMP Potential</div><div className="font-bold text-green-600">{ipo.ipo_details?.gains_rationale || "N/A"}</div></div>
                  </div>
                  <div className="pt-3 border-t border-muted/20">
                    <Link href={`/analysis/${ipo?.slug}`} className="block">
                      <Button size="sm" variant="outline" className="w-full border-primary/20 hover:bg-primary/10 text-primary hover:border-primary/40 transition-all duration-200">
                        <Eye className="h-4 w-4 mr-2" />View Analysis
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}