import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import AdminUser from '../../../../models/AdminUser';

// GET — list all admin users (for dashboard)
export async function GET() {
  try {
    await dbConnect();
    const users = await AdminUser.find({}, '-password').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST — register a new admin/volunteer user
export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password, phone, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Name, email and password are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const exists = await AdminUser.findOne({ email: email.trim().toLowerCase() });
    if (exists) {
      return NextResponse.json({ success: false, message: 'An account with this email already exists.' }, { status: 409 });
    }

    // Plain-text password storage (sufficient for simple NGO use; upgrade to bcrypt for production)
    const user = await AdminUser.create({
      name,
      email,
      password,
      phone: phone || '',
      role: role === 'admin' ? 'admin' : 'volunteer',
      // Admins are approved by default; volunteers need approval
      approved: role === 'admin',
    });

    const { password: _p, ...safeUser } = user.toObject();
    return NextResponse.json({ success: true, data: safeUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
