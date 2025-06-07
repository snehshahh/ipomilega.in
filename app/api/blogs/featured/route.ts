import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";

export async function GET() {
    try {
        const blogs = await getCollection<BlogPost>("blogs"); 
        
        const blogList = await blogs.find({}).toArray();
        const threeFeaturedBlogList = blogList.slice(0, 3);
        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            blogList: threeFeaturedBlogList
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