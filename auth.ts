import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export const getAuthSession = () => getServerSession(authOptions);

export { default as auth } from 'next-auth';
