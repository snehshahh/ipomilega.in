"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Copy,
  ExternalLink,
  Loader2,
  Search,
  Filter,
  Download,
  RefreshCw,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  BarChart3,
  Users,
  Activity,
  Moon,
  Sun,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  PenTool,
  FileText,
  Menu,
  X
} from "lucide-react"
import { useRouter } from "next/navigation"

// Placeholder interface for Ipo
interface Ipo {
  _id?: string;
  upcoming_ipo_2025?: string;
  ipo_type?: string;
  open_date?: string;
  closing_date?: string;
  price_band?: string;
  ipo_size?: string;
  detail_url?: string;
  rhp_url?: string;
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const router = useRouter(); // Initialize useRouter hook

  // Use useEffect to apply the 'dark' class to the HTML element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsDark(!isDark)}
      className="rounded-full border border-border bg-background/80 backdrop-blur-sm"
      aria-label="Toggle theme"
    >
      <Sun className={`h-4 w-4 transition-all ${isDark ? '-rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
      <Moon className={`absolute h-4 w-4 transition-all ${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

// Sample data for demonstration
const sampleIpoData: Ipo[] = [
  {
    _id: "674a1b2c3d4e5f6789012345",
    upcoming_ipo_2025: "TechCorp India Ltd",
    ipo_type: "Mainboard",
    open_date: "2025-07-15",
    closing_date: "2025-07-18",
    price_band: "₹350-₹380",
    ipo_size: "₹2,500 Cr",
    detail_url: "/analysis/674a1b2c3d4e5f6789012345",
    rhp_url: "https://example.com/rhp1"
  },
  {
    _id: "674a1b2c3d4e5f6789012346",
    upcoming_ipo_2025: "Green Energy Solutions",
    ipo_type: "SME",
    open_date: "2025-06-20",
    closing_date: "2025-06-22",
    price_band: "₹120-₹140",
    ipo_size: "₹450 Cr",
    detail_url: "/analysis/674a1b2c3d4e5f6789012346",
    rhp_url: "https://example.com/rhp2"
  },
  {
    _id: "674a1b2c3d4e5f6789012347",
    upcoming_ipo_2025: "FinTech Innovations Pvt Ltd",
    ipo_type: "Mainboard",
    open_date: "2025-08-01",
    closing_date: "2025-08-05",
    price_band: "₹500-₹550",
    ipo_size: "₹3,200 Cr",
    detail_url: "/analysis/674a1b2c3d4e5f6789012347",
    rhp_url: "https://example.com/rhp3"
  },
  {
    _id: "674a1b2c3d4e5f6789012348",
    upcoming_ipo_2025: "BioPharm Discoveries",
    ipo_type: "Mainboard",
    open_date: "2025-09-10",
    closing_date: "2025-09-13",
    price_band: "₹600-₹630",
    ipo_size: "₹4,000 Cr",
    detail_url: "/analysis/674a1b2c3d4e5f6789012348",
    rhp_url: "https://example.com/rhp4"
  },
  {
    _id: "674a1b2c3d4e5f6789012349",
    upcoming_ipo_2025: "AgriTech Innovations",
    ipo_type: "SME",
    open_date: "2025-07-01",
    closing_date: "2025-07-03",
    price_band: "₹80-₹90",
    ipo_size: "₹200 Cr",
    detail_url: "/analysis/674a1b2c3d4e5f6789012349",
    rhp_url: "https://example.com/rhp5"
  },
  {
    _id: "674a1b2c3d4e5f6789012350",
    upcoming_ipo_2025: "Logistics Solutions Ltd",
    ipo_type: "Mainboard",
    open_date: "2025-08-20",
    closing_date: "2025-08-23",
    price_band: "₹280-₹300",
    ipo_size: "₹1,800 Cr",
    detail_url: "/analysis/674a1b2c3d4e5f6789012350",
    rhp_url: "https://example.com/rhp6"
  },
  {
    _id: "674a1b2c3d4e5f6789012351",
    upcoming_ipo_2025: "EduServe Technologies",
    ipo_type: "SME",
    open_date: "2025-09-05",
    closing_date: "2025-09-07",
    price_band: "₹150-₹160",
    ipo_size: "₹300 Cr",
    detail_url: "/analysis/674a1b2c3d4e5f6789012351",
    rhp_url: "https://example.com/rhp7"
  },
  {
    _id: "674a1b2c3d4e5f6789012352",
    upcoming_ipo_2025: "HealthCare Innovations",
    ipo_type: "Mainboard",
    open_date: "2025-10-01",
    closing_date: "2025-10-04",
    price_band: "₹700-₹750",
    ipo_size: "₹5,000 Cr",
    detail_url: "/analysis/674a1b2c3d4e5f6789012352",
    rhp_url: "https://example.com/rhp8"
  },
  {
    _id: "674a1b2c3d4e5f6789012353",
    upcoming_ipo_2025: "Digital Marketing Co.",
    ipo_type: "SME",
    open_date: "2025-07-25",
    closing_date: "2025-07-27",
    price_band: "₹95-₹105",
    ipo_size: "₹180 Cr",
    detail_url: "/analysis/674a1b2c3d4e5f6789012353",
    rhp_url: "https://example.com/rhp9"
  },
  {
    _id: "674a1b2c3d4e5f6789012354",
    upcoming_ipo_2025: "Renewable Systems Inc.",
    ipo_type: "Mainboard",
    open_date: "2025-11-15",
    closing_date: "2025-11-18",
    price_band: "₹400-₹420",
    ipo_size: "₹2,800 Cr",
    detail_url: "/analysis/674a1b2c3d4e5f6789012354",
    rhp_url: "https://example.com/rhp10"
  },
  {
    _id: "674a1b2c3d4e5f6789012355",
    upcoming_ipo_2025: "Cloud Solutions Ltd",
    ipo_type: "Mainboard",
    open_date: "2025-12-01",
    closing_date: "2025-12-04",
    price_band: "₹550-₹580",
    ipo_size: "₹3,500 Cr",
    detail_url: "/analysis/674a1b2c3d4e5f6789012355",
    rhp_url: "https://example.com/rhp11"
  },
  {
    _id: "674a1b2c3d4e5f6789012356",
    upcoming_ipo_2025: "E-commerce Hub",
    ipo_type: "SME",
    open_date: "2025-08-10",
    closing_date: "2025-08-12",
    price_band: "₹70-₹80",
    ipo_size: "₹150 Cr",
    detail_url: "/analysis/674a1b2c3d4e5f6789012356",
    rhp_url: "https://example.com/rhp12"
  },
]

export default function Admin() {
  const [ipoList, setIpoList] = useState<Ipo[]>(sampleIpoData)
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredIpos, setFilteredIpos] = useState<Ipo[]>(sampleIpoData)
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const itemsPerPage = 10

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // In a real app, you'd use toast here
    console.log("Copied to clipboard:", text)
  }

  const refreshData = () => {
    // In a real app, this would fetch fresh data
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      // Simulate data refresh (e.g., refetch from API)
      // setIpoList(updatedIpoData);
    }, 1000)
  }

  const handleBlogClick = (ipoId: string) => {
    router.push(`/blogs/${ipoId}/create-a-blog`)
  }

  useEffect(() => {
    const filtered = ipoList.filter(ipo =>
      ipo.upcoming_ipo_2025?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ipo.ipo_type?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredIpos(filtered)
    setCurrentPage(1) // Reset to first page on search
  }, [searchQuery, ipoList])

  // Calculate dashboard stats
  const totalIpos = ipoList.length
  const mainboardCount = ipoList.filter(ipo => ipo.ipo_type === 'Mainboard').length
  const smeCount = ipoList.filter(ipo => ipo.ipo_type === 'SME').length
  const totalSize = ipoList.length > 0 ? `${ipoList.length * 1500}+ Cr` : '0 Cr' // Placeholder for total size

  const dashboardStats = [
    {
      label: "Total IPOs",
      value: totalIpos.toString(),
      change: "+12%",
      description: "Active listings managed",
      icon: Building2,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      label: "Mainboard IPOs",
      value: mainboardCount.toString(),
      change: "+8%",
      description: "Large cap offerings",
      icon: TrendingUp,
      color: "text-green-600 dark:text-green-400"
    },
    {
      label: "SME IPOs",
      value: smeCount.toString(),
      change: "+15%",
      description: "Small & medium enterprises",
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      label: "Total Market Cap",
      value: totalSize,
      change: "+23%",
      description: "Combined issue size",
      icon: DollarSign,
      color: "text-orange-600 dark:text-orange-400"
    }
  ]

  // Pagination calculations
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
        // Optionally show an error or reset input
        e.currentTarget.value = currentPage.toString()
      }
    }
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
            <div className="text-xl font-medium">Loading IPO Dashboard...</div>
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
          <Card className="border-destructive max-w-md w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-destructive flex items-center justify-center gap-2">
                <Shield className="h-5 w-5" />
                Connection Error
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => window.location.reload()} className="w-full">
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
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent truncate">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">IPO Management Console</p>
                </div>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center space-x-3">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add IPO
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex sm:hidden items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="h-9 w-9"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mt-4 pt-4 border-t sm:hidden">
              <div className="flex flex-col space-y-2">
                <Button variant="outline" size="sm" onClick={refreshData} className="justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
                <Button size="sm" className="justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New IPO
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {dashboardStats.map((stat, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 bg-background/60 backdrop-blur-sm">
              <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color} group-hover:scale-110 transition-transform`} />
                  <Badge variant="secondary" className="text-xs font-medium">
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold">{stat.value}</div>
                  <div className="text-xs sm:text-sm font-medium">{stat.label}</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">{stat.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <Card className="border-0 bg-background/60 backdrop-blur-sm">
          <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search IPOs by company name or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                  <Download className="h-4 w-4 mr-2" />
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
                <CardTitle className="text-lg sm:text-xl">IPO Listings</CardTitle>
                <div className="text-sm text-muted-foreground mt-1">
                  {filteredIpos.length} {filteredIpos.length === 1 ? 'IPO' : 'IPOs'} found
                  {searchQuery && ` for "${searchQuery}"`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium hidden sm:inline">Live Data</span>
              </div>
            </div>
          </CardHeader>

          {filteredIpos.length === 0 ? (
            <CardContent className="py-8 sm:py-16 text-center p-4 sm:p-6">
              <div className="space-y-4">
                <div className="p-4 rounded-full bg-muted/50 w-12 h-12 sm:w-16 sm:h-16 mx-auto flex items-center justify-center">
                  <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-medium mb-2">
                    {searchQuery ? 'No IPOs found' : 'No IPOs in database'}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {searchQuery
                      ? `No results found for "${searchQuery}". Try different keywords.`
                      : 'Start by adding your first IPO to the system.'
                    }
                  </p>
                </div>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                )}
              </div>
            </CardContent>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="block sm:hidden">
                <div className="divide-y">
                  {currentIpos.map((ipo, index) => (
                    <div key={ipo._id?.toString() || index} className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">{ipo.upcoming_ipo_2025 || 'Unnamed IPO'}</div>
                            <div className="text-xs text-muted-foreground">ID: {ipo._id?.toString().slice(-6) || 'N/A'}</div>
                          </div>
                        </div>
                        <Badge variant={ipo.ipo_type === 'Mainboard' ? 'default' : 'secondary'} className="text-xs">
                          {ipo.ipo_type || 'N/A'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="text-muted-foreground mb-1">Open Date</div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {ipo.open_date && !isNaN(new Date(ipo.open_date).getTime())
                              ? new Date(ipo.open_date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short'
                              })
                              : 'TBA'}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Close Date</div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {ipo.closing_date && !isNaN(new Date(ipo.closing_date).getTime())
                              ? new Date(ipo.closing_date).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short'
                              })
                              : 'TBA'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="text-muted-foreground mb-1">Price Band</div>
                          <div className="font-medium">{ipo.price_band || 'TBA'}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Issue Size</div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{ipo.ipo_size || 'TBA'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 pt-2">
                        {ipo._id && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs hover:bg-primary/10 hover:border-primary/20"
                            onClick={() => copyToClipboard(ipo._id!)} // Use ! to assert non-null
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            ID
                          </Button>
                        )}
                        {ipo.detail_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950"
                            onClick={() => window.open(ipo.detail_url!, '_blank')} // Add onClick for navigation
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        )}
                        {ipo.rhp_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950"
                            onClick={() => window.open(ipo.rhp_url!, '_blank')} // Add onClick for navigation
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            RHP
                          </Button>
                        )}
                        {ipo._id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBlogClick(ipo._id!)}
                            className="h-7 px-2 text-xs hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-950"
                          >
                            <PenTool className="h-3 w-3 mr-1" />
                            Blog
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
                    <tr className="border-b">
                      <th className="font-semibold text-left p-4 min-w-[200px]">Company</th>
                      <th className="font-semibold text-left p-4 min-w-[100px]">Type</th>
                      <th className="font-semibold text-left p-4 min-w-[120px]">Open Date</th>
                      <th className="font-semibold text-left p-4 min-w-[120px]">Close Date</th>
                      <th className="font-semibold text-left p-4 min-w-[120px]">Price Band</th>
                      <th className="font-semibold text-left p-4 min-w-[120px]">Issue Size</th>
                      <th className="font-semibold text-left p-4 min-w-[280px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentIpos.map((ipo, index) => (
                      <tr key={ipo._id?.toString() || index} className="group hover:bg-muted/30 transition-colors border-b">
                        <td className="font-medium p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <Building2 className="h-4 w-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate">{ipo.upcoming_ipo_2025 || 'Unnamed IPO'}</div>
                              <div className="text-xs text-muted-foreground">ID: {ipo._id?.toString().slice(-6) || 'N/A'}</div>
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
                            <span className="text-sm">
                              {ipo.open_date && !isNaN(new Date(ipo.open_date).getTime())
                                ? new Date(ipo.open_date).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })
                                : 'TBA'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm">
                              {ipo.closing_date && !isNaN(new Date(ipo.closing_date).getTime())
                                ? new Date(ipo.closing_date).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })
                                : 'TBA'}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{ipo.price_band || 'TBA'}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium">{ipo.ipo_size || 'TBA'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 flex-wrap">
                            {ipo._id && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 hover:bg-primary/10 hover:border-primary/20"
                                onClick={() => copyToClipboard(ipo._id!)}
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                ID
                              </Button>
                            )}
                            {ipo.detail_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950"
                                onClick={() => window.open(ipo.detail_url!, '_blank')} // Add onClick for navigation
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            )}
                            {ipo.rhp_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-2 hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950"
                                onClick={() => window.open(ipo.rhp_url!, '_blank')} // Add onClick for navigation
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                RHP
                              </Button>
                            )}
                            {ipo._id && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/blogs/${ipo._id}/create-a-blog`)}
                                className="h-8 px-2 hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-950"
                              >
                                <PenTool className="h-3 w-3 mr-1" />
                                Blog
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
                      className="h-8 px-3"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Previous</span>
                    </Button>
                    <div className="flex items-center gap-1">
                      {/* Render page numbers around the current page */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
                        .map((page, idx, arr) => (
                          <span key={page}>
                            {idx > 0 && page - arr[idx - 1] > 1 && <span className="px-1 text-muted-foreground">...</span>}
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="h-8 w-8"
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
                      className="w-24 h-8 px-3 text-center"
                      min={1}
                      max={totalPages}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 px-3"
                    >
                      <span className="hidden sm:inline mr-1">Next</span>
                      <ChevronRight className="h-4 w-4" />
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