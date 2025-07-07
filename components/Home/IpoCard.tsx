import React from 'react';
import { TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { Ipo } from '@/app/models/ipo';
import { IpoComprehensiveAnalysis } from '@/app/models/ipo_comprehensive_analysis';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

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
    <Card className={`w-[384px] h-[415px] border-b-4 ${riskBorderColor} shadow-md font-ibm-plex`} >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="w-[60px] h-5">
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-gray-50 border-gray-300 text-gray-800 text-xs font-medium">
              {ipo?.ipo_type || 'N/A'}
            </Badge>
            <Badge variant="secondary"
              className="bg-white/95 backdrop-blur-sm text-red-600 text-xs font-medium animate-pulse border border-red-200">
              🔴 LIVE - {daysUntilClosing == 0 ? "Closing Today" : daysUntilClosing + "d" + " left"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-left justify-left">
          <div className="flex flex-row items-center justify-left gap-3">
            <Avatar className="w-12 h-12">
              {
                ipo?.image_url ? (
                  <AvatarImage src={ipo.image_url} />
                ) : (
                  <AvatarFallback className="text-white bg-black border-black border-2 text-xs font-medium">
                    {getInitials(ipo?.upcoming_ipo_2025 || '')}
                  </AvatarFallback>
                )
              }
            </Avatar>
            <div className="flex flex-col items-left justify-left">
              <h2 className="text-lg font-semibold">{ipo?.upcoming_ipo_2025 || 'Company Name'}</h2>
              <p className="text-sm text-gray-600">{ipo?.ipo_size || 'N/A'} | ₹{ipo?.price_band || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-left justify-center mt-3">
          <div className="flex flex-row items-left justify-center gap-3">
            <div className="w-full bg-gray-50 px-4 py-3 rounded-lg">
              <h3 className="text-sm text-gray-800 flex items-center justify-center space-x-1 font-semibold mb-3">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span>Timeline</span>
              </h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <span className="text-gray-600 font-medium block">Open</span>
                  <span className="font-semibold">{ipo?.open_date || 'TBA'}</span>
                </div>
                <div className="text-center">
                  <span className="text-gray-600 font-medium block">Close</span>
                  <span className="font-semibold">{ipo?.closing_date || 'TBA'}</span>
                </div>
                <div className="text-center">
                  <span className="text-gray-600 font-medium block">Listing</span>
                  <span className="font-semibold">{ipo?.ipo_details?.ipo_listing || 'TBA'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg border border-green-200 shadow-sm">
            <h4 className="text-xs text-green-600 font-medium mb-1">Expected GMP</h4>
            <div className="flex items-center justify-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500 font-semibold">₹{ipo?.gmp_price_gain || 'TBA'}</span>
            </div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-xs text-gray-500 font-medium mb-1">Risk Score</h4>
            <span className="text-sm text-gray-700 font-semibold">{riskScore}/10</span>
          </div>
        </div>
        <hr className="my-4 border-gray-200" />
        <div className="mt-6">
          <Button variant="outline" className="w-full bg-[#0073E6] text-white hover:bg-white hover:text-[#0073E6] hover:border-[#0073E6] text-sm py-2 font-medium transition-colors">
            View Analysis
          </Button>
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
    <Card className={`w-[384px] h-[415px] border-b-4 ${riskBorderColor} shadow-md font-ibm-plex`} >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="w-[60px] h-5">
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-gray-50 border-gray-300 text-gray-800 text-xs font-medium">
              {ipo?.ipo_type || 'N/A'}
            </Badge>
            <Badge variant="secondary"
              className="bg-white/95 backdrop-blur-sm text-blue-600 text-xs font-medium border border-blue-200">
              📅 {daysUntilOpening}d to go
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-left justify-left">
          <div className="flex flex-row items-center justify-left gap-3">
            <Avatar className="w-12 h-12">
              {
                ipo?.image_url ? (
                  <AvatarImage src={ipo.image_url} />
                ) : (
                  <AvatarFallback className="text-white bg-black border-black border-2 text-xs font-medium">
                    {getInitials(ipo?.upcoming_ipo_2025 || '')}
                  </AvatarFallback>
                )
              }
            </Avatar>
            <div className="flex flex-col items-left justify-left">
              <h2 className="text-lg font-semibold">{ipo?.upcoming_ipo_2025 || 'Company Name'}</h2>
              <p className="text-sm text-gray-600">{ipo?.ipo_details?.issue_size || 'N/A'} | ₹{ipo?.price_band || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-left justify-center mt-3">
          <div className="flex flex-row items-left justify-center gap-3">
            <div className="w-full bg-gray-50 px-4 py-3 rounded-lg">
              <h3 className="text-sm text-gray-800 flex items-center justify-center space-x-1 font-semibold mb-3">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span>Timeline</span>
              </h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <span className="text-gray-600 font-medium block">Expected Open</span>
                  <span className="font-semibold">{ipo?.open_date || 'TBA'}</span>
                </div>
                <div className="text-center">
                  <span className="text-gray-600 font-medium block">Expected Close</span>
                  <span className="font-semibold">{ipo?.closing_date || 'TBA'}</span>
                </div>
                <div className="text-center">
                  <span className="text-gray-600 font-medium block">Listing</span>
                  <span className="font-semibold">{ipo?.ipo_details?.ipo_listing || 'TBA'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg border border-gray-200 shadow-sm">
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
        <hr className="my-4 border-gray-200" />
        <div className="mt-6">
          <Button variant="outline" className="w-full bg-[#0073E6] text-white hover:bg-white hover:text-[#0073E6] hover:border-[#0073E6] text-sm py-2 font-medium transition-colors">
            Pre-Analysis
          </Button>
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
    <Card className={`w-[384px] h-[415px] border-b-4 ${riskBorderColor} shadow-md font-ibm-plex`} >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="w-[60px] h-5">
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-gray-50 border-gray-300 text-gray-800 text-xs font-medium">
              {ipo?.ipo_type || 'N/A'}
            </Badge>
            <Badge variant="secondary"
              className="bg-white/95 backdrop-blur-sm text-green-600 text-xs font-medium border border-green-200">
              ✅ Listed
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-left justify-left">
          <div className="flex flex-row items-center justify-left gap-3">
            <Avatar className="w-12 h-12">
              {
                ipo?.image_url ? (
                  <AvatarImage src={ipo.image_url} />
                ) : (
                  <AvatarFallback className="text-white bg-black border-black border-2 text-xs font-medium">
                    {getInitials(ipo?.upcoming_ipo_2025 || '')}
                  </AvatarFallback>
                )
              }
            </Avatar>
            <div className="flex flex-col items-left justify-left">
              <h2 className="text-lg font-semibold">{ipo?.upcoming_ipo_2025 || 'Company Name'}</h2>
              <p className="text-sm text-gray-600">{ipo?.ipo_details?.issue_size || 'N/A'} | ₹{ipo?.price_band || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-left justify-center mt-3">
          <div className="flex flex-row items-left justify-center gap-3">
            <div className="w-full bg-gray-50 px-4 py-3 rounded-lg">
              <h3 className="text-sm text-gray-800 flex items-center justify-center space-x-1 font-semibold mb-3">
                <CheckCircle className="w-4 h-4 text-gray-600" />
                <span>Performance</span>
              </h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <span className="text-gray-600 font-medium block">Listed</span>
                  <span className="font-semibold">{ipo?.closing_date || 'N/A'}</span>
                </div>
                <div className="text-center">
                  <span className="text-gray-600 font-medium block">Listing Price</span>
                  <span className="font-semibold">N/A</span>
                </div>
                <div className="text-center">
                  <span className="text-gray-600 font-medium block">Listing Gain</span>
                  <span className="font-semibold">N/A</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-3 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-xs text-gray-500 font-medium mb-1">Current Price</h4>
            <span className="text-sm text-blue-600 font-semibold">N/A</span>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-xs text-gray-500 font-medium mb-1">Total Return</h4>
            <span className="text-sm text-gray-700 font-semibold">N/A</span>
          </div>
        </div>
        <hr className="my-4 border-gray-200" />
        <div className="mt-6">
          <Button variant="outline" className="w-full bg-[#0073E6] text-white hover:bg-white hover:text-[#0073E6] hover:border-[#0073E6] text-sm py-2 font-medium transition-colors">
            View Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}