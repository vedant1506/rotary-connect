import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Volunteer from '../../../models/Volunteer';

export async function GET() {
  try {
    await dbConnect();

    const volunteers = await Volunteer.find({}).populate('eventId').sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: volunteers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch volunteers',
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
