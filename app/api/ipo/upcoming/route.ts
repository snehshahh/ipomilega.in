import { Ipo } from "@/app/models/ipo";
import { connectToDatabase } from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const ipos = await db.collection("ipos").find({}).toArray();
        const ipoList = ipos || [];
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
        
        const upcomingIpos: Ipo[] = [];
        const liveIpos: Ipo[] = [];
        const pastIpos: Ipo[] = [];
        
        ipoList.forEach((ipo: unknown) => {
            const ipoData = ipo as Ipo;
            
            // Parse dates from the IPO data
            const openDate = new Date(ipoData.open_date);
            const closeDate = new Date(ipoData.closing_date); // Assuming you have close_date field
            
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
            const dateA = new Date(a.open_date);
            const dateB = new Date(b.open_date);
            return dateA.getTime() - dateB.getTime();
        });
        
        // Sort live IPOs by close_date (ascending - closing soonest first)
        const sortedLiveIpos = liveIpos.sort((a, b) => {
            const dateA = new Date(a.closing_date);
            const dateB = new Date(b.closing_date);
            return dateA.getTime() - dateB.getTime();
        });
        
        // Sort past IPOs by close_date (descending - most recently closed first)
        const sortedPastIpos = pastIpos.sort((a, b) => {
            const dateA = new Date(a.closing_date);
            const dateB = new Date(b.closing_date);
            return dateB.getTime() - dateA.getTime();
        });
        
        
        
        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            data: {
                upcoming: sortedUpcomingIpos,
                live: sortedLiveIpos,
                past: sortedPastIpos
            },
            counts: {
                upcoming: sortedUpcomingIpos.length,
                live: sortedLiveIpos.length,
                past: sortedPastIpos.length
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