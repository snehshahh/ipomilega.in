"use client"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, ArrowRight, TrendingUp, Clock, Star, BookOpen, Flame, Zap, User } from "lucide-react"
import { useState, useEffect } from "react"

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
}

export default function BlogsPage() {
  const { theme } = useTheme()
  const [blogs, setBlogs] = useState<BlogPost[]>([])

  useEffect(() => {
    async function fetchBlogs() {
      const response = await fetch('/api/blogs/published')
      const data = await response.json()
      setBlogs(data.blogs)
    }
    fetchBlogs()
  }, [])

  // Theme-based class names using colors.txt palette
  const bgColor = "bg-background"
  const textColor = "text-foreground"
  const borderColor = theme === "dark" ? "border" : "border"
  const mutedText = "text-muted-foreground"
  const hoverBg = theme === "dark" ? "hover:bg-muted/50" : "hover:bg-muted/30"
  const hoverText = "hover:text-primary"
  const secondaryBg = "bg-muted/30"
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

  const featuredPost = blogs[0]
  const regularPosts = blogs.slice(1)

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      {/* Hero Section */}
      <div className={`relative border-b ${borderColor} ${bgColor}/95 backdrop-blur supports-[backdrop-filter]:${bgColor}/60 overflow-hidden`}>
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
            {/* Featured Article */}
            {featuredPost && (
              <div className="mb-20">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className={`text-sm font-semibold ${textColor} uppercase tracking-wider`}>Top Featured Story</span>
                </div>
                
                <Link href={`/blogs/${featuredPost.slug}`} className="group block">
                  <div className={`relative overflow-hidden rounded-2xl ${cardBg} ${borderColor} border-2 group-hover:shadow-xl group-hover:border-primary transition-all duration-500`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-muted/50 to-transparent z-10"></div>
                    <div className="relative z-20 p-8 md:p-12">
                      <div className="flex items-center space-x-4 mb-6">
                        <Badge className={`${borderColor} ${textColor} ${secondaryBg} px-4 py-1 text-sm font-medium`}>
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
                            <Clock className="h-4 w-4" />
                            <span>{Math.ceil(featuredPost.content.split(' ').length / 200)} min read</span>
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          className={`${hoverBg} ${hoverText} text-primary group-hover:scale-105 transition-all duration-300`}
                        >
                          <span className="mr-2">Read the Best Story</span>
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Regular Posts Grid */}
            {regularPosts.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center justify-between mb-10">
                  <h3 className={`text-3xl font-bold ${textColor}`}>More Unmissable Stories</h3>
                  <div className={`h-px flex-1 ml-8 ${borderColor} bg-gradient-to-r from-muted to-transparent opacity-30`}></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((blog, index) => (
                    <Link key={blog._id} href={`/blogs/${blog.slug}`} className="group block">
                      <article className={`relative overflow-hidden rounded-xl ${cardBg} ${borderColor} border group-hover:shadow-2xl group-hover:border-primary transition-all duration-500 transform group-hover:-translate-y-2`}>
                        {/* Article Number */}
                        <div className="absolute top-4 left-4 z-10">
                          <div className={`w-10 h-10 rounded-full ${secondaryBg} flex items-center justify-center text-sm font-bold ${textColor}`}>
                            {String(index + 2).padStart(2, '0')}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 pt-16">
                          <div className="flex items-center space-x-3 mb-4">
                            <Badge variant="outline" className={`${borderColor} ${textColor} text-sm px-3 py-1`}>
                              {getCategoryIcon(blog.category)}
                              <span className="ml-2">{blog.category}</span>
                            </Badge>
                            <div className={`text-sm ${mutedText} flex items-center`}>
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(blog.created_at).toLocaleDateString('en-IN')}
                            </div>
                          </div>
                          
                          <h4 className={`text-xl font-bold ${textColor} mb-3 group-hover:text-primary transition-colors leading-tight line-clamp-2`}>
                            {blog.title}
                          </h4>
                          
                          <p className={`text-sm ${mutedText} mb-4 line-clamp-3 leading-relaxed`}>
                            {blog.excerpt}
                          </p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className={`inline-block px-3 py-1 text-xs ${secondaryBg} ${textColor} rounded-full`}
                              >
                                #{tag}
                              </span>
                            ))}
                            {blog.tags.length > 2 && (
                              <span className={`inline-block px-3 py-1 text-xs ${mutedText} rounded-full`}>
                                +{blog.tags.length - 2}
                              </span>
                            )}
                          </div>
                          
                          <Separator className={`${borderColor} mb-4`} />
                          
                          {/* Footer */}
                          <div className="flex items-center justify-between">
                            <div className={`flex items-center space-x-4 text-sm ${mutedText}`}>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {blog.author}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {Math.ceil(blog.content.split(' ').length / 200)}m
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
            )}
          </>
        )}

        {/* Categories Section */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className={`text-4xl font-bold ${textColor} mb-4`}>Explore the Best Categories</h2>
            <p className={`${mutedText} text-lg mb-8 max-w-2xl mx-auto`}>Dive into our expertly curated categories for the finest investment analysis available</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'IPO Analysis', icon: TrendingUp, count: '24', color: 'from-primary to-muted' },
              { name: 'Market News', icon: Zap, count: '18', color: 'from-primary to-muted' },
              { name: 'Investment Guide', icon: BookOpen, count: '12', color: 'from-primary to-muted' },
              { name: 'Company Review', icon: Star, count: '15', color: 'from-primary to-muted' }
            ].map((category) => (
              <div
                key={category.name}
                className={`group relative overflow-hidden rounded-xl ${cardBg} ${borderColor} border hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                <div className="relative p-6 text-center space-y-4">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${secondaryBg} group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className={`h-7 w-7 ${textColor}`} />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${textColor} group-hover:text-primary transition-colors`}>
                      {category.name}
                    </h3>
                    <p className={`text-sm ${mutedText} mt-1`}>
                      {category.count} articles
                    </p>
                  </div>
                  <div className={`text-sm ${mutedText} group-hover:text-primary transition-colors`}>
                    The best insights in {category.name.toLowerCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}