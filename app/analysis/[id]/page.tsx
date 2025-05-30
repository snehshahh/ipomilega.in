"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis"

export default function AnalysisPage() {
    const { id } = useParams()
    const [analysis, setAnalysis] = useState<IpoComprehensiveAnalysis | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const response = await fetch(`/api/analysis/${id}`)
        }
        
        setAnalysis(data.data);
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAnalysis();
    }
  }, [params.id]);

  const getSeverityColor = (severity: 'Low' | 'Medium' | 'High') => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Buy': return 'bg-green-100 text-green-800';
      case 'Buy': return 'bg-blue-100 text-blue-800';
      case 'Hold': return 'bg-yellow-100 text-yellow-800';
      case 'Sell': return 'bg-orange-100 text-orange-800';
      case 'Strong Sell': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="container mx-auto p-6 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Analysis Not Found</CardTitle>
            <CardDescription>The requested analysis could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/admin')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{analysis.company_name}</h1>
              <p className="text-muted-foreground">Comprehensive IPO Analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Key metrics and summary</CardDescription>
              </div>
              <div className={`px-4 py-2 rounded-full ${getRecommendationColor(analysis.final_recommendation.recommendation)}`}>
                {analysis.final_recommendation.recommendation}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Overall Score</div>
              <div className="flex items-center space-x-2">
                <Progress value={analysis.final_recommendation.overall_score * 10} className="h-2" />
                <span className="text-xl font-bold">
                  {analysis.final_recommendation.overall_score.toFixed(1)}/10
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Price Target</div>
              <div className="text-2xl font-bold">
                ₹{analysis.final_recommendation.price_target?.toLocaleString('en-IN') || 'N/A'}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Upside Potential</div>
              <div className="text-2xl font-bold text-green-600">
                {analysis.final_recommendation.upside_potential}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">P/E Ratio</div>
              <div className="text-xl font-medium">
                {analysis.valuation.pe_ratio}x
                <span className="text-sm text-muted-foreground ml-2">
                  (Industry: {analysis.valuation.industry_pe}x)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fundamentals & Valuation */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5" />
                Fundamentals
              </CardTitle>
              <CardDescription>{analysis.fundamentals.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Revenue</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">
                      ₹{analysis.fundamentals.revenue_details.total_revenue?.toLocaleString('en-IN') || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Revenue</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {analysis.fundamentals.revenue_details.revenue_cagr}%
                    </div>
                    <div className="text-sm text-muted-foreground">CAGR (3Y)</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Profitability</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">
                      {analysis.fundamentals.profit_analysis.profit_margin}%
                    </div>
                    <div className="text-sm text-muted-foreground">Profit Margin</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      ₹{analysis.fundamentals.profit_analysis.ebitda?.toLocaleString('en-IN') || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">EBITDA</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Financial Health</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Debt to Equity</span>
                    <span className="font-medium">
                      {analysis.fundamentals.assets_and_liabilities.debt_to_equity_ratio}x
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(analysis.fundamentals.assets_and_liabilities.debt_to_equity_ratio * 20, 100)} 
                    className="h-2" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Valuation
              </CardTitle>
              <CardDescription>{analysis.valuation.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Key Ratios</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>P/E Ratio</span>
                      <span className="font-medium">
                        {analysis.valuation.pe_ratio}x
                        <span className="text-muted-foreground ml-1">
                          (Ind: {analysis.valuation.industry_pe}x)
                        </span>
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((analysis.valuation.pe_ratio / analysis.valuation.industry_pe) * 100, 200)} 
                      className="h-2" 
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>P/B Ratio</span>
                      <span className="font-medium">
                        {analysis.valuation.pb_ratio}x
                        <span className="text-muted-foreground ml-1">
                          (Ind: {analysis.valuation.industry_pb}x)
                        </span>
                      </span>
                    </div>
                    <Progress 
                      value={Math.min((analysis.valuation.pb_ratio / analysis.valuation.industry_pb) * 100, 200)} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Price Target</h4>
                <div className="text-3xl font-bold text-primary">
                  ₹{analysis.final_recommendation.price_target?.toLocaleString('en-IN')}
                </div>
                <div className="text-green-600 font-medium">
                  {analysis.final_recommendation.upside_potential} upside
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Risk Assessment
            </CardTitle>
            <CardDescription>{analysis.risk_factors.summary}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {analysis.risk_factors.key_risks.map((risk, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{risk.category}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(risk.severity)}`}>
                      {risk.severity} Risk
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{risk.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Final Recommendation */}
        <Card className="border-l-4 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Final Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-2xl font-bold">
                    {analysis.final_recommendation.recommendation}
                  </div>
                  <div className="text-muted-foreground">
                    Based on comprehensive analysis
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    ₹{analysis.final_recommendation.price_target?.toLocaleString('en-IN')}
                  </div>
                  <div className="text-green-600 font-medium">
                    {analysis.final_recommendation.upside_potential} upside
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Key Highlights</h4>
                  <ul className="space-y-2">
                    {analysis.final_recommendation.key_highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Key Risks</h4>
                  <ul className="space-y-2">
                    {analysis.final_recommendation.risks.map((risk, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2">⚠</span>
                        <span className="text-sm">{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}