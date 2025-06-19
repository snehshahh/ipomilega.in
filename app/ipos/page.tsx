"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ExternalLink,
  Search,
  Filter,
  Download,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  FileText,
  XCircle,
  RefreshCw,
  LineChart,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"
import { Ipo } from "../models/ipo"
import { sortIPOsByOpeningDate } from "@/lib/dates"



export default function IPOs() {
  const [ipoList, setIpoList] = useState<Ipo[]>([])
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredIpos, setFilteredIpos] = useState<Ipo[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10


  useEffect(() => {
    const filtered = ipoList.filter(ipo =>
      ipo.upcoming_ipo_2025?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ipo.ipo_type?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    // Sort filtered IPOs by opening date in descending order
    const sortedFiltered = sortIPOsByOpeningDate(filtered, 'desc')
    
    setFilteredIpos(sortedFiltered)
    setCurrentPage(1)
  }, [searchQuery, ipoList])
  
  useEffect(() => {
    const fetchIpos = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin')
        if (!response.ok) {
          throw new Error('Failed to fetch IPO data')
        }
        const data = await response.json()
        
        // Sort IPOs by opening date when setting initial data
        const sortedIpos = sortIPOsByOpeningDate(data.ipos, 'desc')
        
        setIpoList(sortedIpos)
      } catch (error) {
        console.error('Error fetching IPO data:', error)
        setError('Failed to load IPO data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchIpos()
  }, [])

  const totalIpos = ipoList.length
  const mainboardCount = ipoList.filter(ipo => ipo.ipo_type === 'Mainboard').length
  const smeCount = ipoList.filter(ipo => ipo.ipo_type === 'SME').length
  const totalSize = ipoList.length > 0 ? `${ipoList.length * 1500}+ Cr` : '0 Cr'

  const dashboardStats = [
    {
      label: "Total IPOs",
      value: totalIpos.toString(),
      change: "+12%",
      description: "Active listings",
      icon: Building2,
      color: "text-primary",
    },
    {
      label: "Mainboard IPOs",
      value: mainboardCount.toString(),
      change: "+8%",
      description: "Large cap offerings",
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "SME IPOs",
      value: smeCount.toString(),
      change: "+15%",
      description: "Small & medium enterprises",
      icon: Activity,
      color: "text-primary",
    },
    {
      label: "Total Market Cap",
      value: totalSize,
      change: "+23%",
      description: "Combined issue size",
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
    },
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

  const handleViewBlogs = (ipoId: string) => {
    router.push(`/blogs/${ipoId}`)
  }

  const handleViewAnalysis = (ipoId: string) => {
    router.push(`/analysis/${ipoId}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-150"></div>
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-300"></div>
            </div>
            <div className="text-xl font-medium text-foreground">Loading IPO Dashboard...</div>
            <div className="text-sm text-muted-foreground">Fetching latest market data</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="border-destructive max-w-md w-full bg-background/60 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-destructive flex items-center justify-center gap-2">
                <Shield className="h-5 w-5" />
                Connection Error
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()} className="w-full bg-primary hover:bg-primary/90">
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent truncate">
                    IPO Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Explore Upcoming IPOs</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {dashboardStats.map((stat, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 sm:hover:scale-105 border-0 bg-background/60 backdrop-blur-sm"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <stat.icon className={cn("h-6 w-6 sm:h-8 sm:w-8", stat.color, "group-hover:scale-110 transition-transform")} />
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400"
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs sm:text-sm font-medium text-foreground">{stat.label}</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">{stat.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <Card className="border-0 bg-background/60 backdrop-blur-sm">
          <CardContent className="pt-5 sm:pt-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search IPOs by company name or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-background/50 text-sm sm:text-base h-10 sm:h-12"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  >
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-10 sm:h-12 border-primary/20 hover:bg-primary/10">
                  <Filter className="h-5 w-5 mr-2 text-primary" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none h-10 sm:h-12 border-primary/20 hover:bg-primary/10">
                  <Download className="h-5 w-5 mr-2 text-primary" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IPO Table */}
        <Card className="border-0 bg-background/60 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg sm:text-xl text-foreground">IPO Listings</CardTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  {filteredIpos.length} {filteredIpos.length === 1 ? 'IPO' : 'IPOs'} found
                  {searchQuery && ` for "${searchQuery}"`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium hidden sm:inline text-foreground">Live Data</span>
              </div>
            </div>
          </CardHeader>

          {filteredIpos.length === 0 ? (
            <CardContent className="py-10 sm:py-16 text-center p-4 sm:p-6">
              <div className="space-y-4">
                <div className="p-4 rounded-full bg-muted/50 w-12 h-12 sm:w-16 sm:h-16 mx-auto flex items-center justify-center">
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-medium text-foreground mb-2">
                    {searchQuery ? 'No IPOs found' : 'No IPOs available'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {searchQuery
                      ? `No results found for "${searchQuery}". Try different keywords.`
                      : 'No IPOs are currently listed.'
                    }
                  </p>
                </div>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery('')} className="border-primary/20 hover:bg-primary/10">
                    Clear Search
                  </Button>
                )}
              </div>
            </CardContent>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden">
                <div className="divide-y divide-border">
                  {currentIpos.map((ipo, index) => (
                    <div key={ipo._id?.toString() || index} className="p-4 sm:p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-base truncate text-foreground">{ipo.upcoming_ipo_2025 || 'Unnamed IPO'}</div>
                            <div className="text-sm text-muted-foreground">ID: {ipo._id?.toString().slice(-6) || 'N/A'}</div>
                          </div>
                        </div>
                        <Badge variant={ipo.ipo_type === 'Mainboard' ? 'default' : 'secondary'} className="text-xs font-medium">
                          {ipo.ipo_type || 'N/A'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1 text-xs">Open Date</div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {ipo.open_date && !isNaN(new Date(ipo.open_date).getTime())
                              ? new Date(ipo.open_date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                              })
                              : 'TBA'}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1 text-xs">Close Date</div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {ipo.closing_date && !isNaN(new Date(ipo.closing_date).getTime())
                              ? new Date(ipo.closing_date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                              })
                              : 'TBA'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1 text-xs">Price Band</div>
                          <div className="font-medium text-foreground">{ipo.price_band || 'TBA'}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1 text-xs">Issue Size</div>
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">{ipo.ipo_size || 'TBA'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 flex-wrap">

                        {ipo.detail_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 text-sm border-primary/20 hover:bg-primary/10"
                            onClick={() => window.open(ipo.detail_url!, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1.5 text-primary" />
                            Details
                          </Button>
                        )}
                        {ipo.rhp_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 text-sm border-green-600/20 hover:bg-green-600/10 dark:border-green-400/20 dark:hover:bg-green-400/10"
                            onClick={() => window.open(ipo.rhp_url!, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1.5 text-green-600 dark:text-green-400" />
                            RHP
                          </Button>
                        )}
                        {ipo._id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewBlogs(ipo._id!)}
                            className="h-9 px-3 text-sm border-primary/20 hover:bg-primary/10"
                          >
                            <FileText className="h-4 w-4 mr-1.5 text-primary" />
                            View Blogs
                          </Button>
                        )}
                        {ipo._id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAnalysis(ipo._id!)}
                            className="h-9 px-3 text-sm border-primary/20 hover:bg-primary/10"
                          >
                            <LineChart className="h-4 w-4 mr-1.5 text-primary" />
                            View Analysis
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/20">
                    <tr className="border-b border-t">
                      <th className="font-semibold text-left p-4 min-w-[200px] text-foreground">Company</th>
                      <th className="font-semibold text-left p-4 min-w-[100px] text-foreground">Type</th>
                      <th className="font-semibold text-left p-4 min-w-[120px] text-foreground">Open Date</th>
                      <th className="font-semibold text-left p-4 min-w-[120px] text-foreground">Close Date</th>
                      <th className="font-semibold text-left p-4 min-w-[120px] text-foreground">Price Band</th>
                      <th className="font-semibold text-left p-4 min-w-[120px] text-foreground">Issue Size</th>
                      <th className="font-semibold text-left p-4 min-w-[280px] text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentIpos.map((ipo, index) => (
                      <tr key={ipo._id?.toString() || index} className="group hover:bg-muted/30 transition-colors border-b">
                        <td className="font-medium p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate text-foreground">{ipo.upcoming_ipo_2025 || 'Unnamed IPO'}</div>
                              <div className="text-sm text-muted-foreground">ID: {ipo._id?.toString().slice(-6) || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={ipo.ipo_type === 'Mainboard' ? 'default' : 'secondary'} className="font-medium">
                            {ipo.ipo_type || 'N/A'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-foreground">
                              {ipo.open_date && !isNaN(new Date(ipo.open_date).getTime())
                                ? new Date(ipo.open_date).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                                : 'TBA'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-foreground">
                              {ipo.closing_date && !isNaN(new Date(ipo.closing_date).getTime())
                                ? new Date(ipo.closing_date).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                                : 'TBA'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-foreground">{ipo.price_band || 'TBA'}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium text-foreground">{ipo.ipo_size || 'TBA'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 flex-wrap">

                            {ipo.detail_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 px-3 border-primary/20 hover:bg-primary/10"
                                onClick={() => window.open(ipo.detail_url!, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-1.5 text-primary" />
                                Details
                              </Button>
                            )}
                            {ipo.rhp_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 px-3 border-green-600/20 hover:bg-green-600/10 dark:border-green-400/20 dark:hover:bg-green-400/10"
                                onClick={() => window.open(ipo.rhp_url!, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-1.5 text-green-600 dark:text-green-400" />
                                RHP
                              </Button>
                            )}
                            {ipo.slug && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewBlogs(ipo.slug || '')}
                                className="h-9 px-3 border-primary/20 hover:bg-primary/10"
                              >
                                <FileText className="h-4 w-4 mr-1.5 text-primary" />
                                View Blogs
                              </Button>
                            )}
                            {ipo._id && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewAnalysis(ipo._id!)}
                                className="h-9 px-3 border-primary/20 hover:bg-primary/10"
                              >
                                <LineChart className="h-4 w-4 mr-1.5 text-primary" />
                                View Analysis
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <CardContent className="py-4 p-4 sm:p-6 border-t bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-muted-foreground order-2 sm:order-1">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredIpos.length)} of {filteredIpos.length} IPOs
                  </div>
                  <div className="flex items-center gap-2 order-1 sm:order-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-10 px-4 border-primary/20 hover:bg-primary/10"
                    >
                      <ChevronLeft className="h-5 w-5 text-primary" />
                      <span className="hidden sm:inline ml-1">Previous</span>
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => totalPages <= 5 || page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
                        .map((page, idx, arr) => (
                          <span key={page}>
                            {idx > 0 && page - arr[idx - 1] > 1 && <span className="px-2 text-muted-foreground">...</span>}
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="h-10 w-10 border-primary/20 hover:bg-primary/10"
                            >
                              {page}
                            </Button>
                          </span>
                        ))}
                    </div>
                    <Input
                      type="number"
                      placeholder="Go to page"
                      defaultValue={currentPage}
                      onKeyDown={handleGoToPage}
                      className="w-24 h-10 px-3 text-center bg-background/50"
                      min={1}
                      max={totalPages}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-10 px-4 border-primary/20 hover:bg-primary/10"
                    >
                      <span className="hidden sm:inline mr-1">Next</span>
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </Button>
                  </div>
                </CardContent>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
