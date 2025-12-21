"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EssiviPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const defaultLanding = (process?.env?.NEXT_PUBLIC_DEFAULT_LANDING === 'signup') ? '/signup' : '/login';
      if (token) router.replace('/dashboard');
      else router.replace(defaultLanding);
    } catch (e) {
      const defaultLanding = (process?.env?.NEXT_PUBLIC_DEFAULT_LANDING === 'signup') ? '/signup' : '/login';
      router.replace(defaultLanding);
    }
  }, [router]);

  return null;
}
