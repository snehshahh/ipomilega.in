import { NextResponse } from "next/server";
import { connectToDatabase, getCollection } from "@/lib/mongo";

export async function GET(request: Request) {
    try {
        const { db } = await connectToDatabase();
        
        const blogs = await getCollection<BlogPost>("blogs"); 
        
        const blogList = await blogs.find({}).toArray();
        const latestBlog = blogList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
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