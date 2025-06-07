import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import { Ipo } from "@/app/models/ipo";

export async function GET({ params }: { params: { id: string } }) {
    try {
        
        const ipos = await getCollection<Ipo>("ipos"); 
        
        const ipoList = await ipos.find({}).toArray();

        const ipo = ipoList.find((ipo) => ipo._id.toString() === params.id);
        
        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            ipos: ipo
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