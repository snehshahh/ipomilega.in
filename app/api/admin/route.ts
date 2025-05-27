import { NextResponse } from "next/server";
import { connectToDatabase, getCollection } from "@/lib/mongo";
import { Ipo } from "@/app/models/ipo";

export async function GET(request: Request) {
    try {
        console.log("Connecting to database...");
        const { db } = await connectToDatabase();
        console.log("Connected to database");
        
        // List all collections to verify
        const collections = await db.listCollections().toArray();
        console.log("Available collections:", collections.map(c => c.name));
        
        const ipos = await getCollection<Ipo>("ipos"); 
        console.log("Collection access successful");
        
        const ipoList = await ipos.find({}).toArray();
        console.log(`Found ${ipoList.length} IPOs`);
        
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