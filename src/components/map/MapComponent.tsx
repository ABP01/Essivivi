"use client";

import { Card } from '@/components/ui/card';
import { mockAgents, mockClients, mockDeliveries } from '@/lib/essivi-mock';
import L from 'leaflet';
import { Layers, Store, Truck, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

export default function MapComponent() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const [showAgents, setShowAgents] = useState(true);
    const [showClients, setShowClients] = useState(true);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<string>('all');

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current).setView([6.1319, 1.2228], 13);
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Clear existing markers
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
                map.removeLayer(layer);
            }
        });

        // Add agent markers
        if (showAgents) {
            const filteredAgents = selectedAgent === 'all'
                ? mockAgents.filter(a => a.lat && a.lng)
                : mockAgents.filter(a => a.id === selectedAgent && a.lat && a.lng);

            filteredAgents.forEach(agent => {
                const statusColor = agent.status === 'on_delivery' ? '#3B82F6' :
                    agent.status === 'active' ? '#22C55E' : '#888';

                const customIcon = L.divIcon({
                    className: 'custom-marker',
                    html: `
            <div style="
              background: ${statusColor};
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              <img src="${agent.photoUrl}" 
                   style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" 
                   alt="${agent.firstname}"
              />
            </div>
          `,
                    iconSize: [40, 40],
                    iconAnchor: [20, 20],
                });

                if (agent.lat && agent.lng) {
                    L.marker([agent.lat, agent.lng], { icon: customIcon })
                        .addTo(map)
                        .bindPopup(`
              <div style="min-width: 180px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                  <img src="${agent.photoUrl}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
                  <div>
                    <strong>${agent.firstname} ${agent.lastname}</strong><br/>
                    <span style="color: #666; font-size: 12px;">${agent.tricycle.plate}</span>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                  <span style="color: ${statusColor};">●</span>
                  ${agent.status === 'on_delivery' ? 'En livraison' :
                                agent.status === 'active' ? 'Actif' : 'Inactif'}
                </div>
                <div style="margin-top: 8px; font-size: 12px; color: #666;">
                  ${agent.totalDeliveries} livraisons effectuées
                </div>
              </div>
            `);
                }
            });
        }

        // Add client markers
        if (showClients) {
            mockClients.slice(0, 20).forEach(client => {
                const clientIcon = L.divIcon({
                    className: 'custom-marker',
                    html: `
            <div style="
              background: #EF4444;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none">
                <path d="M3 21h18v-2H3v2zM3 7v10h6V7H3zm8 0v10h6V7h-6zm8 10h2V7h-2v10z"/>
              </svg>
            </div>
          `,
                    iconSize: [28, 28],
                    iconAnchor: [14, 14],
                });

                L.marker([client.lat, client.lng], { icon: clientIcon })
                    .addTo(map)
                    .bindPopup(`
            <div style="min-width: 150px;">
              <strong>${client.storeName}</strong><br/>
              <span style="color: #666; font-size: 12px;">${client.ownerName}</span><br/>
              <span style="color: #666; font-size: 12px;">${client.phone}</span>
            </div>
          `);
            });
        }

        // Add heatmap circles for delivery density
        if (showHeatmap) {
            const deliveryCounts: { [key: string]: { lat: number; lng: number; count: number } } = {};

            mockDeliveries.forEach(delivery => {
                const key = `${delivery.lat.toFixed(3)},${delivery.lng.toFixed(3)}`;
                if (!deliveryCounts[key]) {
                    deliveryCounts[key] = { lat: delivery.lat, lng: delivery.lng, count: 0 };
                }
                deliveryCounts[key].count++;
            });

            Object.values(deliveryCounts).forEach(point => {
                const radius = Math.min(point.count * 5, 50);
                L.circleMarker([point.lat, point.lng], {
                    radius,
                    fillColor: '#3B82F6',
                    color: '#3B82F6',
                    weight: 1,
                    opacity: 0.6,
                    fillOpacity: 0.3,
                }).addTo(map);
            });
        }
    }, [showAgents, showClients, showHeatmap, selectedAgent]);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Carte interactive</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Visualisez les agents, clients et zones de livraison
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Controls */}
                <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl lg:order-last">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                        <Layers className="h-5 w-5" />
                        Couches
                    </h3>

                    <div className="space-y-6">
                        {/* Agent Filter */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Agent</label>
                            <select
                                value={selectedAgent}
                                onChange={(e) => setSelectedAgent(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            >
                                <option value="all">Tous les agents</option>
                                {mockAgents.map(agent => (
                                    <option key={agent.id} value={agent.id}>
                                        {agent.firstname} {agent.lastname}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Layer Toggles */}
                        <div className="space-y-4">
                            <label className="flex items-center justify-between cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Agents</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={showAgents}
                                    onChange={(e) => setShowAgents(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </label>

                            <label className="flex items-center justify-between cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Store className="h-4 w-4 text-red-500" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Clients</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={showClients}
                                    onChange={(e) => setShowClients(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </label>

                            <label className="flex items-center justify-between cursor-pointer">
                                <div className="flex items-center gap-2">
                                    <Truck className="h-4 w-4 text-amber-500" />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Densité livraisons</span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={showHeatmap}
                                    onChange={(e) => setShowHeatmap(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </label>
                        </div>

                        {/* Legend */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Légende</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="h-3 w-3 rounded-full bg-green-500" />
                                <span>Agent actif</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="h-3 w-3 rounded-full bg-blue-500" />
                                <span>Agent en livraison</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="h-3 w-3 rounded-full bg-gray-400" />
                                <span>Agent inactif</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="h-3 w-3 rounded-full bg-red-500" />
                                <span>Point de vente</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Map */}
                <div className="lg:col-span-3">
                    <Card className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <div
                            ref={mapRef}
                            className="h-[600px] w-full"
                            style={{ zIndex: 0 }}
                        />
                    </Card>
                </div>
            </div>
        </div>
    );
}
