import { NextResponse } from 'next/server';
import { revokeToken } from '@/lib/google-sheets';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refresh_token')?.value;

        if (refreshToken) {
            await revokeToken(refreshToken, 'User Logout');
        }

        cookieStore.delete('refresh_token');

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    }
}
