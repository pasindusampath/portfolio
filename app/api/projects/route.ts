import { NextResponse } from 'next/server';
import { getProjects, addProject } from '@/lib/google-sheets';
import { uploadImage } from '@/lib/cloudinary';

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
    const { password, imageBase64, ...projectData } = body;

    // Simple Admin Check
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
