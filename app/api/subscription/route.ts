import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";

/**
 * @interface Subscription
 * Defines the structure for user activity data, including subscriptions.
 * - name (string, optional): The user's name.
 * - email (string): The user's email address (unique identifier).
 * - whatsapp_number (string, optional): The user's WhatsApp number.
 * - is_newsletter_subscribed (boolean): Status of newsletter subscription.
 * - is_whatsapp_subscribed (boolean): Status of WhatsApp alerts subscription.
 * - created_at (string): Timestamp of the initial record creation.
 * - updated_at (string): Timestamp of the last update.
 */
interface Subscription {
    name?: string;
    email: string;
    whatsapp_number?: string;
    is_newsletter_subscribed: boolean;
    is_whatsapp_subscribed: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * POST /api/subscriptions
 * Handles newsletter subscription requests with name and email.
 * If the user's email already exists, it updates their subscription status and name.
 * If the email does not exist, it creates a new user activity record.
 *
 * @param {Request} request - The incoming Next.js request object.
 * @returns {NextResponse} - A JSON response indicating success or failure.
 */
export async function POST(request: Request) {
    try {
        const { db } = await connectToDatabase();
        const { email, name } = await request.json();

        // --- Validation ---
        if (!email) {
            return NextResponse.json(
                { message: "Email is required.", success: false },
                { status: 400 }
            );
        }

        const userActivityCollection = db.collection<Subscription>("user_activity");

        // --- Check for existing user ---
        const existingUser = await userActivityCollection.findOne({ email });

        if (existingUser) {
            // --- User exists: Update their newsletter subscription status and name ---
            if (existingUser.is_newsletter_subscribed) {
                return NextResponse.json(
                    { message: "You are already subscribed to our newsletter.", success: true },
                    { status: 200 }
                );
            }

            await userActivityCollection.updateOne(
                { email },
                {
                    $set: {
                        is_newsletter_subscribed: true,
                        name: name || existingUser.name, // Update name if provided
                        updated_at: new Date().toISOString(),
                    },
                }
            );

            return NextResponse.json(
                { message: "Successfully subscribed to the newsletter!", success: true },
                { status: 200 }
            );
        } else {
            // --- New user: Create a new subscription record ---
            const newSubscription: Subscription = {
                name,
                email,
                is_newsletter_subscribed: true,
                is_whatsapp_subscribed: false, // Default value
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            await userActivityCollection.insertOne(newSubscription);

            return NextResponse.json(
                { message: "Thank you for subscribing to our newsletter!", success: true },
                { status: 201 } // 201 Created
            );
        }
    } catch (error) {
        console.error("Error in /api/subscriptions:", error);
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        return NextResponse.json(
            { message: "Something went wrong.", error: errorMessage, success: false },
            { status: 500 }
        );
    }
}
