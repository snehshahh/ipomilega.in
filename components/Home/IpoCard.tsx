import React from 'react';
import { Clock, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { Ipo } from '@/app/models/ipo';
import { IpoComprehensiveAnalysis } from '@/app/models/ipo_comprehensive_analysis';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

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

// Live IPO Card Component - Responsive version
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
    <Card className={`w-full max-w-sm mx-auto overflow-hidden border-2 border-gray-200 bg-white h-full border-b-4 ${riskBorderColor}`}>
      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4 h-full flex flex-col">
        {/* Header with Live Badge */}
        <div className="flex justify-between items-start flex-wrap gap-2">
          <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 font-medium text-xs">
            {ipo?.ipo_details?.ipo_listing || 'N/A'}
          </Badge>
          <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 font-medium text-xs whitespace-nowrap">
            🔴 LIVE - {daysUntilClosing}d left
          </Badge>
        </div>

        {/* Company Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white shadow-md flex-shrink-0">
            <AvatarImage
              src={ipo?.image_url}
              alt={`${ipo?.upcoming_ipo_2025} logo`}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-700 text-white font-bold text-xs sm:text-sm">
              {getInitials(ipo?.upcoming_ipo_2025 || '')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">
              {ipo?.ipo_type || 'N/A'}
            </p>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-tight truncate">
              {ipo?.upcoming_ipo_2025 || 'Company Name'}
            </h2>
            <p className="text-xs text-gray-600 font-medium truncate">
              {ipo?.ipo_details?.issue_size || 'N/A'} | ₹{ipo?.price_band || 'N/A'}
            </p>
          </div>
        </div>

        {/* IPO Timeline */}
        <div className="space-y-2 bg-gray-50 p-2 sm:p-3 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center space-x-1">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            <span>Timeline</span>
          </h3>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Opens:</span>
              <span className="font-medium">{ipo?.open_date || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Closes:</span>
              <span className="font-medium text-red-600">{ipo?.closing_date || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Current Performance */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="text-center p-2 bg-white rounded-lg border">
            <h4 className="text-xs font-medium text-gray-500 mb-1">GMP</h4>
            <div className="flex items-center justify-center space-x-1">
              <TrendingUp className="w-3 h-3 text-gray-400" />
              <span className="text-xs sm:text-sm font-medium text-gray-600">₹{ipo?.gmp_price_gain || 0}</span>
            </div>
          </div>
          <div className="text-center p-2 bg-white rounded-lg border">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Risk</h4>
            <span className="text-xs sm:text-sm font-medium text-gray-600">{riskScore}/10</span>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="space-y-2 flex-1">
          <h4 className="text-sm font-semibold text-gray-800">Subscription</h4>
          <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center">
            <div className="bg-white p-1 sm:p-1.5 rounded border">
              <p className="text-xs font-medium text-gray-600">QIB</p>
              <p className="font-bold text-xs text-gray-900">{ipo?.qib_sr || 'N/A'}</p>
            </div>
            <div className="bg-white p-1 sm:p-1.5 rounded border">
              <p className="text-xs font-medium text-gray-600">NII</p>
              <p className="font-bold text-xs text-gray-900">{ipo?.nii_sr || 'N/A'}</p>
            </div>
            <div className="bg-white p-1 sm:p-1.5 rounded border">
              <p className="text-xs font-medium text-gray-600">RII</p>
              <p className="font-bold text-xs text-gray-900">{ipo?.rii_sr || 'N/A'}</p>
            </div>
            <div className="bg-white p-1 sm:p-1.5 rounded border">
              <p className="text-xs font-medium text-gray-600">Total</p>
              <p className="font-bold text-xs text-gray-600">{ipo?.total_sr || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-1.5 sm:py-2">
            Chances of Allotment
          </Button>
          <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 text-xs py-1.5 sm:py-2">
            View Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Upcoming IPO Card Component - Responsive version
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
    <Card className={`w-full max-w-sm mx-auto overflow-hidden border-2 border-gray-200 bg-white h-full border-b-4 ${riskBorderColor}`}>
      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4 h-full flex flex-col">
        {/* Header with Upcoming Badge */}
        <div className="flex justify-between items-start flex-wrap gap-2">
          <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 font-medium text-xs">
            {ipo?.ipo_details?.ipo_listing || 'N/A'}
          </Badge>
          <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 font-medium text-xs whitespace-nowrap">
            📅 {daysUntilOpening}d to go
          </Badge>
        </div>

        {/* Company Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white shadow-md flex-shrink-0">
            <AvatarImage
              src={ipo?.image_url}
              alt={`${ipo?.upcoming_ipo_2025} logo`}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-700 text-white font-bold text-xs sm:text-sm">
              {getInitials(ipo?.upcoming_ipo_2025 || '')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">
              {ipo?.ipo_type || 'N/A'}
            </p>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-tight truncate">
              {ipo?.upcoming_ipo_2025 || 'Company Name'}
            </h2>
            <p className="text-xs text-gray-600 font-medium truncate">
              {ipo?.ipo_details?.issue_size || 'N/A'} | ₹{ipo?.price_band || 'N/A'}
            </p>
          </div>
        </div>

        {/* Launch Timeline */}
        <div className="space-y-2 bg-gray-50 p-2 sm:p-3 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center space-x-1">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            <span>Timeline</span>
          </h3>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Expected Open:</span>
              <span className="font-medium">{ipo?.open_date || 'TBA'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Expected Close:</span>
              <span className="font-medium">{ipo?.closing_date || 'TBA'}</span>
            </div>
            <div className="flex items-center justify-center space-x-1 text-gray-700 pt-1 bg-white rounded-md py-1">
              <Clock className="w-3 h-3" />
              <span className="font-bold text-xs">{daysUntilOpening} Day{daysUntilOpening === 1 ? '' : 's'} to Launch</span>
            </div>
          </div>
        </div>

        {/* Predicted Metrics */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="text-center p-2 bg-white rounded-lg border">
            <h4 className="text-xs font-medium text-gray-600 mb-1">Expected GMP</h4>
            <div className="flex items-center justify-center space-x-1">
              <TrendingUp className="w-3 h-3 text-gray-400" />
              <span className="text-xs sm:text-sm font-bold text-gray-600">₹{ipo?.gmp_price_gain || 'TBA'}</span>
            </div>
          </div>
          <div className="text-center p-2 bg-white rounded-lg border">
            <h4 className="text-xs font-medium text-gray-600 mb-1">Risk Score</h4>
            <span className="text-xs sm:text-sm font-bold text-gray-600">{riskScore}/10</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1 mt-auto">
          <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full text-xs py-1.5 sm:py-2">
            Pre-Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Past IPO Card Component - Responsive version
export function PastIpoCard({ ipo, analysis }: IpoCardProps) {
  const riskScore = analysis?.risk_meter?.score || 0;
  const riskBorderColor = getRiskBorderColor(riskScore);

  return (
    <Card className={`w-full max-w-sm mx-auto overflow-hidden border-2 border-gray-200 bg-white h-full border-b-4 ${riskBorderColor}`}>
      <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4 h-full flex flex-col">
        {/* Header with Listed Badge */}
        <div className="flex justify-between items-start flex-wrap gap-2">
          <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 font-medium text-xs">
            {ipo?.ipo_details?.ipo_listing || 'N/A'}
          </Badge>
          <Badge variant="outline" className="bg-white border-gray-300 text-gray-700 font-medium text-xs whitespace-nowrap">
            ✅ Listed
          </Badge>
        </div>

        {/* Company Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white shadow-md flex-shrink-0">
            <AvatarImage
              src={ipo?.image_url}
              alt={`${ipo?.upcoming_ipo_2025} logo`}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-700 text-white font-bold text-xs sm:text-sm">
              {getInitials(ipo?.upcoming_ipo_2025 || '')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">
              {ipo?.ipo_type || 'N/A'}
            </p>
            <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-tight truncate">
              {ipo?.upcoming_ipo_2025 || 'Company Name'}
            </h2>
            <p className="text-xs text-gray-600 font-medium truncate">
              {ipo?.ipo_details?.issue_size || 'N/A'} | ₹{ipo?.price_band || 'N/A'}
            </p>
          </div>
        </div>

        {/* Listing Performance */}
        <div className="space-y-2 bg-gray-50 p-2 sm:p-3 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center space-x-1">
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
            <span>Performance</span>
          </h3>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Listed:</span>
              <span className="font-medium">{ipo?.closing_date || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Listing Price:</span>
              <span className="font-medium">N/A</span>
            </div>
            <div className="flex items-center justify-center space-x-1 text-gray-700 pt-1 bg-white rounded-md py-1">
              <TrendingUp className="w-3 h-3" />
              <span className="font-bold text-xs">Listing Gain: N/A</span>
            </div>
          </div>
        </div>

        {/* Current Trading Info */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="text-center p-2 bg-white rounded-lg border">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Current Price</h4>
            <span className="text-xs sm:text-sm font-medium text-blue-600">N/A</span>
          </div>
          <div className="text-center p-2 bg-white rounded-lg border">
            <h4 className="text-xs font-medium text-gray-500 mb-1">Total Return</h4>
            <span className="text-xs sm:text-sm font-medium text-gray-600">N/A</span>
          </div>
        </div>

        {/* Final Subscription Results */}
        <div className="space-y-2 flex-1">
          <h4 className="text-sm font-semibold text-gray-800">Final Subscription</h4>
          <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center">
            <div className="bg-white p-1 sm:p-1.5 rounded border">
              <p className="text-xs font-medium text-gray-600">QIB</p>
              <p className="font-bold text-xs text-gray-900">{ipo?.qib_sr || 'N/A'}</p>
            </div>
            <div className="bg-white p-1 sm:p-1.5 rounded border">
              <p className="text-xs font-medium text-gray-600">NII</p>
              <p className="font-bold text-xs text-gray-900">{ipo?.nii_sr || 'N/A'}</p>
            </div>
            <div className="bg-white p-1 sm:p-1.5 rounded border">
              <p className="text-xs font-medium text-gray-600">RII</p>
              <p className="font-bold text-xs text-gray-900">{ipo?.rii_sr || 'N/A'}</p>
            </div>
            <div className="bg-white p-1 sm:p-1.5 rounded border">
              <p className="text-xs font-medium text-gray-600">Total</p>
              <p className="font-bold text-xs text-gray-600">{ipo?.total_sr || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-1 mt-auto">
          <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full text-xs py-1.5 sm:py-2">
            View Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}