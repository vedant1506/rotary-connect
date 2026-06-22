import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import AdminUser from '../../../../models/AdminUser';

const ADMIN_AUTH_COOKIE = 'rotary_admin_auth';
const SESSION_VALUE = 'authenticated';

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const normalizedEmailInput = normalizeEmail(email);
    const inputPassword = String(password || '');

    if (!normalizedEmailInput || !inputPassword) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }

    // 1. First, check if matches environment variables (fallback/superuser admin)
    const allowedEmail = normalizeEmail(process.env.ADMIN_LOGIN_EMAIL);
    const allowedPassword = String(process.env.ADMIN_LOGIN_PASSWORD || '');

    let isAuthed = false;

    if (allowedEmail && allowedPassword && normalizedEmailInput === allowedEmail && inputPassword === allowedPassword) {
      isAuthed = true;
    }

    // 2. If not matched, try checking Database-registered accounts
    if (!isAuthed) {
      await dbConnect();
      const user = await AdminUser.findOne({ email: normalizedEmailInput });

      if (user) {
        // Compare password (stored as plain-text per setup in users registration route)
        if (user.password === inputPassword) {
          if (!user.approved) {
            return NextResponse.json(
              { message: 'Your account is pending admin approval.' },
              { status: 403 }
            );
          }
          isAuthed = true;
        }
      }
    }

    if (!isAuthed) {
      return NextResponse.json({ message: 'Invalid admin credentials.' }, { status: 401 });
    }

    const response = NextResponse.json({ message: 'Login successful.' });
    response.cookies.set(ADMIN_AUTH_COOKIE, SESSION_VALUE, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error: ' + error.message }, { status: 500 });
  }
}