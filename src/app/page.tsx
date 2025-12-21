"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EssiviPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (token) router.replace('/dashboard');
      else router.replace('/login');
    } catch (e) {
      router.replace('/login');
    }
  }, [router]);

  return null;
}
