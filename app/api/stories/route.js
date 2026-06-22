import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Story from '../../../models/Story';

export const dynamic = 'force-dynamic';

// GET — return all approved stories (public feed)
export async function GET() {
  try {
    await dbConnect();
    const stories = await Story.find({ approved: true }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: stories }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stories', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST — anyone can submit a story; goes into pending (approved: false) until admin approves
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { name, role, village, quote } = body;
    if (!name || !role || !village || !quote) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }
    if (quote.length > 500) {
      return NextResponse.json({ success: false, message: 'Quote must be under 500 characters.' }, { status: 400 });
    }

    const story = await Story.create({ name, role, village, quote, approved: false });
    return NextResponse.json({ success: true, data: story }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to submit story', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
