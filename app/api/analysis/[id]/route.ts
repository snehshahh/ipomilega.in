import { NextResponse } from "next/server";
import { connectToDatabase, getCollection } from "@/lib/mongo";
import { Ipo } from "@/app/models/ipo";
import { IpoComprehensiveAnalysis } from "@/app/models/ipo_comprehensive_analysis";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { db } = await connectToDatabase();
        
        const ipos = await getCollection<IpoComprehensiveAnalysis>("ipo_comprehensive_analysis"); 
        
        const ipoList = await ipos.find({}).toArray();
        
        const ipo = ipoList.find((ipo) => ipo.ipo_table_id === id);
        
        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            ipos_analysis: ipo
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