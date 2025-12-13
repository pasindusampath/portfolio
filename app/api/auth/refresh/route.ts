import { NextResponse } from 'next/server';
import { findTokenById, revokeToken, storeRefreshToken, getUserByEmail } from '@/lib/google-sheets';
import { signAccessToken, generateRefreshToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { deviceId } = await req.json();
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refresh_token')?.value;

        if (!refreshToken || !deviceId) {
            return NextResponse.json({ error: 'Missing token or device ID' }, { status: 401 });
        }

        // 1. Find Token in DB (Using refreshToken as the ID)
        const tokenRecord = await findTokenById(refreshToken);

        if (!tokenRecord) {
            // Token not found = possibly already revoked or invalid
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        // 2. Validate Device Binding
        if (tokenRecord.deviceId !== deviceId) {
            // Suspicious: Token used from different device
            await revokeToken(refreshToken, 'Device Mismatch - Suspicious Activity');
            return NextResponse.json({ error: 'Invalid device' }, { status: 401 });
        }

        // 3. Retrieve User Info for new Access Token
        
        const newAccessToken = await signAccessToken({ userId: tokenRecord.userId, role: 'admin' });
        const newRefreshToken = generateRefreshToken();

        // 4. Rotate: Revoke old, Store new
        await revokeToken(refreshToken, 'Rotation');
        
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await storeRefreshToken({
            tokenId: newRefreshToken,
            userId: tokenRecord.userId,
            deviceId,
            expiresAt: expiresAt.toISOString()
        }, newRefreshToken);

        // 5. Update Cookie
        cookieStore.set('refresh_token', newRefreshToken, {
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
