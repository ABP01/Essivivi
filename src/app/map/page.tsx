"use client";

import RequireAuth from '@/components/auth/RequireAuth';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(
  () => import('@/components/map/MapComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl">
        <p className="text-gray-500">Chargement de la carte...</p>
      </div>
    )
  }
);

function MapPage() {
  return <MapComponent />;
}

export default function ProtectedMapPage() {
  return (
    <RequireAuth>
      <MapPage />
    </RequireAuth>
  );
}
