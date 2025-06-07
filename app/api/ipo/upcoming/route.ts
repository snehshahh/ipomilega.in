import { Ipo } from "@/app/models/ipo";
import { connectToDatabase } from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const {db} = await connectToDatabase();
        const ipos = await db.collection("ipos").find({}).toArray(); 
        const ipoList = ipos || [];
        const currentMonthInLetter = new Date().toLocaleString("en-US", { month: "long" });
        const top3Ipos: unknown[] = [];
        ipoList.forEach((ipo: unknown) => {
            if ((ipo as Ipo).open_date.includes(currentMonthInLetter)) {
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