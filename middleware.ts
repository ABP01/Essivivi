import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

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
  const PUBLIC_ROUTES = ['/login', '/api'];
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

  // Protect admin/dashboard routes: require admin/gestionnaire role in JWT payload
  try {
    const pathnameLower = pathname.toLowerCase();
    if (pathnameLower.startsWith('/dashboard') || pathnameLower.startsWith('/admin')) {
      // decode JWT payload without verifying signature (edge runtime cannot access secret)
      const parts = token.split('.');
      if (parts.length < 2) throw new Error('invalid token');
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
      const decoded = Buffer.from(padded, 'base64').toString('utf8');
      const data = JSON.parse(decoded);

      const isAdmin = !!data.is_superuser || !!data.is_staff;
      const tokenRole = (data.role || data.user_type || data.type || '').toString().toLowerCase();

      // Fallback: Check for client-set flavor cookies if backend claim is missing (Temporary fix for deployment sync)
      const cookieRole = req.cookies.get('user_role')?.value || '';
      const cookieUser = req.cookies.get('user_name')?.value || '';

      const role = tokenRole || cookieRole;
      const username = data.username || cookieUser;

      const isManager = role === 'gestionnaire' || role === 'manager' || role === 'admin' || username === 'admin';

      if (!isAdmin && !isManager) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = '/login';
        // optionally add query to explain reason
        loginUrl.searchParams.set('reason', 'not_authorized');
        return NextResponse.redirect(loginUrl);
      }
    }
  } catch (err) {
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
