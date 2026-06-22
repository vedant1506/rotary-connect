import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import AdminUser from '../../../../../models/AdminUser';

// PATCH /api/admin/users/[id] — approve or change role
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const user = await AdminUser.findByIdAndUpdate(params.id, body, { new: true, select: '-password' });
    if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id]
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    await AdminUser.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'User removed.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
