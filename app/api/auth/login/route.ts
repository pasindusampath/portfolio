import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/google-sheets';
import { storeRefreshToken } from '@/lib/google-sheets';
import { comparePassword, signAccessToken, generateRefreshToken, hashToken } from '@/lib/auth';
import { isBlocked, recordFailedAttempt, clearAttempts } from '@/lib/rate-limit';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { email, password, deviceId } = await req.json();

        if (!email || !password || !deviceId) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        // --- Rate Limiting ---
        // Use the IP from Vercel headers; fall back to a generic key locally
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            ?? req.headers.get('x-real-ip')
            ?? 'local';

        const { blocked, retryAfterSeconds } = isBlocked(ip);
        if (blocked) {
            return NextResponse.json(
                { error: `Too many failed attempts. Try again in ${retryAfterSeconds} seconds.` },
                { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
            );
        }

        // --- Credential Validation ---
        const user = await getUserByEmail(email);
        if (!user) {
            recordFailedAttempt(ip);
            // Generic message — does not reveal whether the email exists
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await comparePassword(password, user.passwordHash);
        if (!isValid) {
            recordFailedAttempt(ip);
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Clear failure counter on successful login
        clearAttempts(ip);

        // --- Token Generation ---
        const accessToken = await signAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        const rawRefreshToken = generateRefreshToken();
        // SECURITY: Only the SHA-256 hash of the token is persisted in the DB.
        // The raw UUID lives only in the httpOnly cookie on the client.
        const tokenHash = hashToken(rawRefreshToken);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7-day refresh window

        await storeRefreshToken(
            {
                tokenId: tokenHash, // hash is the stable lookup key in the DB
                userId: user.id,
                deviceId,
                expiresAt: expiresAt.toISOString(),
            },
            tokenHash // hash column — stored again for future constant-time comparison
        );

        // --- Set Cookies ---
        const cookieStore = await cookies();
        cookieStore.set('refresh_token', rawRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        cookieStore.set('device_id', deviceId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: '/',
        });

        return NextResponse.json({ accessToken, user: { email: user.email, role: user.role } });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
