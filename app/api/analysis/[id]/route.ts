import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";


export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id
        console.log("id",id)
        const { db } = await connectToDatabase();
        const ipoList = await db.collection("ipos").find({}).toArray();

        const ipoTable = ipoList.find((ipo) => ipo.slug === id);
        const ipoTableId = ipoTable?._id.toString();
        console.log("ipoTableId",ipoTableId)
        const analysisList = await db.collection("ipo_comprehensive_analysis").findOne({ ipo_table_id: ipoTableId });


        if (!analysisList) {
            return NextResponse.json({
                message: "Data not found",
                success: false,
            }, { status: 404 });
        }


        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            ipos_analysis: analysisList,
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