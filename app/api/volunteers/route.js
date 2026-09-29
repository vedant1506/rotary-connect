import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Volunteer from '../../../models/Volunteer';
import '../../../models/Event'; // ensure Event model is registered for populate('eventId')

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    await dbConnect();

    // Populate is best-effort: one corrupt eventId ref must not 500 the whole list.
    let volunteers;
    try {
      volunteers = await Volunteer.find({})
        .populate({ path: 'eventId', strictPopulate: false })
        .sort({ createdAt: -1 })
        .lean();
    } catch (populateError) {
      console.error('GET /api/volunteers populate failed, falling back to plain find:', populateError);
      volunteers = await Volunteer.find({}).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ success: true, data: volunteers }, { status: 200 });
  } catch (error) {
    console.error('GET /api/volunteers failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch volunteers. If this is on Vercel, check MONGO_URI env var and Atlas Network Access.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const volunteer = await Volunteer.create(body);

    return NextResponse.json({ success: true, data: volunteer }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create volunteer registration',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
