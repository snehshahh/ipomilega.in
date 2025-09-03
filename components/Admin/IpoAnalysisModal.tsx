import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    Plus,
    ChevronRight,
    ChevronLeft,
    CheckCircle,
    AlertTriangle,
    LineChart,
    Shield,
    Activity,
    Clock,
    TrendingUp,
    Save,
    Copy,
    ExternalLink,
    Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Ipo } from '@/app/models/ipo';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

// Type definitions for analysis data
interface RiskAnalysis {
    score: number;
    summary: string;
    key_risks: string[];
    risk_categories: {
        financial_risks: string[];
        market_risks: string[];
        operational_risks: string[];
        regulatory_risks: string[];
    };
    risk_mitigation: string;
}

interface PerformanceAnalysis {
    score: number;
    summary: string;
    historical_growth: {
        pattern: string;
        rate: string;
        consistency: string;
    };
    key_achievements: string[];
    management_quality: {
        experience: string;
        track_record: string;
        score: number;
    };
    market_comparison: string;
    future_potential: {
        growth_forecast: string;
        upcoming_projects: string[];
    };
    consistency_analysis: {
        operational_years: number;
        revenue_stability: string;
        rationale: string;
    };
}

interface FlexibilityAnalysis {
    score: number;
    summary: string;
    market_adaptability: {
        score: number;
        description: string;
    };
    financial_stability: {
        score: number;
        description: string;
    };
    operational_agility: {
        score: number;
        description: string;
    };
    product_diversification: string;
    pivoting_history: string[];
    future_adaptability_potential: string;
}

interface FundamentalsAnalysis {
    score: number;
    summary: string;
    market_position: string;
    business_model: string;
    revenue_details: {
        total_revenue: number;
        revenue_cagr: number;
        revenue_trend: string;
    };
    profit_analysis: {
        net_profit: number;
        profit_margin: number;
        ebitda: number | null;
        profit_trend: string;
    };
    assets_and_liabilities: {
        total_assets: number;
        total_liabilities: number | null;
        debt_to_equity_ratio: number | null;
    };
    financial_ratios: {
        current_ratio: string | null;
        quick_ratio: string | null;
        return_on_equity: string | null;
    };
}

interface TimeAnalysis {
    score: number;
    summary: string;
    issue_dates: {
        opening: string;
        closing: string;
    };
    listing_details: {
        expected_date: string;
        exchanges: string[];
    };
    allotment_timeline: {
        date: string;
        process: string;
    };
    key_milestones: Array<{
        date: string;
        event: string;
    }>;
    market_timing_assessment: string;
    time_to_market: {
        score: number;
        rationale: string;
    };
}

interface SummaryAnalysis {
    approximate_gains_potential: number;
    gains_rationale: string;
    profitability_of_allotment: {
        score: number;
        assessment: string;
    };
}


// Analysis data type union
type AnalysisDataType = RiskAnalysis | PerformanceAnalysis | FlexibilityAnalysis | FundamentalsAnalysis | TimeAnalysis | SummaryAnalysis;

// Complete analysis data interface
interface AnalysisData {
    risk_meter?: RiskAnalysis;
    performance?: PerformanceAnalysis;
    flexibility?: FlexibilityAnalysis;
    fundamentals?: FundamentalsAnalysis;
    time?: TimeAnalysis;
    summary?: SummaryAnalysis;
}

// Updated prompts to include summary
const analysisPrompts = {
    risk_meter: `**CRITICAL: Do not mention page numbers. Keep all summaries and descriptions under 20 words.** Analyze risk factors for this IPO.

RISK FACTORS TEXT (RHP): READ THE REFERENCE FROM THE PDF
SCRAPED DATA CONTEXT: READ THE REFERENCE FROM THE PDF

Return JSON with this exact structure:
{
  "score": number (1-10, lower is better),
  "summary": "string (A summary explaining risk severity. Max 20 words.)",
  "key_risks": ["array of 5-7 significant risk strings"],
  "risk_categories": {
    "financial_risks": ["array of financial risk strings"],
    "market_risks": ["array of market/competition risk strings"],
    "operational_risks": ["array of operational risk strings"],
    "regulatory_risks": ["array of regulatory risk strings"]
  },
  "risk_mitigation": "string (Describe risk mitigation strategies. Max 20 words.)"
}`,

    performance: `**CRITICAL: Do not mention page numbers. Keep all summaries and descriptions under 20 words.** Analyze the performance.

PERFORMANCE INFORMATION (RHP): READ THE REFERENCE FROM THE PDF
SCRAPED PERFORMANCE DATA: READ THE REFERENCE FROM THE PDF

Return JSON with this exact structure:
{
  "score": number (1-10),
  "summary": "string (A summary comparing to competitors. Max 20 words.)",
  "historical_growth": {
    "pattern": "string (e.g., 'Exponential', 'Stable')",
    "rate": "string (e.g., '10% annual growth')",
    "consistency": "string (e.g., 'High', 'Variable')"
  },
  "key_achievements": ["array of significant achievement strings"],
  "management_quality": {
    "experience": "string (Describe management experience. Max 20 words.)",
    "track_record": "string (Describe management track record. Max 20 words.)",
    "score": number (1-10)
  },
  "market_comparison": "string (Compare to industry peers. Max 20 words.)",
  "future_potential": {
    "growth_forecast": "string (Describe growth prospects. Max 20 words.)",
    "upcoming_projects": ["array of upcoming initiative strings"]
  },
  "consistency_analysis": {
    "operational_years": number,
    "revenue_stability": "string describing revenue stability",
    "rationale": "string (Explain consistency rationale. Max 20 words.)"
  }
}`,

    flexibility: `**CRITICAL: Do not mention page numbers. Keep all summaries and descriptions under 20 words.** Analyze flexibility.

FLEXIBILITY INFORMATION (RHP): READ THE REFERENCE FROM THE PDF
SCRAPED DATA CONTEXT: READ THE REFERENCE FROM THE PDF

Return JSON with this exact structure:
{
  "score": number (1-10),
  "summary": "string (A summary comparing adaptability. Max 20 words.)",
  "market_adaptability": {
    "score": number (1-10),
    "description": "string (Describe market adaptation ability. Max 20 words.)"
  },
  "financial_stability": {
    "score": number | null,
    "description": "string | null (Describe financial stability. Max 20 words.)"
  },
  "operational_agility": {
    "score": number (1-10),
    "description": "string (Describe operational flexibility. Max 20 words.)"
  },
  "product_diversification": "string (Describe product diversification. Max 20 words.)",
  "pivoting_history": ["array of historical pivot strings"],
  "future_adaptability_potential": "string (Describe future adaptation potential. Max 20 words.)"
}`,

    fundamentals: `**CRITICAL: Do not mention page numbers. Keep all summaries and descriptions under 20 words.** Analyze financial fundamentals.

FINANCIAL DATA FROM RHP: READ THE REFERENCE FROM THE PDF
SCRAPED FINANCIAL DATA: READ THE REFERENCE FROM THE PDF
BUSINESS DESCRIPTION: READ THE REFERENCE FROM THE PDF

Return JSON with this exact structure:
{
  "score": number (1-10),
  "summary": "string (Explain financial strengths/weaknesses. Max 20 words.)",
  "market_position": "string (Describe market position. Max 20 words.)",
  "business_model": "string (Describe business model. Max 20 words.)",
  "revenue_details": {
    "total_revenue": number (in millions, numerical value only),
    "revenue_cagr": number (percentage as number, e.g., 15.5),
    "revenue_trend": "string describing revenue trend"
  },
  "profit_analysis": {
    "net_profit": number (in millions, numerical value only),
    "profit_margin": number (percentage as number, e.g., 12.5),
    "ebitda": number | null,
    "profit_trend": "string describing profit trend"
  },
  "assets_and_liabilities": {
    "total_assets": number (in millions, numerical value only),
    "total_liabilities": number | null,
    "debt_to_equity_ratio": number | null
  },
  "financial_ratios": {
    "current_ratio": "string | null (e.g., '1.5:1')",
    "quick_ratio": "string | null (e.g., '1.2:1')",
    "return_on_equity": "string | null (e.g., '15%')"
  }
}`,

    time: `**CRITICAL: Do not mention page numbers. Keep all summaries and descriptions under 20 words.** Analyze timing. Use YYYY-MM-DD for dates.

TIME INFORMATION (RHP): READ THE REFERENCE FROM THE PDF
SCRAPED TIME DATA: READ THE REFERENCE FROM THE PDF

Return JSON with this exact structure:
{
  "score": number (1-10),
  "summary": "string (Explain timing favorability. Max 20 words.)",
  "issue_dates": {
    "opening": "string (YYYY-MM-DD format)",
    "closing": "string (YYYY-MM-DD format)"
  },
  "listing_details": {
    "expected_date": "string (YYYY-MM-DD format)",
    "exchanges": ["array of exchange name strings"]
  },
  "allotment_timeline": {
    "date": "string (YYYY-MM-DD format)",
    "process": "string (Describe allotment process. Max 20 words.)"
  },
  "key_milestones": [
    {
      "date": "string (YYYY-MM-DD format)",
      "event": "string describing milestone event"
    }
  ],
  "market_timing_assessment": "string (Assess current market conditions. Max 20 words.)",
  "time_to_market": {
    "score": number (1-10),
    "rationale": "string (Explain timing score rationale. Max 20 words.)"
  }
}`,
    summary: `**CRITICAL: Do not mention page numbers. Keep all descriptions under 20 words.** Provide a final investment summary.

ALL PREVIOUS ANALYSIS CONTEXT: Use the analysis you've already generated for other sections.
SCRAPED GMP/GAINS DATA: READ THE REFERENCE FROM THE PDF

Return JSON with this exact structure:
{
  "approximate_gains_potential": number (percentage as number, e.g., 25.5),
  "gains_rationale": "string (Briefly explain gain potential. Max 20 words.)",
  "profitability_of_allotment": {
    "score": number (1-10, based on overall analysis),
    "assessment": "string (e.g., 'High probability of gains due to strong fundamentals.') (Max 20 words.)"
  }
}`
};

interface AnalysisStep {
    id: keyof typeof analysisPrompts;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    required: boolean;
}

interface IpoAnalysisModalProps {
    ipoItem: {
        _id: string;
        ipo: Ipo;
    };
    onAnalysisAdded: () => void;
}

// Added 'summary' to analysis steps
const analysisSteps: AnalysisStep[] = [
    { id: 'risk_meter', title: 'Risk Analysis', description: 'Evaluate potential risks and mitigation strategies.', icon: Shield, color: 'text-red-600', required: true },
    { id: 'performance', title: 'Performance', description: 'Analyze historical growth and achievements.', icon: TrendingUp, color: 'text-green-600', required: true },
    { id: 'flexibility', title: 'Flexibility', description: 'Assess market adaptability and agility.', icon: Activity, color: 'text-blue-600', required: true },
    { id: 'fundamentals', title: 'Fundamentals', description: 'Review financial health and ratios.', icon: LineChart, color: 'text-purple-600', required: true },
    { id: 'time', title: 'Time Analysis', description: 'Check market timing and milestones.', icon: Clock, color: 'text-orange-600', required: true },
    { id: 'summary', title: 'Investment Summary', description: 'Provide final verdict and gain potential.', icon: CheckCircle, color: 'text-indigo-600', required: true }
];

export function IpoAnalysisModal({ ipoItem, onAnalysisAdded }: IpoAnalysisModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [analysisData, setAnalysisData] = useState<AnalysisData>({});
    const [jsonInput, setJsonInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const [jsonError, setJsonError] = useState<string | null>(null);

    const currentStepData = analysisSteps[currentStep];
    const isLastStep = currentStep === analysisSteps.length - 1;

    // Get RHP and DRHP links from the correct ipo_details structure
    const rhpLink = ipoItem.ipo.ipo_details?.rhp_draft_prospectus_links?.[0]?.href;
    const drhpLink = ipoItem.ipo.ipo_details?.drhp_draft_prospectus_links?.[0]?.href;

    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setAnalysisData({});
            setJsonInput('');
            setCompletedSteps(new Set());
            setJsonError(null);
            setIsSubmitting(false);
        }
    }, [isOpen]);

    // Auto-load data when step changes
    useEffect(() => {
        const stepId = analysisSteps[currentStep].id;
        const stepData = analysisData[stepId as keyof AnalysisData];
        if (stepData) {
            setJsonInput(JSON.stringify(stepData, null, 2));
        } else {
            setJsonInput('');
        }
        setJsonError(null);
    }, [currentStep, analysisData]);

    const validateJson = (jsonString: string): { isValid: boolean; data?: AnalysisDataType; error?: string } => {
        if (!jsonString.trim()) {
            return { isValid: false, error: 'JSON data cannot be empty.' };
        }
        try {
            const data = JSON.parse(jsonString) as AnalysisDataType;
            return { isValid: true, data };
        } catch (error) {
            return { isValid: false, error: `Invalid JSON format: ${error instanceof Error ? error.message : 'Unknown error'}` };
        }
    };

    const handleJsonChange = (value: string) => {
        setJsonInput(value);
        if (jsonError) setJsonError(null);
    };

    const copyPromptToClipboard = () => {
        navigator.clipboard.writeText(analysisPrompts[currentStepData.id]);
        toast.success(`Prompt for "${currentStepData.title}" copied!`);
    };

    const saveCurrentStep = (input: string) => {
        const validation = validateJson(input);
        if (validation.isValid && validation.data) {
            const stepId = currentStepData.id;
            setAnalysisData(prev => ({ ...prev, [stepId as keyof AnalysisData]: validation.data }));
            setCompletedSteps(prev => new Set(prev).add(stepId));
            setJsonError(null);
            return true;
        } else {
            setJsonError(validation.error || 'Invalid JSON');
            return false;
        }
    };

    const navigateStep = (direction: 'next' | 'prev' | 'skip') => {
        let isSaved = true;
        if (jsonInput.trim()) {
            isSaved = saveCurrentStep(jsonInput);
        } else if (currentStepData.required) {
            // If required and empty, clear the completed status
            setCompletedSteps(prev => {
                const newSet = new Set(prev);
                newSet.delete(currentStepData.id);
                return newSet;
            });
        }

        if (!isSaved) return;

        if (direction === 'next' && !isLastStep) {
            setCurrentStep(c => c + 1);
        } else if (direction === 'prev' && currentStep > 0) {
            setCurrentStep(c => c - 1);
        } else if (direction === 'skip' && !currentStepData.required && !isLastStep) {
            setCurrentStep(c => c + 1);
        }
    };

    // Function to map IPO details from existing Ipo interface to comprehensive analysis format
    const mapIpoDetails = (ipo: Ipo) => {
        const retailQuota = ipo.ipo_details?.retail_quota || '35';
        const qibQuota = ipo.ipo_details?.qib_quota || '50';
        const niiQuota = ipo.ipo_details?.nii_quota || '15';

        const lotSize = parseInt(ipo.ipo_market_lot?.[0]?.lot_size || '0');

        return {
            issue_size: ipo.ipo_size || '',
            price_band: ipo.price_band || '',
            lot_size: lotSize,
            allocation_details: {
                retail: retailQuota,
                qib: qibQuota,
                nii: niiQuota
            },
            approximate_gains_potential: 0,
            gains_rationale: ipo.gmp_price_gain || '',
            profitability_of_allotment: {
                score: 0,
                assessment: ''
            }
        };
    };

    const handleSave = async () => {
        let isCurrentStepSaved = true;
        if (jsonInput.trim()) {
            isCurrentStepSaved = saveCurrentStep(jsonInput);
        }

        if (!isCurrentStepSaved) {
            toast.error("The current step has invalid JSON data. Please fix it before saving.");
            return;
        }

        // Get final analysis data with current step if there's input
        const finalAnalysisData = jsonInput.trim() ?
            { ...analysisData, [currentStepData.id]: JSON.parse(jsonInput) } :
            analysisData;

        const requiredSteps = analysisSteps.filter(step => step.required);
        const firstMissingStep = requiredSteps.find(step => !finalAnalysisData[step.id as keyof AnalysisData]);

        if (firstMissingStep) {
            const missingStepIndex = analysisSteps.findIndex(s => s.id === firstMissingStep.id);
            setCurrentStep(missingStepIndex);
            toast.error(`Please complete the '${firstMissingStep.title}' step before saving.`);
            return;
        }

        setIsSubmitting(true);
        try {
            // Map factual IPO details from the existing IPO data
            const mappedIpoDetails = mapIpoDetails(ipoItem.ipo);
            const summaryData = finalAnalysisData.summary;

            // Merge analytical summary data into the factual IPO details
            const finalIpoDetails = {
                ...mappedIpoDetails,
                approximate_gains_potential: summaryData?.approximate_gains_potential ?? 0,
                gains_rationale: summaryData?.gains_rationale ?? '',
                profitability_of_allotment: summaryData?.profitability_of_allotment ?? { score: 0, assessment: '' },
            };

            // Calculate summary metrics from the collected data
            const summaryMetrics = {
                fundamentals_score: finalAnalysisData.fundamentals?.score || 0,
                risk_meter: finalAnalysisData.risk_meter?.score || 0,
                flexibility_score: finalAnalysisData.flexibility?.score || 0,
                time_score: finalAnalysisData.time?.score || 0,
                performance_score: finalAnalysisData.performance?.score || 0,
                approximate_gains_potential: finalIpoDetails.approximate_gains_potential,
                profitability_of_allotment: finalIpoDetails.profitability_of_allotment.score,
                total_revenue: finalAnalysisData.fundamentals?.revenue_details?.total_revenue || 0,
                net_profit: finalAnalysisData.fundamentals?.profit_analysis?.net_profit || 0,
                total_assets: finalAnalysisData.fundamentals?.assets_and_liabilities?.total_assets || 0
            };

            // Transform data to match the IpoComprehensiveAnalysis interface structure
            const payload = {
                ipo_table_id: ipoItem.ipo._id,
                company_name: ipoItem.ipo.ipo_name || ipoItem.ipo.upcoming_ipo_2025 || 'Unknown Company',
                image_url: ipoItem.ipo.image_url || '',
                fundamentals: finalAnalysisData.fundamentals || {},
                risk_meter: finalAnalysisData.risk_meter || {},
                flexibility: finalAnalysisData.flexibility || {},
                time: finalAnalysisData.time || {},
                performance: finalAnalysisData.performance || {},
                ipo_details: finalIpoDetails, // Use merged IPO details
                summary_metrics: summaryMetrics
            };

            const response = await fetch('/api/analysis/manipulate-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to save analysis');

            toast.success('Comprehensive analysis saved successfully!');
            setIsOpen(false);
            onAnalysisAdded();

        } catch (error) {
            toast.error('Failed to save analysis', {
                description: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-3 text-sm border-green-600/20 hover:bg-green-600/10 text-green-600 font-bold font-ibm-plex">
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add Analysis
                </Button>
            </DialogTrigger>
            <DialogContent className="h-[95vh] flex flex-col font-ibm-plex lg:max-w-[calc(100%-6rem)]">
                <DialogHeader className="p-6 border-b flex-shrink-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-3">
                        <div className="flex items-center gap-2 justify-between w-full">
                            <div className="flex items-center gap-2">
                                <div className="p-2 w-12 h-12 rounded-lg bg-blue-600/10 ">
                                    <Avatar>
                                        {ipoItem.ipo.image_url ? (
                                            <AvatarImage src={ipoItem.ipo.image_url || ''} />
                                        ) : (
                                            <AvatarFallback>{ipoItem.ipo.ipo_name || ipoItem.ipo.upcoming_ipo_2025 || 'Unknown Company'}</AvatarFallback>
                                        )}
                                    </Avatar>
                                </div>
                                <div>
                                    <div>
                                        {ipoItem.ipo.ipo_name || ipoItem.ipo.upcoming_ipo_2025 || 'Unknown Company'}
                                    </div>
                                    <div className="text-sm font-medium text-gray-600 mt-1">Add Comprehensive Analysis</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* RHP Link */}
                                {rhpLink && (
                                    <Button
                                        onClick={() => window.open(rhpLink, "_blank")}
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <LinkIcon className="h-4 w-4" />
                                        RHP
                                    </Button>
                                )}
                                {/* DRHP Link */}
                                {drhpLink && (
                                    <Button
                                        onClick={() => window.open(drhpLink, "_blank")}
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2"
                                    >
                                        <LinkIcon className="h-4 w-4" />
                                        DRHP
                                    </Button>
                                )}
                                {/* NotebookLM Link */}
                                <Button
                                    onClick={() => window.open("https://notebooklm.google.com/", "_blank")}
                                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    NotebookLM
                                </Button>
                            </div>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 flex flex-row overflow-hidden">
                    {/* Left Column: Progress & Details */}
                    <div className="w-1/3 min-w-[300px] border-r bg-gray-50/50 flex flex-col p-6 space-y-6 overflow-y-auto">
                        <h3 className="font-bold text-lg text-gray-800 sticky top-0 bg-gray-50/50 pb-2">
                            Analysis Steps
                        </h3>
                        <div className="space-y-4">
                            {analysisSteps.map((step, index) => {
                                const isCompleted = completedSteps.has(step.id);
                                const isCurrent = index === currentStep;
                                const StepIcon = step.icon;
                                return (
                                    <div
                                        key={step.id}
                                        className={cn(
                                            "flex items-center gap-4 p-3 rounded-lg transition-all cursor-pointer",
                                            isCurrent
                                                ? "bg-blue-100/80 shadow-md border-2 border-blue-200"
                                                : "hover:bg-gray-200/60 border-2 border-transparent"
                                        )}
                                        onClick={() => setCurrentStep(index)}
                                    >
                                        <div className={cn(
                                            "flex items-center justify-center w-10 h-10 rounded-full border-2 flex-shrink-0",
                                            isCurrent
                                                ? "border-blue-600 bg-blue-50 text-blue-600" :
                                                isCompleted
                                                    ? "border-green-600 bg-green-50 text-green-600" :
                                                    "border-gray-300 bg-white text-gray-400"
                                        )}>
                                            {isCompleted && !isCurrent ?
                                                <CheckCircle className="h-5 w-5" /> :
                                                <StepIcon className="h-5 w-5" />
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-gray-900 truncate">{step.title}</div>
                                            <p className="text-sm text-gray-600">{step.description}</p>
                                        </div>
                                        {!step.required && (
                                            <Badge variant="secondary" className="text-xs flex-shrink-0">
                                                Optional
                                            </Badge>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: JSON Input */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-6 border-b bg-white flex-shrink-0">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <currentStepData.icon className={`h-6 w-6 ${currentStepData.color}`} />
                                    <span className="text-lg font-bold">
                                        Step {currentStep + 1}: {currentStepData.title}
                                    </span>
                                    {currentStepData.required && (
                                        <Badge variant="destructive" className="text-xs ml-2">Required</Badge>
                                    )}
                                </div>
                                <Button variant="outline" size="sm" onClick={copyPromptToClipboard}>
                                    <Copy className="h-3 w-3 mr-1.5" />
                                    Copy Prompt
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 p-6 flex flex-col overflow-hidden">
                            <div className="relative flex-1 flex flex-col">
                                <Textarea
                                    placeholder={`Paste your ${currentStepData.title.toLowerCase()} JSON data here...`}
                                    value={jsonInput}
                                    onChange={(e) => handleJsonChange(e.target.value)}
                                    className="flex-1 w-full font-mono text-sm resize-none min-h-0 border-2 focus:border-blue-500 rounded-lg"
                                />
                                {jsonError && (
                                    <div className="absolute bottom-2 left-2 right-2 bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2 shadow-lg">
                                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        <div className="text-sm text-red-700 font-semibold flex-1">{jsonError}</div>
                                    </div>
                                )}
                            </div>
                            {jsonInput.trim() && !jsonError && (
                                <div className="flex items-center gap-2 text-green-600 text-sm mt-3 p-2 bg-green-50 rounded-md">
                                    <CheckCircle className="h-4 w-4" />
                                    Valid JSON format - Ready to save
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer: Action Buttons */}
                <div className="flex-shrink-0 border-t p-6 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => navigateStep('prev')}
                                disabled={currentStep === 0 || isSubmitting}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            {!currentStepData.required && (
                                <Button
                                    variant="ghost"
                                    onClick={() => navigateStep('skip')}
                                    disabled={isLastStep || isSubmitting}
                                    className="text-gray-600"
                                >
                                    Skip Step
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-500 mr-2">
                                {currentStep + 1} of {analysisSteps.length}
                            </div>
                            {!isLastStep ? (
                                <Button
                                    onClick={() => navigateStep('next')}
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Next Step
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSave}
                                    disabled={isSubmitting}
                                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving Analysis...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Save Analysis
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}