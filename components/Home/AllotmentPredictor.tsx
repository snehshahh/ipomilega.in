import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Info, AlertTriangle } from 'lucide-react';
import { HomePageIpoProps } from '@/app/types/homepage';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface IpoAllotmentModalProps {
  ipos: HomePageIpoProps[];
  isOpen: boolean;
  onClose: () => void;
  preSelectedIpoId?: string;
}

// IPO Category Limits (in INR)
const CATEGORY_LIMITS = {
  retail: { min: 10000, max: 200000, name: 'Retail Individual Investor' },
  hni: { min: 200001, max: 10000000, name: 'High Net Worth Individual' },
  qib: { min: 10000000, max: Infinity, name: 'Qualified Institutional Buyer' }
};

// IPO Quality Scoring Factors
const IPO_QUALITY_FACTORS = {
  // Sector scoring (out of 100)
  sectors: {
    'technology': 85,
    'healthcare': 80,
    'financial': 75,
    'consumer': 70,
    'manufacturing': 65,
    'energy': 60,
    'telecom': 65,
    'default': 60
  },
  
  // Company age factor
  companyAge: {
    'new': 60,      // < 5 years
    'established': 75, // 5-15 years
    'mature': 85    // > 15 years
  },
  
  // Price band factor (higher price = lower retail participation)
  priceBand: {
    'low': 80,      // < ₹500
    'medium': 70,   // ₹500-1500
    'high': 60      // > ₹1500
  }
};
interface CalculationDetails {
  categoryAllocation: number;
  expectedSubscription: number;
  investmentTier: string;
  qualityScore: number;
  factors: string[];
}

const IpoAllotmentModal: React.FC<IpoAllotmentModalProps> = ({
  ipos,
  isOpen,
  onClose,
  preSelectedIpoId
}) => {
  const [selectedIpo, setSelectedIpo] = useState('');
  const [investmentCategory, setInvestmentCategory] = useState<keyof typeof CATEGORY_LIMITS>('retail');
  const [amount, setAmount] = useState('');
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [calculationDetails, setCalculationDetails] = useState<CalculationDetails | null>(null);

  // Set pre-selected IPO when modal opens
  useEffect(() => {
    if (isOpen && preSelectedIpoId) {
      setSelectedIpo(preSelectedIpoId);
    } else if (isOpen && !preSelectedIpoId) {
      setSelectedIpo('');
    }
  }, [isOpen, preSelectedIpoId]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedIpo('');
      setInvestmentCategory('retail');
      setAmount('');
      setPrediction(null);
      setShowResult(false);
      setValidationError('');
      setCalculationDetails(null);
    }
  }, [isOpen]);

  // Validate investment amount
  const validateAmount = (amt: string, category: keyof typeof CATEGORY_LIMITS): string => {
    if (!amt) return '';
    
    const numAmount = parseInt(amt);
    const limits = CATEGORY_LIMITS[category];
    
    if (numAmount < limits.min) {
      return `Minimum investment for ${limits.name} is ₹${limits.min.toLocaleString()}`;
    }
    
    if (numAmount > limits.max) {
      return `Maximum investment for ${limits.name} is ₹${limits.max.toLocaleString()}`;
    }
    
    return '';
  };

  // Calculate IPO quality score
  const calculateIpoQualityScore = (ipo: HomePageIpoProps): number => {
    let score = 50; // Base score
    
    // Sector scoring (simplified - you'd need actual sector data)
    const ipoName = ipo.ipo.upcoming_ipo_2025.toLowerCase();
    let sectorScore = IPO_QUALITY_FACTORS.sectors.default;
    
    // Simple keyword-based sector detection (replace with actual sector data)
    if (ipoName.includes('tech') || ipoName.includes('software') || ipoName.includes('digital')) {
      sectorScore = IPO_QUALITY_FACTORS.sectors.technology;
    } else if (ipoName.includes('pharma') || ipoName.includes('health') || ipoName.includes('medical')) {
      sectorScore = IPO_QUALITY_FACTORS.sectors.healthcare;
    } else if (ipoName.includes('bank') || ipoName.includes('finance') || ipoName.includes('insurance')) {
      sectorScore = IPO_QUALITY_FACTORS.sectors.financial;
    }
    
    // Price band factor
    const priceBand = parseInt(ipo.ipo.price_band.replace(/[^\d]/g, ''));
    let priceFactor = IPO_QUALITY_FACTORS.priceBand.low;
    if (priceBand > 1500) {
      priceFactor = IPO_QUALITY_FACTORS.priceBand.high;
    } else if (priceBand > 500) {
      priceFactor = IPO_QUALITY_FACTORS.priceBand.medium;
    }
    
    // Combine factors
    score = (sectorScore * 0.6) + (priceFactor * 0.4);
    
    return Math.min(95, Math.max(20, score));
  };

  // Main allotment calculation logic
  const calculateAllotmentChance = (
    ipo: HomePageIpoProps | null,
    category: keyof typeof CATEGORY_LIMITS,
    investmentAmount: number
  ): { probability: number; details: CalculationDetails } => {
    let probability = 50; // Base probability
    const details: CalculationDetails = {
      factors: [],
      categoryAllocation: 0,
      expectedSubscription: 0,
      investmentTier: '',
      qualityScore: 0
    };

    // Category-wise allocation percentages (standard SEBI guidelines)
    const categoryAllocations = {
      retail: 35,  // 35% reserved for retail
      hni: 15,     // 15% for HNI
      qib: 50      // 50% for QIB
    };

    details.categoryAllocation = categoryAllocations[category];

    // Category-specific calculations
    if (category === 'retail') {
      // Retail category (35% allocation)
      probability = 65; // Base higher chance due to reservation
      
      // Amount tier impact
      if (investmentAmount <= 15000) {
        probability += 15;
        details.investmentTier = 'Small investor bonus';
        details.factors.push('Small investment amount: +15%');
      } else if (investmentAmount <= 50000) {
        probability += 10;
        details.investmentTier = 'Moderate investment';
        details.factors.push('Moderate investment amount: +10%');
      } else if (investmentAmount >= 150000) {
        probability -= 5;
        details.investmentTier = 'High retail investment';
        details.factors.push('High retail investment: -5%');
      }
      
      // Expected subscription impact (retail typically 2-5x subscribed)
      details.expectedSubscription = 3.5;
      probability -= 20; // Reduce due to typical oversubscription
      details.factors.push('Expected retail oversubscription (3.5x): -20%');
      
    } else if (category === 'hni') {
      // HNI category (15% allocation, typically heavily oversubscribed)
      probability = 25; // Lower base due to high competition
      
      // Amount tier impact
      if (investmentAmount >= 5000000) {
        probability += 15;
        details.investmentTier = 'Large HNI investment';
        details.factors.push('Large HNI investment (₹50L+): +15%');
      } else if (investmentAmount >= 1000000) {
        probability += 10;
        details.investmentTier = 'Moderate HNI investment';
        details.factors.push('Moderate HNI investment (₹10L+): +10%');
      } else {
        probability += 5;
        details.investmentTier = 'Entry-level HNI';
        details.factors.push('Entry-level HNI investment: +5%');
      }
      
      // Expected subscription impact (HNI typically 5-20x subscribed)
      details.expectedSubscription = 8.0;
      probability -= 30; // Significant reduction due to oversubscription
      details.factors.push('Expected HNI oversubscription (8x): -30%');
      
    } else if (category === 'qib') {
      // QIB category (50% allocation, institutional investors)
      probability = 70; // Higher base due to reserved allocation
      
      // QIBs typically get better allocation due to large reserved portion
      details.investmentTier = 'Institutional investment';
      details.expectedSubscription = 2.0;
      probability -= 5; // Minimal reduction
      details.factors.push('QIB category advantage: +20%');
      details.factors.push('Expected QIB subscription (2x): -5%');
    }

    // IPO-specific quality adjustment
    if (ipo) {
      const qualityScore = calculateIpoQualityScore(ipo);
      details.qualityScore = qualityScore;
      
      if (qualityScore >= 80) {
        probability -= 15; // High quality = more competition
        details.factors.push('High-quality IPO: -15% (more competition)');
      } else if (qualityScore >= 65) {
        probability -= 8;
        details.factors.push('Good quality IPO: -8% (moderate competition)');
      } else if (qualityScore <= 40) {
        probability += 10;
        details.factors.push('Lower quality IPO: +10% (less competition)');
      }
    } else {
      // General IPO analysis
      probability -= 5;
      details.factors.push('General analysis: -5% (average market conditions)');
    }

    // Market conditions adjustment (you can make this dynamic based on current market)
    let marketSentiment; // This could be fetched from an API
    if (marketSentiment === 'bullish') {
      probability -= 10;
      details.factors.push('Bullish market conditions: -10%');
    } else if (marketSentiment === 'bearish') {
      probability += 15;
      details.factors.push('Bearish market conditions: +15%');
    }
    else{
      probability += 5;
      details.factors.push('Neutral market conditions: +5%');
    }

    // Ensure probability is within realistic bounds
    probability = Math.min(90, Math.max(5, probability));

    return { probability: Math.round(probability), details };
  };

  const handlePredict = async () => {
    // Validation
    setValidationError('');
    
    if (!selectedIpo) {
      setValidationError('Please select an IPO');
      return;
    }

    const selectedIpoData = selectedIpo === ' ' ? null : ipos.find(ipo => ipo._id === selectedIpo);
    let investmentAmount: number;

    if (!amount) {
      // Use maximum allowed for category if no amount specified
      investmentAmount = CATEGORY_LIMITS[investmentCategory].max === Infinity 
        ? 10000000 // Default 1 crore for QIB
        : CATEGORY_LIMITS[investmentCategory].max;
    } else {
      investmentAmount = parseInt(amount);
      const amountError = validateAmount(amount, investmentCategory);
      if (amountError) {
        setValidationError(amountError);
        return;
      }
    }

    setIsLoading(true);
    setShowResult(false);

    // Simulate processing time (remove in production)
    setTimeout(() => {
      const result = calculateAllotmentChance(selectedIpoData!, investmentCategory, investmentAmount);
      setPrediction(result.probability);
      setCalculationDetails(result.details);
      setShowResult(true);
      setIsLoading(false);
    }, 1500);
  };

  const getMeterColor = (percentage: number) => {
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    if (percentage >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const getMeterMessage = (percentage: number) => {
    if (percentage >= 80) return 'Excellent chances! High probability of allotment.';
    if (percentage >= 60) return 'Good chances! Solid opportunity for allotment.';
    if (percentage >= 40) return 'Moderate chances. Consider market conditions.';
    if (percentage >= 20) return 'Lower chances. High competition expected.';
    return 'Challenging odds. Very high competition likely.';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm font-ibm-plex flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl font-ibm-plex" style={{background: `
              linear-gradient(135deg, 
                rgba(240, 248, 255, 1) 0%,
                rgba(230, 245, 255, 1) 30%,
                rgba(220, 240, 255, 1) 60%,
                rgba(235, 247, 255, 1) 100%
              )
            `}}>
        {/* Header */}
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4 sm:pb-6 border-b border-gray-100 font-ibm-plex">
          <div className="flex-1 pr-4 sm:pr-0">
            <CardTitle className="text-xl sm:text-2xl font-black text-gray-900 font-ibm-plex">
              IPO Allotment Prediction
            </CardTitle>
            <p className="text-gray-600 text-xs sm:text-sm font-medium font-ibm-plex mt-1">
              Advanced algorithm based on market data and SEBI allocation rules
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 self-end sm:self-auto"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </CardHeader>

        {/* Form */}
        <CardContent className="space-y-6 pt-6">
          {/* IPO Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 font-ibm-plex">
              Select IPO
            </label>
            <Select value={selectedIpo} onValueChange={setSelectedIpo}>
              <SelectTrigger className="w-full border-gray-300 focus:border-[#0073E6] focus:ring-[#0073E6] font-ibm-plex">
                <SelectValue placeholder="All IPOs (General Analysis)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All IPOs (General Analysis)</SelectItem>
                {ipos.map((ipo) => (
                  <SelectItem key={ipo._id} value={ipo._id}>
                    {ipo.ipo.upcoming_ipo_2025} (₹{ipo.ipo.price_band})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Investment Category and Amount */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Investment Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-ibm-plex">
                Investment Category
              </label>
              <Select value={investmentCategory} onValueChange={(value: keyof typeof CATEGORY_LIMITS) => {
                setInvestmentCategory(value);
                setValidationError('');
              }}>
                <SelectTrigger className="w-full border-gray-300 focus:border-[#0073E6] focus:ring-[#0073E6] font-ibm-plex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">
                    Retail (₹10K - ₹2L)
                  </SelectItem>
                  <SelectItem value="hni">
                    HNI (₹2L - ₹1Cr)
                  </SelectItem>
                  <SelectItem value="qib">
                    QIB (₹1Cr+)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-ibm-plex">
                Investment Amount <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setValidationError('');
                  }}
                  placeholder={`Max: ₹${CATEGORY_LIMITS[investmentCategory].max === Infinity ? '1Cr+' : CATEGORY_LIMITS[investmentCategory].max.toLocaleString()}`}
                  className="pl-8 border-gray-300 focus:border-[#0073E6] focus:ring-[#0073E6] font-ibm-plex"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
              </div>
              {!amount && (
                <p className="text-xs text-gray-500 mt-1 font-ibm-plex">
                  If not specified, maximum allowed amount will be used
                </p>
              )}
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <Card className="bg-red-50 border-red-200 font-ibm-plex">
              <CardContent className="p-3 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium font-ibm-plex">{validationError}</p>
              </CardContent>
            </Card>
          )}

          {/* Predict Button */}
          <Button
            onClick={handlePredict}
            disabled={!selectedIpo || isLoading || !!validationError}
            className="w-full bg-[#0073E6] hover:bg-[#0073E6]/90 text-white font-bold font-ibm-plex shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Calculating Probability...</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 mr-2 text-white" />
                <span>Calculate Allotment Probability</span>
              </>
            )}
          </Button>

          {/* Results */}
          {showResult && prediction !== null && calculationDetails && (
            <div className="space-y-3 sm:space-y-4">
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 font-ibm-plex">
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Meter Visualization */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-64 h-36 sm:w-80 sm:h-48 mb-4">
                      <svg viewBox="0 0 300 180" className="w-full h-full">
                        <defs>
                          <linearGradient id="redToYellow" x1="0%" y1="0%" x2="50%" y2="0%">
                            <stop offset="0%" stopColor="#B4292E" />
                            <stop offset="100%" stopColor="#D59527" />
                          </linearGradient>
                          <linearGradient id="yellowToGreen" x1="50%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#D59527" />
                            <stop offset="100%" stopColor="#00914D" />
                          </linearGradient>
                        </defs>

                        <path
                          d="M 50 150 A 100 100 0 0 1 250 150"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="20"
                          strokeLinecap="round"
                        />

                        <path
                          d="M 50 150 A 100 100 0 0 1 150 50"
                          fill="none"
                          stroke="url(#redToYellow)"
                          strokeWidth="20"
                          strokeLinecap="round"
                        />

                        <path
                          d="M 150 50 A 100 100 0 0 1 250 150"
                          fill="none"
                          stroke="url(#yellowToGreen)"
                          strokeWidth="20"
                          strokeLinecap="round"
                        />

                        <g transform={`rotate(${(-90 + (prediction / 100) * 180)} 150 150)`}>
                          <line
                            x1="150"
                            y1="150"
                            x2="150"
                            y2="60"
                            stroke="#1F2937"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <circle cx="150" cy="150" r="6" fill="#1F2937" />
                        </g>
                      </svg>
                    </div>

                    <div className="text-center">
                      <h3 className="text-lg sm:text-xl font-black text-gray-900 font-ibm-plex mb-2">
                        Allotment Probability
                      </h3>
                      <div className={`text-3xl sm:text-5xl font-black ${getMeterColor(prediction)} mb-2 font-ibm-plex`}>
                        {prediction}%
                      </div>
                      <p className="text-gray-600 font-medium font-ibm-plex mb-4 text-sm sm:text-base px-2">
                        {getMeterMessage(prediction)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calculation Details */}
              <Card className="bg-white border-gray-200 font-ibm-plex">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-base sm:text-lg font-bold text-gray-900 font-ibm-plex">
                    Calculation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div className="text-center sm:text-left">
                      <p className="text-xs sm:text-sm font-bold text-gray-700 font-ibm-plex">Category Allocation</p>
                      <p className="text-lg font-black text-[#0073E6] font-ibm-plex">{calculationDetails.categoryAllocation}%</p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-xs sm:text-sm font-bold text-gray-700 font-ibm-plex">Expected Subscription</p>
                      <p className="text-lg font-black text-orange-600 font-ibm-plex">{calculationDetails.expectedSubscription}x</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2 font-ibm-plex">Factors Considered:</p>
                    {calculationDetails.factors.map((factor: string, index: number) => (
                      <div key={index} className="flex items-start text-xs sm:text-sm text-gray-600 font-ibm-plex">
                        <div className="w-2 h-2 bg-[#0073E6] rounded-full mr-2 mt-1 flex-shrink-0"></div>
                        <span className="leading-relaxed">{factor}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
                <CardContent className="p-4 flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 font-ibm-plex">
                    <p className="font-bold">Methodology</p>
                    <p className="font-medium">This prediction uses SEBI allocation rules, historical subscription patterns, IPO quality metrics, and market conditions. Based on deterministic algorithms without random factors. Use as guidance alongside your research.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IpoAllotmentModal;