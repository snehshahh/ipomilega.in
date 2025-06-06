"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PenTool,
  Save,
  Eye,
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Tags,
  Building2,
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Type,
  AlignLeft,
  Bold,
  Italic,
  List,
  Quote,
  Link as LinkIcon,
  Sparkles
} from "lucide-react"
import { toast } from "react-toastify"
import Link from "next/link"
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis"
import { Ipo } from "@/app/models/ipo"

interface IpoandAnalysis {
  ipo: Ipo;
  analysis: IpoComprehensiveAnalysis;
}

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published';
  featured_image?: string;
  meta_description: string;
  author: string;
}

export default function CreateBlogPage() {
  const params = useParams()
  const router = useRouter()
  const ipoId = params.id as string
  const [ipoData,setIpoData]=useState<IpoandAnalysis | null>(null)
  const [ipoAnalysis, setIpoAnalysis] = useState<IpoComprehensiveAnalysis | null>(null)
  const [isLoadingIpo, setIsLoadingIpo] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [blogPost, setBlogPost] = useState<BlogPost>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    tags: [],
    category: 'IPO Analysis',
    status: 'draft',
    meta_description: '',
    author: 'Admin'
  })

  const [newTag, setNewTag] = useState('')
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    const fetchIpoData = async () => {
      try {
        setIsLoadingIpo(true)
        const response : any = await fetch(`/api/ipo/${ipoId}`)
      
        const response2 : any = await fetch(`/api/analysis/${ipoId}`)
        if (!response.ok || !response2.ok) {
          throw new Error('Failed to fetch IPO data')
        }
        
        const data: any = await response.json()
        const analysisData: any = await response2.json()
        console.log("ipo data",data.ipos)
        console.log("analysis data",analysisData.ipos_analysis)
        setIpoData({ ipo: data.ipos, analysis: analysisData.ipos_analysis })
        
        if (data.ipos) {
          setBlogPost(prev => ({
            ...prev,
            title: `${data.ipos.upcoming_ipo_2025} IPO Analysis: Complete Review & Investment Guide`,
            slug: generateSlug(`${data.ipos.upcoming_ipo_2025}-ipo-analysis`),
            excerpt: `Comprehensive analysis of ${data.ipos.upcoming_ipo_2025} IPO including price band, issue size, and investment recommendations.`,
            meta_description: `Complete review of ${data.ipos.upcoming_ipo_2025} IPO - Price: ${data.ipos.price_band}, Size: ${data.ipos.ipo_size}. Expert analysis and investment guide.`,
            tags: [data.ipos.upcoming_ipo_2025, data.ipos.ipo_type, 'IPO 2025', 'Stock Market'],
            content: generateInitialContent(data.ipos)
          }))
        }
      } catch (error) {
        console.error('Error fetching IPO data:', error)
        toast.error('Failed to load IPO data')
      } finally {
        setIsLoadingIpo(false)
      }
    }

    if (ipoId) {
      fetchIpoData()
    }
  }, [ipoId])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const generateInitialContent = (ipo: Ipo) => {
    // Add null checks to prevent undefined values
    const companyName = ipo.upcoming_ipo_2025 || 'Company Name';
    const ipoType = ipo.ipo_type || 'IPO Type';
    const priceBand = ipo.price_band || 'To be announced';
    const issueSize = ipo.ipo_size || 'To be announced';
    const openDate = ipo.open_date ? new Date(ipo.open_date).toLocaleDateString('en-IN') : 'To be announced';
    const closeDate = ipo.closing_date ? new Date(ipo.closing_date).toLocaleDateString('en-IN') : 'To be announced';
  
    return `# ${companyName} IPO: Complete Analysis & Investment Guide
  
  ## Overview
  
  ${companyName} is set to launch its Initial Public Offering (IPO) in 2025, marking a significant milestone for the company and presenting an exciting opportunity for investors.
  
  ## IPO Details
  
  ### Key Information
  - **Company:** ${companyName}
  - **IPO Type:** ${ipoType}
  - **Price Band:** ${priceBand}
  - **Issue Size:** ${issueSize}
  - **Open Date:** ${openDate}
  - **Close Date:** ${closeDate}
  
  ## Company Background
  
  [Write about the company's history, business model, and market position]
  
  ## Financial Analysis
  
  ### Revenue & Profitability
  [Add financial highlights and key metrics]
  
  ### Growth Prospects
  [Discuss future growth opportunities and market potential]
  
  ## IPO Analysis
  
  ### Valuation
  [Analyze the IPO pricing and valuation metrics]
  
  ### Use of Proceeds
  [Explain how the company plans to use the IPO funds]
  
  ### Risk Factors
  [Highlight key risks investors should consider]
  
  ## Investment Recommendation
  
  ### Pros
  - [List positive factors]
  
  ### Cons
  - [List concerns or risks]
  
  ### Final Verdict
  [Provide your investment recommendation]
  
  ## How to Apply
  
  [Include step-by-step guide for IPO application]
  
  ## Conclusion
  
  [Summarize key points and final thoughts]
  
  ---
  
  *This analysis is for informational purposes only and should not be considered as investment advice. Please consult with a financial advisor before making investment decisions.*`
  }

  const handleInputChange = (field: keyof BlogPost, value: string | string[]) => {
    setBlogPost(prev => ({
      ...prev,
      [field]: value
    }))

    // Auto-generate slug from title
    if (field === 'title' && typeof value === 'string') {
      setBlogPost(prev => ({
        ...prev,
        slug: generateSlug(value)
      }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !blogPost.tags.includes(newTag.trim())) {
      setBlogPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setBlogPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSave = async (status: 'draft' | 'published') => {
    try {
      setIsSaving(true)
      
      const payload = {
        ...blogPost,
        status,
        ipo_id: ipoId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to save blog post')
      }

      const data = await response.json()
      
      if (status === 'published') {
        toast.success('Blog post published successfully!')
      } else {
        toast.success('Draft saved successfully!')
      }

      // Redirect to blog management or view page
      router.push(`/admin`)
      
    } catch (error) {
      console.error('Error saving blog post:', error)
      toast.error('Failed to save blog post')
    } finally {
      setIsSaving(false)
    }
  }

  const insertFormatting = (format: string) => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    let replacement = ''

    switch (format) {
      case 'bold':
        replacement = `**${selectedText || 'bold text'}**`
        break
      case 'italic':
        replacement = `*${selectedText || 'italic text'}*`
        break
      case 'heading':
        replacement = `## ${selectedText || 'Heading'}`
        break
      case 'list':
        replacement = `- ${selectedText || 'List item'}`
        break
      case 'quote':
        replacement = `> ${selectedText || 'Quote'}`
        break
      case 'link':
        replacement = `[${selectedText || 'Link text'}](url)`
        break
    }

    const newContent = 
      textarea.value.substring(0, start) + 
      replacement + 
      textarea.value.substring(end)

    setBlogPost(prev => ({ ...prev, content: newContent }))
  }

  if (isLoadingIpo) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <div className="text-xl font-medium">Loading IPO Data...</div>
            <div className="text-sm text-muted-foreground">Preparing blog editor</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <PenTool className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Create Blog Post
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {ipoData?.ipo?.upcoming_ipo_2025} IPO Analysis
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isPreviewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave('draft')}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={() => handleSave('published')}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* IPO Reference Card */}
            {ipoData && (
              <Card className="border-0 bg-gradient-to-r from-primary/5 to-purple/5 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{ipoData.ipo.upcoming_ipo_2025}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{ipoData.ipo.ipo_type}</span>
                          <span>•</span>
                          <span>{ipoData.ipo.price_band}</span>
                          <span>•</span>
                          <span>{ipoData.ipo.ipo_size}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">Reference IPO</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Blog Editor */}
            <Card className="border-0 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {isPreviewMode ? 'Preview' : 'Blog Editor'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isPreviewMode ? (
                  <>
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Blog Title</Label>
                      <Input
                        id="title"
                        value={blogPost.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter blog post title..."
                        className="text-lg font-medium"
                      />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={blogPost.slug}
                        onChange={(e) => handleInputChange('slug', e.target.value)}
                        placeholder="url-slug"
                        className="font-mono text-sm"
                      />
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={blogPost.excerpt}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                        placeholder="Brief description of the blog post..."
                        rows={3}
                      />
                    </div>

                    {/* Content Editor Toolbar */}
                    <div className="space-y-2">
                      <Label>Content</Label>
                      <div className="flex items-center space-x-2 p-2 border rounded-lg bg-muted/20">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormatting('bold')}
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormatting('italic')}
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormatting('heading')}
                        >
                          <Type className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormatting('list')}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormatting('quote')}
                        >
                          <Quote className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => insertFormatting('link')}
                        >
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <Textarea
                      id="content-textarea"
                      value={blogPost.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Write your blog content here... (Markdown supported)"
                      rows={20}
                      className="font-mono text-sm resize-none"
                    />
                  </>
                ) : (
                  /* Preview Mode */
                  <div className="prose prose-lg max-w-none">
                    <h1>{blogPost.title}</h1>
                    <p className="text-muted-foreground italic">{blogPost.excerpt}</p>
                    <div className="whitespace-pre-wrap">{blogPost.content}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Category */}
            <Card className="border-0 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={blogPost.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={blogPost.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IPO Analysis">IPO Analysis</SelectItem>
                      <SelectItem value="Market News">Market News</SelectItem>
                      <SelectItem value="Investment Guide">Investment Guide</SelectItem>
                      <SelectItem value="Company Review">Company Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input
                    value={blogPost.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    placeholder="Author name"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-0 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Tags className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button size="sm" onClick={addTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blogPost.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card className="border-0 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={blogPost.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                    placeholder="SEO meta description..."
                    rows={3}
                  />
                  <div className="text-xs text-muted-foreground">
                    {blogPost.meta_description.length}/160 characters
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Featured Image
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}