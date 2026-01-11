"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
  const router = useRouter();


  useEffect(() => {
    // Simple authentication check - just verify token exists
    // Full validation happens on each API call via axios interceptors
    const checkAuth = () => {
      if (typeof window === 'undefined') return;

      const token = localStorage.getItem('access_token');
      if (!token) {
        router.replace('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    // Block navigation via browser back/forward arrows to protected pages.
    // If user is unauthenticated, any popstate will redirect to /login.
    // If user is authenticated but tries to navigate to public auth pages,
    // immediately replace the location with /dashboard so the auth pages
    // cannot be reached via history arrows.
    try {
      const handler = (e: PopStateEvent) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const pathname = window.location.pathname;

        if (!token) {
          window.location.replace('/login');
          return;
        }

        // If authenticated, prevent going back to login/signup
        if (pathname === '/login' || pathname === '/signup') {
          // replace to dashboard (use replace to avoid creating new history entry)
          window.location.replace('/dashboard');
          return;
        }

        // Otherwise keep user on the intended protected page; ensure a stable history state
        try {
          window.history.pushState(null, '', window.location.href);
        } catch (err) { }
      };

      // push initial state so popstate has something to work with
      if (typeof window !== 'undefined') {
        try { window.history.pushState(null, '', window.location.href); } catch (e) { }
        window.addEventListener('popstate', handler);
      }

      return () => {
        try { window.removeEventListener('popstate', handler); } catch (e) { }
      };
    } catch (e) {
      // ignore in SSR
    }
  }, []);

  return <>{children}</>;
}
