import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  BookmarkPlus,
  Building2,
  TrendingUp,
  Clock
} from "lucide-react"

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

interface IpoData {
  _id: string
  upcoming_ipo_2025: string
  ipo_type: string
  price_band: string
  ipo_size: string
  open_date: string
  closing_date: string
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blogs/slug/${slug}`, {
      cache: 'no-store' // Always fetch fresh data
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.blog
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}

async function getIpoData(ipoId: string): Promise<IpoData | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/ipo/${ipoId}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    const data = await response.json()
    return data.ipos
  } catch (error) {
    console.error('Error fetching IPO data:', error)
    return null
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const blog = await getBlogPost(params.slug)
  
  if (!blog) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog post could not be found.'
    }
  }

  return {
    title: blog.title,
    description: blog.meta_description || blog.excerpt,
    keywords: blog.tags.join(', '),
    authors: [{ name: blog.author }],
    openGraph: {
      title: blog.title,
      description: blog.meta_description || blog.excerpt,
      type: 'article',
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
      authors: [blog.author],
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.meta_description || blog.excerpt,
    }
  }
}

// Format markdown content to HTML (basic implementation)
function formatContent(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-6">$1</h1>')
    // Bold and Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Lists
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-2">• $1</li>')
    // Quotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">$1</blockquote>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-4">')
    // Wrap in paragraphs
    .replace(/^(?!<[h|l|b])(.+)$/gm, '<p class="mb-4">$1</p>')
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const blog = await getBlogPost(params.slug)
  
  if (!blog) {
    notFound()
  }

  // Only show published blogs to regular users
  if (blog.status !== 'published') {
    notFound()
  }

  const ipoData = blog.ipo_id ? await getIpoData(blog.ipo_id) : null
  
  const formattedDate = new Date(blog.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const readingTime = Math.ceil(blog.content.split(' ').length / 200) // Approximate reading time

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blogs" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blogs
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{blog.category}</Badge>
              {blog.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline">{tag}</Badge>
              ))}
            </div>
            
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {blog.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {blog.excerpt}
            </p>
            
            <div className="flex items-center justify-between border-b pb-6">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {blog.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formattedDate}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {readingTime} min read
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          </div>

          {/* IPO Reference Card (if available) */}
          {ipoData && (
            <Card className="mb-8 border-0 bg-gradient-to-r from-primary/5 to-purple/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{ipoData.upcoming_ipo_2025}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{ipoData.ipo_type}</span>
                        <span>•</span>
                        <span>{ipoData.price_band}</span>
                        <span>•</span>
                        <span>{ipoData.ipo_size}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/analysis/${ipoData._id}`}>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Analysis
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: formatContent(blog.content) 
              }}
            />
          </div>

          {/* Article Footer */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Tags:</span>
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Article
                </Button>
              </div>
            </div>
          </div>

          {/* Related Articles Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* You can add related articles logic here */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <p>Related articles coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}