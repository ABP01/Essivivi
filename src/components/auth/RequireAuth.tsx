"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      router.replace('/login');
    }
  }, []);

  return <>{children}</>;
}
