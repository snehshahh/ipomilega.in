"use client"

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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
  Sun
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// Mock data with more detailed information
const blogPosts = [
  {
    id: 1,
    title: "Comprehensive Analysis of XYZ Corp IPO Launch",
    excerpt: "Deep dive into the financials, market positioning, and growth prospects of XYZ Corp as they prepare for their public debut with strong fundamentals.",
    category: "IPO Analysis",
    date: "Nov 15, 2024",
    readTime: "8 min read",
    author: "Investment Team",
    ipoDetails: {
      companyName: "XYZ Corp",
      issueSize: "₹2,500 Cr",
      sector: "Technology",
      gmp: "+12%"
    }
  },
  {
    id: 2,
    title: "Tech Sector IPO Trends: What Investors Need to Know",
    excerpt: "Analysis of recent tech IPO performances and key factors driving valuations in the current market environment with expert insights.",
    category: "Market Trends",
    date: "Nov 12, 2024",
    readTime: "6 min read",
    author: "Market Research",
    ipoDetails: {
      companyName: "Multiple",
      issueSize: "₹15,000+ Cr",
      sector: "Technology",
      gmp: "+8%"
    }
  },
  {
    id: 3,
    title: "Manufacturing IPO Boom: Infrastructure Growth Story",
    excerpt: "How infrastructure development is driving manufacturing IPOs with strong order books and government policy support creating opportunities.",
    category: "Sector Analysis",
    date: "Nov 10, 2024",
    readTime: "10 min read",
    author: "Sector Specialist",
    ipoDetails: {
      companyName: "ManufacCorp Ltd",
      issueSize: "₹1,800 Cr",
      sector: "Manufacturing",
      gmp: "+15%"
    }
  }
];

const upcomingIPOs = [
  { 
    company: "TechStart Ltd", 
    date: "Dec 15, 2024", 
    size: "₹1,200 Cr", 
    sector: "Technology",
    priceBand: "₹450-520",
    gmp: "+8%",
    subscription: "Opens Soon",
    listing: "Dec 22, 2024"
  },
  { 
    company: "GreenEnergy Co", 
    date: "Dec 22, 2024", 
    size: "₹850 Cr", 
    sector: "Renewable Energy",
    priceBand: "₹280-350",
    gmp: "+12%",
    subscription: "Opens Soon",
    listing: "Dec 29, 2024"
  },
  { 
    company: "FinCorp Solutions", 
    date: "Jan 5, 2025", 
    size: "₹2,100 Cr", 
    sector: "Financial Services",
    priceBand: "₹320-380",
    gmp: "+5%",
    subscription: "Opens Soon",
    listing: "Jan 12, 2025"
  }
];

const marketStats = [
  { label: "Total IPOs This Year", value: "127", change: "+23%", description: "More companies going public", icon: Building2 },
  { label: "Market Cap Raised", value: "₹89,450 Cr", change: "+18%", description: "Record fundraising year", icon: DollarSign },
  { label: "Average Success Rate", value: "74%", change: "+5%", description: "Strong listing performance", icon: TrendingUp },
  { label: "Active Listings", value: "45", change: "+12%", description: "Currently open for subscription", icon: Activity }
];

const features = [
  {
    icon: BarChart3,
    title: "Comprehensive Analysis",
    description: "In-depth financial analysis with detailed metrics, ratio analysis, and growth forecasts for informed investment decisions"
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Real-time market trends, sector-wise performance tracking, and comparative analysis with peer companies"
  },
  {
    icon: Target,
    title: "Investment Guidance",
    description: "Expert recommendations, risk assessment, and portfolio allocation suggestions based on your investment profile"
  },
  {
    icon: Bell,
    title: "Real-time Alerts",
    description: "Get instant notifications about new IPO launches, subscription status, GMP updates, and listing dates"
  }
];

const successStories = [
  {
    company: "TechGiant IPO 2023",
    returns: "+185%",
    timeframe: "12 months",
    sector: "Technology"
  },
  {
    company: "PharmaCorp IPO 2023",
    returns: "+92%",
    timeframe: "8 months",
    sector: "Pharmaceuticals"
  },
  {
    company: "FinTech Solutions 2023",
    returns: "+156%",
    timeframe: "10 months",
    sector: "Financial Technology"
  }
];

export default function Home() {
  return (
    <>
      {/* SEO Head would go here in actual Next.js app */}
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
                <Button variant="outline" size="lg">
                  View Analysis
                </Button>
              </div>
              
              {/* Quick Stats */}
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
              {upcomingIPOs.map((ipo, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{ipo.company}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {ipo.sector}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Issue Size</span>
                          <div className="font-medium">{ipo.size}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price Band</span>
                          <div className="font-medium">{ipo.priceBand}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">GMP</span>
                          <div className="font-medium text-green-600 dark:text-green-400">{ipo.gmp}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Opens</span>
                          <div className="font-medium">{ipo.date}</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Expected Listing</div>
                        <div className="text-sm font-medium">{ipo.listing}</div>
                      </div>
                    </div>
                    <Button className="w-full mt-4 group-hover:scale-105 transition-transform">
                      Get Detailed Analysis
                    </Button>
                  </CardContent>
                </Card>
              ))}
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

        {/* Latest Analysis */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Latest IPO Analysis & Insights</h2>
              <p className="text-muted-foreground max-w-3xl mx-auto">
                Expert insights and detailed analysis on recent and upcoming IPOs with comprehensive research and recommendations
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Link key={post.id} href={`/analysis/${post.id}`} className="group block">
                  <Card className="h-full group-hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors mb-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-sm mb-3">
                        {post.excerpt}
                      </CardDescription>
                      <div className="text-xs text-muted-foreground mb-2">
                        By {post.author} • {post.date}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {post.ipoDetails.companyName}
                          </Badge>
                          <Badge variant="default" className="text-xs">
                            {post.ipoDetails.issueSize}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-green-600 text-green-600 dark:border-green-400 dark:text-green-400">
                            GMP {post.ipoDetails.gmp}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center font-medium text-sm group-hover:text-primary transition-colors">
                            Read Full Analysis
                            <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                          </div>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                View All Analysis & Research
              </Button>
            </div>
          </div>
        </section>

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
              <span className="font-bold text-xl">IPO Insights</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 IPO Insights. All rights reserved. Building smarter investment decisions.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}