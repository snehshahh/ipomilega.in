"use client";

// app/blogs/[id]/BlogDisplay.tsx
import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  BookmarkPlus,
  Building2,
  TrendingUp,
  Clock,
  Eye,
  MessageCircle,
  Heart,
} from "lucide-react";

interface BlogPost {
  title: string;
  slug: string;
  ipo_id: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  status: "draft" | "published";
  featured_image?: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
  author: string;
}

interface Ipo {
  _id: string;
  ipo_table_id?: string;
  upcoming_ipo_2025: string;
  ipo_type?: string;
  ipo_details: {
    ipo_price_band?: string;
    issue_size?: string;
  };
}

function formatMarkdownContent(content: string): string {
  // First, normalize line endings and handle multiple newlines
  let formatted = content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  // Handle headers (must be done before other formatting)
  formatted = formatted
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-8 mb-4 text-foreground">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-6 text-foreground">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-12 mb-8 text-foreground">$1</h1>');

  // Handle blockquotes
  formatted = formatted.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-6 py-4 my-6 italic text-muted-foreground bg-muted/30 rounded-r-lg">$1</blockquote>');

  // Handle lists - improved pattern
  formatted = formatted.replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 text-foreground list-disc list-inside">$1</li>');
  
  // Wrap consecutive list items in <ul> tags
  formatted = formatted.replace(/(<li[^>]*>.*?<\/li>\s*)+/gs, '<ul class="mb-6 space-y-2">$&</ul>');

  // Handle bold and italic (order matters)
  formatted = formatted
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-muted-foreground">$1</em>');

  // Handle inline code
  formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm font-mono text-primary">$1</code>');

  // Handle horizontal rules
  formatted = formatted.replace(/^---\s*$/gim, '<hr class="my-8 border-t border-muted" />');

  // Split into paragraphs and wrap non-HTML content
  const lines = formatted.split('\n');
  const processedLines: string[] = [];
  let currentParagraph: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (line === '') {
      if (currentParagraph.length > 0) {
        // Close current paragraph
        const paragraphContent = currentParagraph.join(' ').trim();
        if (paragraphContent && !isHtmlElement(paragraphContent)) {
          processedLines.push(`<p class="mb-6 text-foreground leading-relaxed">${paragraphContent}</p>`);
        } else if (paragraphContent) {
          processedLines.push(paragraphContent);
        }
        currentParagraph = [];
      }
      continue;
    }

    // If line is already HTML, add it directly
    if (isHtmlElement(line)) {
      // First close any open paragraph
      if (currentParagraph.length > 0) {
        const paragraphContent = currentParagraph.join(' ').trim();
        if (!isHtmlElement(paragraphContent)) {
          processedLines.push(`<p class="mb-6 text-foreground leading-relaxed">${paragraphContent}</p>`);
        } else {
          processedLines.push(paragraphContent);
        }
        currentParagraph = [];
      }
      processedLines.push(line);
    } else {
      // Add to current paragraph
      currentParagraph.push(line);
    }
  }

  // Handle any remaining paragraph
  if (currentParagraph.length > 0) {
    const paragraphContent = currentParagraph.join(' ').trim();
    if (paragraphContent && !isHtmlElement(paragraphContent)) {
      processedLines.push(`<p class="mb-6 text-foreground leading-relaxed">${paragraphContent}</p>`);
    } else if (paragraphContent) {
      processedLines.push(paragraphContent);
    }
  }

  return processedLines.join('\n');
}

function isHtmlElement(text: string): boolean {
  return /^<(h[1-6]|p|div|ul|li|blockquote|hr|strong|em|code)[^>]*>/.test(text.trim());
}

export default function BlogDisplay({ blog }: { blog: BlogPost }) {
  const [ipoData, setIpoData] = useState<Ipo | null>(null);
  const [isLoadingIpo, setIsLoadingIpo] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (blog.ipo_id) {
      const fetchIpoData = async () => {
        setIsLoadingIpo(true);
        try {
          const response = await fetch(`/api/ipo/${blog.ipo_id}`);
          if (response.ok) {
            const data: Ipo = await response.json();
            setIpoData(data);
          }
        } catch (error) {
          console.error("Error fetching IPO data:", error);
        } finally {
          setIsLoadingIpo(false);
        }
      };
      fetchIpoData();
    }
  }, [blog.ipo_id]);

  const formattedDate = new Date(blog.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const readingTime = Math.ceil(blog.content.split(" ").length / 200);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <div className="border-b bg-background/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/blogs" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blogs
              </Link>
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "text-red-500" : "text-muted-foreground"}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={isBookmarked ? "text-primary" : "text-muted-foreground"}
              >
                <BookmarkPlus className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare} className="text-muted-foreground">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            {/* Category and Tags */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <Badge variant="default" className="px-4 py-2 text-sm font-medium bg-primary text-background">
                {blog.category}
              </Badge>
              {blog.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1 text-xs border text-muted-foreground">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
              {blog.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {blog.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-8">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span className="font-medium">{blog.author}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{readingTime} min read</span>
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  <span>1.2k views</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Comment
                </Button>
              </div>
            </div>

            <Separator className="border-t" />
          </header>

      

          {/* IPO Reference Card */}
          {blog.ipo_id && (
            <Card className="mb-12 bg-muted/30 border border-muted">
              <CardContent className="pt-6">
                {isLoadingIpo ? (
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-lg" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[300px]" />
                    </div>
                  </div>
                ) : ipoData ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-primary/10 border">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground mb-1">
                          {ipoData.upcoming_ipo_2025}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="bg-muted px-2 py-1 rounded">
                            {ipoData.ipo_type || "IPO"}
                          </span>
                          <span>•</span>
                          <span>{ipoData.ipo_details?.ipo_price_band || "Price TBA"}</span>
                          <span>•</span>
                          <span>{ipoData.ipo_details?.issue_size || "Size TBA"}</span>
                        </div>
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/analysis/${ipoData._id}`}>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Analysis
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>IPO information not available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Article Content */}
          <article className="mb-12">
            <div
              className="prose prose-lg max-w-none [&>*]:text-foreground [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_p]:text-foreground [&_li]:text-foreground [&_strong]:text-foreground"
              dangerouslySetInnerHTML={{
                __html: formatMarkdownContent(blog.content),
              }}
            />
          </article>

          <Separator className="my-12" />

          {/* Article Footer */}
          <footer className="mb-12">
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground font-medium">Tags:</span>
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1 text-xs bg-muted text-muted-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Article
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={isBookmarked ? "bg-muted" : ""}
                >
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  {isBookmarked ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          </footer>

          {/* Related Articles Section */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-foreground">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-muted/30 border group hover:bg-muted/50 transition-all duration-300">
                <CardContent className="pt-6 text-center">
                  <div className="text-muted-foreground mb-4">
                    <TrendingUp className="h-12 w-12 mx-auto opacity-50" />
                  </div>
                  <p className="text-muted-foreground">
                    Related articles will be displayed here based on tags and category.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30 border group hover:bg-muted/50 transition-all duration-300">
                <CardContent className="pt-6 text-center">
                  <div className="text-muted-foreground mb-4">
                    <Building2 className="h-12 w-12 mx-auto opacity-50" />
                  </div>
                  <p className="text-muted-foreground">
                    Discover more IPO insights and market analysis.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}