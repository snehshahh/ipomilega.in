import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";

export async function GET() {
    try {
        const {db} = await connectToDatabase();
        const blogs = await db.collection("blogs").find({}).toArray();
        
        const blogList = blogs || [];
        
        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            blogs: blogList
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