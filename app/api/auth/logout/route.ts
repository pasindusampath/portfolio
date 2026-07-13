import { NextResponse } from 'next/server';
import { revokeToken } from '@/lib/google-sheets';
import { hashToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        const rawRefreshToken = cookieStore.get('refresh_token')?.value;

        if (rawRefreshToken) {
            // Compute the hash to match the stored tokenId — the raw token is never in the DB
            const tokenHash = hashToken(rawRefreshToken);
            await revokeToken(tokenHash, 'User Logout');
        }

        cookieStore.delete('refresh_token');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
}
