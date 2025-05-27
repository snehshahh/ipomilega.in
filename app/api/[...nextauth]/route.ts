import NextAuth, { AuthOptions, DefaultSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import type { Adapter } from 'next-auth/adapters';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import client from '@/lib/mongo';

// Create a promise that resolves to the MongoDB client
const clientPromise = Promise.resolve(client);

// Workaround for MongoDB 6.x compatibility
const adapter = {
  ...MongoDBAdapter(clientPromise, {
    databaseName: process.env.MONGODB_DB || 'test',
  }),
  // Add any adapter methods that might be missing
  getSessionAndUser: async (sessionToken: string) => {
    const mongoClient = await clientPromise;
    const db = mongoClient.db(process.env.MONGODB_DB || 'test');
    const session = await db.collection('sessions').findOne({ sessionToken });
    if (!session) return null;
    const user = await db.collection('users').findOne({ _id: session.userId });
    if (!user) return null;
    return { session, user };
  },
} as Adapter;

// Extend the Session and JWT types to include the role
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession['user'];
  }

  interface User {
    role?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}

// Using the adapter with MongoDB 6.x compatibility

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  
  // Use MongoDB adapter
  adapter: adapter,
  
  // Custom pages
  pages: {
    signIn: '/auth/signin',
  },
  
  // Session configuration
  session: {
    strategy: 'jwt' as const,
  },
  
  // Callbacks to customize JWT and session
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user) {
        user.role = 'user';
        
        // You can set specific emails as admin
        const adminEmails = ['admin@example.com']; // Add admin emails here
        if (user.email && adminEmails.includes(user.email)) {
          user.role = 'admin';
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      // Add user ID and role to JWT
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID and role to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  
  // Enable debug in development
  debug: process.env.NODE_ENV === 'development',
  
  // Secret for encrypting the JWT
  secret: process.env.NEXTAUTH_SECRET,
  
  // Add custom events
  events: {
    async createUser({ user }) {
      // You can add additional logic when a new user is created
      console.log('New user created:', user.email);
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };