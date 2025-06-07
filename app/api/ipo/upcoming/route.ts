import { Ipo } from "@/app/models/ipo";
import { connectToDatabase, getCollection } from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { db } = await connectToDatabase();
        
        const ipos = await getCollection<Ipo>("ipos"); 
        
        const ipoList = await ipos.find({}).toArray();
        const currentMonthInLetter = new Date().toLocaleString("en-US", { month: "long" });
        let top3Ipos: Ipo[] = [];
        ipoList.forEach((ipo: Ipo) => {
            if (ipo.open_date.includes(currentMonthInLetter)) {
                top3Ipos.push(ipo);
            }
        });
        const threeUpcomingIpos = top3Ipos.slice(0, 3);
        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            ipos: threeUpcomingIpos
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