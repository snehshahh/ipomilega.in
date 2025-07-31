"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Calendar, ArrowRight, TrendingUp, Clock, Star, BookOpen,
  Flame, Zap, User, Eye, Heart, Image as ImageIcon
} from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

interface BlogPost {
  _id: string
  title: string
  slug: string
  content: string
  excerpt: string
  tags: string[]
  category: string
  status: string
  meta_description: string
  author: string
  ipo_id: string
  created_at: string
  updated_at: string
  image_url?: string
}

interface CategoryData {
  _id: string
  category: string
  status: string
  [key: string]: string
}

interface ApiResponse {
  blogs: BlogPost[]
  ipo_analysis: CategoryData[]
  company_review: CategoryData[]
  market_news: CategoryData[]
  investment_guide: CategoryData[]
}

// Fallback component for when an image is not available
const ImageFallback = () => (
  <div className="w-full h-full bg-muted flex items-center justify-center">
    <ImageIcon className="h-10 w-10 text-muted-foreground" />
  </div>
);


export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [categoryData, setCategoryData] = useState<{
    ipo_analysis: CategoryData[]
    company_review: CategoryData[]
    market_news: CategoryData[]
    investment_guide: CategoryData[]
  }>({
    ipo_analysis: [],
    company_review: [],
    market_news: [],
    investment_guide: []
  })
  const [topStories, setTopStories] = useState<BlogPost[]>([])

  useEffect(() => {
    async function fetchBlogs() {
      const response = await fetch('/api/blogs/published')
      const data: ApiResponse = await response.json()
      setBlogs(data.blogs)
      setCategoryData({
        ipo_analysis: data.ipo_analysis,
        company_review: data.company_review,
        market_news: data.market_news,
        investment_guide: data.investment_guide
      })

      // Generate random top stories (simulate views)
      const shuffled = [...data.blogs].sort(() => 0.5 - Math.random())
      setTopStories(shuffled.slice(0, 3))
    }
    fetchBlogs()
  }, [])

  // Theme-based class names
  const textColor = "text-foreground"
  const mutedText = "text-muted-foreground"
  const cardBg = "bg-background/60 backdrop-blur-sm"

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'ipo analysis': return <TrendingUp className="h-4 w-4" />
      case 'market news': return <Zap className="h-4 w-4" />
      case 'investment guide': return <BookOpen className="h-4 w-4" />
      case 'company review': return <Star className="h-4 w-4" />
      default: return <Flame className="h-4 w-4" />
    }
  }

  const generateRandomViews = () => Math.floor(Math.random() * 5000) + 1000
  const generateRandomLikes = () => Math.floor(Math.random() * 500) + 50

  const featuredPost = blogs[0]

  const getCategoryBlogs = (category: string) => {
    return blogs.filter(blog => blog.category.toLowerCase() === category.toLowerCase()).slice(0, 3)
  }

  const categoryInfo = [
    {
      name: 'IPO Analysis',
      icon: TrendingUp,
      count: categoryData.ipo_analysis.length,
      color: 'from-blue-500/20 to-purple-500/20',
      description: 'Deep dives into upcoming IPOs'
    },
    {
      name: 'Market News',
      icon: Zap,
      count: categoryData.market_news.length,
      color: 'from-green-500/20 to-teal-500/20',
      description: 'Latest market updates and trends'
    },
    {
      name: 'Investment Guide',
      icon: BookOpen,
      count: categoryData.investment_guide.length,
      color: 'from-orange-500/20 to-red-500/20',
      description: 'Strategic investment insights'
    },
    {
      name: 'Company Review',
      icon: Star,
      count: categoryData.company_review.length,
      color: 'from-yellow-500/20 to-pink-500/20',
      description: 'Comprehensive company analysis'
    }
  ]

  return (
    <div className={`min-h-screen font-ibm-plex`}
    style={{
      background: `
        radial-gradient(circle at 20% 30%, rgba(240, 248, 255, 1), rgba(240, 248, 255, 0) 40%),
        radial-gradient(circle at 70% 20%, rgba(173, 216, 230, 0.6), rgba(173, 216, 230, 0) 50%),
        radial-gradient(circle at 30% 80%, rgba(135, 206, 250, 0.5), rgba(135, 206, 250, 0) 50%),
        radial-gradient(circle at 90% 70%, rgba(173, 216, 250, 0.5), rgba(173, 216, 250, 0) 60%)
      `,
      backgroundColor: '#e6f4fe',
    }}>
      {/* Hero Section */}
      <div className={`relative border-b backdrop-blur overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent opacity-50"></div>
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-muted text-primary text-sm font-semibold animate-pulse">
              <Flame className="h-5 w-5" />
              <span>Unmatched IPO Insights</span>
            </div>
            <h1 className={`text-5xl md:text-6xl font-extrabold ${textColor} leading-tight tracking-tight`}>
              The Best Investment Blog
              <br />
              <span className="text-primary text-3xl md:text-4xl font-semibold">Unrivaled. Unparalleled. Unmissable.</span>
            </h1>
            <p className={`text-xl ${mutedText} mt-6 py-11 max-w-3xl mx-auto leading-relaxed`}>
              Discover the ultimate source for IPO analysis, market trends, and investment strategies. Our expert-crafted blogs are the best—delivering cutting-edge insights to fuel your financial success.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {blogs.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted text-primary mb-6">
              <BookOpen className="h-10 w-10" />
            </div>
            <h2 className={`text-4xl font-bold ${textColor} mb-4`}>No Stories Yet</h2>
            <p className={`text-lg ${mutedText} max-w-xl mx-auto`}>
              Our team of experts is crafting the best investment insights. Stay tuned for unmatched content!
            </p>
          </div>
        ) : (
          <>
            {/* Top Stories Section */}
            {topStories.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className={`text-sm font-semibold ${textColor} uppercase tracking-wider`}>🔥 Trending Now</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {topStories.map((story, index) => (
                    <Link key={story._id} href={`/blogs/${story.slug}`} className="group block">
                      <div className={`relative overflow-hidden rounded-xl ${cardBg} border group-hover:shadow-xl group-hover:border-primary transition-all duration-500 transform group-hover:-translate-y-1`}>
                        <div className="absolute top-3 left-3 z-10">
                          <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            #{index + 1}
                          </div>
                        </div>

                        {/* ✅ Corrected Image Handling */}
                        <div className="relative w-full h-40 overflow-hidden">
                          {story.image_url ? (
                            <Image
                              src={story.image_url}
                              alt={story.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />
                          ) : (
                            <ImageFallback />
                          )}
                        </div>

                        <div className="p-4">
                          <h4 className={`text-lg font-bold ${textColor} mb-2 group-hover:text-primary transition-colors line-clamp-2`}>
                            {story.title}
                          </h4>
                          <p className={`text-sm ${mutedText} mb-3 line-clamp-2`}>
                            {story.excerpt}
                          </p>

                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center">
                                <Eye className="h-3 w-3 mr-1" />
                                {generateRandomViews().toLocaleString()}
                              </div>
                              <div className="flex items-center">
                                <Heart className="h-3 w-3 mr-1" />
                                {generateRandomLikes()}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {Math.ceil(story.content.split(' ').length / 200)}m
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Featured Article */}
            {featuredPost && (
              <div className="mb-20">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className={`text-sm font-semibold ${textColor} uppercase tracking-wider`}>Editor&apos;s Pick</span>
                </div>

                <Link href={`/blogs/${featuredPost.slug}`} className="group block">
                  <div className={`relative overflow-hidden rounded-2xl ${cardBg} border-2 group-hover:shadow-xl group-hover:border-primary transition-all duration-500`}>
                    {/* ✅ Corrected Image Handling */}
                    <div className="relative h-64 md:h-96 w-full overflow-hidden">
                      {featuredPost.image_url ? (
                        <>
                          <Image
                            src={featuredPost.image_url}
                            alt={featuredPost.title}
                            fill
                            sizes="100vw"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </>
                      ) : (
                        <ImageFallback />
                      )}
                    </div>

                    <div className="relative z-20 p-8 md:p-12">
                      <div className="flex items-center space-x-4 mb-6">
                        <Badge variant="outline" className={`px-4 py-1 text-sm font-medium`}>
                          {getCategoryIcon(featuredPost.category)}
                          <span className="ml-2">{featuredPost.category}</span>
                        </Badge>
                        <div className={`flex items-center space-x-2 text-sm ${mutedText}`}>
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(featuredPost.created_at).toLocaleDateString('en-IN')}</span>
                        </div>
                      </div>

                      <h2 className={`text-3xl md:text-5xl font-extrabold ${textColor} mb-4 group-hover:text-primary transition-colors leading-tight`}>
                        {featuredPost.title}
                      </h2>

                      <p className={`text-lg ${mutedText} mb-8 leading-relaxed max-w-3xl`}>
                        {featuredPost.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className={`flex items-center space-x-6 text-sm ${mutedText}`}>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{featuredPost.author}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Eye className="h-4 w-4" />
                            <span>{generateRandomViews().toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{Math.ceil(featuredPost.content.split(' ').length / 200)} min read</span>
                          </div>
                        </div>

                        <Button variant="ghost" className={`text-primary group-hover:scale-105 transition-all duration-300`}>
                          <span className="mr-2">Read the Best Story</span>
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Category Sections */}
            <div className="space-y-16">
              {categoryInfo.map((categoryInfoItem) => {
                const categoryBlogs = getCategoryBlogs(categoryInfoItem.name)
                if (categoryBlogs.length === 0) return null

                return (
                  <div key={categoryInfoItem.name}>
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <categoryInfoItem.icon className={`h-6 w-6 ${textColor}`} />
                        </div>
                        <div>
                          <h3 className={`text-2xl font-bold ${textColor}`}>{categoryInfoItem.name}</h3>
                          <p className={`text-sm ${mutedText}`}>Latest insights and analysis</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="group">
                        View All
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {categoryBlogs.map((blog) => (
                        <Link key={blog._id} href={`/blogs/${blog.slug}`} className="group block">
                          <article className={`relative overflow-hidden rounded-xl ${cardBg} border group-hover:shadow-xl group-hover:border-primary transition-all duration-500 transform group-hover:-translate-y-1`}>
                            {/* ✅ Corrected Image Handling */}
                            <div className="relative h-48 w-full overflow-hidden">
                              {blog.image_url ? (
                                <>
                                  <Image
                                    src={blog.image_url}
                                    alt={blog.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                </>
                              ) : (
                                <ImageFallback />
                              )}
                            </div>

                            <div className="p-6">
                              <div className={`text-sm ${mutedText} flex items-center mb-3`}>
                                <Calendar className="h-4 w-4 mr-1.5" />
                                {new Date(blog.created_at).toLocaleDateString('en-IN')}
                              </div>

                              <h4 className={`text-lg font-bold ${textColor} mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2`}>
                                {blog.title}
                              </h4>

                              <p className={`text-sm ${mutedText} mb-4 line-clamp-3 leading-relaxed`}>
                                {blog.excerpt}
                              </p>

                              <Separator className="mb-4" />

                              <div className="flex items-center justify-between">
                                <div className={`flex items-center space-x-4 text-sm ${mutedText}`}>
                                  <div className="flex items-center">
                                    <User className="h-4 w-4 mr-1" />
                                    {blog.author}
                                  </div>
                                  <div className="flex items-center">
                                    <Eye className="h-4 w-4 mr-1" />
                                    {generateRandomViews().toLocaleString()}
                                  </div>
                                </div>

                                <ArrowRight className={`h-5 w-5 ${mutedText} group-hover:text-primary group-hover:translate-x-2 transition-all duration-300`} />
                              </div>
                            </div>
                          </article>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Categories Showcase */}
            <div className="space-y-16 mt-16">
              <div className="text-center mb-12">
                <h2 className={`text-4xl font-bold ${textColor} mb-4`}>Explore by Category</h2>
                <p className={`${mutedText} text-lg max-w-2xl mx-auto`}>
                  Dive deep into our expertly curated categories for unmatched investment insights
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryInfo.map((category) => (
                  <div key={category.name} className={`group relative overflow-hidden rounded-xl ${cardBg} border hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-bold">{category.count}</div>
                    </div>
                    <div className="relative p-6 text-center space-y-4">
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted group-hover:scale-110 transition-transform duration-300`}>
                        <category.icon className={`h-7 w-7 ${textColor}`} />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${textColor} group-hover:text-primary transition-colors`}>{category.name}</h3>
                        <p className={`text-sm ${mutedText} mt-1`}>{category.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}