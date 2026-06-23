import { NextResponse } from 'next/server';

const ADMIN_AUTH_COOKIE = 'rotary_admin_auth';
const SESSION_VALUE = 'authenticated';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const authCookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  const isAuthenticated = authCookie === SESSION_VALUE;
  return NextResponse.json({ authenticated: isAuthenticated });
}
