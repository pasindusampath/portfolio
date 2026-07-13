import { NextResponse } from 'next/server';
import { findTokenById, revokeToken, storeRefreshToken, getUserById } from '@/lib/google-sheets';
import { signAccessToken, generateRefreshToken, hashToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { deviceId } = await req.json();
        const cookieStore = await cookies();
        const rawRefreshToken = cookieStore.get('refresh_token')?.value;

        if (!rawRefreshToken || !deviceId) {
            return NextResponse.json({ error: 'Missing token or device ID' }, { status: 401 });
        }

        // --- Token Lookup ---
        // The DB stores the SHA-256 hash as the tokenId, so we hash the cookie value
        // before looking it up. The raw token never touches the database.
        const tokenHash = hashToken(rawRefreshToken);
        const tokenRecord = await findTokenById(tokenHash);

        if (!tokenRecord) {
            // Token not found — revoked or forged
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // --- Expiry Check (Fix #4) ---
        if (tokenRecord.expiresAt && new Date(tokenRecord.expiresAt) < new Date()) {
            await revokeToken(tokenHash, 'Token Expired');
            return NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 });
        }

        // --- Device Binding Check ---
        if (tokenRecord.deviceId !== deviceId) {
            // Suspicious: same token presented from a different device → kill the session
            await revokeToken(tokenHash, 'Device Mismatch - Suspicious Activity');
            return NextResponse.json({ error: 'Invalid device' }, { status: 401 });
        }

        // --- Re-validate User & Role (Fix #7) ---
        // Always re-read the user's role from the DB — never trust the cached role in the token
        const user = await getUserById(tokenRecord.userId);
        if (!user) {
            await revokeToken(tokenHash, 'User Not Found');
            return NextResponse.json({ error: 'User no longer exists' }, { status: 401 });
        }

        if (user.role !== 'admin') {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }

        // --- Token Rotation ---
        const newAccessToken = await signAccessToken({
            userId: user.id,
            email: user.email,
            role: user.role, // role sourced from live DB read, not from old token
        });

        const newRawRefreshToken = generateRefreshToken();
        const newTokenHash = hashToken(newRawRefreshToken);

        // Revoke old token, store new one (rotation)
        await revokeToken(tokenHash, 'Token Rotation');

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await storeRefreshToken(
            {
                tokenId: newTokenHash,
                userId: user.id,
                deviceId,
                expiresAt: expiresAt.toISOString(),
            },
            newTokenHash
        );

        // --- Update Cookie with New Token ---
        cookieStore.set('refresh_token', newRawRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return NextResponse.json({ accessToken: newAccessToken });

    } catch (error) {
        console.error('Refresh error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
