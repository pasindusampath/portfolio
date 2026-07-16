import { NextResponse } from 'next/server';
import { getDailyNotes, addDailyNote } from '@/lib/google-sheets';
import { verifyAccessToken } from '@/lib/auth';

export async function GET() {
  try {
    const notes = await getDailyNotes();
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch daily notes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Verify Access Token from Header
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Missing Token' }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Invalid Token' }, { status: 401 });
    }

    const body = await req.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const note = {
      date: new Date().toISOString(),
      content: content.trim(),
    };

    const success = await addDailyNote(note);

    if (!success) {
      return NextResponse.json({ error: 'Failed to add daily note' }, { status: 500 });
    }

    return NextResponse.json({ success: true, note });
  } catch (error) {
    console.error('Daily Notes API Error:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
