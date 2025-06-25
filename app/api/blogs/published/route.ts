import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";

export async function GET() {
    try {
        const {db} = await connectToDatabase();
        const blogs = await db.collection("blogs").find({}).toArray();
                const blogList = blogs || [];
        const sortedBlogList = blogList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const publishedBlogs = sortedBlogList.filter(blog => blog.status === 'published');
        const ipo_analysis = await db.collection("categories").find({category: "IPO Analysis",status: "published"}).toArray();
        const company_review = await db.collection("categories").find({category: "Company Review",status: "published"}).toArray();
        const market_news = await db.collection("categories").find({category: "Market News",status: "published"}).toArray();
        const investment_guide = await db.collection("categories").find({category: "Investment Guide",status: "published"}).toArray();
        
        return NextResponse.json({
            message: "Data retrieved successfully",
            success: true,
            blogs: publishedBlogs,
            ipo_analysis: ipo_analysis,
            company_review: company_review,
            market_news: market_news,
            investment_guide: investment_guide
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