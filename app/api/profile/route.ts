import { NextResponse } from 'next/server';
import { getProfile, updateProfile } from '@/lib/google-sheets';
import { verifyAccessToken } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { avatarBase64, ...profileData } = body;

    // Verify Access Token from Header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1]; // Bearer <token>
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing Token' }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Invalid Token' }, { status: 401 });
    }

    let avatarUrl = profileData.avatarUrl || '';

    // Handle Avatar Image Upload if base64 provided
    if (avatarBase64) {
      try {
        avatarUrl = await uploadImage(avatarBase64);
      } catch (uploadError) {
        console.error('Avatar upload failed:', uploadError);
        return NextResponse.json({ error: 'Avatar upload failed' }, { status: 500 });
      }
    }

    const success = await updateProfile({ ...profileData, avatarUrl });
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true, avatarUrl });
  } catch (error) {
    console.error('Profile API Error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
