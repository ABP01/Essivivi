"use client";

import React, { useEffect, useState } from 'react';
import { EssiviHeader, EssiviSidebar } from './index';
import { usePathname } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export function ConditionalShell({ children }: Props) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const token = localStorage.getItem('access_token');
      setAuthed(!!token);
    } catch (e) {
      setAuthed(false);
    }
  }, []);

  // If we're on auth pages, never render the app chrome behind them
  if (pathname && (pathname === '/login' || pathname.startsWith('/login') || pathname === '/signup' || pathname.startsWith('/signup'))) {
    return <>{children}</>;
  }

  // while checking, avoid flashing the full app chrome
  if (authed === null) return <>{children}</>;

  if (!authed) {
    // not authenticated: render children full-bleed (login/signup)
    return <>{children}</>;
  }

  // authenticated: render normal app chrome
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EssiviSidebar />
      <div className="lg:pl-64">
        <EssiviHeader />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

export default ConditionalShell;
