import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Define admin routes
    const adminRoutes = ['/admin'];
    
    // Check if the route is an admin route
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    
    // If it's an admin route and user is not an admin, redirect to home
    if (isAdminRoute && token?.role !== 'admin') {
      const url = new URL('/', req.url);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // The `authorized` callback is used to verify if the request is authorized to access a page
      authorized: ({ token }) => {
        // If there's a token, the user is authenticated
        return !!token;
      },
    },
  }
);

// Specify which paths should be protected
// All routes under these paths will require authentication
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - auth (sign-in page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth|$).*)',
  ],
};
