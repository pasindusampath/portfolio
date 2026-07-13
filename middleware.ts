import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for the /admin route.
 *
 * The admin panel is a fully client-rendered SPA — on the initial page load the
 * browser receives the shell, then the React component immediately calls
 * /api/auth/refresh. If that fails, the component renders the login form.
 *
 * Server-side access-token validation in Edge middleware is impractical here
 * because:
 *  - The access token is stored in React state (in-memory), not in a cookie.
 *  - Calling googleapis from the Edge runtime is unreliable.
 *
 * What we CAN do: if there is no refresh_token cookie at all, we know for
 * certain the user is logged out, so we redirect them to /admin (which shows
 * the login form) instead of rendering a blank loading screen for /admin/…
 * sub-paths.
 *
 * Full session validity is enforced in each API route handler via verifyAccessToken.
 */
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const refreshToken = req.cookies.get('refresh_token')?.value;

    // Protect deep admin sub-paths — if there is provably no session, redirect
    // to the admin root (login form) rather than attempting to render the page.
    const isDeepAdminPath = pathname.startsWith('/admin/');
    if (isDeepAdminPath && !refreshToken) {
        return NextResponse.redirect(new URL('/admin', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
