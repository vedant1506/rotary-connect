import { NextResponse } from 'next/server';

const ADMIN_AUTH_COOKIE = 'rotary_admin_auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out successfully.' });
  response.cookies.set(ADMIN_AUTH_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0, // expire immediately
  });
  return response;
}
