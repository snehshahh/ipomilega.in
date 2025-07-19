"use client";
import { useEffect, useState, Suspense, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Search,
  Building2,
  Calendar,
  TrendingUp,
  Shield,
  ChevronRight,
  LineChart,
  PieChart,
  ChevronLeft,
  RefreshCw,
  Clock,
  XCircle,
  Activity,
  Loader2,
  Upload,
  Copy,
  Eye,
  ExternalLink,
  PenTool,
  Plus,
  Edit
} from "lucide-react"
import { cn } from "@/lib/utils"
import { HomePageIpoProps } from "../types/homepage"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProgressRouter } from "@/components/Progressbar/useProgressRouter"
import { useSearchParams } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Blog } from "../models/ipo";

type FilterType = 'all' | 'live' | 'upcoming' | 'past'

function AdminContent() {
  const [ipoList, setIpoList] = useState<HomePageIpoProps[]>([])
  const [upcomingIpoList, setUpcomingIpoList] = useState<HomePageIpoProps[]>([])
  const [liveIpoList, setLiveIpoList] = useState<HomePageIpoProps[]>([])
  const [pastIpoList, setPastIpoList] = useState<HomePageIpoProps[]>([])
  const [blogList, setBlogList] = useState<Blog[]>([])
  const router = useProgressRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredIpos, setFilteredIpos] = useState<HomePageIpoProps[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const itemsPerPage = 10

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard", {
      description: text,
    })
  }

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>, ipoId: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension) {
      toast.error("Invalid file format")
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only image files (JPEG, PNG, GIF, WebP) are allowed")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit")
      return
    }

    const newFileName = `${ipoId}.${extension}`
    const formData = new FormData()
    formData.append('file', new File([file], newFileName, { type: file.type }))
    formData.append('folder', 'logo')
    formData.append('documentId', ipoId)
    formData.append('collection', 'ipos')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (data.success) {
        setFilteredIpos(prev =>
          prev.map(ipo =>
            ipo.ipo._id === ipoId ? { ...ipo, ipo: { ...ipo.ipo, image_url: data.url } } : ipo
          )
        )
        setIpoList(prev =>
          prev.map(ipo =>
            ipo.ipo._id === ipoId ? { ...ipo, ipo: { ...ipo.ipo, image_url: data.url } } : ipo
          )
        )
        setUpcomingIpoList(prev =>
          prev.map(ipo =>
            ipo.ipo._id === ipoId ? { ...ipo, ipo: { ...ipo.ipo, image_url: data.url } } : ipo
          )
        )
        setLiveIpoList(prev =>
          prev.map(ipo =>
            ipo.ipo._id === ipoId ? { ...ipo, ipo: { ...ipo.ipo, image_url: data.url } } : ipo
          )
        )
        setPastIpoList(prev =>
          prev.map(ipo =>
            ipo.ipo._id === ipoId ? { ...ipo, ipo: { ...ipo.ipo, image_url: data.url } } : ipo
          )
        )
        toast.success("Logo uploaded successfully")
      } else {
        toast.error(data.error || "Failed to upload logo")
      }
    } catch (error) {
      toast.error("Error uploading logo")
      console.error('Upload error:', error)
    }
  }

  const handleBlogClick = (ipoId: string) => {
    router.push(`/blogs/${ipoId}/create-a-blog`)
  }

  const handleEditBlog = (blogId: string) => {
    window.open(`/blogs/edit-a-blog/${blogId}`, '_blank')
  }

  const getBlogsForIpo = (ipoId: string) => {
    return blogList.filter(blog => blog.ipo_id === ipoId)
  }

  // Get filter from URL parameter
  useEffect(() => {
    const filterParam = searchParams.get('filter') as FilterType
    if (filterParam && ['all', 'live', 'upcoming', 'past'].includes(filterParam)) {
      setActiveFilter(filterParam)
    }
  }, [searchParams])

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Get current IPO list based on active filter
  const getCurrentIpoList = () => {
    switch (activeFilter) {
      case 'live':
        return liveIpoList
      case 'upcoming':
        return upcomingIpoList
      case 'past':
        return pastIpoList
      default:
        return ipoList
    }
  }

  // Filter and search logic
  useEffect(() => {
    const currentList = getCurrentIpoList()
    const filtered = currentList.filter(ipoItem =>
      ipoItem.ipo.upcoming_ipo_2025?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ipoItem.ipo.ipo_type?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredIpos(filtered)
    setCurrentPage(1)
  }, [searchQuery, ipoList, liveIpoList, upcomingIpoList, pastIpoList, activeFilter])

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter)
    const url = new URL(window.location.href)
    if (filter === 'all') {
      url.searchParams.delete('filter')
    } else {
      url.searchParams.set('filter', filter)
    }
    window.history.pushState({}, '', url.toString())
  }

  useEffect(() => {
    const fetchIpos = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/ipo/upcoming')
        if (!response.ok) {
          throw new Error('Failed to fetch IPO data')
        }
        const data = await response.json()
        setIpoList(data.data.all || [])
        setUpcomingIpoList(data.data.upcoming || [])
        setBlogList(data.data.blogList || []);
        setLiveIpoList(data.data.live || [])
        setPastIpoList(data.data.past || [])
      } catch (error) {
        console.error('Error fetching IPO data:', error)
        setError('Failed to load IPO data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchIpos()
  }, [])

  // Stats based on current filter
  const getFilteredStats = () => {
    const currentList = getCurrentIpoList()
    const totalIpos = currentList.length
    const mainboardCount = currentList.filter(ipoItem => ipoItem.ipo.ipo_type === 'Mainboard').length
    const smeCount = currentList.filter(ipoItem => ipoItem.ipo.ipo_type === 'SME').length
    const totalSize = currentList.length > 0 ? `${currentList.length * 1500}+ Cr` : '0 Cr'

    return { totalIpos, mainboardCount, smeCount, totalSize }
  }

  const { totalIpos, mainboardCount, smeCount, totalSize } = getFilteredStats()

  const dashboardStats = [
    {
      label: "Total IPOs",
      value: totalIpos.toString(),
      change: "+12%",
      description: "Active listings managed",
      icon: Building2,
      color: "text-[#0073E6]"
    },
    {
      label: "Mainboard IPOs",
      value: mainboardCount.toString(),
      change: "+8%",
      description: "Large cap offerings",
      icon: TrendingUp,
      color: "text-[#00914D]"
    },
    {
      label: "SME IPOs",
      value: smeCount.toString(),
      change: "+15%",
      description: "Small & medium enterprises",
      icon: Activity,
      color: "text-[#B4292E]"
    },
    {
      label: "Total Market Cap",
      value: totalSize,
      change: "+23%",
      description: "Combined issue size",
      icon: PieChart,
      color: "text-[#D59527]"
    }
  ]

  const filterOptions = [
    { value: 'all', label: 'All IPOs', count: ipoList.length, icon: Building2 },
    { value: 'live', label: 'Live IPOs', count: liveIpoList.length, icon: Activity },
    { value: 'upcoming', label: 'Upcoming IPOs', count: upcomingIpoList.length, icon: Calendar },
    { value: 'past', label: 'Past IPOs', count: pastIpoList.length, icon: Clock }
  ]

  const totalPages = Math.ceil(filteredIpos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentIpos = filteredIpos.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleGoToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const pageNum = parseInt(e.currentTarget.value)
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        handlePageChange(pageNum)
      } else {
        e.currentTarget.value = currentPage.toString()
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-[#0073E6] animate-pulse"></div>
              <div className="w-4 h-4 rounded-full bg-[#B4292E] animate-pulse delay-150"></div>
              <div className="w-4 h-4 rounded-full bg-[#00914D] animate-pulse delay-300"></div>
            </div>
            <div className="text-xl font-black text-gray-900 font-ibm-plex">Loading IPO Dashboard...</div>
            <div className="text-sm text-gray-600 font-medium font-ibm-plex">Fetching latest market data</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="border-[#B4292E] max-w-md w-full bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-[#B4292E] flex items-center justify-center gap-2 font-black font-ibm-plex">
                <Shield className="h-5 w-5" />
                Connection Error
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600 font-medium font-ibm-plex">{error}</p>
              <Button onClick={() => window.location.reload()} className="w-full bg-[#0073E6] hover:bg-[#0073E6]/90 font-bold">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 px-4 py-15">
      <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center lg:justify-start">
          {filterOptions.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value as FilterType)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-200 shadow-md border font-ibm-plex text-sm sm:text-base",
                activeFilter === filter.value
                  ? "bg-[#0073E6] text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 hover:shadow-lg"
              )}
            >
              <filter.icon className="h-4 w-4" />
              <span>{filter.label}</span>
              <Badge
                variant="secondary"
                className={cn(
                  "ml-1 text-xs font-bold",
                  activeFilter === filter.value
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                {filter.count}
              </Badge>
            </button>
          ))}
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 sm:hover:scale-105 border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <stat.icon className={cn("h-6 w-6 sm:h-8 sm:w-8", stat.color, "group-hover:scale-110 transition-transform")} />
                  <Badge variant="secondary" className="text-xs font-bold bg-[#00914D]/10 text-[#00914D] border-[#00914D]/20">
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 font-ibm-plex">{stat.value}</div>
                  <div className="text-xs sm:text-sm font-bold text-gray-900 font-ibm-plex">{stat.label}</div>
                  <div className="text-xs text-gray-600 hidden sm:block font-medium font-ibm-plex">{stat.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Bar */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search IPOs by company name or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 bg-white/50 text-sm sm:text-base h-10 sm:h-12 border-gray-200 font-medium font-ibm-plex focus:border-[#0073E6] focus:ring-[#0073E6]"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* IPO Table */}
        <Card className="border-0 bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg">
          {filteredIpos.length === 0 ? (
            <CardContent className="py-10 sm:py-16 text-center p-4 sm:p-6">
              <div className="space-y-4">
                <div className="p-4 rounded-full bg-gray-100 w-12 h-12 sm:w-16 sm:h-16 mx-auto flex items-center justify-center">
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-black text-gray-900 mb-2 font-ibm-plex">
                    {searchQuery ? 'No IPOs found' : `No ${activeFilter} IPOs available`}
                  </p>
                  <p className="text-gray-600 text-sm font-medium font-ibm-plex">
                    {searchQuery
                      ? `No results found for "${searchQuery}". Try different keywords.`
                      : `No ${activeFilter} IPOs in the system right now.`
                    }
                  </p>
                </div>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery('')} className="border-[#0073E6]/20 hover:bg-[#0073E6]/10 text-[#0073E6] font-bold">
                    Clear Search
                  </Button>
                )}
              </div>
            </CardContent>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block lg:hidden">
                <div className="divide-y divide-gray-100">
                  {currentIpos.map((ipoItem, index) => (
                    <div key={ipoItem._id || index} className="p-4 sm:p-5 space-y-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          {ipoItem.ipo.image_url ? (
                            <Avatar className="border-2 border-gray-100">
                              <AvatarImage src={ipoItem.ipo.image_url} alt={`${ipoItem.ipo.upcoming_ipo_2025} logo`} />
                              <AvatarFallback className="bg-[#0073E6]/10 text-[#0073E6] font-bold">IP</AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="p-2 rounded-lg bg-[#0073E6]/10 flex-shrink-0">
                              <Building2 className="h-4 w-4 text-[#0073E6]" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-black text-gray-900 truncate font-ibm-plex">{ipoItem.ipo.upcoming_ipo_2025 || 'Unnamed IPO'}</div>
                          </div>
                        </div>
                        <Badge variant={ipoItem.ipo.ipo_type === 'Mainboard' ? 'default' : 'secondary'} className="text-xs font-bold flex-shrink-0 bg-[#0073E6] text-white">
                          {ipoItem.ipo.ipo_type || 'N/A'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500 mb-1 text-xs font-medium font-ibm-plex">Open Date</div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            <span className="text-xs font-medium font-ibm-plex text-gray-900">
                              {ipoItem.ipo.open_date || 'TBA'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1 text-xs font-medium font-ibm-plex">Close Date</div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            <span className="text-xs font-medium font-ibm-plex text-gray-900">
                              {ipoItem.ipo.closing_date || 'TBA'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500 mb-1 text-xs font-medium font-ibm-plex">Price Band</div>
                          <div className="font-black text-gray-900 text-xs font-ibm-plex">₹{ipoItem.ipo.price_band || 'TBA'}</div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1 text-xs font-medium font-ibm-plex">Issue Size</div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-3 w-3 text-gray-400 flex-shrink-0">₹</span>
                            <span className="font-black text-gray-900 text-xs font-ibm-plex">{ipoItem.ipo.ipo_size || 'TBA'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 flex-wrap">
                        {ipoItem._id && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-xs border-[#B4292E]/20 hover:bg-[#B4292E]/10 text-[#B4292E] font-bold"
                            onClick={() => router.push(`/analysis/${ipoItem._id}`)}
                          >
                            <LineChart className="h-3 w-3 mr-1" />
                            Analysis
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px]">
                    <thead className="bg-gray-50/80">
                      <tr className="border-b border-gray-200">
                        <th className="font-black text-left p-4 min-w-[200px] text-gray-900 font-ibm-plex">Company</th>
                        <th className="font-black text-left p-4 min-w-[100px] text-gray-900 font-ibm-plex">Type</th>
                        <th className="font-black text-left p-4 min-w-[120px] text-gray-900 font-ibm-plex">Open Date</th>
                        <th className="font-black text-left p-4 min-w-[120px] text-gray-900 font-ibm-plex">Close Date</th>
                        <th className="font-black text-left p-4 min-w-[120px] text-gray-900 font-ibm-plex">Price Band</th>
                        <th className="font-black text-left p-4 min-w-[120px] text-gray-900 font-ibm-plex">Issue Size</th>
                        <th className="font-black text-left p-4 min-w-[300px] text-gray-900 font-ibm-plex">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentIpos.map((ipoItem, index) => (
                        <tr key={ipoItem._id || index} className="group hover:bg-gray-50/80 transition-colors border-b border-gray-100">
                          <td className="font-medium p-4">
                            <div className="flex items-center gap-3">
                              {ipoItem.ipo.image_url ? (
                                <Avatar className="border-2 border-gray-100">
                                  <AvatarImage src={ipoItem.ipo.image_url} alt={`${ipoItem.ipo.upcoming_ipo_2025} logo`} />
                                  <AvatarFallback className="bg-[#0073E6]/10 text-[#0073E6] font-bold">IP</AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="p-2 rounded-lg bg-[#0073E6]/10 group-hover:bg-[#0073E6]/20 transition-colors flex-shrink-0">
                                  <Building2 className="h-5 w-5 text-[#0073E6]" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-black truncate text-gray-900 font-ibm-plex">{ipoItem.ipo.upcoming_ipo_2025 || 'Unnamed IPO'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={ipoItem.ipo.ipo_type === 'Mainboard' ? 'default' : 'secondary'} className="font-bold bg-[#0073E6] text-white">
                              {ipoItem.ipo.ipo_type || 'N/A'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-900 font-medium font-ibm-plex">
                                {ipoItem.ipo.open_date || 'TBA'}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-900 font-medium font-ibm-plex">
                                {ipoItem.ipo.closing_date || 'TBA'}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-black text-gray-900 font-ibm-plex">₹{ipoItem.ipo.price_band || 'TBA'}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-gray-900 font-ibm-plex">₹{ipoItem.ipo.ipo_size || 'TBA'}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              {ipoItem.ipo._id && !ipoItem.ipo.image_url && (
                                <label className="flex items-center">
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={(e) => handleLogoUpload(e, ipoItem.ipo._id!)}
                                    className="hidden"
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 px-3 text-sm border-primary/20 hover:bg-primary/10"
                                    asChild
                                  >
                                    <span>
                                      <Upload className="h-4 w-4 mr-1.5 text-primary" />
                                      Logo
                                    </span>
                                  </Button>
                                </label>
                              )}
                              {ipoItem.ipo._id && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 px-3 text-sm border-primary/20 hover:bg-primary/10"
                                  onClick={() => copyToClipboard(ipoItem.ipo._id!)}
                                >
                                  <Copy className="h-4 w-4 mr-1.5 text-primary" />
                                  ID
                                </Button>
                              )}
                              {ipoItem.ipo.detail_url && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 px-3 text-sm border-primary/20 hover:bg-primary/10"
                                  onClick={() => window.open(ipoItem.ipo.detail_url!, '_blank')}
                                >
                                  <Eye className="h-4 w-4 mr-1.5 text-primary" />
                                  View
                                </Button>
                              )}
                              {ipoItem.ipo.ipo_details?.rhp_draft_prospectus_links?.[0]?.href && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 px-3 text-sm border-green-600/20 hover:bg-green-600/10 dark:border-green-400/20 dark:hover:bg-green-400/10"
                                  onClick={() => window.open(ipoItem.ipo.ipo_details.rhp_draft_prospectus_links[0].href!, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4 mr-1.5 text-green-600 dark:text-green-400" />
                                  DHRP
                                </Button>
                              )}
                              {ipoItem.ipo.ipo_details?.drhp_draft_prospectus_links?.[0]?.href && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 px-3 text-sm border-green-600/20 hover:bg-green-600/10 dark:border-green-400/20 dark:hover:bg-green-400/10"
                                  onClick={() => window.open(ipoItem.ipo.ipo_details.drhp_draft_prospectus_links[0].href!, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4 mr-1.5 text-green-600 dark:text-green-400" />
                                  RHP
                                </Button>
                              )}
                              {ipoItem.ipo._id && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-9 px-3 text-sm border-primary/20 hover:bg-primary/10"
                                    >
                                      <PenTool className="h-4 w-4 mr-1.5 text-primary" />
                                      Blog
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleBlogClick(ipoItem.ipo._id!)}>
                                      <Plus className="h-4 w-4 mr-2" />
                                      Write New Blog
                                    </DropdownMenuItem>
                                    {getBlogsForIpo(ipoItem.ipo._id!).map((blog) => (
                                      <DropdownMenuItem key={blog._id} onClick={() => handleEditBlog(blog._id!)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit: {blog.title?.substring(0, 30)}...
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                              {ipoItem.ipo._id && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-9 px-3 text-sm border-primary/20 hover:bg-primary/10"
                                  onClick={() => router.push(`/analysis/${ipoItem.ipo._id}`)}
                                >
                                  <LineChart className="h-4 w-4 mr-1.5 text-red-600 dark:text-red-400" />
                                  Analysis
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <CardContent className="p-4 sm:p-6 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600 font-medium font-ibm-plex">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredIpos.length)} of {filteredIpos.length} IPOs
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 sm:h-9 px-3 border-gray-200 hover:bg-gray-50 font-bold font-ibm-plex"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max={totalPages}
                        defaultValue={currentPage}
                        onKeyDown={handleGoToPage}
                        className="w-16 h-8 sm:h-9 text-center border-gray-200 font-medium font-ibm-plex"
                      />
                      <span className="text-sm text-gray-600 font-medium font-ibm-plex">of {totalPages}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 sm:h-9 px-3 border-gray-200 hover:bg-gray-50 font-bold font-ibm-plex"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        {/* Refresh Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={isLoading}
            className="h-9 px-4 border-[#0073E6]/20 hover:bg-[#0073E6]/10 text-[#0073E6] font-bold font-ibm-plex"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            {isLoading ? "Refreshing..." : "Refresh Data"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-lg font-medium font-ibm-plex">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Admin() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminContent />
    </Suspense>
  )
}
