import { connectToDatabase } from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const slug = (await params).slug;
        
        const {db} = await connectToDatabase();
        const blogs = await db.collection("blogs").find({}).toArray();
        
        const blogList = blogs || [];
        
        const blog = blogList.find((blog) => blog.slug === slug);
        
        if (blog) {
            return NextResponse.json({
                message: "Blog exists",
                exists: true,
            }, { status: 200 });
        }

        return NextResponse.json({
            message: "Blog does not exist",
            exists: false,
        }, { status: 200 });
    }
    catch (error) {
        console.error("Error in /api/admin:", error);
        return NextResponse.json({
            message: error instanceof Error ? error.message : "Something went wrong",
            exists: false,
        }, { status: 500 });
    }
}