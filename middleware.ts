import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

// Paths that require authentication
const PROTECTED_PATHS = ['/admin'];

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    
    // Check if path is protected
    const isProtected = PROTECTED_PATHS.some(prefix => path.startsWith(prefix));

    if (isProtected) {
        // We can't easily verify the full session here because we need DB access for Refresh Token
        // and Edge middleware has limited support for Node libs (googleapis might struggle).
        // However, we CAN check for an Access Token in headers if we had one set in cookies, but we only set Refresh Token in httpOnly cookie.
        // Access Token is in-memory on client.
        // So for the initial page load of /admin, we rely on the client to check auth and redirect.
        // BUT, what if we want to protect the route rendering?
        // We can check if `refresh_token` cookie exists. If not, redirect to login.
        // Ensuring validity is harder without DB.
        
        const refreshToken = req.cookies.get('refresh_token')?.value;
        
        if (!refreshToken) {
            // No refresh token, definitely not logged in.
            // But wait, /admin is the login page too (in our current single-page admin design)!
            // If we redirect to /admin/login, we'd loop if /admin IS where login lives.
            // Our design: app/admin/page.tsx handles BOTH Login and Dashboard states.
            // So we should NOT redirect if we are just requesting the page.
            // If we had /admin/dashboard vs /admin/login, we would redirect.
            // Since it's a Single Page App style admin, we allow the request to pass.
            // The client component will show the Login form if no auth.
            return NextResponse.next();
        }
    }

    // For API routes protection?
    // We handle API protection in the route handlers themselves (verifyAccessToken).
    
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
