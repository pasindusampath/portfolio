import { NextResponse } from 'next/server';
import { getProjects, addProject } from '@/lib/google-sheets';
import { uploadImage } from '@/lib/cloudinary';
import { verifyAccessToken } from '@/lib/auth';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64, ...projectData } = body;

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

    // Deprecated: Password Check (removed)
    // if (password !== process.env.ADMIN_PASSWORD) { ... }

    let imageUrl = projectData.imageUrl || '';

    // Handle Image Upload if base64 provided
    if (imageBase64) {
      try {
        imageUrl = await uploadImage(imageBase64);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
      }
    }

    const success = await addProject({ ...projectData, imageUrl });
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
    }

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
