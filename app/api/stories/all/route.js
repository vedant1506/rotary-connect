import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Story from '../../../../models/Story';

export const dynamic = 'force-dynamic';

// GET /api/stories/all — returns ALL stories for admin (both pending and approved)
export async function GET() {
  try {
    await dbConnect();
    const stories = await Story.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: stories }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stories', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
