import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Users, AlertCircle, CheckCircle, Info, Target, DollarSign } from 'lucide-react';
import { Ipo } from '@/app/models/ipo';


interface AllotmentPredictorProps {
    ipos?: Ipo[] | null;
    selectedIpo?: Ipo;
    className?: string;
    isModal?: boolean;
}

interface Result {
    ipoName: string;
    allotmentChance: number;
    subscriptionRatio: number;
    expectedShares: number;
    expectedGain: number;
    investmentAmount: number;
    category: string;
    riskLevel: string;
    issueSize: number;
    pricePerShare: number;
    categoryQuota: number;
    gmpGain: number;
}

const AllotmentPredictor: React.FC<AllotmentPredictorProps> = ({
    ipos = null,
    selectedIpo = null,
    className = "",
    isModal = false
}) => {
    const [selectedIpoId, setSelectedIpoId] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [applicationAmount, setApplicationAmount] = useState<string>('');
    const [result, setResult] = useState<Result | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Categories with descriptions
    const categories = [
        {
            value: 'retail',
            label: 'Retail Individual Investors (RII)',
            description: 'Investment up to ₹2 lakhs',
            quota: '35%'
        },
        {
            value: 'nii',
            label: 'Non-Institutional Investors (NII)',
            description: 'Investment above ₹2 lakhs up to ₹10 lakhs',
            quota: '15%'
        },
        {
            value: 'qib',
            label: 'Qualified Institutional Buyers (QIB)',
            description: 'Institutional investors',
            quota: '50%'
        }
    ];

    // Initialize selected IPO
    useEffect(() => {
        if (selectedIpo) {
            setSelectedIpoId(selectedIpo._id);
        }
    }, [selectedIpo]);

    // Enhanced calculation with issue size consideration
    const calculateAllotment = () => {
        if (!selectedIpoId || !category || !applicationAmount) return;

        setIsCalculating(true);

        setTimeout(() => {
            const selectedIpoData = ipos?.find(ipo => ipo._id === selectedIpoId);
            if (!selectedIpoData) return;

            const amount = parseFloat(applicationAmount);
            let subscriptionRatio = 1;
            let allotmentChance = 0;
            let expectedShares = 0;
            let categoryQuota = 0;

            // Extract numeric values from strings
            const issueSize = parseFloat(selectedIpoData.ipo_size.replace(/[^\d.]/g, '')) || 100;
            const pricePerShare = parseFloat(selectedIpoData.ipo_price || selectedIpoData.price_band.split(' to ')[1] || '100');

            // Get subscription ratio and quota based on category
            switch (category) {
                case 'retail':
                    subscriptionRatio = parseFloat(selectedIpoData.rii_sr?.replace('x', '') || '1');
                    categoryQuota = 35;
                    break;
                case 'nii':
                    subscriptionRatio = parseFloat(selectedIpoData.nii_sr?.replace('x', '') || '1');
                    categoryQuota = 15;
                    break;
                case 'qib':
                    subscriptionRatio = parseFloat(selectedIpoData.qib_sr?.replace('x', '') || '1');
                    categoryQuota = 50;
                    break;
            }

            // Calculate total shares available for category
            //const totalShares = (issueSize * 10000000) / pricePerShare; // Convert crores to actual amount
            //const categoryShares = (totalShares * categoryQuota) / 100;

            // Enhanced allotment calculation considering issue size and demand
            if (subscriptionRatio <= 1) {
                allotmentChance = Math.min(100, 95 - (subscriptionRatio * 5));
                expectedShares = amount / pricePerShare;
            } else {
                // Calculate based on oversubscription and issue size
                const demandFactor = Math.min(subscriptionRatio, 10);
                const sizeFactor = Math.min(issueSize / 100, 2); // Larger IPOs have slightly better chances

                allotmentChance = Math.max(3, Math.min(85, (100 / demandFactor) * sizeFactor));
                expectedShares = Math.floor((amount / pricePerShare) / subscriptionRatio);
            }

            // Adjust for very high oversubscription
            if (subscriptionRatio > 5) {
                allotmentChance = Math.max(2, allotmentChance * 0.6);
            }

            // Calculate potential returns
            const listingPrice = parseFloat(selectedIpoData.listing_price?.replace('₹', '') || '0');
            const gmpGain = selectedIpoData.gmp_price_gain ?
                parseFloat(selectedIpoData.gmp_price_gain.match(/\(([\d.]+)%\)/)?.[1] || '0') : 0;

            const expectedGain = listingPrice > 0 ?
                ((listingPrice - pricePerShare) / pricePerShare) * 100 :
                gmpGain;

            setResult({
                ipoName: selectedIpoData.ipo_name || selectedIpoData.upcoming_ipo_2025,
                allotmentChance: Math.round(allotmentChance),
                subscriptionRatio,
                expectedShares: Math.max(0, Math.floor(expectedShares)),
                expectedGain: Math.round(expectedGain * 100) / 100,
                investmentAmount: amount,
                category: categories.find(cat => cat.value === category)?.label || '',
                riskLevel: allotmentChance > 60 ? 'Low' : allotmentChance > 30 ? 'Medium' : 'High',
                issueSize: issueSize,
                pricePerShare: pricePerShare,
                categoryQuota: categoryQuota,
                gmpGain: gmpGain
            });

            setIsCalculating(false);
        }, 1500);
    };

    const resetCalculator = () => {
        setResult(null);
        setApplicationAmount('');
        if (!selectedIpo) {
            setSelectedIpoId('');
            setCategory('');
        }
    };

    // Progress bar component
    const ProgressBar = ({ percentage, label }: { percentage: number; label: string }) => {
        const getColor = (percent: number) => {
            if (percent >= 60) return 'bg-green-500';
            if (percent >= 30) return 'bg-yellow-500';
            return 'bg-red-500';
        };

        return (
            <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600 font-ibm-plex">{label}</span>
                    <span className="text-sm font-bold text-gray-900 font-ibm-plex">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all duration-1000 ease-out ${getColor(percentage)}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className={`${isModal ? 'w-full' : 'max-w-4xl mx-auto'} ${className}`}>
            {/* Header - only show if not in modal */}
            {!isModal && (
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="bg-[#0073E6] p-3 rounded-full">
                            <Calculator className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 font-ibm-plex">
                            IPO Allotment Predictor
                        </h2>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base font-ibm-plex max-w-2xl mx-auto">
                        Calculate your chances of getting IPO allotment based on subscription levels, issue size, and category
                    </p>
                </div>
            )}

            {/* Show message if no IPOs available */}
            {ipos?.length === 0 ? (
                <div className="text-center py-8">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2 font-ibm-plex">No IPOs Available</h3>
                        <p className="text-gray-600 font-ibm-plex">
                            There are currently no IPOs available to calculate allotment chances. Please check back later.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Calculator Form */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* IPO Selection */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 font-ibm-plex">
                                        Select IPO
                                    </label>
                                    <select
                                        value={selectedIpoId}
                                        onChange={(e) => setSelectedIpoId(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073E6] focus:border-transparent font-ibm-plex"
                                        disabled={!!selectedIpo}
                                    >
                                        <option value="">Choose an IPO</option>
                                        {ipos?.map((ipo) => (
                                            <option key={ipo._id} value={ipo._id}>
                                                {ipo.ipo_name || ipo.upcoming_ipo_2025} (₹{ipo.price_band})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Category Selection */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 font-ibm-plex">
                                        Investor Category
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073E6] focus:border-transparent font-ibm-plex"
                                    >
                                        <option value="">Choose category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Application Amount */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 font-ibm-plex">
                                        Application Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={applicationAmount}
                                        onChange={(e) => setApplicationAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0073E6] focus:border-transparent font-ibm-plex"
                                    />
                                </div>
                            </div>

                            {/* Category Info & Action */}
                            <div className="space-y-4">
                                {/* Category Info */}
                                {category && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h3 className="font-bold text-blue-900 mb-2 font-ibm-plex">
                                            {categories.find(cat => cat.value === category)?.label}
                                        </h3>
                                        <p className="text-blue-700 text-sm mb-2 font-ibm-plex">
                                            {categories.find(cat => cat.value === category)?.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-blue-800">
                                            <Info className="w-4 h-4" />
                                            <span className="text-sm font-medium font-ibm-plex">
                                                Quota: {categories.find(cat => cat.value === category)?.quota}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Selected IPO Info */}
                                {selectedIpoId && (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        {(() => {
                                            const selectedIpoData = ipos?.find(ipo => ipo._id === selectedIpoId);
                                            return selectedIpoData ? (
                                                <div>
                                                    <h3 className="font-bold text-gray-900 mb-2 font-ibm-plex">
                                                        {selectedIpoData.ipo_name || selectedIpoData.upcoming_ipo_2025}
                                                    </h3>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <span className="text-gray-500 font-ibm-plex">Price Band:</span>
                                                            <span className="font-medium ml-1 font-ibm-plex">₹{selectedIpoData.price_band}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500 font-ibm-plex">Size:</span>
                                                            <span className="font-medium ml-1 font-ibm-plex">{selectedIpoData.ipo_size}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500 font-ibm-plex">RII:</span>
                                                            <span className="font-medium ml-1 font-ibm-plex">{selectedIpoData.rii_sr}x</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500 font-ibm-plex">NII:</span>
                                                            <span className="font-medium ml-1 font-ibm-plex">{selectedIpoData.nii_sr}x</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500 font-ibm-plex">QIB:</span>
                                                            <span className="font-medium ml-1 font-ibm-plex">{selectedIpoData.qib_sr}x</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-500 font-ibm-plex">Total:</span>
                                                            <span className="font-medium ml-1 font-ibm-plex">{selectedIpoData.total_sr}x</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null;
                                        })()}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={calculateAllotment}
                                        disabled={!selectedIpoId || !category || !applicationAmount || isCalculating}
                                        className="flex-1 bg-[#0073E6] text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-ibm-plex"
                                    >
                                        {isCalculating ? 'Calculating...' : 'Calculate Chances'}
                                    </button>
                                    {result && (
                                        <button
                                            onClick={resetCalculator}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors font-ibm-plex"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    {result && (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 font-ibm-plex">
                                    Allotment Analysis for {result.ipoName}
                                </h3>
                            </div>

                            {/* Progress Bar for Allotment Chance */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <Target className="w-5 h-5 text-[#0073E6]" />
                                    <h4 className="text-lg font-bold text-gray-900 font-ibm-plex">Allotment Probability</h4>
                                </div>
                                <ProgressBar
                                    percentage={result.allotmentChance}
                                    label="Chances of getting IPO allotment based on current subscription levels"
                                />
                                <p className="text-sm text-gray-600 mt-2 font-ibm-plex">
                                    {result.allotmentChance >= 60 ? 'High probability - Good chances of allotment' :
                                        result.allotmentChance >= 30 ? 'Moderate probability - Average chances' :
                                            'Low probability - Oversubscribed, lottery-based allotment'}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {/* Subscription Ratio */}
                                <div className="bg-gradient-to-r from-[#B4292E] to-red-600 text-white p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="w-5 h-5" />
                                        <span className="text-sm font-medium font-ibm-plex">Subscription</span>
                                    </div>
                                    <div className="text-2xl font-black font-ibm-plex">{result.subscriptionRatio}x</div>
                                    <div className="text-xs opacity-90 font-ibm-plex">Oversubscribed</div>
                                </div>

                                {/* Expected Shares */}
                                <div className="bg-gradient-to-r from-[#00914D] to-green-600 text-white p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calculator className="w-5 h-5" />
                                        <span className="text-sm font-medium font-ibm-plex">Expected Shares</span>
                                    </div>
                                    <div className="text-2xl font-black font-ibm-plex">{result.expectedShares}</div>
                                    <div className="text-xs opacity-90 font-ibm-plex">If allotted</div>
                                </div>

                                {/* Expected Gain */}
                                <div className="bg-gradient-to-r from-[#D59527] to-orange-600 text-white p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-5 h-5" />
                                        <span className="text-sm font-medium font-ibm-plex">Expected Gain</span>
                                    </div>
                                    <div className="text-2xl font-black font-ibm-plex">{result.expectedGain}%</div>
                                    <div className="text-xs opacity-90 font-ibm-plex">On listing</div>
                                </div>

                                {/* Investment Amount */}
                                <div className="bg-gradient-to-r from-[#0073E6] to-blue-600 text-white p-4 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-5 h-5" />
                                        <span className="text-sm font-medium font-ibm-plex">Investment</span>
                                    </div>
                                    <div className="text-2xl font-black font-ibm-plex">₹{result.investmentAmount.toLocaleString()}</div>
                                    <div className="text-xs opacity-90 font-ibm-plex">Application amount</div>
                                </div>
                            </div>

                            {/* Detailed Analysis */}
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                {/* Risk Assessment */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertCircle className="w-5 h-5 text-orange-500" />
                                        <h4 className="font-bold text-gray-900 font-ibm-plex">Risk Assessment</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-600 font-ibm-plex">Allotment Risk:</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold font-ibm-plex ${result.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                                                    result.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {result.riskLevel}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 font-ibm-plex">
                                            <div>Category: {result.category}</div>
                                            <div>Quota: {result.categoryQuota}%</div>
                                            <div>Issue Size: ₹{result.issueSize} Cr</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Info className="w-5 h-5 text-blue-500" />
                                        <h4 className="font-bold text-blue-900 font-ibm-plex">Additional Information</h4>
                                    </div>
                                    <div className="space-y-2 text-sm text-blue-800 font-ibm-plex">
                                        <div>Price per share: ₹{result.pricePerShare}</div>
                                        <div>Potential profit: ₹{Math.round(result.expectedShares * result.pricePerShare * (result.expectedGain / 100))}</div>
                                        {result.gmpGain > 0 && (
                                            <div>Grey Market Premium: {result.gmpGain}%</div>
                                        )}
                                        <div className="text-xs text-blue-600 mt-2">
                                            Calculations based on current subscription levels and historical patterns
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-xs text-yellow-800 font-ibm-plex">
                                    <strong>Disclaimer:</strong> This calculator provides estimated allotment chances based on current subscription data, issue size, and historical patterns.
                                    Actual allotment may vary based on final subscription numbers, lottery system, and other factors.
                                    Please consult with financial advisors before making investment decisions. Past performance does not guarantee future results.
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AllotmentPredictor;