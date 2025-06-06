import { NextResponse } from "next/server";
import { connectToDatabase, getCollection } from "@/lib/mongo";
import { BlogPost } from "@/app/models/blogs";

export async function GET(request: Request) {
    try {
        const { db } = await connectToDatabase();
        
        const blogs = await getCollection<BlogPost>("blogs"); 
        
        const blogList = await blogs.find({}).toArray();
        
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