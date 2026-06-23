import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Event from '../../../../models/Event';

export const dynamic = 'force-dynamic';

// GET single event
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const event = await Event.findById(params.id);
    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: event }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch event', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT update event
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const event = await Event.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: event }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update event', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE event
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const event = await Event.findByIdAndDelete(params.id);
    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Event deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete event', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
