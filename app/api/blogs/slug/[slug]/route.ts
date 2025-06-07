import { connectToDatabase } from "@/lib/mongo";
import { NextResponse } from "next/server";



export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {   
        const slug = (await params).slug;
        
        const {db} = await connectToDatabase();
        const blogs = await db.collection("blogs").find({}).toArray();
        
        const blogList = blogs || [];
        
        const blog = blogList.find((blog) => blog.slug === slug);
        
        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            blog: blog
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