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
  const globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(uri, options);
}

export async function connectToDatabase() {
  if (cachedDb) {
    return { client, db: cachedDb };
  }

  try {
    await client.connect();
    console.log("MongoDB connected successfully");
    const db = client.db(dbName);
    await db.command({ ping: 1 });
    cachedDb = db;
    console.log("Database cached successfully");
    return { client, db };
  } catch (error) {
    
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}


export async function closeConnection() {
  if (client) {
    await client.close();
    cachedDb = null;
  }
}

export default client;