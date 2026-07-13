import { NextResponse } from 'next/server';
import { getFootprints, addFootprint } from '@/lib/google-sheets';
import { Footprint } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const footprints = await getFootprints();
    return NextResponse.json(footprints);
  } catch (error) {
    console.error('API GET Footprints Error:', error);
    return NextResponse.json({ error: 'Failed to fetch footprints' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { deviceId, name, emoji, message, color, x, y, timezone } = body;

    // Simple validation
    if (!deviceId || !name || !emoji || !color || x === undefined || y === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Geolocation detection from Vercel headers
    let country = req.headers.get('x-vercel-ip-country') || '';
    let city = req.headers.get('x-vercel-ip-city') || '';

    // Fallback to timezone string parsing if headers are not available (e.g., local dev)
    if (!city && timezone) {
      // e.g. "Asia/Colombo" -> city: "Colombo"
      const parts = timezone.split('/');
      if (parts.length > 1) {
        city = parts[1].replace(/_/g, ' ');
      } else {
        city = timezone;
      }
    }

    if (!city) {
      city = 'Local Space';
    }

    // Clean up city name from URI encoding if any
    city = decodeURIComponent(city);

    // Map country code to full name/emoji if possible, or just keep the code
    if (country) {
      // Optional flag emoji mapping
      const getFlagEmoji = (countryCode: string) => {
        const codePoints = countryCode
          .toUpperCase()
          .split('')
          .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
      };
      
      try {
        const flag = getFlagEmoji(country);
        country = `${country} ${flag}`;
      } catch (e) {
        // Fallback if flag parsing fails
      }
    } else {
      country = 'Offline';
    }

    const newFootprint: Footprint = {
      id: uuidv4(),
      deviceId,
      name: name.substring(0, 20), // Max 20 chars
      emoji,
      message: message ? message.substring(0, 60) : '', // Max 60 chars
      color,
      x: parseFloat(x),
      y: parseFloat(y),
      country,
      city,
      createdAt: new Date().toISOString(),
    };

    const success = await addFootprint(newFootprint);
    if (!success) {
      return NextResponse.json({ error: 'Failed to save footprint' }, { status: 500 });
    }

    return NextResponse.json({ success: true, footprint: newFootprint });
  } catch (error) {
    console.error('API POST Footprints Error:', error);
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
}
