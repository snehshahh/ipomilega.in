import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Info } from 'lucide-react';
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

const IpoAllotmentModal: React.FC<IpoAllotmentModalProps> = ({
  ipos,
  isOpen,
  onClose,
  preSelectedIpoId
}) => {
  const [selectedIpo, setSelectedIpo] = useState('');
  const [investmentCategory, setInvestmentCategory] = useState('retail');
  const [amount, setAmount] = useState('');
  const [prediction, setPrediction] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Set pre-selected IPO when modal opens
  useEffect(() => {
    if (isOpen && preSelectedIpoId) {
      setSelectedIpo(preSelectedIpoId);
    } else if (isOpen && !preSelectedIpoId) {
      setSelectedIpo(''); // Default to "All IPOs" option
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
    }
  }, [isOpen]);

  const handlePredict = async () => {
    if (!selectedIpo || !amount) return;

    setIsLoading(true);
    setShowResult(false);

    // Simulate API call
    setTimeout(() => {
      // Mock prediction logic based on various factors
      const baseChance = Math.random() * 100;
      const amountFactor = parseInt(amount) > 50000 ? -10 : 5;
      const categoryFactor = investmentCategory === 'retail' ? 10 :
        investmentCategory === 'hni' ? -5 : 0;

      const finalPrediction = Math.min(95, Math.max(5, baseChance + amountFactor + categoryFactor));

      setPrediction(Math.round(finalPrediction));
      setShowResult(true);
      setIsLoading(false);
    }, 2000);
  };



  const getMeterColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    if (percentage >= 25) return 'text-orange-600';
    return 'text-red-600';
  };



  const getMeterMessage = (percentage: number) => {
    if (percentage >= 80) return 'Excellent chances! Your application looks very promising.';
    if (percentage >= 60) return 'Good chances! You have a solid opportunity.';
    if (percentage >= 40) return 'Moderate chances. Consider your investment strategy.';
    if (percentage >= 20) return 'Lower chances. High competition expected.';
    return 'Challenging odds. Very high competition likely.';
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm font-ibm-plex flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" style={{background: `
              linear-gradient(135deg, 
                rgba(240, 248, 255, 1) 0%,     /* Alice Blue */
                rgba(230, 245, 255, 1) 30%,    /* Slightly deeper alice blue */
                rgba(220, 240, 255, 1) 60%,    /* Light sky blue */
                rgba(235, 247, 255, 1) 100%    /* Very light blue */
              )
            `
          }}>
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b border-gray-100">
          <div>
            <CardTitle className="text-2xl font-black text-gray-900 font-ibm-plex">
              IPO Allotment Prediction
            </CardTitle>
            <p className="text-gray-600 text-sm font-medium font-ibm-plex mt-1">
              Predict your chances of getting IPO allotment
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
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
              <SelectTrigger className="w-full border-gray-300 focus:border-[#0073E6] focus:ring-[#0073E6]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Investment Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-ibm-plex">
                Investment Category
              </label>
              <Select value={investmentCategory} onValueChange={setInvestmentCategory}>
                <SelectTrigger className="w-full border-gray-300 focus:border-[#0073E6] focus:ring-[#0073E6]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail Investor</SelectItem>
                  <SelectItem value="hni">HNI (High Net Worth)</SelectItem>
                  <SelectItem value="qib">QIB (Qualified Institutional)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 font-ibm-plex">
                Investment Amount
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="pl-8 border-gray-300 focus:border-[#0073E6] focus:ring-[#0073E6]"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
              </div>
            </div>
          </div>

          {/* Predict Button */}
          <Button
            onClick={handlePredict}
            disabled={!selectedIpo || !amount || isLoading}
            className="w-full bg-[#0073E6] hover:bg-[#0073E6]/90 text-white font-bold font-ibm-plex shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5 mr-2 text-white" />
                <span>Predict My Allotment</span>
              </>
            )}
          </Button>

          {/* Results */}
          {showResult && prediction !== null && (
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="p-6 space-y-6">
                {/* Meter Visualization */}
                <div className="flex flex-col items-center">
                  <div className="relative w-80 h-48 mb-4">
                    <svg viewBox="0 0 300 180" className="w-full h-full">
                      {/* Gradient Definitions */}
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

                      {/* Background Arc */}
                      <path
                        d="M 50 150 A 100 100 0 0 1 250 150"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="20"
                        strokeLinecap="round"
                      />

                      {/* Red to Yellow Arc */}
                      <path
                        d="M 50 150 A 100 100 0 0 1 150 50"
                        fill="none"
                        stroke="url(#redToYellow)"
                        strokeWidth="20"
                        strokeLinecap="round"
                      />

                      {/* Yellow to Green Arc */}
                      <path
                        d="M 150 50 A 100 100 0 0 1 250 150"
                        fill="none"
                        stroke="url(#yellowToGreen)"
                        strokeWidth="20"
                        strokeLinecap="round"
                      />
                      {/* Needle */}
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
                    <h3 className="text-xl font-black text-gray-900 font-ibm-plex mb-2">
                      Allotment Probability
                    </h3>
                    <div className={`text-5xl font-black ${getMeterColor(prediction)} mb-2 font-ibm-plex`}>
                      {prediction}%
                    </div>
                    <p className="text-gray-600 font-medium font-ibm-plex mb-4">
                      {getMeterMessage(prediction)}
                    </p>
                  </div>
                </div>

                {/* Disclaimer */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
                  <CardContent className="p-4 flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800 font-ibm-plex">
                      <p className="font-bold">Important Disclaimer</p>
                      <p className="font-medium">This prediction is based on historical data and market analysis. Actual allotment depends on various factors including subscription rates, lot size, and category-wise allocation. Use this as guidance, not financial advice.</p>
                    </div>
                  </CardContent>
                </Card>

              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IpoAllotmentModal;