import React from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Badge 
} from '@/components/ui/badge';
import { 
  Input 
} from '@/components/ui/input';
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
  Bell
} from 'lucide-react';

// Mock data - replace with your actual data
const blogPosts = [
  {
    id: 1,
    title: "Comprehensive Analysis of XYZ Corp IPO Launch",
    excerpt: "Deep dive into the financials, market positioning, and growth prospects of XYZ Corp as they prepare for their public debut.",
    category: "IPO Analysis",
    date: "Nov 15, 2024",
    ipoDetails: {
      companyName: "XYZ Corp",
      issueSize: "₹2,500 Cr"
    }
  },
  {
    id: 2,
    title: "Tech Sector IPO Trends: What Investors Need to Know",
    excerpt: "Analysis of recent tech IPO performances and key factors driving valuations in the current market environment.",
    category: "Market Trends",
    date: "Nov 12, 2024",
    ipoDetails: {
      companyName: "Multiple",
      issueSize: "₹15,000+ Cr"
    }
  }
];

const upcomingIPOs = [
  { company: "TechStart Ltd", date: "Dec 15, 2024", size: "₹1,200 Cr", sector: "Technology" },
  { company: "GreenEnergy Co", date: "Dec 22, 2024", size: "₹850 Cr", sector: "Renewable Energy" },
  { company: "FinCorp Solutions", date: "Jan 5, 2025", size: "₹2,100 Cr", sector: "Financial Services" }
];

const marketStats = [
  { label: "Total IPOs This Year", value: "127", change: "+23%" },
  { label: "Market Cap Raised", value: "₹89,450 Cr", change: "+18%" },
  { label: "Average Success Rate", value: "74%", change: "+5%" },
  { label: "Active Listings", value: "45", change: "+12%" }
];

const features = [
  {
    icon: BarChart3,
    title: "Comprehensive Analysis",
    description: "In-depth financial analysis with detailed metrics and forecasts"
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Real-time market trends and sector-wise performance tracking"
  },
  {
    icon: Target,
    title: "Investment Guidance",
    description: "Expert recommendations and risk assessment for informed decisions"
  },
  {
    icon: Bell,
    title: "Real-time Alerts",
    description: "Get notified about new IPO launches and important updates"
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
              IPO Analysis
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              Your comprehensive platform for IPO insights, analysis, and investment guidance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                Explore IPOs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="border-black text-black hover:bg-black hover:text-white">
                View Analysis
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Market Stats */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-black mb-12">Market Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {marketStats.map((stat, index) => (
              <Card key={index} className="text-center border-gray-200">
                <CardContent className="pt-6">
                  <div className="text-2xl md:text-3xl font-bold text-black mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {stat.change}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Why Choose Our Platform</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get comprehensive IPO analysis with expert insights and real-time market data
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-black" />
                  <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming IPOs */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">Upcoming IPOs</h2>
              <p className="text-gray-600">Stay ahead with upcoming public offerings</p>
            </div>
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
              View All
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingIPOs.map((ipo, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-black">{ipo.company}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {ipo.sector}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Launch Date</span>
                      <span className="font-medium text-black">{ipo.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issue Size</span>
                      <span className="font-medium text-black">{ipo.size}</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-black text-white hover:bg-gray-800">
                    Get Analysis
                  </Button>
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
            <h2 className="text-3xl font-bold text-black mb-4">Latest IPO Analysis</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Expert insights and detailed analysis on recent and upcoming IPOs
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blogs/${post.id}`} className="group block">
                <Card className="h-full border-gray-200 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-sm text-gray-500">{post.date}</span>
                    </div>
                    <CardTitle className="text-xl text-black group-hover:text-gray-600 transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {post.ipoDetails.companyName}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-black text-white">
                        {post.ipoDetails.issueSize}
                      </Badge>
                    </div>
                    <div className="flex items-center text-black font-medium">
                      Read Analysis
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-black text-black hover:bg-black hover:text-white">
              View All Analysis
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-black text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Ahead of the Market</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Get exclusive IPO insights, market analysis, and investment opportunities delivered to your inbox weekly.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white text-black border-white"
              />
              <Button className="bg-white text-black hover:bg-gray-200">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-700">Expert Analysis</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-gray-700">Trusted by 10,000+ Investors</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Users className="h-5 w-5 text-black" />
              <span className="text-gray-700">Professional Community</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}