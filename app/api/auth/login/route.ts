import { NextResponse } from 'next/server';
import { getUserByEmail, storeRefreshToken } from '@/lib/google-sheets';
import { hashPassword, comparePassword, signAccessToken, generateRefreshToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { email, password, deviceId } = await req.json();

        if (!email || !password || !deviceId) {
            return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await comparePassword(password, user.passwordHash);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Generate Tokens
        const accessToken = await signAccessToken({ userId: user.id, email: user.email, role: user.role });
        const refreshToken = generateRefreshToken();

        // Store Refresh Token (We store the token itself since it's opaque UUID, simpler for lookup/validation in this context)
        // Ideally we hash it, but let's stick to the plan of matching token + device ID.
        // For extra security, one might hash it, but then we need to iterate to find it or query by another ID. 
        // Our 'findTokenById' uses tokenId. We aren't storing `tokenId` separate from `refreshToken` yet in the generate function.
        // Let's assume refreshToken IS the tokenId for simplicity, or we generate a pair.
        // Let's use refreshToken string as the "token" and generate a purely unique ID for the DB row if needed.
        // Actually, schema said 'token_id', 'device_id'. Let's treat refreshToken as the secret.
        // So we need: tokenId (public/lookup), refreshToken (secret/hashed).
        // Simplification: UUID is the refresh token. We store it as `token_id`.
        
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        await storeRefreshToken({
            tokenId: refreshToken, // Using the UUID as the token itself
            userId: user.id,
            deviceId,
            expiresAt: expiresAt.toISOString()
        }, refreshToken); // Storing it directly as hash for now (in real app, use bcrypt(refreshToken)). 
        // Note: lib/google-sheets storeRefreshToken takes (tokenObj, hash). 
        // If we treat the UUID as the token, we can just store it.

        // Set Cookie
        const cookieStore = await cookies();
        cookieStore.set('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        // Set Device ID Cookie persistence
        cookieStore.set('device_id', deviceId, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 365,
        });

        return NextResponse.json({ accessToken, user: { email: user.email, role: user.role } });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
