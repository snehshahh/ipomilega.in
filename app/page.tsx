"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  BarChart3,
  Target,
  Users,
  Calendar,
  DollarSign,
  ArrowRight,
  Star,
  CheckCircle,
  Bell,
  Building2,
  PieChart,
  Shield,
  Clock,
  TrendingDown,
  Award,
  Eye,
  FileText,
  Lightbulb,
  Activity,
  Moon,
  Sun,
  User,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IpoComprehensiveAnalysis } from "./models/ipo_comprehensive_analysis";
import { Ipo } from "./models/ipo";

const marketStats = [
  { label: "Total IPOs This Year", value: "127", change: "+23%", description: "More companies going public", icon: Building2 },
  { label: "Market Cap Raised", value: "₹89,450 Cr", change: "+18%", description: "Record fundraising year", icon: DollarSign },
  { label: "Average Success Rate", value: "74%", change: "+5%", description: "Strong listing performance", icon: TrendingUp },
  { label: "Active Listings", value: "45", change: "+12%", description: "Currently open for subscription", icon: Activity },
];

const features = [
  {
    icon: BarChart3,
    title: "Comprehensive Analysis",
    description: "In-depth financial analysis with detailed metrics, ratio analysis, and growth forecasts for informed investment decisions",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Real-time market trends, sector-wise performance tracking, and comparative analysis with peer companies",
  },
  {
    icon: Target,
    title: "Investment Guidance",
    description: "Expert recommendations, risk assessment, and portfolio allocation suggestions based on your investment profile",
  },
  {
    icon: Bell,
    title: "Real-time Alerts",
    description: "Get instant notifications about new IPO launches, subscription status, GMP updates, and listing dates",
  },
];

const successStories = [
  {
    company: "TechGiant IPO 2023",
    returns: "+185%",
    timeframe: "12 months",
    sector: "Technology",
  },
  {
    company: "PharmaCorp IPO 2023",
    returns: "+92%",
    timeframe: "8 months",
    sector: "Pharmaceuticals",
  },
  {
    company: "FinTech Solutions 2023",
    returns: "+156%",
    timeframe: "10 months",
    sector: "Financial Technology",
  },
];

interface BlogPost {
  ipo_id: string;
  slug: string;
  title: string;
  content: string;
  category?: string;
  created_at: string;
  author: string;
}

export default function Home() {
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogPost[]>([]);
  const [upcomingIPOs, setUpcomingIPOs] = useState<Ipo[]>([]);
  const [latestAnalysis, setLatestAnalysis] = useState<IpoComprehensiveAnalysis[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingIPOs, setLoadingIPOs] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);

  useEffect(() => {
    async function fetchFeaturedBlogs() {
      setLoadingBlogs(true);
      try {
        const response = await fetch("/api/blogs/featured");
        const data = await response.json();
        setFeaturedBlogs(data.blogList);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoadingBlogs(false);
      }
    }
    fetchFeaturedBlogs();
  }, []);

  useEffect(() => {
    async function fetchLatestAnalysis() {
      setLoadingAnalysis(true);
      try {
        const response = await fetch("/api/analysis/latest-analysis");
        const data = await response.json();
        setLatestAnalysis(data.analysis);
      } catch (error) {
        console.error("Error fetching analysis:", error);
      } finally {
        setLoadingAnalysis(false);
      }
    }
    fetchLatestAnalysis();
  }, []);

  useEffect(() => {
    async function fetchUpcomingIPOs() {
      setLoadingIPOs(true);
      try {
        const response = await fetch("/api/ipo/upcoming");
        const data = await response.json();
        setUpcomingIPOs(data.ipos);
      } catch (error) {
        console.error("Error fetching IPOs:", error);
      } finally {
        setLoadingIPOs(false);
      }
    }
    fetchUpcomingIPOs();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                IPO Analysis & Investment Platform
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8">
                Your comprehensive platform for IPO insights, detailed analysis, and expert investment guidance.
                Make informed decisions with our data-driven approach to IPO investing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" asChild className="group">
                  <Link href="/ipos">
                    Explore IPOs
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">IPOs Analyzed</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">85%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm text-muted-foreground">Investors Guided</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl font-bold">₹200Cr+</div>
                  <div className="text-sm text-muted-foreground">Investments Tracked</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Market Stats */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Live Market Overview</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Real-time insights into the Indian IPO market performance and trends
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {marketStats.map((stat, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      <Badge variant="secondary" className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                      <div className="text-sm font-medium">{stat.label}</div>
                      <div className="text-xs text-muted-foreground">{stat.description}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Our IPO Analysis Platform</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Get comprehensive IPO analysis with expert insights, real-time market data, and personalized investment recommendations
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/60 backdrop-blur-sm">
                  <CardContent className="pt-6 text-center">
                    <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming IPOs */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2">Upcoming IPOs to Watch</h2>
                <p className="text-muted-foreground">Stay ahead with detailed analysis of upcoming public offerings</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/ipos">View All IPOs</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {loadingIPOs ? (
                Array(3).fill(0).map((_, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-6 w-32" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-5 w-24" />
                          </div>
                          <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-5 w-24" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-5 w-24" />
                          </div>
                          <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-5 w-24" />
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                upcomingIPOs.map((ipo, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-3">
                          <Building2 className="h-8 w-8 text-primary group-hover:text-primary-dark transition-colors" />
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {ipo.upcoming_ipo_2025}
                          </CardTitle>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {ipo.ipo_details.ipo_listing}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Issue Size</span>
                            <div className="font-medium">{ipo.ipo_details.issue_size}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Price Band</span>
                            <div className="font-medium">{ipo.ipo_details.ipo_price_band}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Opens</span>
                            <div className="font-medium">{ipo.ipo_dates.ipo_open_date}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Closes</span>
                            <div className="font-medium">{ipo.ipo_dates.ipo_close_date}</div>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Expected Listing</div>
                          <div className="text-sm font-medium">{ipo.ipo_dates.ipo_listing_date}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">IPO Success Stories</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Track record of successful IPO recommendations and their performance
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {successStories.map((story, index) => (
                <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <Award className="h-12 w-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{story.returns}</div>
                    <div className="text-lg font-medium mb-2">{story.company}</div>
                    <div className="text-sm text-muted-foreground mb-2">{story.timeframe}</div>
                    <Badge variant="outline" className="text-xs">
                      {story.sector}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Blogs Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured IPO Blogs</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Discover expert insights, market trends, and investment strategies from our top IPO blog posts
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {loadingBlogs ? (
                Array(3).fill(0).map((_, index) => (
                  <Card key={index} className="h-full bg-background/95 backdrop-blur-sm border border-muted/50 rounded-xl group-hover:shadow-xl group-hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-center mb-3">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-7 w-3/4" />
                      <Skeleton className="h-12 w-full mt-2" />
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                featuredBlogs.map((post) => (
                  <Link key={post.ipo_id} href={`/blogs/${post.slug}`} className="group block">
                    <Card className="h-full bg-background/95 backdrop-blur-sm border border-muted/50 rounded-xl group-hover:shadow-xl group-hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-center mb-3">
                          <Badge
                            variant="outline"
                            className="text-xs font-medium px-3_latex_ py-1 border-primary/50 text-primary group-hover:bg-primary/10 transition-colors"
                          >
                            {post.category || "IPO Insights"}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-primary/70 group-hover:text-primary transition-colors" />
                            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <CardTitle className="text-xl sm:text-2xl font-bold leading-tight group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/60 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground/80 line-clamp-3 mt-2">
                          {post.content.trim().split(" ").slice(0, 20).join(" ")}...
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center font-medium text-sm text-primary/80 group-hover:text-primary transition-colors">
                            Read Full Blog
                            <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                          </div>
                          <FileText className="h-5 w-5 text-primary/70 group-hover:text-primary group-hover:scale-110 transition-all duration-200" />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground/90">
                          <User className="h-4 w-4 text-primary/60" />
                          <span className="italic font-medium">By {post.author}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              )}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link href="/blogs">View All Blogs</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Latest Analysis */}
        {loadingAnalysis && latestAnalysis.length === 0 ? (
          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Latest IPO Analysis & Insights</h2>
                  <p className="text-muted-foreground max-w-2xl">Expert insights and detailed analysis on recent and upcoming IPOs with comprehensive research</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/analysis">View All Analysis</Link>
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, index) => (
                  <Card key={index} className="h-full bg-background/95 backdrop-blur-sm border border-muted/50 rounded-xl group-hover:shadow-xl group-hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-6 w-32" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-5 w-24" />
                          </div>
                          <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-5 w-24" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-5 w-24" />
                          </div>
                          <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-5 w-24" />
                          </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-5 w-24" />
                          </div>
                          <div>
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-5 w-24" />
                          </div>
                        </div>
                        <Skeleton className="h-10 w-full mt-4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ) : latestAnalysis.length > 0 ? (
          <section className="py-16 px-4 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Latest IPO Analysis & Insights</h2>
                  <p className="text-muted-foreground max-w-2xl">Expert insights and detailed analysis on recent and upcoming IPOs with comprehensive research</p>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/analysis">View All Analysis</Link>
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {latestAnalysis.map((ipo) => (
                  <Link key={ipo._id} href={`/analysis/${ipo.ipo_table_id}`} className="group block">
                    <Card className="h-full bg-background/95 backdrop-blur-sm border border-muted/50 rounded-xl group-hover:shadow-xl group-hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <BarChart3 className="h-8 w-8 text-primary group-hover:text-primary-dark transition-colors" />
                            <CardTitle className="text-lg sm:text-xl font-bold group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/60 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                              {ipo.company_name}
                            </CardTitle>
                          </div>
                        </div>
                        <CardDescription className="text-sm text-muted-foreground/80 line-clamp-2">
                          {ipo.ipo_details?.issue_size} • {ipo.ipo_details?.price_band}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Opens</span>
                              <div className="font-medium">{ipo.time?.issue_dates?.opening || "N/A"}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Closes</span>
                              <div className="font-medium">{ipo.time?.issue_dates?.closing || "N/A"}</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">GMP Potential</span>
                              <div className="font-medium text-green-600 dark:text-green-400">
                                {ipo.ipo_details?.approximate_gains_potential ? `+${ipo.ipo_details.approximate_gains_potential}%` : "N/A"}
                              </div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Risk Score</span>
                              <div className="font-medium text-red-600 dark:text-red-400">
                                {ipo.summary_metrics?.risk_meter ? `${ipo.summary_metrics.risk_meter}/100` : "N/A"}
                              </div>
                            </div>
                          </div>
                          <Separator />
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Fundamentals</span>
                              <div className="font-medium">{ipo.summary_metrics?.fundamentals_score ? `${ipo.summary_metrics.fundamentals_score}/100` : "N/A"}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Market Position</span>
                              <div className="font-medium">{ipo.fundamentals?.market_position || "N/A"}</div>
                            </div>
                          </div>
                        </div>
                        <Button className="w-full mt-4 group-hover:scale-105 transition-transform">
                          Read Full Analysis
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Newsletter Section */}
        <section className="py-16 px-4 bg-foreground text-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Ahead of the IPO Market</h2>
            <p className="text-background/80 mb-8 max-w-3xl mx-auto">
              Get exclusive IPO insights, comprehensive market analysis, GMP updates, and investment opportunities
              delivered to your inbox weekly. Join 50,000+ smart investors.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-background text-foreground"
                />
                <Button variant="secondary">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-background/60 mt-3">
                Free newsletter • No spam • Unsubscribe anytime • Trusted by 50,000+ investors
              </p>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-12 px-4 border-t">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="font-medium">SEBI Compliant Analysis</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="font-medium">50,000+ Investors Trust Us</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">Expert Research Team</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium">Data Security Certified</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 bg-muted/30 border-t">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Building2 className="h-6 w-6" />
              <span className="font-bold text-xl">IPO Dekho</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 IPO Dekho. All rights reserved. Building smarter investment decisions.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}