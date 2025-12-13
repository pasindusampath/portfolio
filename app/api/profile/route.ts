import { NextResponse } from 'next/server';
import { getProfile } from '@/lib/google-sheets';

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
