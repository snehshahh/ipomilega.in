"use client"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, User, ArrowRight, TrendingUp, Clock } from "lucide-react"
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

  // Theme-based class names
  const bgColor = theme === "dark" ? "bg-black" : "bg-white"
  const textColor = theme === "dark" ? "text-white" : "text-black"
  const borderColor = theme === "dark" ? "border-gray-700" : "border-black"
  const mutedText = theme === "dark" ? "text-gray-400" : "text-gray-600"
  const hoverBg = theme === "dark" ? "hover:bg-gray-800" : "hover:bg-black"
  const hoverText = "hover:text-white"
  const secondaryBg = theme === "dark" ? "bg-gray-800" : "bg-gray-100"
  const cardBg = theme === "dark" ? "bg-black/60 backdrop-blur-sm" : "bg-white/60 backdrop-blur-sm"

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      {/* Header */}
      <div className={`border-b ${borderColor} bg-${bgColor}/95 backdrop-blur supports-[backdrop-filter]:bg-${bgColor}/60`}>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <h1 className={`text-4xl font-bold ${textColor}`}>
              IPO Analysis & Investment Insights
            </h1>
            <p className={`text-xl ${mutedText} max-w-2xl mx-auto`}>
              Expert analysis, comprehensive reviews, and investment guides for upcoming IPOs
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {blogs.length === 0 ? (
          <Card className={`max-w-md mx-auto ${cardBg} ${borderColor}`}>
            <CardHeader className="text-center">
              <CardTitle className={`text-2xl ${textColor}`}>No blogs available</CardTitle>
              <CardDescription className={`${mutedText}`}>
                Check back soon for the latest IPO analysis and insights.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Card
                key={blog._id}
                className={`group hover:shadow-lg transition-all duration-300 ${cardBg} ${borderColor}`}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`${borderColor} ${textColor} ${cardBg} ${hoverBg} ${hoverText}`}
                    >
                      {blog.category}
                    </Badge>
                    <span className={`text-xs ${mutedText} flex items-center`}>
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(blog.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <CardTitle
                      className={`text-xl ${theme === "dark" ? "group-hover:text-gray-200" : "group-hover:text-gray-600"} transition-colors line-clamp-2`}
                    >
                      {blog.title}
                    </CardTitle>
                    <CardDescription className={`${mutedText} text-sm line-clamp-3`}>
                      {blog.excerpt}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className={`text-xs ${secondaryBg} ${textColor} ${hoverBg} ${hoverText}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 3 && (
                      <Badge variant="secondary" className={`text-xs ${secondaryBg} ${textColor}`}>
                        +{blog.tags.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <Separator className={borderColor} />

                  <div className="flex items-center justify-between">
                    <div className={`flex items-center space-x-4 text-xs ${mutedText}`}>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {blog.author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {Math.ceil(blog.content.split(' ').length / 200)} min read
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" asChild className={`${hoverBg} ${hoverText}`}>
                      <Link href={`/blogs/${blog.slug}`} className="flex items-center">
                        Read More
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Featured Categories */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className={`text-2xl font-bold ${textColor} mb-2`}>Browse by Category</h2>
            <Separator className={`max-w-24 mx-auto ${borderColor}`} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['IPO Analysis', 'Market News', 'Investment Guide', 'Company Review'].map((category) => (
              <Card
                key={category}
                className={`hover:shadow-md transition-all duration-300 cursor-pointer ${cardBg} ${borderColor} ${hoverBg} ${hoverText} group`}
              >
                <CardContent className="pt-6 text-center space-y-3">
                  <TrendingUp
                    className={`h-8 w-8 mx-auto ${textColor} group-hover:text-white transition-colors`}
                  />
                  <CardTitle className={`text-base ${textColor} group-hover:text-white transition-colors`}>
                    {category}
                  </CardTitle>
                  <CardDescription
                    className={`text-sm ${mutedText} group-hover:text-gray-300 transition-colors`}
                  >
                    Latest {category.toLowerCase()} articles
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}