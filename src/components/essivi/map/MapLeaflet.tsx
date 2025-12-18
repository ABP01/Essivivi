"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAgents } from '@/lib/essivi-mock';
import { useEffect, useRef } from 'react';

interface MapLeafletProps {
  className?: string;
  showAgents?: boolean;
  center?: [number, number];
  zoom?: number;
}

export function MapLeaflet({ 
  className = '', 
  showAgents = true, 
  center = [6.1319, 1.2228], 
  zoom = 13 
}: MapLeafletProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Import Leaflet dynamically on client side only
    const initMap = async () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;
      // Leaflet CSS is imported in globals.css

      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Initialize map
      const map = L.map(mapRef.current).setView(center, zoom);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add agent markers
      if (showAgents) {
        const activeAgents = mockAgents.filter(a => a.lat && a.lng);
        
        activeAgents.forEach(agent => {
          const statusColor = agent.status === 'on_delivery' ? '#3b82f6' : 
                             agent.status === 'active' ? '#22c55e' : '#6b7280';
          
          const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `
              <div style="
                background: ${statusColor};
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              ">
                <img src="${agent.photoUrl}" 
                     style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" 
                     alt="${agent.firstname}"
                />
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          if (agent.lat && agent.lng) {
            L.marker([agent.lat, agent.lng], { icon: customIcon })
              .addTo(map)
              .bindPopup(`
                <div style="min-width: 150px;">
                  <strong>${agent.firstname} ${agent.lastname}</strong><br/>
                  <span style="color: #666;">${agent.tricycle.plate}</span><br/>
                  <span style="color: ${statusColor};">●</span> ${
                    agent.status === 'on_delivery' ? 'En livraison' : 
                    agent.status === 'active' ? 'Actif' : 'Inactif'
                  }
                </div>
              `);
          }
        });
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, showAgents]);

  return (
    <Card className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Carte des agents</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div 
          ref={mapRef} 
          className={`h-[300px] w-full ${className}`}
          style={{ zIndex: 0 }}
        />
      </CardContent>
    </Card>
  );
}
