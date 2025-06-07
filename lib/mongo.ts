import { MongoClient, ServerApiVersion, MongoClientOptions, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

if (!process.env.MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const options: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let cachedDb: Db | null = null;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
}

export async function connectToDatabase() {
  if (cachedDb) {
    return { client, db: cachedDb };
  }

  try {
    await client.connect();
    
    const db = client.db(dbName);
    
    // Test the connection
    await db.command({ ping: 1 });
    
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

// Helper function to get a specific collection with type safety
export async function getCollection<T extends Document>(collectionName: string) {
  try {
    const { db } = await connectToDatabase();
    return db.collection<T>(collectionName);
  } catch (error) {
    console.error('MongoDB collection error:', error);
    throw new Error('Failed to get MongoDB collection');
  }
}

// Close the connection when the application is shutting down
export async function closeConnection() {
  if (client) {
    await client.close();
    cachedDb = null;
  }
}

// Export a module-scoped MongoClient for backward compatibility
export default client;