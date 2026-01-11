"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import usersService from '@/services/users.service';

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
  const LRef = useRef<any>(null);

  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    const fetchAgents = async () => {
      try {
        const agentsResp = await usersService.getAgents();
        if (mounted && Array.isArray(agentsResp)) setAgents(agentsResp);
      } catch (e) { }
    };

    const initMap = async () => {
      if (!mapRef.current) return;

      // Remove any previous map instance
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) { }
        mapInstanceRef.current = null;
      }

      // Clear the container
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
        (mapRef.current as any)._leaflet_id = undefined;
      }

      const L = (await import('leaflet')).default;
      LRef.current = L;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current).setView(center, zoom);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
    };

    fetchAgents();
    initMap();

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, showAgents]);

  useEffect(() => {
    const L = LRef.current;
    if (!mapInstanceRef.current || !agents || !showAgents || !L) return;

    // Remove existing markers (if any)
    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    // Add agent markers
    agents.filter(a => a.lat && a.lng).forEach(agent => {
      const statusColor = agent.status === 'on_delivery' ? '#3b82f6' : agent.status === 'active' ? '#22c55e' : '#6b7280';
      const imgHtml = agent.photoUrl ? `<img src="${agent.photoUrl}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;" alt="${agent.firstname}"/>` : `<div style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;">?</div>`;
      const popupTricycle = agent.tricycle?.plate ?? '—';

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: ${statusColor}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${imgHtml}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      L.marker([agent.lat, agent.lng], { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`<div style="min-width: 150px;"><strong>${agent.firstname} ${agent.lastname}</strong><br/><span style="color: #666;">${popupTricycle}</span><br/><span style="color: ${statusColor};">●</span> ${agent.status === 'on_delivery' ? 'En livraison' : agent.status === 'active' ? 'Actif' : 'Inactif'}</div>`);
    });
  }, [agents, showAgents]);

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
