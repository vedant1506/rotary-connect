import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Participant from '../../../models/Participant';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    const participants = await Participant.find({}).populate('eventId').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: participants }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch participants',
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
