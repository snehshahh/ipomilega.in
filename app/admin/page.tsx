"use client"

import { Ipo } from "@/app/models/ipo"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, ExternalLink, Loader2 } from "lucide-react"
import { toast } from "react-toastify"

export default function Admin() {
  const [ipoList, setIpoList] = useState<Ipo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("<div>Copy to clipboard</div>")
  }

  useEffect(() => {
    const fetchIpoList = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/admin")
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch data')
        }
        
        setIpoList(data.ipos || [])
      } catch (err) {
        console.error('Error fetching IPOs:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchIpoList()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-150"></div>
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-300"></div>
          <span className="ml-2 text-lg">Loading IPOs...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          {ipoList.length} {ipoList.length === 1 ? 'IPO' : 'IPOs'} found
        </div>
      </div>
      
      {ipoList.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No IPOs found in the database.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Open Date</TableHead>
                <TableHead>Close Date</TableHead>
                <TableHead>Price Band</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ipoList.map((ipo) => (
                <TableRow key={ipo._id?.toString()}>
                  <TableCell className="font-medium">
                    {ipo.upcoming_ipo_2025 || 'Unnamed IPO'}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground">
                      {ipo.ipo_type || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {ipo.open_date ? new Date(ipo.open_date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {ipo.closing_date ? new Date(ipo.closing_date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>{ipo.price_band || 'N/A'}</TableCell>
                  <TableCell>{ipo.ipo_size || 'N/A'}</TableCell>
                  <TableCell className="space-x-2">
                    {ipo._id && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => copyToClipboard(ipo._id!.toString())}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        ID
                      </Button>
                    )}
                    {ipo.detail_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        asChild
                      >
                        <a 
                          href={`/analysis/${ipo._id?.toString()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View
                        </a>
                      </Button>
                    )}
                    {ipo.rhp_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => copyToClipboard(ipo.rhp_url!)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        RHP
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}