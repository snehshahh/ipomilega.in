
import { getCollection } from "@/lib/mongo";
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const analysis = await getCollection<IpoComprehensiveAnalysis>("ipo_comprehensive_analysis"); 
        
        const analysisList = await analysis.find({}).sort({}).toArray();
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