
import { connectToDatabase } from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const {db} = await connectToDatabase();
        const analysis = await db.collection("ipo_comprehensive_analysis").find({}).toArray();
        
        const analysisList = analysis || [];
        const threeAnalysisList = analysisList.slice(0, 3);
            
        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            analysis: threeAnalysisList
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