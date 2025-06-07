import { getCollection } from "@/lib/mongo";
import { NextResponse } from "next/server";
import { BlogPost } from "@/app/models/blog";

export async function GET({ params }: { params: { slug: string } }) {
    try {
        const { slug } = await params;
        
        const blogs = await getCollection<BlogPost>("blogs"); 
        
        const blogList = await blogs.find({}).toArray();
        
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