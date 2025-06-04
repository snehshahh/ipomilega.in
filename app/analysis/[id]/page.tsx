"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BarChart2, TrendingUp, Activity, PieChart, Shield, Clock, Target, Building2, DollarSign, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

export default function AnalysisPage() {
    const { id } = useParams()
    const router = useRouter()
    const [analysis, setAnalysis] = useState<IpoComprehensiveAnalysis | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                setIsLoading(true)
                setError(null)
                const response = await fetch(`/api/analysis/${id}`)
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json()
                setAnalysis(data.ipos_analysis)
            } catch (err) {
                console.error('Error fetching analysis:', err)
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            fetchAnalysis();
        }
    }, [id]);

    const getScoreColor = (score: number) => {
        if (score >= 8) return 'text-green-400';
        if (score >= 6) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getRiskColor = (score: number) => {
        if (score >= 8) return 'text-red-400';
        if (score >= 6) return 'text-yellow-400';
        return 'text-green-400';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="container mx-auto p-6 space-y-6">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full bg-gray-800" />
                        <Skeleton className="h-10 w-48 bg-gray-800" />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-40 w-full rounded-lg bg-gray-800" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="container mx-auto p-6 text-center">
                    <Card className="max-w-2xl mx-auto bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-red-400">Error</CardTitle>
                            <CardDescription className="text-gray-400">{error}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => window.location.reload()} className="bg-white text-black hover:bg-gray-200">
                                Retry
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="min-h-screen bg-black text-white">
                <div className="container mx-auto p-6 text-center">
                    <Card className="max-w-2xl mx-auto bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-white">Analysis Not Found</CardTitle>
                            <CardDescription className="text-gray-400">The requested analysis could not be found.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => router.push('/admin')} className="bg-white text-black hover:bg-gray-200">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gray-900 shadow-xl border-b border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center space-x-4">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => router.back()}
                            className="border-gray-700 text-white hover:bg-gray-800"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-white">{analysis.company_name}</h1>
                            <p className="text-gray-400 text-lg">Comprehensive IPO Analysis</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Key Metrics Overview */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Overall Score</p>
                                    <p className={`text-3xl font-bold ${getScoreColor((analysis.summary_metrics.fundamentals_score + analysis.summary_metrics.performance_score) / 2)}`}>
                                        {((analysis.summary_metrics.fundamentals_score + analysis.summary_metrics.performance_score) / 2).toFixed(1)}/10
                                    </p>
                                </div>
                                <Target className="h-8 w-8 text-gray-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Issue Size</p>
                                    <p className="text-2xl font-bold text-white">{analysis.ipo_details.issue_size}</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-gray-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Price Band</p>
                                    <p className="text-2xl font-bold text-white">{analysis.ipo_details.price_band}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-gray-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Gains Potential</p>
                                    <p className="text-2xl font-bold text-green-400">{analysis.ipo_details.approximate_gains_potential}%</p>
                                </div>
                                <Zap className="h-8 w-8 text-gray-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Analysis Grid */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Fundamentals */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <Building2 className="mr-3 h-6 w-6" />
                                Fundamentals
                                <span className={`ml-auto text-2xl font-bold ${getScoreColor(analysis.fundamentals.score)}`}>
                                    {analysis.fundamentals.score}/10
                                </span>
                            </CardTitle>
                            <CardDescription className="text-gray-400">{analysis.fundamentals.summary}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Total Revenue</p>
                                    <p className="text-xl font-bold text-white">
                                        ₹{(analysis.fundamentals.revenue_details.total_revenue / 10000000).toFixed(1)}Cr
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Revenue CAGR</p>
                                    <p className="text-xl font-bold text-green-400">{analysis.fundamentals.revenue_details.revenue_cagr}%</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Net Profit</p>
                                    <p className="text-xl font-bold text-white">
                                        ₹{(analysis.fundamentals.profit_analysis.net_profit / 10000000).toFixed(1)}Cr
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Profit Margin</p>
                                    <p className="text-xl font-bold text-green-400">{analysis.fundamentals.profit_analysis.profit_margin}%</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-400 text-sm mb-2">Debt to Equity</p>
                                <div className="flex items-center space-x-3">
                                    <Progress value={Math.min(analysis.fundamentals.assets_and_liabilities.debt_to_equity_ratio * 20, 100)} className="flex-1 h-2" />
                                    <span className="text-white font-medium">{analysis.fundamentals.assets_and_liabilities.debt_to_equity_ratio}x</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Risk Assessment */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <Shield className="mr-3 h-6 w-6" />
                                Risk Meter
                                <span className={`ml-auto text-2xl font-bold ${getRiskColor(analysis.risk_meter.score)}`}>
                                    {analysis.risk_meter.score}/10
                                </span>
                            </CardTitle>
                            <CardDescription className="text-gray-400">{analysis.risk_meter.summary}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.entries(analysis.risk_meter.risk_categories).map(([category, risks]) => (
                                <div key={category} className="border border-gray-800 rounded-lg p-4">
                                    <h4 className="font-medium text-white capitalize mb-2">
                                        {category.replace('_', ' ')}
                                    </h4>
                                    <ul className="space-y-1">
                                        {risks.slice(0, 2).map((risk, index) => (
                                            <li key={index} className="text-sm text-gray-400 flex items-start">
                                                <span className="text-red-400 mr-2">•</span>
                                                {risk}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Performance & Flexibility */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Performance */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <BarChart2 className="mr-3 h-6 w-6" />
                                Performance
                                <span className={`ml-auto text-2xl font-bold ${getScoreColor(analysis.performance.score)}`}>
                                    {analysis.performance.score}/10
                                </span>
                            </CardTitle>
                            <CardDescription className="text-gray-400">{analysis.performance.summary}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium text-white mb-2">Management Quality</h4>
                                <div className="flex items-center space-x-3 mb-2">
                                    <Progress value={analysis.performance.management_quality.score * 10} className="flex-1 h-2" />
                                    <span className="text-white font-medium">{analysis.performance.management_quality.score}/10</span>
                                </div>
                                <p className="text-sm text-gray-400">{analysis.performance.management_quality.experience}</p>
                            </div>

                            <div>
                                <h4 className="font-medium text-white mb-2">Key Achievements</h4>
                                <ul className="space-y-1">
                                    {analysis.performance.key_achievements.slice(0, 3).map((achievement, index) => (
                                        <li key={index} className="text-sm text-gray-400 flex items-start">
                                            <span className="text-green-400 mr-2">✓</span>
                                            {achievement}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Flexibility */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <Activity className="mr-3 h-6 w-6" />
                                Flexibility
                                <span className={`ml-auto text-2xl font-bold ${getScoreColor(analysis.flexibility.score)}`}>
                                    {analysis.flexibility.score}/10
                                </span>
                            </CardTitle>
                            <CardDescription className="text-gray-400">{analysis.flexibility.summary}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-400">Market Adaptability</span>
                                        <span className="text-sm font-medium text-white">{analysis.flexibility.market_adaptability.score}/10</span>
                                    </div>
                                    <Progress value={analysis.flexibility.market_adaptability.score * 10} className="h-2" />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-400">Financial Stability</span>
                                        <span className="text-sm font-medium text-white">{analysis.flexibility.financial_stability.score}/10</span>
                                    </div>
                                    <Progress value={analysis.flexibility.financial_stability.score * 10} className="h-2" />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-400">Operational Agility</span>
                                        <span className="text-sm font-medium text-white">{analysis.flexibility.operational_agility.score}/10</span>
                                    </div>
                                    <Progress value={analysis.flexibility.operational_agility.score * 10} className="h-2" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Timeline & IPO Details */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Timeline */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <Clock className="mr-3 h-6 w-6" />
                                Timeline
                                <span className={`ml-auto text-2xl font-bold ${getScoreColor(analysis.time.score)}`}>
                                    {analysis.time.score}/10
                                </span>
                            </CardTitle>
                            <CardDescription className="text-gray-400">{analysis.time.summary}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Issue Dates</p>
                                    <p className="text-white font-medium">
                                        {analysis.time.issue_dates.opening} - {analysis.time.issue_dates.closing}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Expected Listing</p>
                                    <p className="text-white font-medium">{analysis.time.listing_details.expected_date}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Exchanges</p>
                                    <p className="text-white font-medium">{analysis.time.listing_details.exchanges.join(', ')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* IPO Details */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="flex items-center text-white">
                                <PieChart className="mr-3 h-6 w-6" />
                                IPO Allocation
                            </CardTitle>
                            <CardDescription className="text-gray-400">Share allocation breakdown</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-400">Retail Investors</span>
                                        <span className="text-sm font-medium text-white">{analysis.ipo_details.allocation_details.retail}%</span>
                                    </div>
                                    <Progress value={analysis.ipo_details.allocation_details.retail} className="h-2" />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-400">QIB</span>
                                        <span className="text-sm font-medium text-white">{analysis.ipo_details.allocation_details.qib}%</span>
                                    </div>
                                    <Progress value={analysis.ipo_details.allocation_details.qib} className="h-2" />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-gray-400">NII</span>
                                        <span className="text-sm font-medium text-white">{analysis.ipo_details.allocation_details.nii}%</span>
                                    </div>
                                    <Progress value={analysis.ipo_details.allocation_details.nii} className="h-2" />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-800">
                                <p className="text-gray-400 text-sm">Lot Size</p>
                                <p className="text-2xl font-bold text-white">{analysis.ipo_details.lot_size} shares</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Final Summary */}
                <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white">Investment Summary</CardTitle>
                        <CardDescription className="text-gray-400">
                            {analysis.ipo_details.gains_rationale}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="text-center">
                                <p className="text-gray-400 text-sm mb-2">Profitability Score</p>
                                <p className={`text-4xl font-bold ${getScoreColor(analysis.ipo_details.profitability_of_allotment.score)}`}>
                                    {analysis.ipo_details.profitability_of_allotment.score}/10
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-400 text-sm mb-2">Potential Gains</p>
                                <p className="text-4xl font-bold text-green-400">
                                    {analysis.ipo_details.approximate_gains_potential}%
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-400 text-sm mb-2">Assessment</p>
                                <p className="text-lg font-medium text-white">
                                    {analysis.ipo_details.profitability_of_allotment.assessment}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}