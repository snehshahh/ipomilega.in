import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function GET() {
    try {

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
        body.created_at = new Date().toISOString();
        body.updated_at = new Date().toISOString();
        await db.collection("blogs").insertOne(body);

        const slug = body.slug;
        await db.collection("blogs").updateOne(
            { _id: new ObjectId(body.ipo_id) },
            { $set: { slug: slug } }
        );

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