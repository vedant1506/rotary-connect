import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Event from '../../../models/Event';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    const events = await Event.find({}).sort({ date: 1 });

    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch events',
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
    const event = await Event.create(body);

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create event',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
