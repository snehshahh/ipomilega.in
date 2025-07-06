import React from 'react';
import { Clock, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { Ipo } from '@/app/models/ipo';
import { IpoComprehensiveAnalysis } from '@/app/models/ipo_comprehensive_analysis';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Image from 'next/image';

interface IpoCardProps {
  ipo: Ipo | null;
  analysis: IpoComprehensiveAnalysis | null;
}

// Utility function for getting company initials
const getInitials = (name: string) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((word: string) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Utility function to get risk border color
const getRiskBorderColor = (riskScore: number) => {
  if (riskScore <= 3) return 'border-b-green-500';
  if (riskScore <= 6) return 'border-b-yellow-500';
  return 'border-b-red-500';
};

// Live IPO Card Component
export function LiveIpoCard({ ipo, analysis }: IpoCardProps) {
  const getDaysUntilClosing = () => {
    if (!ipo?.closing_date) return 0;
    const closingDate = new Date(ipo.closing_date);
    const today = new Date();
    const diffTime = closingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysUntilClosing = getDaysUntilClosing();
  const riskScore = analysis?.risk_meter?.score || 0;
  const riskBorderColor = getRiskBorderColor(riskScore);

  return (
    <Card className={`w-full max-w-md mx-auto overflow-hidden border-2 py-0 border-gray-200 bg-white h-auto border-b-4 ${riskBorderColor} rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`} style={{ fontFamily: 'var(--font-ibm-plex)' }}>
      <CardContent className="p-0 h-full flex flex-col">
        {/* Creative Company Image with Hexagonal Overlay */}
        <div className="w-full h-48 relative overflow-hidden rounded-t-xl bg-gradient-to-br from-red-500 via-red-600 to-red-700">
          <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-800/40"></div>
          <div className="w-full h-full relative">
            {ipo?.image_url ? (
              <div className="relative w-full h-full">
                <Image
                  src={ipo.image_url}
                  alt={`${ipo?.upcoming_ipo_2025} logo`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 mix-blend-overlay"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                {/* Hexagonal frame overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20 backdrop-blur-[1px]"></div>
              </div>
            ) : null}
            <div className={`absolute inset-0 bg-gradient-to-br from-red-500/90 to-red-700/90 text-white text-4xl font-bold flex items-center justify-center ${!ipo?.image_url ? 'flex' : 'hidden'}`}>
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center border-2 border-white/30">
                {getInitials(ipo?.upcoming_ipo_2025 || '')}
              </div>
            </div>
          </div>
          {/* Animated Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/95 backdrop-blur-sm text-red-600 text-xs font-medium px-3 py-1.5 animate-pulse border border-red-200">
              🔴 LIVE - {daysUntilClosing}d left
            </Badge>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-6 left-6 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
            <div className="absolute bottom-6 right-8 w-3 h-3 bg-white/30 rounded-full"></div>
          </div>
        </div>

        {/* Content Below Image */}
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          {/* Header with Exchange Badges */}
          <div className="flex justify-between items-center flex-wrap gap-2">
        
            <Badge variant="outline" className="bg-gray-50 border-gray-300 text-gray-800 text-xs font-medium">
              {ipo?.ipo_type || 'N/A'}
            </Badge>
          </div>

          {/* Company Info */}
          <div className="text-center">
            <h2 className="text-xl text-gray-900 font-bold leading-tight mb-1">
              {ipo?.upcoming_ipo_2025 || 'Company Name'}
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              {ipo?.ipo_size || 'N/A'} | ₹{ipo?.price_band || 'N/A'}
            </p>
          </div>

          {/* IPO Timeline */}
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm text-gray-800 flex items-center justify-center space-x-1 font-semibold">
              <Clock className="w-4 h-4 text-gray-600" />
              <span>Timeline</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <span className="text-gray-600 font-medium block">Opens</span>
                <span className="font-semibold">{ipo?.open_date || 'N/A'}</span>
              </div>
              <div className="text-center">
                <span className="text-gray-600 font-medium block">Closes</span>
                <span className="text-red-600 font-semibold">{ipo?.closing_date || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Current Performance */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-xs text-gray-500 font-medium mb-1">GMP</h4>
              <div className="flex items-center justify-center space-x-1">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 font-semibold">₹{ipo?.gmp_price_gain || 0}</span>
              </div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-xs text-gray-500 font-medium mb-1">Risk</h4>
              <span className="text-sm text-gray-700 font-semibold">{riskScore}/10</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto">
            <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 text-sm py-2 font-medium transition-colors">
              View Analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Upcoming IPO Card Component
export function UpcomingIpoCard({ ipo, analysis }: IpoCardProps) {
  const getDaysUntilOpening = () => {
    if (!ipo?.open_date) return 0;
    const openingDate = new Date(ipo.open_date);
    const today = new Date();
    const diffTime = openingDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysUntilOpening = getDaysUntilOpening();
  const riskScore = analysis?.risk_meter?.score || 0;
  const riskBorderColor = getRiskBorderColor(riskScore);

  return (
    <Card className={`w-full max-w-md mx-auto overflow-hidden py-0 border-2 border-gray-200 bg-white h-auto border-b-4 ${riskBorderColor} rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`} style={{ fontFamily: 'var(--font-ibm-plex)' }}>
      <CardContent className="p-0 h-full flex flex-col">
        {/* Creative Company Image with Blue Gradient */}
        <div className="w-full h-48 relative overflow-hidden rounded-t-xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-800/40"></div>
          <div className="w-full h-full relative">
            {ipo?.image_url ? (
              <div className="relative w-full h-full">
                <Image
                  src={ipo.image_url}
                  alt={`${ipo?.upcoming_ipo_2025} logo`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 mix-blend-overlay"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20 backdrop-blur-[1px]"></div>
              </div>
            ) : null}
            <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/90 to-blue-700/90 text-white text-4xl font-bold flex items-center justify-center ${!ipo?.image_url ? 'flex' : 'hidden'}`}>
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center border-2 border-white/30">
                {getInitials(ipo?.upcoming_ipo_2025 || '')}
              </div>
            </div>
          </div>
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/95 backdrop-blur-sm text-blue-600 text-xs font-medium px-3 py-1.5 border border-blue-200">
              📅 {daysUntilOpening}d to go
            </Badge>
          </div>
          {/* Decorative countdown circles */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-6 left-6 w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="absolute bottom-6 right-8 w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white/50 rounded-full"></div>
          </div>
        </div>

        {/* Content Below Image */}
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          {/* Header with Exchange Badges */}
          <div className="flex justify-between items-center flex-wrap gap-2">
            <Badge variant="outline" className="bg-gray-50 border-gray-300 text-gray-800 text-xs font-medium">
              {ipo?.ipo_details?.ipo_listing || 'N/A'}
            </Badge>
            <Badge variant="outline" className="bg-gray-50 border-gray-300 text-gray-800 text-xs font-medium">
              {ipo?.ipo_type || 'N/A'}
            </Badge>
          </div>

          {/* Company Info */}
          <div className="text-center">
            <h2 className="text-xl text-gray-900 font-bold leading-tight mb-1">
              {ipo?.upcoming_ipo_2025 || 'Company Name'}
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              {ipo?.ipo_details?.issue_size || 'N/A'} | ₹{ipo?.price_band || 'N/A'}
            </p>
          </div>

          {/* Launch Timeline */}
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm text-gray-800 flex items-center justify-center space-x-1 font-semibold">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span>Timeline</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <span className="text-gray-600 font-medium block">Expected Open</span>
                <span className="font-semibold">{ipo?.open_date || 'TBA'}</span>
              </div>
              <div className="text-center">
                <span className="text-gray-600 font-medium block">Expected Close</span>
                <span className="font-semibold">{ipo?.closing_date || 'TBA'}</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-1 text-gray-700 bg-white rounded-md py-1.5">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-semibold">{daysUntilOpening} Day{daysUntilOpening === 1 ? '' : 's'} to Launch</span>
            </div>
          </div>

          {/* Predicted Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-xs text-gray-500 font-medium mb-1">Expected GMP</h4>
              <div className="flex items-center justify-center space-x-1">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 font-semibold">₹{ipo?.gmp_price_gain || 'TBA'}</span>
              </div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-xs text-gray-500 font-medium mb-1">Risk Score</h4>
              <span className="text-sm text-gray-700 font-semibold">{riskScore}/10</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 text-sm py-2 font-medium transition-colors">
              Pre-Analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Past IPO Card Component
export function PastIpoCard({ ipo, analysis }: IpoCardProps) {
  const riskScore = analysis?.risk_meter?.score || 0;
  const riskBorderColor = getRiskBorderColor(riskScore);

  return (
    <Card className={`w-full max-w-md mx-auto overflow-hidden py-0 border-2 border-gray-200 bg-white h-auto border-b-4 ${riskBorderColor} rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`} style={{ fontFamily: 'var(--font-ibm-plex)' }}>
      <CardContent className="p-0 h-full flex flex-col">
        {/* Creative Company Image with Green Success Theme */}
        <div className="w-full h-48 relative overflow-hidden rounded-t-xl bg-gradient-to-br from-green-500 via-green-600 to-green-700">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-800/40"></div>
          <div className="w-full h-full relative">
            {ipo?.image_url ? (
              <div className="relative w-full h-full">
                <Image
                  src={ipo.image_url}
                  alt={`${ipo?.upcoming_ipo_2025} logo`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 mix-blend-overlay"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.parentElement?.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20 backdrop-blur-[1px]"></div>
              </div>
            ) : null}
            <div className={`absolute inset-0 bg-gradient-to-br from-green-500/90 to-green-700/90 text-white text-4xl font-bold flex items-center justify-center ${!ipo?.image_url ? 'flex' : 'hidden'}`}>
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center border-2 border-white/30">
                {getInitials(ipo?.upcoming_ipo_2025 || '')}
              </div>
            </div>
          </div>
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/95 backdrop-blur-sm text-green-600 text-xs font-medium px-3 py-1.5 border border-green-200">
              ✅ Listed
            </Badge>
          </div>
          {/* Success indicators */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-6 left-6 w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="absolute bottom-6 right-8 w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="absolute top-8 right-12 w-1 h-1 bg-white/50 rounded-full"></div>
          </div>
        </div>

        {/* Content Below Image */}
        <div className="p-4 space-y-3 flex-1 flex flex-col">
          {/* Header with Exchange Badges */}
          <div className="flex justify-between items-center flex-wrap gap-2">
            <Badge variant="outline" className="bg-gray-50 border-gray-300 text-gray-800 text-xs font-medium">
              {ipo?.ipo_details?.ipo_listing || 'N/A'}
            </Badge>
            <Badge variant="outline" className="bg-gray-50 border-gray-300 text-gray-800 text-xs font-medium">
              {ipo?.ipo_type || 'N/A'}
            </Badge>
          </div>

          {/* Company Info */}
          <div className="text-center">
            <h2 className="text-xl text-gray-900 font-bold leading-tight mb-1">
              {ipo?.upcoming_ipo_2025 || 'Company Name'}
            </h2>
            <p className="text-sm text-gray-600 font-medium">
              {ipo?.ipo_details?.issue_size || 'N/A'} | ₹{ipo?.price_band || 'N/A'}
            </p>
          </div>

          {/* Listing Performance */}
          <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
            <h3 className="text-sm text-gray-800 flex items-center justify-center space-x-1 font-semibold">
              <CheckCircle className="w-4 h-4 text-gray-600" />
              <span>Performance</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <span className="text-gray-600 font-medium block">Listed</span>
                <span className="font-semibold">{ipo?.closing_date || 'N/A'}</span>
              </div>
              <div className="text-center">
                <span className="text-gray-600 font-medium block">Listing Price</span>
                <span className="font-semibold">N/A</span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-1 text-gray-700 bg-white rounded-md py-1.5">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold">Listing Gain: N/A</span>
            </div>
          </div>

          {/* Current Trading Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-xs text-gray-500 font-medium mb-1">Current Price</h4>
              <span className="text-sm text-blue-600 font-semibold">N/A</span>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-xs text-gray-500 font-medium mb-1">Total Return</h4>
              <span className="text-sm text-gray-700 font-semibold">N/A</span>
            </div>
          </div>

          {/* Final Subscription Results */}
          <div className="space-y-2 flex-1">
            <h4 className="text-sm text-gray-800 text-center font-semibold">Final Subscription</h4>
            <div className="grid grid-cols-4 gap-1 text-center">
              <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-600 font-medium">QIB</p>
                <p className="text-xs text-gray-900 font-semibold">{ipo?.qib_sr || 'N/A'}</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-600 font-medium">NII</p>
                <p className="text-xs text-gray-900 font-semibold">{ipo?.nii_sr || 'N/A'}</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-600 font-medium">RII</p>
                <p className="text-xs text-gray-900 font-semibold">{ipo?.rii_sr || 'N/A'}</p>
              </div>
              <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-xs text-gray-600 font-medium">Total</p>
                <p className="text-xs text-gray-600 font-semibold">{ipo?.total_sr || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 text-sm py-2 font-medium transition-colors">
              View Analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}