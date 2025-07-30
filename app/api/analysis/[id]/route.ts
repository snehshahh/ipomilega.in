import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";


export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        const { db } = await connectToDatabase();
        const analysisList = await db.collection("ipo_comprehensive_analysis").find({}).toArray();
        const ipoList = await db.collection("ipos").find({}).toArray();
        const analysis = analysisList || [];

        const analysisData = analysis.find((ana) => ana.ipo_table_id === id);

        const ipoTable = ipoList.find((ipo) => ipo._id.toString() === id);

        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            ipos_analysis: analysisData,
            ipo: ipoTable,
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