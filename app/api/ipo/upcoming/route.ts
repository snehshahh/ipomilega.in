import { Ipo } from "@/app/models/ipo";
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis";
import { HomePageIpoProps } from "@/app/types/homepage";
import { Blog } from "@/app/models/ipo";
import { connectToDatabase } from "@/lib/mongo";
import { NextResponse } from "next/server";

// Helper function to parse date strings like "12 June" or "June 12, 2025"
function parseIpoDate(dateString: string, currentYear: number = new Date().getFullYear()): Date | null {
    if (!dateString) return null;
    
    const cleanDate = dateString.trim();
    
    if (cleanDate.toLowerCase() === 'tba' || cleanDate === '-' || cleanDate === '') {
        return null;
    }
    
    if (cleanDate === '2025' || cleanDate === currentYear.toString()) {
        return null;
    }
    
    if (cleanDate.includes(',') && cleanDate.includes('2025')) {
        const parsedDate = new Date(cleanDate);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }
    
    const dateWithYear = `${cleanDate} ${currentYear}`;
    const parsedDate = new Date(dateWithYear);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const ipos = await db.collection("ipos").find({}).toArray();
        const ipoList = ipos || [];
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentYear = today.getFullYear();
        
        const upcomingIpos: Ipo[] = [];
        const liveIpos: Ipo[] = [];
        const pastIpos: Ipo[] = [];
        const tbaIpos: Ipo[] = [];
        
        ipoList.forEach((ipo: unknown) => {
            const ipoData = ipo as Ipo; // Assuming ipo matches Ipo interface (add validation if needed)
            
            let openDateString = '';
            let closeDateString = '';
            
            if (ipoData.ipo_dates?.ipo_open_date) {
                openDateString = ipoData.ipo_dates.ipo_open_date;
            } else if (ipoData.open_date) {
                openDateString = ipoData.open_date;
            }
            
            if (ipoData.ipo_dates?.ipo_close_date) {
                closeDateString = ipoData.ipo_dates.ipo_close_date;
            } else if (ipoData.closing_date) {
                closeDateString = ipoData.closing_date;
            }
            
            const openDate = parseIpoDate(openDateString, currentYear);
            const closeDate = parseIpoDate(closeDateString, currentYear);
            
            if (!openDate || !closeDate) {
                tbaIpos.push(ipoData);
                return;
            }
            
            openDate.setHours(0, 0, 0, 0);
            closeDate.setHours(23, 59, 59, 999);
            
            if (openDate > today) {
                upcomingIpos.push(ipoData);
            } else if (openDate <= today && closeDate >= today) {
                liveIpos.push(ipoData);
            } else if (closeDate < today) {
                pastIpos.push(ipoData);
            }
        });
        
        const sortedUpcomingIpos = upcomingIpos.sort((a, b) => {
            const dateA = parseIpoDate(a.ipo_dates?.ipo_open_date || a.open_date, currentYear);
            const dateB = parseIpoDate(b.ipo_dates?.ipo_open_date || b.open_date, currentYear);
            if (!dateA || !dateB) return 0;
            return dateA.getTime() - dateB.getTime();
        });
        
        const sortedLiveIpos = liveIpos.sort((a, b) => {
            const dateA = parseIpoDate(a.ipo_dates?.ipo_close_date || a.closing_date, currentYear);
            const dateB = parseIpoDate(b.ipo_dates?.ipo_close_date || b.closing_date, currentYear);
            if (!dateA || !dateB) return 0;
            return dateA.getTime() - dateB.getTime();
        });
        
        const sortedPastIpos = pastIpos.sort((a, b) => {
            const dateA = parseIpoDate(a.ipo_dates?.ipo_close_date || a.closing_date, currentYear);
            const dateB = parseIpoDate(b.ipo_dates?.ipo_close_date || b.closing_date, currentYear);
            if (!dateA || !dateB) return 0;
            return dateB.getTime() - dateA.getTime();
        });

        const sortedPastIposWithExistingPerformance =sortedPastIpos.filter((ipo: Ipo) => ipo.listing_price != "");
        
        const sortedTbaIpos = tbaIpos.sort((a, b) => {
            const nameA = a.upcoming_ipo_2025 || '';
            const nameB = b.upcoming_ipo_2025 || '';
            return nameA.localeCompare(nameB);
        });

        const analysisList = await db.collection("ipo_comprehensive_analysis").find({}).toArray();
        const blogsList = await db.collection("blogs").find({}).toArray();
        
        const finalLiveIpos: HomePageIpoProps[] = [];
        const finalUpcomingIpos: HomePageIpoProps[] = [];
        const finalPastIpos: HomePageIpoProps[] = [];
        const finalTbaIpos: HomePageIpoProps[] = [];
        const finalAllIpos: HomePageIpoProps[] = [];

        sortedLiveIpos.forEach((ipo: Ipo) => {
            const analysisData = analysisList.find((analysis: unknown) => {
                const analysisTyped = analysis as IpoComprehensiveAnalysis;
                return analysisTyped.ipo_table_id === ipo._id.toString();
            }) as IpoComprehensiveAnalysis | undefined;
            
            finalLiveIpos.push({
                _id: ipo._id.toString(),
                ipo,
                analysis: analysisData || null, // Convert undefined to null
            });
        });

        sortedUpcomingIpos.forEach((ipo: Ipo) => {
            const analysisData = analysisList.find((analysis: unknown) => {
                const analysisTyped = analysis as IpoComprehensiveAnalysis;
                return analysisTyped.ipo_table_id === ipo._id.toString();
            }) as IpoComprehensiveAnalysis | undefined;
            
            finalUpcomingIpos.push({
                _id: ipo._id.toString(),
                ipo,
                analysis: analysisData || null,
            });
        });

        sortedPastIposWithExistingPerformance.forEach((ipo: Ipo) => {
            const analysisData = analysisList.find((analysis: unknown) => {
                const analysisTyped = analysis as IpoComprehensiveAnalysis;
                return analysisTyped.ipo_table_id === ipo._id.toString();
            }) as IpoComprehensiveAnalysis | undefined;
            
            finalPastIpos.push({
                _id: ipo._id.toString(),
                ipo,
                analysis: analysisData || null,
            });
        });

        sortedTbaIpos.forEach((ipo: Ipo) => {
            const analysisData = analysisList.find((analysis: unknown) => {
                const analysisTyped = analysis as IpoComprehensiveAnalysis;
                return analysisTyped.ipo_table_id === ipo._id.toString();
            }) as IpoComprehensiveAnalysis | undefined;
            
            finalTbaIpos.push({
                _id: ipo._id.toString(),
                ipo,
                analysis: analysisData || null,
            });
        });

        // Populate finalAllIpos if needed (e.g., combine all IPOs)
        finalAllIpos.push(...finalLiveIpos, ...finalUpcomingIpos, ...finalPastIpos, ...finalTbaIpos);
        
        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            data: {
                upcoming: finalUpcomingIpos,
                live: finalLiveIpos,
                past: finalPastIpos,
                tba: finalTbaIpos,
                all: finalAllIpos,
                blogs: blogsList as unknown as Blog[],
            },
            counts: {
                upcoming: finalUpcomingIpos.length,
                live: finalLiveIpos.length,
                past: finalPastIpos.length,
                tba: finalTbaIpos.length,
                total: ipoList.length,
            },
        });
    } catch (error) {
        console.error("Error in /api/admin:", error);
        return NextResponse.json({
            message: error instanceof Error ? error.message : "Something went wrong",
            success: false,
        }, { status: 500 });
    }
}