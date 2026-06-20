import { NextResponse } from 'next/server';

const ADMIN_AUTH_COOKIE = 'rotary_admin_auth';
const SESSION_VALUE = 'authenticated';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isAdminDashboard = pathname.startsWith('/admin/dashboard');

  if (!isAdminDashboard) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;

  if (authCookie === SESSION_VALUE) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/admin/login', request.url);
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};