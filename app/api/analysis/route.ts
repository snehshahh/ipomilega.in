import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis";

export async function GET() {
    try {
        
        const ipos = await getCollection<IpoComprehensiveAnalysis>("ipo_comprehensive_analysis"); 
        
        const ipoList = await ipos.find({}).toArray();
        
        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            ipos_analysis: ipoList
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