"use client";

import { MapLeaflet } from '@/components/essivi/map/MapLeaflet';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { mockDeliveries } from '@/lib/essivi-mock';
import { useEffect, useState } from 'react';
import usersService from '@/services/users.service';
import salesService from '@/services/sales.service';
import { cn } from '@/lib/utils';
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Package } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

export default function ClientDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [client, setClient] = useState<any | null>(null);
  const [clientDeliveries, setClientDeliveries] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [clientResp, livraisonsResp] = await Promise.all([
          usersService.getClientById(id),
          salesService.getLivraisons(),
        ]);
        if (!mounted) return;
        if (clientResp) setClient(clientResp);
        if (Array.isArray(livraisonsResp)) setClientDeliveries(livraisonsResp.filter((d: any) => d.clientId === id));
      } catch (e) {
        // fallback to mock deliveries
        setClientDeliveries(mockDeliveries.filter((d: any) => d.clientId === id));
      }
    })();
    return () => { mounted = false };
  }, [id]);

  if (!client) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Client non trouvé</p>
      </div>
    );
  }

  const formatDate = (date: string) => {
    if (!date) return '—';
    const d = new Date(date);
    if (!isFinite(d.getTime())) return '—';
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(d);
  };

  // normalize contact/email/phone across API variants
  const contact =
    client.contact ||
    client.contactName ||
    client.contact_name ||
    client.ownerName ||
    client.owner_name ||
    (client.user && ((client.user.first_name && client.user.last_name) ? `${client.user.first_name} ${client.user.last_name}` : client.user.username)) ||
    client.username ||
    '—';

  const email = client.email || client.user?.email || client.contactEmail || client.contact_email || '—';

  const phone =
    client.phone ||
    client.phone_number ||
    client.user?.phone ||
    client.user?.phone_number ||
    client.contact ||
    client.contactPhone ||
    client.contact_phone ||
    client.user?.profile?.phone ||
    '—';

  // normalize orders / last order date / coordinates across API variants
  const totalOrders =
    client.totalOrders ??
    client.total_orders ??
    client.ordersCount ??
    client.orders_count ??
    client.totalDeliveries ??
    client.total_deliveries ??
    (Array.isArray(client.orders) ? client.orders.length : undefined) ??
    '—';

  let lastOrderDate =
    client.lastOrderDate ||
    client.last_order_date ||
    client.lastOrderAt ||
    client.last_order_at ||
    client.lastOrder?.date ||
    client.last_order?.date ||
    client.lastOrder?.timestamp ||
    client.last_order?.timestamp ||
    null;
  if (!lastOrderDate && Array.isArray(clientDeliveries) && clientDeliveries.length) {
    const sorted = [...clientDeliveries].sort((a: any, b: any) => {
      const ta = a.timestamp || a.date || 0;
      const tb = b.timestamp || b.date || 0;
      return new Date(tb).getTime() - new Date(ta).getTime();
    });
    lastOrderDate = sorted[0]?.timestamp || sorted[0]?.date || null;
  }

  const latRaw = client.lat ?? client.latitude ?? client.coords?.lat ?? client.location?.lat ?? client.geo?.lat ?? client.lat_deg;
  const lngRaw = client.lng ?? client.longitude ?? client.coords?.lng ?? client.location?.lng ?? client.geo?.lng ?? client.lng_deg;
  const latNum = latRaw != null ? Number(latRaw) : null;
  const lngNum = lngRaw != null ? Number(lngRaw) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/clients')} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profil du client</h1>
          <p className="text-gray-500 dark:text-gray-400">{client.code || client.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
              {/* no client photo in mock; keep placeholder */}
              <div className="h-24 w-24 flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 3a2 2 0 012-2h8a2 2 0 012 2v2H4V3zM3 7h14v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{client.storeName || client.store_name || 'Client'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{contact}</p>

            <div className="w-full mt-6 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{phone}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{client.address || '—'}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalOrders ?? '—'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Commandes</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{lastOrderDate ? formatDate(lastOrderDate) : '—'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Dernière commande</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Badge className="text-xs font-medium">{client.type || '—'}</Badge>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{Number.isFinite(latNum) ? latNum.toFixed(4) : '—'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Latitude</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{Number.isFinite(lngNum) ? lngNum.toFixed(4) : '—'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Longitude</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dernières livraisons</h3>
            <div className="space-y-4">
              {clientDeliveries.slice(0, 5).map(delivery => (
                <div key={delivery.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{delivery.agentName || delivery.agentId}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{delivery.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">{delivery.amount ? `${delivery.amount} XOF` : '—'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(delivery.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {client.lat && client.lng && (
            <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <MapLeaflet center={[client.lat, client.lng]} zoom={15} />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
