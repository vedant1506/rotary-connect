import { NextResponse } from 'next/server';

const ADMIN_AUTH_COOKIE = 'rotary_admin_auth';
const SESSION_VALUE = 'authenticated';

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export async function POST(request) {
  const { email, password } = await request.json();

  const allowedEmail = normalizeEmail(process.env.ADMIN_LOGIN_EMAIL);
  const allowedPassword = String(process.env.ADMIN_LOGIN_PASSWORD || '');

  if (!allowedEmail || !allowedPassword) {
    return NextResponse.json(
      {
        message: 'Admin login is not configured. Set ADMIN_LOGIN_EMAIL and ADMIN_LOGIN_PASSWORD in .env.local.',
      },
      { status: 500 }
    );
  }

  if (normalizeEmail(email) !== allowedEmail || String(password || '') !== allowedPassword) {
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
}