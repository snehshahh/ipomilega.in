import { NextResponse } from "next/server";
import { connectToDatabase, getCollection } from "@/lib/mongo";

export async function GET(request: Request) {
    try {
        const { db } = await connectToDatabase();
        
        const ipos = await getCollection<BlogPost>("blogs"); 
        
        const ipoList = await ipos.find({}).toArray();
        
        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            ipos: ipoList
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

export async function POST(request: Request) {
    try {
        const { db } = await connectToDatabase();
        
        const body: BlogPost = await request.json();    
        
        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
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