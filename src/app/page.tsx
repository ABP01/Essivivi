"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EssiviPage() {
  const router = useRouter();

  useEffect(() => {
    // Force initial landing to the login page. After successful login,
    // the `LoginPage` will navigate to `/dashboard`.
    router.replace('/login');
  }, [router]);

  return null;
}
