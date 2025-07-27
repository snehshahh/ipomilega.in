// import React, { useState, useEffect } from 'react';
// import { Calculator, TrendingUp, Users, AlertCircle, CheckCircle, Info, Target, DollarSign, Sparkles, BarChart3, TrendingDown } from 'lucide-react';
// // import { Ipo } from '@/app/models/ipo';

// // Mock IPO data for demonstration
// const mockIpos = [
//   {
//     _id: '1',
//     ipo_name: 'TechCorp Solutions IPO',
//     upcoming_ipo_2025: 'TechCorp Solutions IPO',
//     ipo_size: '₹500 Cr',
//     price_band: '300 to 350',
//     ipo_price: '350',
//     listing_price: '420',
//     rii_sr: '12.5',
//     nii_sr: '8.2',
//     qib_sr: '2.1',
//     total_sr: '7.8',
//     gmp_price_gain: 'Premium: ₹70 (20%)',
//     open_date: '2025-01-15',
//     closing_date: '2025-01-17'
//   },
//   {
//     _id: '2',
//     ipo_name: 'GreenEnergy Ltd IPO',
//     upcoming_ipo_2025: 'GreenEnergy Ltd IPO',
//     ipo_size: '₹1200 Cr',
//     price_band: '180 to 200',
//     ipo_price: '200',
//     listing_price: '245',
//     rii_sr: '25.6',
//     nii_sr: '15.3',
//     qib_sr: '4.2',
//     total_sr: '15.7',
//     gmp_price_gain: 'Premium: ₹45 (22.5%)',
//     open_date: '2025-01-20',
//     closing_date: '2025-01-22'
//   }
// ];

// interface AllotmentPredictorProps {
//     ipos?: ay[] | null;
//     selectedIpo?: any;
//     className?: string;
//     isModal?: boolean;
// }

// interface Result {
//     ipoName: string;
//     allotmentChance: number;
//     subscriptionRatio: number;
//     expectedShares: number;
//     expectedGain: number;
//     investmentAmount: number;
//     category: string;
//     riskLevel: string;
//     issueSize: number;
//     pricePerShare: number;
//     categoryQuota: number;
//     gmpGain: number;
//     maxInvestment: number;
//     confidenceLevel: string;
//     marketSentiment: string;
//     recommendedAction: string;
// }

// const AllotmentPredictor: React.FC<AllotmentPredictorProps> = ({
//     ipos = mockIpos,
//     selectedIpo = null,
//     className = "",
//     isModal = false
// }) => {
//     const [selectedIpoId, setSelectedIpoId] = useState<string>('');
//     const [category, setCategory] = useState<string>('');
//     const [applicationAmount, setApplicationAmount] = useState<string>('');
//     const [useMaxAmount, setUseMaxAmount] = useState<boolean>(false);
//     const [result, setResult] = useState<Result | null>(null);
//     const [isCalculating, setIsCalculating] = useState(false);

//     // Enhanced categories with investment limits and descriptions
//     const categories = [
//         {
//             value: 'retail',
//             label: 'Retail Individual Investors (RII)',
//             description: 'Investment up to ₹2,00,000 per individual',
//             quota: '35%',
//             maxInvestment: 200000,
//             minInvestment: 15000,
//             icon: '👤'
//         },
//         {
//             value: 'nii',
//             label: 'Non-Institutional Investors (NII)',
//             description: 'Investment above ₹2,00,000 up to ₹10,00,000',
//             quota: '15%',
//             maxInvestment: 1000000,
//             minInvestment: 200001,
//             icon: '🏢'
//         },
//         {
//             value: 'qib',
//             label: 'Qualified Institutional Buyers (QIB)',
//             description: 'Institutional investors with no upper limit',
//             quota: '50%',
//             maxInvestment: 50000000,
//             minInvestment: 1000001,
//             icon: '🏦'
//         }
//     ];

//     // Initialize selected IPO
//     useEffect(() => {
//         if (selectedIpo) {
//             setSelectedIpoId(selectedIpo._id);
//         }
//     }, [selectedIpo]);

//     // Calculate max investment for selected category and IPO
//     const getMaxInvestmentForCategory = (selectedIpoData: any, categoryValue: string) => {
//         if (!selectedIpoData || !categoryValue) return 0;
        
//         const pricePerShare = parseFloat(selectedIpoData.ipo_price || selectedIpoData.price_band.split(' to ')[1] || '100');
//         const categoryData = categories.find(cat => cat.value === categoryValue);
        
//         if (!categoryData) return 0;
        
//         // Calculate lot size (assuming minimum 1 lot = price per share for simplicity)
//         const lotSize = Math.ceil(15000 / pricePerShare) * pricePerShare; // Minimum lot worth ~15k
//         const maxLots = Math.floor(categoryData.maxInvestment / lotSize);
        
//         return maxLots * lotSize;
//     };

//     // Enhanced calculation logic with multiple factors
//     const calculateAllotment = () => {
//         if (!selectedIpoId || !category) return;

//         setIsCalculating(true);

//         setTimeout(() => {
//             const ipoData = ipos?.find(ipo => ipo._id === selectedIpoId);
//             if (!ipoData) return;

//             const categoryData = categories.find(cat => cat.value === category);
//             if (!categoryData) return;

//             // Determine investment amount
//             let amount = 0;
//             if (useMaxAmount || !applicationAmount) {
//                 amount = getMaxInvestmentForCategory(ipoData, category);
//             } else {
//                 amount = parseFloat(applicationAmount);
//             }

//             // Extract and clean data
//             const issueSize = parseFloat(ipoData.ipo_size.replace(/[^\d.]/g, '')) || 100;
//             const pricePerShare = parseFloat(ipoData.ipo_price || ipoData.price_band.split(' to ')[1] || '100');
            
//             // Get subscription ratios
//             let subscriptionRatio = 1;
//             let categoryQuota = 0;
            
//             switch (category) {
//                 case 'retail':
//                     subscriptionRatio = parseFloat(ipoData.rii_sr?.replace('x', '') || '1');
//                     categoryQuota = 35;
//                     break;
//                 case 'nii':
//                     subscriptionRatio = parseFloat(ipoData.nii_sr?.replace('x', '') || '1');
//                     categoryQuota = 15;
//                     break;
//                 case 'qib':
//                     subscriptionRatio = parseFloat(ipoData.qib_sr?.replace('x', '') || '1');
//                     categoryQuota = 50;
//                     break;
//             }

//             // Enhanced allotment calculation with multiple factors
//             let allotmentChance = 0;
//             let confidenceLevel = '';
//             let marketSentiment = '';
//             let recommendedAction = '';

//             // Base calculation factors
//             const issueSizeFactor = Math.min(issueSize / 500, 2); // Larger IPOs generally have better chances
//             const categoryFactor = categoryQuota / 100; // Higher quota = better base chances
//             const demandIntensity = Math.min(subscriptionRatio, 50); // Cap extreme values
            
//             if (subscriptionRatio <= 1) {
//                 // Undersubscribed
//                 allotmentChance = Math.min(98, 85 + (issueSizeFactor * 10));
//                 confidenceLevel = 'Very High';
//                 marketSentiment = 'Weak Demand';
//                 recommendedAction = 'High probability - Consider applying';
//             } else if (subscriptionRatio <= 3) {
//                 // Moderately oversubscribed
//                 allotmentChance = Math.max(20, 70 - (subscriptionRatio * 15) + (issueSizeFactor * 5));
//                 confidenceLevel = 'High';
//                 marketSentiment = 'Moderate Demand';
//                 recommendedAction = 'Good chances - Worth applying';
//             } else if (subscriptionRatio <= 10) {
//                 // Highly oversubscribed
//                 allotmentChance = Math.max(8, (100 / subscriptionRatio) * issueSizeFactor * 1.2);
//                 confidenceLevel = 'Medium';
//                 marketSentiment = 'High Demand';
//                 recommendedAction = 'Lottery system - Apply with caution';
//             } else {
//                 // Extremely oversubscribed
//                 allotmentChance = Math.max(2, (100 / subscriptionRatio) * issueSizeFactor * 0.8);
//                 confidenceLevel = 'Low';
//                 marketSentiment = 'Extremely High Demand';
//                 recommendedAction = 'Very low chances - High risk';
//             }

//             // Adjust based on category
//             if (category === 'retail' && subscriptionRatio > 5) {
//                 allotmentChance *= 0.7; // Retail gets hit harder in oversubscription
//             } else if (category === 'qib' && subscriptionRatio < 5) {
//                 allotmentChance *= 1.1; // QIB generally has better allocation
//             }

//             // Calculate expected shares with lot consideration
//             const lotSize = Math.ceil(15000 / pricePerShare);
//             let expectedShares = 0;
            
//             if (subscriptionRatio <= 1) {
//                 expectedShares = Math.floor(amount / pricePerShare);
//             } else {
//                 // In oversubscription, typically get minimum lot or proportional
//                 const proportionalShares = Math.floor((amount / pricePerShare) / subscriptionRatio);
//                 expectedShares = Math.max(lotSize, proportionalShares);
//             }

//             // Calculate returns
//             const listingPrice = parseFloat(ipoData.listing_price?.replace('₹', '') || '0');
//             const gmpGain = ipoData.gmp_price_gain ? 
//                 parseFloat(ipoData.gmp_price_gain.match(/\(([\d.]+)%\)/)?.[1] || '0') : 0;

//             const expectedGain = listingPrice > 0 ? 
//                 ((listingPrice - pricePerShare) / pricePerShare) * 100 : gmpGain;

//             // Risk assessment
//             let riskLevel = 'Medium';
//             if (allotmentChance > 60) riskLevel = 'Low';
//             else if (allotmentChance < 20) riskLevel = 'High';

//             setResult({
//                 ipoName: ipoData.ipo_name || ipoData.upcoming_ipo_2025,
//                 allotmentChance: Math.round(allotmentChance),
//                 subscriptionRatio,
//                 expectedShares: Math.max(0, Math.floor(expectedShares)),
//                 expectedGain: Math.round(expectedGain * 100) / 100,
//                 investmentAmount: amount,
//                 category: categoryData.label,
//                 riskLevel,
//                 issueSize,
//                 pricePerShare,
//                 categoryQuota,
//                 gmpGain,
//                 maxInvestment: getMaxInvestmentForCategory(ipoData, category),
//                 confidenceLevel,
//                 marketSentiment,
//                 recommendedAction
//             });

//             setIsCalculating(false);
//         }, 2000);
//     };

//     const resetCalculator = () => {
//         setResult(null);
//         setApplicationAmount('');
//         setUseMaxAmount(false);
//         if (!selectedIpo) {
//             setSelectedIpoId('');
//             setCategory('');
//         }
//     };

//     // Enhanced Progress bar component with animations
//     const ProgressBar = ({ percentage, label, showDetails = false }: { percentage: number; label: string; showDetails?: boolean }) => {
//         const getColor = (percent: number) => {
//             if (percent >= 60) return 'bg-gradient-to-r from-green-400 to-green-600';
//             if (percent >= 30) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
//             return 'bg-gradient-to-r from-red-400 to-red-600';
//         };

//         const getTextColor = (percent: number) => {
//             if (percent >= 60) return 'text-green-700';
//             if (percent >= 30) return 'text-orange-700';
//             return 'text-red-700';
//         };

//         return (
//             <div className="w-full">
//                 <div className="flex justify-between items-center mb-3">
//                     <span className="text-sm font-semibold text-gray-700 font-ibm-plex">{label}</span>
//                     <div className="flex items-center gap-2">
//                         <span className={`text-lg font-black font-ibm-plex ${getTextColor(percentage)}`}>
//                             {percentage}%
//                         </span>
//                         {showDetails && (
//                             <div className="flex items-center">
//                                 {percentage >= 60 ? <CheckCircle className="w-4 h-4 text-green-600" /> :
//                                  percentage >= 30 ? <AlertCircle className="w-4 h-4 text-orange-600" /> :
//                                  <TrendingDown className="w-4 h-4 text-red-600" />}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
//                     <div
//                         className={`h-4 rounded-full transition-all duration-2000 ease-out shadow-lg ${getColor(percentage)}`}
//                         style={{ width: `${Math.min(percentage, 100)}%` }}
//                     />
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className={`${isModal ? 'w-full' : 'max-w-6xl mx-auto'} ${className}`}>
//             {/* Enhanced Header */}
//             {!isModal && (
//                 <div className="text-center mb-10">
//                     <div className="flex items-center justify-center gap-4 mb-6">
//                         <div className="bg-gradient-to-r from-[#0073E6] to-blue-600 p-4 rounded-2xl shadow-lg">
//                             <Calculator className="w-8 h-8 text-white" />
//                         </div>
//                         <div>
//                             <h2 className="text-3xl md:text-4xl font-black text-gray-900 font-ibm-plex bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                                 IPO Allotment Predictor
//                             </h2>
//                             <div className="flex items-center justify-center gap-2 mt-2">
//                                 <Sparkles className="w-4 h-4 text-yellow-500" />
//                                 <span className="text-sm font-semibold text-gray-600 font-ibm-plex">Enhanced AI-Powered Analysis</span>
//                             </div>
//                         </div>
//                     </div>
//                     <p className="text-gray-600 text-base md:text-lg font-ibm-plex max-w-3xl mx-auto leading-relaxed">
//                         Advanced IPO allotment prediction using subscription data, market sentiment, and historical patterns
//                     </p>
//                 </div>
//             )}

//             {/* Enhanced Calculator Form */}
//             <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
//                 <div className="grid lg:grid-cols-3 gap-8">
//                     {/* IPO Selection */}
//                     <div className="space-y-6">
//                         <div>
//                             <label className="block text-sm font-bold text-gray-800 mb-3 font-ibm-plex flex items-center gap-2">
//                                 <BarChart3 className="w-4 h-4 text-[#0073E6]" />
//                                 Select IPO
//                             </label>
//                             <select
//                                 value={selectedIpoId}
//                                 onChange={(e) => setSelectedIpoId(e.target.value)}
//                                 className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0073E6] focus:border-transparent font-ibm-plex text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200"
//                                 disabled={!!selectedIpo}
//                             >
//                                 <option value="">Choose an IPO to analyze</option>
//                                 {ipos?.map((ipo) => (
//                                     <option key={ipo._id} value={ipo._id}>
//                                         {ipo.ipo_name || ipo.upcoming_ipo_2025} (₹{ipo.price_band})
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Category Selection */}
//                         <div>
//                             <label className="block text-sm font-bold text-gray-800 mb-3 font-ibm-plex flex items-center gap-2">
//                                 <Users className="w-4 h-4 text-[#0073E6]" />
//                                 Investor Category
//                             </label>
//                             <div className="space-y-3">
//                                 {categories.map((cat) => (
//                                     <label key={cat.value} className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-[#0073E6] hover:bg-blue-50 transition-all duration-200 cursor-pointer">
//                                         <input
//                                             type="radio"
//                                             name="category"
//                                             value={cat.value}
//                                             checked={category === cat.value}
//                                             onChange={(e) => setCategory(e.target.value)}
//                                             className="mt-1 text-[#0073E6] focus:ring-[#0073E6]"
//                                         />
//                                         <div className="flex-1">
//                                             <div className="flex items-center gap-2 mb-1">
//                                                 <span className="text-lg">{cat.icon}</span>
//                                                 <span className="font-bold text-gray-900 font-ibm-plex text-sm">{cat.label}</span>
//                                             </div>
//                                             <p className="text-xs text-gray-600 font-ibm-plex">{cat.description}</p>
//                                             <div className="flex items-center gap-4 mt-2 text-xs">
//                                                 <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold font-ibm-plex">
//                                                     Quota: {cat.quota}
//                                                 </span>
//                                                 <span className="text-gray-500 font-ibm-plex">
//                                                     Max: ₹{(cat.maxInvestment / 100000).toFixed(1)}L
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </label>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Amount Selection */}
//                     <div className="space-y-6">
//                         <div>
//                             <label className="block text-sm font-bold text-gray-800 mb-3 font-ibm-plex flex items-center gap-2">
//                                 <DollarSign className="w-4 h-4 text-[#0073E6]" />
//                                 Investment Amount
//                             </label>
                            
//                             {/* Max Amount Toggle */}
//                             <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
//                                 <label className="flex items-center gap-3 cursor-pointer">
//                                     <input
//                                         type="checkbox"
//                                         checked={useMaxAmount}
//                                         onChange={(e) => setUseMaxAmount(e.target.checked)}
//                                         className="text-green-600 focus:ring-green-500 rounded"
//                                     />
//                                     <div>
//                                         <span className="font-bold text-green-800 font-ibm-plex">Use Maximum Amount</span>
//                                         <p className="text-xs text-green-700 font-ibm-plex">
//                                             Automatically use the maximum investment allowed for selected category
//                                         </p>
//                                         {category && selectedIpoId && (
//                                             <p className="text-sm font-bold text-green-800 mt-1 font-ibm-plex">
//                                                 Max: ₹{getMaxInvestmentForCategory(ipos?.find(ipo => ipo._id === selectedIpoId), category).toLocaleString()}
//                                             </p>
//                                         )}
//                                     </div>
//                                 </label>
//                             </div>

//                             {/* Manual Amount Input */}
//                             <input
//                                 type="number"
//                                 value={applicationAmount}
//                                 onChange={(e) => setApplicationAmount(e.target.value)}
//                                 placeholder={useMaxAmount ? "Amount will be set automatically" : "Enter investment amount"}
//                                 disabled={useMaxAmount}
//                                 className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0073E6] focus:border-transparent font-ibm-plex text-gray-900 bg-gray-50 hover:bg-white transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500"
//                             />
                            
//                             {category && !useMaxAmount && (
//                                 <div className="mt-2 text-xs text-gray-500 font-ibm-plex">
//                                     Range: ₹{categories.find(cat => cat.value === category)?.minInvestment.toLocaleString()} - ₹{categories.find(cat => cat.value === category)?.maxInvestment.toLocaleString()}
//                                 </div>
//                             )}
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="space-y-3">
//                             <button
//                                 onClick={calculateAllotment}
//                                 disabled={!selectedIpoId || !category || isCalculating}
//                                 className="w-full bg-gradient-to-r from-[#0073E6] to-blue-600 text-white px-6 py-4 rounded-xl font-black text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-ibm-plex shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//                             >
//                                 {isCalculating ? (
//                                     <div className="flex items-center justify-center gap-2">
//                                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                                         Analyzing IPO Data...
//                                     </div>
//                                 ) : (
//                                     <div className="flex items-center justify-center gap-2">
//                                         <Target className="w-5 h-5" />
//                                         Calculate Allotment Chances
//                                     </div>
//                                 )}
//                             </button>
//                             {result && (
//                                 <button
//                                     onClick={resetCalculator}
//                                     className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-ibm-plex"
//                                 >
//                                     Reset & Try Another IPO
//                                 </button>
//                             )}
//                         </div>
//                     </div>

//                     {/* IPO Information Panel */}
//                     <div className="space-y-6">
//                         {selectedIpoId && (
//                             <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl p-6">
//                                 {(() => {
//                                     const selectedIpoData = ipos?.find(ipo => ipo._id === selectedIpoId);
//                                     return selectedIpoData ? (
//                                         <div>
//                                             <h3 className="font-black text-gray-900 mb-4 font-ibm-plex text-lg">
//                                                 📊 {selectedIpoData.ipo_name || selectedIpoData.upcoming_ipo_2025}
//                                             </h3>
//                                             <div className="grid grid-cols-2 gap-4 text-sm">
//                                                 <div className="bg-white p-3 rounded-lg shadow-sm">
//                                                     <span className="text-gray-500 font-ibm-plex block">Price Band</span>
//                                                     <span className="font-bold text-gray-900 font-ibm-plex">₹{selectedIpoData.price_band}</span>
//                                                 </div>
//                                                 <div className="bg-white p-3 rounded-lg shadow-sm">
//                                                     <span className="text-gray-500 font-ibm-plex block">Issue Size</span>
//                                                     <span className="font-bold text-gray-900 font-ibm-plex">{selectedIpoData.ipo_size}</span>
//                                                 </div>
//                                                 <div className="bg-red-50 p-3 rounded-lg border border-red-200">
//                                                     <span className="text-red-600 font-ibm-plex block text-xs">RII Subscription</span>
//                                                     <span className="font-bold text-red-800 font-ibm-plex">{selectedIpoData.rii_sr}x</span>
//                                                 </div>
//                                                 <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
//                                                     <span className="text-orange-600 font-ibm-plex block text-xs">NII Subscription</span>
//                                                     <span className="font-bold text-orange-800 font-ibm-plex">{selectedIpoData.nii_sr}x</span>
//                                                 </div>
//                                                 <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
//                                                     <span className="text-blue-600 font-ibm-plex block text-xs">QIB Subscription</span>
//                                                     <span className="font-bold text-blue-800 font-ibm-plex">{selectedIpoData.qib_sr}x</span>
//                                                 </div>
//                                                 <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
//                                                     <span className="text-purple-600 font-ibm-plex block text-xs">Total Subscription</span>
//                                                     <span className="font-bold text-purple-800 font-ibm-plex">{selectedIpoData.total_sr}x</span>
//                                                 </div>
//                                             </div>
//                                             {selectedIpoData.gmp_price_gain && (
//                                                 <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
//                                                     <span className="text-green-600 font-ibm-plex block text-xs">Grey Market Premium</span>
//                                                     <span className="font-bold text-green-800 font-ibm-plex">{selectedIpoData.gmp_price_gain}</span>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     ) : null;
//                                 })()}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Enhanced Results */}
//             {result && (
//                 <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
//                     <div className="flex items-center gap-4 mb-8">
//                         <div className="bg-gradient-to-r from-green-400 to-green-600 p-3 rounded-2xl shadow-lg">
//                             <CheckCircle className="w-6 h-6 text-white" />
//                         </div>
//                         <div>
//                             <h3 className="text-2xl font-black text-gray-900 font-ibm-plex">
//                                 Allotment Analysis for {result.ipoName}
//                             </h3>
//                             <p className="text-gray-600 font-ibm-plex">
//                                 Investment: ₹{result.investmentAmount.toLocaleString()} • Category: {result.category}
//                             </p>
//                         </div>
//                     </div>

//                     {/* Main Allotment Probability */}
//                     <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border-2 border-blue-200">
//                         <div className="flex items-center gap-3 mb-4">
//                             <Target className="w-6 h-6 text-[#0073E6]" />
//                             <h4 className="text-xl font-black text-gray-900 font-ibm-plex">Allotment Probability Analysis</h4>
//                         </div>
//                         <ProgressBar
//                             percentage={result.allotmentChance}
//                             label="Your chances of getting IPO allotment"
//                             showDetails={true}
//                         />
//                         <div className="mt-4 grid md:grid-cols-3 gap-4">
//                             <div className="text-center">
//                                 <div className="text-sm text-gray-600 font-ibm-plex">Confidence Level</div>
//                                 <div className="font-black text-lg text-gray-900 font-ibm-plex">{result.confidenceLevel}</div>
//                             </div>
//                             <div className="text-center">
//                                 <div className="text-sm text-gray-600 font-ibm-plex">Market Sentiment</div>
//                                 <div className="font-black text-lg text-gray-900 font-ibm-plex">{result.marketSentiment}</div>
//                             </div>
//                             <div className="text-center">
//                                 <div className="text-sm text-gray-600 font-ibm-plex">Risk Level</div>
//                                 <div className={`font-black text-lg font-ibm-plex ${
//                                     result.riskLevel === 'Low' ? 'text-green-600' :
//                                     result.riskLevel === 'Medium' ? 'text-yellow-600' :
//                                     'text-red-600'
//                                 }`}>{result.riskLevel}</div>
//                             </div>
//                         </div>
//                         <div className="mt-4 p-4 bg-white rounded-xl border border-blue-200">
//                             <div className="flex items-center gap-2 mb-2">
//                                 <Info className="w-4 h-4 text-blue-600" />
//                                 <span className="font-bold text-blue-900 font-ibm-plex">Recommendation</span>
//                             </div>
//                             <p className="text-blue-800 font-ibm-plex font-medium">{result.recommendedAction}</p>
//                         </div>
//                     </div>

//                     {/* Key Metrics Grid */}
//                     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                         {/* Subscription Ratio */}
//                         <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200">
//                             <div className="flex items-center justify-between mb-3">
//                                 <Users className="w-8 h-8 opacity-80" />
//                                 <div className="text-right">
//                                     <div className="text-3xl font-black font-ibm-plex">{result.subscriptionRatio}x</div>
//                                     <div className="text-xs opacity-90 font-ibm-plex">Oversubscribed</div>
//                                 </div>
//                             </div>
//                             <div className="text-sm font-medium font-ibm-plex">Subscription Ratio</div>
//                         </div>

//                         {/* Expected Shares */}
//                         <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200">
//                             <div className="flex items-center justify-between mb-3">
//                                 <Calculator className="w-8 h-8 opacity-80" />
//                                 <div className="text-right">
//                                     <div className="text-3xl font-black font-ibm-plex">{result.expectedShares}</div>
//                                     <div className="text-xs opacity-90 font-ibm-plex">Shares (if allotted)</div>
//                                 </div>
//                             </div>
//                             <div className="text-sm font-medium font-ibm-plex">Expected Allocation</div>
//                         </div>

//                         {/* Expected Gain */}
//                         <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200">
//                             <div className="flex items-center justify-between mb-3">
//                                 <TrendingUp className="w-8 h-8 opacity-80" />
//                                 <div className="text-right">
//                                     <div className="text-3xl font-black font-ibm-plex">{result.expectedGain}%</div>
//                                     <div className="text-xs opacity-90 font-ibm-plex">On listing day</div>
//                                 </div>
//                             </div>
//                             <div className="text-sm font-medium font-ibm-plex">Expected Returns</div>
//                         </div>

//                         {/* Investment Value */}
//                         <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200">
//                             <div className="flex items-center justify-between mb-3">
//                                 <DollarSign className="w-8 h-8 opacity-80" />
//                                 <div className="text-right">
//                                     <div className="text-2xl font-black font-ibm-plex">₹{(result.investmentAmount / 100000).toFixed(1)}L</div>
//                                     <div className="text-xs opacity-90 font-ibm-plex">Applied amount</div>
//                                 </div>
//                             </div>
//                             <div className="text-sm font-medium font-ibm-plex">Investment Amount</div>
//                         </div>
//                     </div>

//                     {/* Detailed Analysis */}
//                     <div className="grid lg:grid-cols-2 gap-8 mb-8">
//                         {/* Investment Breakdown */}
//                         <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-2xl p-6">
//                             <div className="flex items-center gap-3 mb-6">
//                                 <BarChart3 className="w-6 h-6 text-[#0073E6]" />
//                                 <h4 className="font-black text-gray-900 font-ibm-plex text-xl">Investment Analysis</h4>
//                             </div>
//                             <div className="space-y-4">
//                                 <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
//                                     <span className="text-gray-600 font-ibm-plex font-medium">Price per Share</span>
//                                     <span className="font-black text-gray-900 font-ibm-plex">₹{result.pricePerShare}</span>
//                                 </div>
//                                 <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
//                                     <span className="text-gray-600 font-ibm-plex font-medium">Category Quota</span>
//                                     <span className="font-black text-gray-900 font-ibm-plex">{result.categoryQuota}%</span>
//                                 </div>
//                                 <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
//                                     <span className="text-gray-600 font-ibm-plex font-medium">Issue Size</span>
//                                     <span className="font-black text-gray-900 font-ibm-plex">₹{result.issueSize} Cr</span>
//                                 </div>
//                                 <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
//                                     <span className="text-green-700 font-ibm-plex font-medium">Potential Profit</span>
//                                     <span className="font-black text-green-800 font-ibm-plex">
//                                         ₹{Math.round(result.expectedShares * result.pricePerShare * (result.expectedGain / 100)).toLocaleString()}
//                                     </span>
//                                 </div>
//                                 {result.gmpGain > 0 && (
//                                     <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                                         <span className="text-yellow-700 font-ibm-plex font-medium">Grey Market Premium</span>
//                                         <span className="font-black text-yellow-800 font-ibm-plex">{result.gmpGain}%</span>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Strategy & Tips */}
//                         <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
//                             <div className="flex items-center gap-3 mb-6">
//                                 <Sparkles className="w-6 h-6 text-purple-600" />
//                                 <h4 className="font-black text-gray-900 font-ibm-plex text-xl">Strategy & Tips</h4>
//                             </div>
//                             <div className="space-y-4">
//                                 <div className="p-4 bg-white rounded-xl border border-purple-200">
//                                     <h5 className="font-bold text-purple-900 font-ibm-plex mb-2">🎯 Allotment Strategy</h5>
//                                     <p className="text-sm text-purple-800 font-ibm-plex">
//                                         {result.allotmentChance > 60 ? 
//                                             'High probability scenario - Consider full allocation with confidence.' :
//                                             result.allotmentChance > 30 ?
//                                             'Moderate chances - Apply with measured risk. Consider diversifying across multiple IPOs.' :
//                                             'Low probability - Lottery system likely. Apply smaller amounts or skip if risk-averse.'
//                                         }
//                                     </p>
//                                 </div>
                                
//                                 <div className="p-4 bg-white rounded-xl border border-purple-200">
//                                     <h5 className="font-bold text-purple-900 font-ibm-plex mb-2">💡 Pro Tips</h5>
//                                     <ul className="text-sm text-purple-800 font-ibm-plex space-y-1">
//                                         <li>• Apply early to avoid last-minute technical issues</li>
//                                         <li>• Use UPI for faster payment processing</li>
//                                         <li>• Multiple demat accounts can increase chances</li>
//                                         <li>• Consider family member applications (HUF, spouse)</li>
//                                     </ul>
//                                 </div>

//                                 <div className="p-4 bg-white rounded-xl border border-purple-200">
//                                     <h5 className="font-bold text-purple-900 font-ibm-plex mb-2">⚠️ Risk Factors</h5>
//                                     <ul className="text-sm text-purple-800 font-ibm-plex space-y-1">
//                                         <li>• Market conditions can affect listing performance</li>
//                                         <li>• High subscription doesn't guarantee profits</li>
//                                         <li>• Funds blocked until allotment/refund</li>
//                                         <li>• Consider overall portfolio allocation</li>
//                                     </ul>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Enhanced Disclaimer */}
//                     <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl">
//                         <div className="flex items-start gap-3">
//                             <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
//                             <div>
//                                 <h5 className="font-bold text-yellow-800 font-ibm-plex mb-2">Important Disclaimer</h5>
//                                 <p className="text-sm text-yellow-800 font-ibm-plex leading-relaxed">
//                                     <strong>Investment Risk Warning:</strong> This calculator provides estimated allotment probabilities based on current subscription data, 
//                                     historical patterns, and market analysis. Actual allotment results may vary significantly due to final subscription numbers, 
//                                     regulatory changes, market conditions, and random lottery systems. <strong>IPO investments carry substantial risk</strong> including 
//                                     potential loss of capital. Past performance and grey market premiums do not guarantee future results. 
//                                     Please conduct thorough research, read the prospectus carefully, and consult qualified financial advisors before making investment decisions. 
//                                     Only invest amounts you can afford to lose.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AllotmentPredictor;