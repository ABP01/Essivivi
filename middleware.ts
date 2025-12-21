import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware to redirect unauthenticated users to /login.
// It checks for an `access_token` cookie which is set on successful login.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow Next internals, static files and common public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/public') ||
    pathname === '/favicon.ico' ||
    pathname.match(/\.[a-zA-Z0-9]+$/)
  ) {
    return NextResponse.next();
  }

  // Public routes that should always be accessible
  const PUBLIC_ROUTES = ['/login', '/signup', '/api'];
  for (const pr of PUBLIC_ROUTES) {
    if (pathname === pr || pathname.startsWith(pr)) return NextResponse.next();
  }

  // Check cookie set by authService on login
  const token = req.cookies.get('access_token')?.value;
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // apply middleware to all routes except the Next internals handled above
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
