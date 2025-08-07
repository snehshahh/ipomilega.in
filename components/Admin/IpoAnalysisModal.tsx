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
    FileText,
    Save,
    Copy,
    Building2,
    ArrowLeft,
    ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Updated prompts for each analysis step
const analysisPrompts = {
    risk: "Analyze risk factors for, focusing strictly on risks and avoiding overlap with financial performance, flexibility, or IPO timing. Avoid Page Numbers, and the summary should be 1-2 lines Not more than that. Also please dont give any * * in case you want to make it bold give precise formatting.\n\nRISK FACTORS TEXT (RHP):READ THE REFRENCE FROM THE PDF\nSCRAPED DATA CONTEXT:READ THE REFRENCE FROM THE PDF\n\nReturn JSON with:\n- risk_meter: number (1-10, based on the following rubric):\n  - 1-3: Low risk (few significant risks, strong mitigation plans, stable industry).\n  - 4-6: Moderate risk (some risks in 1-2 categories, moderate mitigation, competitive industry).\n  - 7-10: High risk (multiple significant risks across categories, weak mitigation, volatile industry).\n- risk_summary: string (1-2 lines, explaining the severity and likelihood of risks compared to typical IPOs in the same sector).\n- key_risks: list of 5-7 significant risks (e.g., 'High dependence on single supplier', 'Regulatory changes in X market').\n- risk_categories: {{\n    financial_risks: list of financial risks (e.g., 'High debt levels', 'Cash flow volatility'),\n    market_risks: list of market/competition risks (e.g., 'Intense competition from X', 'Market saturation'),\n    operational_risks: list of operational risks (e.g., 'Supply chain disruptions', 'Key personnel dependency'),\n    regulatory_risks: list of regulatory risks (e.g., 'Pending litigation', 'New compliance requirements')\n  }}\n- risk_mitigation: string (specific strategies the company has outlined to address these risks, e.g., 'Diversifying suppliers', 'Hedging against currency fluctuations').",
    performance: "Analyze the performance, focusing on historical growth, operational achievements, and future potential. Do not consider financial metrics, risks, or flexibility, as these are evaluated separately. Avoid Page Numbers, and the summary should be 1-2 lines Not more than that. Also please dont give any * * in case you want to make it bold give precise formatting.\n\nPERFORMANCE INFORMATION (RHP): READ THE REFRENCE FROM THE PDF\nSCRAPED PERFORMANCE DATA: READ THE REFRENCE FROM THE PDF\n\nReturn JSON with:\n- performance_score: number (1-10, based on the following rubric):\n  - 8-10: Strong performance (consistent operational growth, significant market achievements, clear future growth plans).\n  - 5-7: Moderate performance (steady growth, some achievements, moderate future potential).\n  - 1-4: Weak performance (stagnant growth, few achievements, unclear future plans).\n- performance_summary: string (1-2 lines, comparing performance to competitors or industry leaders).\n- historical_growth: {{pattern: string (e.g., 'Exponential', 'Stable'), rate: string (e.g., '10% annual growth'), consistency: string (e.g., 'High', 'Variable')}}\n- key_achievements: list of strings (e.g., 'Launched X product in 2023', 'Expanded to Y markets').\n- management_quality: {{experience: string, track_record: string, score: number (1-10)}}\n- market_comparison: string (e.g., 'Outperforms peers in X segment', 'Lags behind in Y metric').\n- future_potential: {{growth_forecast: string, upcoming_projects: list of strings}}\n- consistency_analysis: {{operational_years: number, revenue_stability: string, rationale: string}}",
    flexibility: "Analyze the flexibility, focusing on its ability to adapt to market changes, operational agility, and strategic pivoting. Do not consider financial metrics or risks, as these are evaluated separately. Avoid Page Numbers, and the summary should be 1-2 lines Not more than that. Also please dont give any * * in case you want to make it bold give precise formatting.\n\nFLEXIBILITY INFORMATION (RHP):READ THE REFRENCE FROM THE PDF\nSCRAPED DATA CONTEXT: READ THE REFRENCE FROM THE PDF\n\nReturn JSON with:\n- flexibility_score: number (1-10, based on the following rubric):\n  - 8-10: High adaptability (proven pivots, diversified products, agile operations, strong strategic plans).\n  - 5-7: Moderate adaptability (some successful pivots, limited diversification, stable operations).\n  - 1-4: Low adaptability (rigid business model, no pivoting history, slow response to market changes).\n- flexibility_summary: string (1-2 lines, comparing adaptability to competitors in the same industry).\n- market_adaptability: {{score: number (1-10), description: string (e.g., 'Quickly adjusts to consumer trends')}}\n- financial_stability: {{score: number (1-10), description: string (e.g., 'Strong cash reserves for pivoting')}}\n- operational_agility: {{score: number (1-10), description: string (e.g., 'Streamlined supply chain')}}\n- product_diversification: string (e.g., 'Multiple product lines across X segments').\n- pivoting_history: list of strings (e.g., 'Shifted to e-commerce in 2020', 'Entered new market in 2022').\n- future_adaptability_potential: string (e.g., 'Plans to leverage AI for operational efficiency').",
    fundamentals: "Analyze the financial fundamentals, focusing strictly on financial health and market position. Do not consider risks, operational flexibility, or IPO timing, as these are evaluated separately. Avoid Page Numbers, and the summary should be 1-2 lines Not more than that. Also please dont give any * * in case you want to make it bold give precise formatting.\n\nFINANCIAL DATA FROM RHP: READ THE REFRENCE FROM THE PDF\nSCRAPED FINANCIAL DATA: READ THE REFRENCE FROM THE PDF\nBUSINESS DESCRIPTION (SCRAPED): READ THE REFRENCE FROM THE PDF\n\nReturn JSON with:\n- fundamentals_score: number (1-10, based on the following rubric):\n  - 8-10: Strong revenue growth (>15% CAGR), high profitability (>10% net margin), low debt-to-equity (<0.5), and leading market position in a growing industry.\n  - 5-7: Moderate revenue growth (5-15% CAGR), stable profitability (5-10% net margin), moderate debt-to-equity (0.5-1.0), and competitive but not leading market position.\n  - 1-4: Low or negative revenue growth (<5% CAGR), low or negative profitability (<5% net margin), high debt-to-equity (>1.0), or weak market position.\n- fundamentals_summary: string (1-2 lines, explaining financial strengths and weaknesses relative to industry benchmarks, e.g., S&P 500 or sector-specific peers).\n- market_position: string (e.g., 'Market leader in X segment', 'Niche player with limited share').\n- business_model: string (e.g., 'Subscription-based SaaS', 'Manufacturing with B2B focus').\n- revenue_details: {{total_revenue: number (millions), revenue_cagr: number (%), revenue_trend: string (e.g., 'Consistent growth', 'Volatile')}}\n- profit_analysis: {{net_profit: number (millions), profit_margin: number (%), ebitda: number (millions), profit_trend: string (e.g., 'Improving', 'Declining')}}\n- assets_and_liabilities: {{total_assets: number (millions), total_liabilities: number (millions), debt_to_equity_ratio: number}}\n- financial_ratios: {{current_ratio: number, quick_ratio: number, return_on_equity: number (%)}}.",
    time: "Analyze the timing, focusing on market conditions, IPO schedule, and strategic timing. Do not consider financial performance, risks, or operational flexibility. Avoid Page Numbers, and the summary should be 1-2 lines Not more than that. Also please dont give any * * in case you want to make it bold give precise formatting.\n\nTIME INFORMATION (RHP): READ THE REFRENCE FROM THE PDF\nSCRAPED TIME DATA: READ THE REFRENCE FROM THE PDF\n\nReturn JSON with:\n- time_score: number (1-10, based on the following rubric):\n  - 8-10: Optimal timing (favorable market conditions, strong investor sentiment, well-aligned milestones).\n  - 5-7: Moderate timing (neutral market conditions, standard IPO schedule, some alignment with milestones).\n  - 1-4: Poor timing (volatile market, weak investor sentiment, misaligned milestones).\n- time_summary: string (1-2 lines, explaining why the timing is favorable or unfavorable compared to recent IPO trends).\n- issue_dates: {{opening: string (YYYY-MM-DD), closing: string (YYYY-MM-DD)}}\n- listing_details: {{expected_date: string (YYYY-MM-DD), exchanges: list of strings}}\n- allotment_timeline: {{date: string (YYYY-MM-DD), process: string}}\n- key_milestones: list of {{date: string, event: string}}\n- market_timing_assessment: string (e.g., 'Favorable due to bullish market', 'Risky due to economic uncertainty').\n- time_to_market: {{score: number (1-10), rationale: string (e.g., 'Efficient IPO process')}}",
    ipo_details: "Analyze IPO details, focusing on the IPO structure and potential investor gains. Do not consider financial performance, risks, or operational flexibility. Issue size Must be strictly Numbers. Avoid Page Numbers, and the summary should be 1-2 lines Not more than that. Also please dont give any * * in case you want to make it bold give precise formatting.\n\nIPO DETAILS (RHP): READ THE REFRENCE FROM THE PDF\nSCRAPED IPO DATA: READ THE REFRENCE FROM THE PDF\n\nReturn JSON with:\n- issue_size: string (e.g., 'INR 500 crore')\n- price_band: string (e.g., 'INR 100-120')\n- lot_size: number\n- allocation_details: {{retail: number (%), qib: number (%), nii: number (%)}}\n- approximate_gains_potential: number (1-10, based on the following rubric):\n  - 8-10: High gains potential (attractive price band, high retail allocation, strong market demand).\n  - 5-7: Moderate gains potential (reasonable pricing, balanced allocation, moderate demand).\n  - 1-4: Low gains potential (overpriced, low retail allocation, weak demand).\n- gains_rationale: string (e.g., 'Attractive pricing relative to peers', 'Oversubscription expected').\n- profitability_of_allotment: {{score: number (1-10), assessment: string (e.g., 'High likelihood of listing gains')}}"
};

interface AnalysisStep {
    id: keyof typeof analysisPrompts;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    color: string;
    required: boolean;
}

interface IpoAnalysisModalProps {
    ipoItem: {
        _id: string;
        ipo: {
            _id?: string;
            upcoming_ipo_2025?: string;
            image_url?: string;
        };
    };
    onAnalysisAdded: () => void;
}

const analysisSteps: AnalysisStep[] = [
    { id: 'risk', title: 'Risk Analysis', description: 'Evaluate potential risks.', icon: Shield, color: 'text-red-600', required: true },
    { id: 'performance', title: 'Performance', description: 'Analyze historical growth.', icon: TrendingUp, color: 'text-green-600', required: true },
    { id: 'flexibility', title: 'Flexibility', description: 'Assess market adaptability.', icon: Activity, color: 'text-blue-600', required: true },
    { id: 'fundamentals', title: 'Fundamentals', description: 'Review financial health.', icon: LineChart, color: 'text-purple-600', required: true },
    { id: 'time', title: 'Time Analysis', description: 'Check market timing.', icon: Clock, color: 'text-orange-600', required: true },
    { id: 'ipo_details', title: 'IPO Details', description: 'Define IPO structure.', icon: FileText, color: 'text-gray-600', required: false }
];

export function IpoAnalysisModal({ ipoItem, onAnalysisAdded }: IpoAnalysisModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [analysisData, setAnalysisData] = useState<Record<string, any>>({});
    const [jsonInput, setJsonInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
    const [jsonError, setJsonError] = useState<string | null>(null);

    const currentStepData = analysisSteps[currentStep];
    const isLastStep = currentStep === analysisSteps.length - 1;

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
        if (analysisData[stepId]) {
            setJsonInput(JSON.stringify(analysisData[stepId], null, 2));
        } else {
            setJsonInput('');
        }
        setJsonError(null);
    }, [currentStep, analysisData]);


    const validateJson = (jsonString: string): { isValid: boolean; data?: any; error?: string } => {
        if (!jsonString.trim()) {
            return { isValid: false, error: 'JSON data cannot be empty.' };
        }
        try {
            const data = JSON.parse(jsonString);
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
        if (validation.isValid) {
            const stepId = currentStepData.id;
            setAnalysisData(prev => ({ ...prev, [stepId]: validation.data }));
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

    const handleSave = async () => {
        let isCurrentStepSaved = true;
        if (jsonInput.trim()) {
            isCurrentStepSaved = saveCurrentStep(jsonInput);
        }

        if (!isCurrentStepSaved) {
            toast.error("The current step has invalid JSON data. Please fix it before saving.");
            return;
        }

        // Use a callback with setAnalysisData to get the most up-to-date state
        // This is crucial because state updates might be async.
        const finalAnalysisData = jsonInput.trim() ? { ...analysisData, [currentStepData.id]: JSON.parse(jsonInput) } : analysisData;

        const requiredSteps = analysisSteps.filter(step => step.required);
        const firstMissingStep = requiredSteps.find(step => !finalAnalysisData[step.id]);

        if (firstMissingStep) {
            const missingStepIndex = analysisSteps.findIndex(s => s.id === firstMissingStep.id);
            setCurrentStep(missingStepIndex);
            toast.error(`Please complete the '${firstMissingStep.title}' step before saving.`);
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ipo_table_id: ipoItem.ipo._id,
                company_name: ipoItem.ipo.upcoming_ipo_2025 || 'Unknown Company',
                image_url: ipoItem.ipo.image_url || '',
                ...finalAnalysisData
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
            toast.error('Failed to save analysis', { description: error instanceof Error ? error.message : 'Unknown error' });
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
                                <div className="p-2 rounded-lg bg-blue-600/10">

                                    <Building2 className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <div>Add Comprehensive Analysis</div>
                                    <div className="text-sm font-medium text-gray-600 mt-1">
                                        {ipoItem.ipo.upcoming_ipo_2025 || 'Unknown Company'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                            <Button onClick={() => window.open("https://notebooklm.google.com/", "_blank")} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                                <ExternalLink className="h-4 w-4 mr-1.5" />
                                Open NoteBookLLM
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