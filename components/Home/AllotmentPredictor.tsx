
import React, { useState, useEffect } from 'react';
import { X, ChevronDown, TrendingUp, Info } from 'lucide-react';

// Mock IPO data - replace with your actual data
const mockIpos = [
  { _id: '1', upcoming_ipo_2025: 'Jainik Power and Cables', price_band: '250-265', status: 'live' },
  { _id: '2', upcoming_ipo_2025: 'Concord Enviro Systems', price_band: '650-685', status: 'live' },
  { _id: '3', upcoming_ipo_2025: 'Sanathan Textiles', price_band: '305-321', status: 'upcoming' },
  { _id: '4', upcoming_ipo_2025: 'Metalman Auto', price_band: '90-96', status: 'upcoming' },
  { _id: '5', upcoming_ipo_2025: 'Vikrant Tyres', price_band: '280-295', status: 'live' },
];

interface IpoAllotmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedIpoId?: string;
}

const IpoAllotmentModal: React.FC<IpoAllotmentModalProps> = ({ 
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

  const getSelectedIpoName = () => {
    if (!selectedIpo) return 'Select an IPO';
    const ipo = mockIpos.find(i => i._id === selectedIpo);
    return ipo ? ipo.upcoming_ipo_2025 : 'Select an IPO';
  };

  const getMeterColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-500';
    if (percentage >= 50) return 'text-yellow-500';
    if (percentage >= 25) return 'text-orange-500';
    return 'text-red-500';
  };

  const getMeterBackground = (percentage: number) => {
    if (percentage >= 75) return 'from-green-400 to-green-600';
    if (percentage >= 50) return 'from-yellow-400 to-yellow-600';
    if (percentage >= 25) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const generateMeterPath = (percentage: number) => {
    const angle = (percentage / 100) * 180;
    const radians = (angle * Math.PI) / 180;
    const x = 150 + 120 * Math.cos(Math.PI - radians);
    const y = 150 - 120 * Math.sin(Math.PI - radians);
    
    return `M 30 150 A 120 120 0 0 1 ${x} ${y}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">IPO Allotment Prediction</h2>
            <p className="text-gray-600 text-sm mt-1">Predict your chances of getting IPO allotment</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* IPO Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select IPO
            </label>
            <div className="relative">
              <select
                value={selectedIpo}
                onChange={(e) => setSelectedIpo(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="">All IPOs (General Analysis)</option>
                {mockIpos.map((ipo) => (
                  <option key={ipo._id} value={ipo._id}>
                    {ipo.upcoming_ipo_2025} (₹{ipo.price_band})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Investment Category and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Investment Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Investment Category
              </label>
              <div className="relative">
                <select
                  value={investmentCategory}
                  onChange={(e) => setInvestmentCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="retail">Retail Investor</option>
                  <option value="hni">HNI (High Net Worth)</option>
                  <option value="qib">QIB (Qualified Institutional)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Investment Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
              </div>
            </div>
          </div>

          {/* Predict Button */}
          <button
            onClick={handlePredict}
            disabled={!selectedIpo || !amount || isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                <span>Predict My Allotment</span>
              </>
            )}
          </button>

          {/* Results */}
          {showResult && prediction !== null && (
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              {/* Meter Visualization */}
              <div className="flex flex-col items-center">
                <div className="relative w-80 h-40 mb-4">
                  <svg viewBox="0 0 300 150" className="w-full h-full">
                    {/* Background arc */}
                    <path
                      d="M 30 150 A 120 120 0 0 1 270 150"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    
                    {/* Colored segments */}
                    <path
                      d="M 30 150 A 120 120 0 0 1 90 60"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="20"
                      strokeLinecap="round"
                      opacity="0.3"
                    />
                    <path
                      d="M 90 60 A 120 120 0 0 1 150 30"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="20"
                      strokeLinecap="round"
                      opacity="0.3"
                    />
                    <path
                      d="M 150 30 A 120 120 0 0 1 210 60"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="20"
                      strokeLinecap="round"
                      opacity="0.3"
                    />
                    <path
                      d="M 210 60 A 120 120 0 0 1 270 150"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="20"
                      strokeLinecap="round"
                      opacity="0.3"
                    />
                    
                    {/* Progress arc */}
                    <path
                      d={generateMeterPath(prediction)}
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />
                    
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" className={`stop-color-${getMeterBackground(prediction).split('-')[1]}-400`} />
                        <stop offset="100%" className={`stop-color-${getMeterBackground(prediction).split('-')[3]}-600`} />
                      </linearGradient>
                    </defs>
                    
                    {/* Needle */}
                    <g transform={`rotate(${(prediction / 100) * 180} 150 150)`}>
                      <line
                        x1="150"
                        y1="150"
                        x2="150"
                        y2="40"
                        stroke="#374151"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="150"
                        cy="150"
                        r="8"
                        fill="#374151"
                      />
                    </g>
                  </svg>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Here&apos;s what your chances look like:
                  </h3>
                  <div className={`text-4xl font-bold ${getMeterColor(prediction)} mb-2`}>
                    {prediction}%
                  </div>
                  <p className="text-gray-600 font-medium">
                    Chance of getting the IPO allotment
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Important Disclaimer</p>
                  <p>This prediction is based on historical data and market analysis. Actual allotment depends on various factors including subscription rates, lot size, and category-wise allocation. Use this as guidance, not financial advice.</p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-800 mb-2">Your Application</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-600">IPO:</span> {getSelectedIpoName()}</p>
                    <p><span className="text-gray-600">Category:</span> {investmentCategory.toUpperCase()}</p>
                    <p><span className="text-gray-600">Amount:</span> ₹{amount}</p>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="font-semibold text-gray-800 mb-2">Factors Considered</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>• Historical subscription data</p>
                    <p>• Category-wise allocation</p>
                    <p>• Investment amount vs. lot size</p>
                    <p>• Market sentiment</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IpoAllotmentModal;
