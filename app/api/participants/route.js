import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Participant from '../../../models/Participant';
import '../../../models/Event'; // ensure Event model is registered for populate('eventId')

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    await dbConnect();

    // Populate is best-effort: one corrupt eventId ref must not 500 the whole list.
    let participants;
    try {
      participants = await Participant.find({})
        .populate({ path: 'eventId', strictPopulate: false })
        .sort({ createdAt: -1 })
        .lean();
    } catch (populateError) {
      console.error('GET /api/participants populate failed, falling back to plain find:', populateError);
      participants = await Participant.find({}).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ success: true, data: participants }, { status: 200 });
  } catch (error) {
    console.error('GET /api/participants failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch participants. If this is on Vercel, check MONGO_URI env var and Atlas Network Access.',
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
    const participant = await Participant.create(body);

    return NextResponse.json({ success: true, data: participant }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create participant registration',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
