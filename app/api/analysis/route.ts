import { NextResponse } from "next/server";
import { connectToDatabase, getCollection } from "@/lib/mongo";
import { Ipo } from "@/app/models/ipo";
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis";

export async function GET(request: Request) {
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