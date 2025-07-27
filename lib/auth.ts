import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { connectToDatabase, closeConnection } from "./mongo";

let db;
let auth: unknown;

try {
  // Attempt to connect to the database
  const connection = await connectToDatabase();
  db = connection.db;

  // Initialize betterAuth only if the database connection is successful
  auth = betterAuth({
    database: mongodbAdapter(db),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    socialProviders: {
      google: {
        prompt: "select_account",
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          defaultValue: "user",
        },
      },
    },
  });

} catch (error) {
  console.error("🔴 Failed to initialize database or authentication:", error);
  // Depending on your needs, you might want to exit the process
  // if the database connection is critical for the app to run.
  // process.exit(1);
}

// Export the initialized auth object
export { auth };

// Ensure proper cleanup on shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received. Closing MongoDB connection.");
  await closeConnection();
});