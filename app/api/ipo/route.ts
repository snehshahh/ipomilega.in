import { Ipo } from "@/app/models/ipo";
import { connectToDatabase } from "@/lib/mongo";
import { NextResponse } from "next/server";

// Helper function to parse date strings like "12 June" or "June 12, 2025"
function parseIpoDate(dateString: string, currentYear: number = new Date().getFullYear()): Date | null {
    if (!dateString) return null;
    
    const cleanDate = dateString.trim();
    
    // Handle TBA (To Be Announced) dates
    if (cleanDate.toLowerCase() === 'tba' || cleanDate === '-' || cleanDate === '') {
        return null;
    }
    
    // Handle incomplete dates like just "2025"
    if (cleanDate === '2025' || cleanDate === currentYear.toString()) {
        return null;
    }
    
    // If date already includes year (like "June 12, 2025")
    if (cleanDate.includes(',') && cleanDate.includes('2025')) {
        const parsedDate = new Date(cleanDate);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }
    
    // For dates like "12 June" - add current year
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
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
        const currentYear = today.getFullYear();
        
        const upcomingIpos: Ipo[] = [];
        const liveIpos: Ipo[] = [];
        const pastIpos: Ipo[] = [];
        const tbaIpos: Ipo[] = []; // IPOs with TBA dates
        
        ipoList.forEach((ipo: unknown) => {
            const ipoData = ipo as Ipo;
            
            // Try to get dates from multiple possible fields
            let openDateString = '';
            let closeDateString = '';
            
            // Priority: ipo_dates.ipo_open_date > open_date
            if (ipoData.ipo_dates?.ipo_open_date) {
                openDateString = ipoData.ipo_dates.ipo_open_date;
            } else if (ipoData.open_date) {
                openDateString = ipoData.open_date;
            }
            
            // Priority: ipo_dates.ipo_close_date > closing_date
            if (ipoData.ipo_dates?.ipo_close_date) {
                closeDateString = ipoData.ipo_dates.ipo_close_date;
            } else if (ipoData.closing_date) {
                closeDateString = ipoData.closing_date;
            }
            
            // Parse dates
            const openDate = parseIpoDate(openDateString, currentYear);
            const closeDate = parseIpoDate(closeDateString, currentYear);
            
            // Handle TBA dates - if either date is null/invalid, put in TBA category
            if (!openDate || !closeDate) {
                tbaIpos.push(ipoData);
                return;
            }
            
            // Reset time to start of day for accurate comparison
            openDate.setHours(0, 0, 0, 0);
            closeDate.setHours(23, 59, 59, 999); // End of day for closing date
            
            if (openDate > today) {
                // Upcoming: Open date is in the future
                upcomingIpos.push(ipoData);
            } else if (openDate <= today && closeDate >= today) {
                // Live: Open date has passed or is today, and close date hasn't passed
                liveIpos.push(ipoData);
            } else if (closeDate < today) {
                // Past: Close date has passed
                pastIpos.push(ipoData);
            }
        });
        
        // Sort upcoming IPOs by open_date (ascending - nearest first)
        const sortedUpcomingIpos = upcomingIpos.sort((a, b) => {
            const dateA = parseIpoDate(a.ipo_dates?.ipo_open_date || a.open_date, currentYear);
            const dateB = parseIpoDate(b.ipo_dates?.ipo_open_date || b.open_date, currentYear);
            if (!dateA || !dateB) return 0;
            return dateA.getTime() - dateB.getTime();
        });
        
        // Sort live IPOs by close_date (ascending - closing soonest first)
        const sortedLiveIpos = liveIpos.sort((a, b) => {
            const dateA = parseIpoDate(a.ipo_dates?.ipo_close_date || a.closing_date, currentYear);
            const dateB = parseIpoDate(b.ipo_dates?.ipo_close_date || b.closing_date, currentYear);
            if (!dateA || !dateB) return 0;
            return dateA.getTime() - dateB.getTime();
        });
        
        // Sort past IPOs by close_date (descending - most recently closed first)
        const sortedPastIpos = pastIpos.sort((a, b) => {
            const dateA = parseIpoDate(a.ipo_dates?.ipo_close_date || a.closing_date, currentYear);
            const dateB = parseIpoDate(b.ipo_dates?.ipo_close_date || b.closing_date, currentYear);
            if (!dateA || !dateB) return 0;
            return dateB.getTime() - dateA.getTime();
        });
        
        // Sort TBA IPOs by company name
        const sortedTbaIpos = tbaIpos.sort((a, b) => {
            const nameA = a.upcoming_ipo_2025 || '';
            const nameB = b.upcoming_ipo_2025 || '';
            return nameA.localeCompare(nameB);
        });

        const analysisList = await db.collection("ipo_comprehensive_analysis").find({}).toArray();
        const analysis = analysisList || [];
        const blogsList = await db.collection("blogs").find({}).toArray()
        const blogs = blogsList || [];
        
        
        
         
        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            data: {
                upcoming: sortedUpcomingIpos,
                live: sortedLiveIpos,
                past: sortedPastIpos,
                tba: sortedTbaIpos, // IPOs with dates to be announced
                all: ipoList,
                analysis: analysis,
                blogs: blogs
            },
            counts: {
                upcoming: sortedUpcomingIpos.length,
                live: sortedLiveIpos.length,
                past: sortedPastIpos.length,
                tba: sortedTbaIpos.length,
                total: ipoList.length
            }
        });
    }
    catch (error) {
        console.error("Error in /api/admin:", error);
        return NextResponse.json({
            message: error instanceof Error ? error.message : "Something went wrong",
            success: false,
        }, { status: 500 });
    }
}