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
  if (riskScore <= 3) return 'border-b-[#00914D]';
  if (riskScore <= 6) return 'border-b-[#D59527]';
  return 'border-b-[#B4292E]';
};

// Utility function to get risk text color (no background)
const getRiskTextColor = (riskScore: number) => {
  if (riskScore <= 3) return 'text-[#00914D]';
  if (riskScore <= 6) return 'text-[#D59527]';
  return 'text-[#B4292E]';
};

// Utility function to get risk border color for elements
// const getRiskBorderColorForElements = (riskScore: number) => {
//   if (riskScore <= 3) return 'border-green-500';
//   if (riskScore <= 6) return 'border-yellow-500';
//   return 'border-red-500';
// };

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

  const getRiskTextColorForElements = (riskScore: number) => {
    if (riskScore <= 3) return 'text-[#00914D]';
    if (riskScore <= 6) return 'text-[#D59527]';
    return 'text-[#B4292E]';
  };

  const daysUntilClosing = getDaysUntilClosing();
  const riskScore = analysis?.risk_meter?.score || 0;
  const riskBorderColor = getRiskBorderColor(riskScore);
  const riskTextColorForElements = getRiskTextColorForElements(riskScore);


  return (
    <Card className={`w-[384px] h-full border-b-6 ${riskBorderColor} shadow-md font-ibm-plex`} style={{ borderRadius: '8px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', boxShadow: 'none' }} >
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
            <Avatar className="w-16 h-16">
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
            <div className="w-full py-3">
              <h3 className="text-md text-gray-800 flex items-left space-x-1 font-semibold mb-1">
                <Calendar className="w-4 h-4 mt-1 text-gray-600" />
                <span className="text-md font-medium font-ibm-plex" style={{ fontWeight: '600' }}>Timeline</span>
              </h3>
              <div className="text-left flex flex-row items-left justify-between gap-2">
                <span className="font-normal block font-ibm-plex" style={{ fontWeight: '400' }}>Opening Date</span>
                <span className="font-medium block font-ibm-plex" style={{ fontWeight: '400' }}>{ipo?.open_date || 'TBA'}</span>
              </div>
              <div className="text-left flex flex-row items-left justify-between gap-2">
                <span className="font-medium block font-ibm-plex" style={{ fontWeight: '400' }}>Closing Date</span>
                <span className="font-medium block font-ibm-plex" style={{ fontWeight: '400' }}>{ipo?.closing_date || 'TBA'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-xs font-medium mb-1">Expected GMP</h4>
            <div className="flex items-center justify-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500 font-semibold">₹{ipo?.gmp_price_gain || 'TBA'}</span>
            </div>
          </div>
          <div className="text-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-xs font-medium mb-1">Risk Score</h4>
            <span className={`text-sm ${riskTextColorForElements} font-semibold`}>{riskScore}/10</span>
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
  const riskTextColor = getRiskTextColor(riskScore);

  return (
    <Card className={`w-[384px] h-full border-b-6 ${riskBorderColor} shadow-md font-ibm-plex`} style={{ borderRadius: '8px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', boxShadow: 'none' }}>
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
            <Avatar className="w-16 h-16">
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
            <div className="w-full py-3">
              <h3 className="text-md text-gray-800 flex items-left space-x-1 font-semibold mb-1">
                <Calendar className="w-4 h-4 mt-1 text-gray-600" />
                <span className="text-md font-medium font-ibm-plex" style={{ fontWeight: '600' }}>Timeline</span>
              </h3>
              <div className="text-left flex flex-row items-left justify-between gap-2">
                <span className="font-medium block font-ibm-plex" style={{ fontWeight: '400' }}>Expected Opening Date</span>
                <span className="font-medium block font-ibm-plex" style={{ fontWeight: '400' }}>{ipo?.open_date || 'TBA'}</span>
              </div>
              <div className="text-left flex flex-row items-left justify-between gap-2">
                <span className="font-medium block font-ibm-plex" style={{ fontWeight: '400' }}>Expected Closing Date</span>
                <span className="font-medium block font-ibm-plex" style={{ fontWeight: '400' }}>{ipo?.closing_date || 'TBA'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className={`text-center p-3 rounded-lg border  shadow-sm`}>
            <h4 className={`text-xs font-medium mb-1`}>Expected GMP</h4>
            <div className="flex items-center justify-center space-x-1">
              <span className={`text-sm ${riskTextColor} font-semibold`}>₹{ipo?.gmp_price_gain || 'TBA'}</span>
            </div>
          </div>
          <div className={`text-center p-3 bg-white rounded-lg border shadow-sm`}>
            <h4 className={`text-xs font-medium mb-1`}>Risk Score</h4>
            <span className={`text-sm ${riskTextColor} font-semibold`}>{riskScore}/10</span>
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
  const riskTextColor = getRiskTextColor(riskScore);

  return (
    <Card className={`w-[384px] h-full border-b-6
     ${riskBorderColor} shadow-md font-ibm-plex`} style={{ borderRadius: '8px', borderTop: 'none', borderLeft: 'none', borderRight: 'none', boxShadow: 'none' }} >
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
            <Avatar className="w-16 h-16">
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
            <div className="w-full py-3">
              <h3 className="text-md text-gray-800 flex items-left space-x-1 font-semibold mb-1">
                <CheckCircle className="w-4 h-4 mt-1 text-gray-600" />
                <span className="text-md font-medium font-ibm-plex">Performance</span>
              </h3>
              <div className="text-left flex flex-row items-left justify-between gap-2">
                <span className="font-medium block font-ibm-plex" style={{ fontWeight: '500' }}>Listed</span>
                <span className="font-medium block font-ibm-plex" style={{ fontWeight: '400' }}>{ipo?.ipo_dates?.ipo_listing_date || 'N/A'}</span>
              </div>
              <div className="text-left flex flex-row items-left justify-between gap-2">
                <span className="font-medium block font-ibm-plex" style={{ fontWeight: '500' }}>Listing Price</span>
                <span className="font-medium block font-ibm-plex" style={{ fontWeight: '400' }}>{ipo?.listing_price || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className={`text-center p-3 rounded-lg border  shadow-sm`}>
            <h4 className={`text-xs font-medium mb-1`}>Current Price</h4>
            <span className={`text-sm font-semibold`}>₹{ipo?.listing_price || 'N/A'}</span>
          </div>
          <div className={`text-center p-3 bg-white rounded-lg border  shadow-sm`}>
            <h4 className={`text-xs font-medium mb-1`}>Total Return</h4>
            <span className={`text-sm ${riskTextColor} font-semibold`}>{ipo?.listing_gain || 'N/A'}</span>
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