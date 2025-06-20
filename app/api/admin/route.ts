import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";

export async function GET() {   
    try {
        const {db} = await connectToDatabase();
        const ipos = await db.collection("ipos").find({}).toArray();
        const blogs =await db.collection("blogs").find({}).toArray();
        const ipoList = ipos || [];
        const particularBlog=blogs.filter((blog) => ipoList.some((ipo) => ipo._id.toString() === blog.ipo_id));
        
        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            ipos: ipoList,
            blog: particularBlog
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