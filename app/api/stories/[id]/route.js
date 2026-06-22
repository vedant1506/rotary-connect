import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Story from '../../../../models/Story';

// PATCH /api/stories/[id] — toggle approved status
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();
    const story = await Story.findByIdAndUpdate(id, { approved: body.approved }, { new: true });
    if (!story) {
      return NextResponse.json({ success: false, message: 'Story not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: story }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update story', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/stories/[id]
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    await Story.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Story deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete story', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
