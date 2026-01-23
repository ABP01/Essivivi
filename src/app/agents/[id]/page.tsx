"use client";

import { MapLeaflet } from '@/components/essivi/map/MapLeaflet';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import { useEffect, useState } from 'react';
import usersService from '@/services/users.service';
import salesService from '@/services/sales.service';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Edit,
  Mail,
  MapPin,
  Package,
  Phone,
  TrendingUp,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

const statusConfig = {
  active: { label: 'Actif', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  inactive: { label: 'Inactif', class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  on_delivery: { label: 'En livraison', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
};

export default function AgentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'map' | 'history'>('map');

  const id = params.id as string;
  const [agent, setAgent] = useState<any | null>(null);
  const [agentDeliveries, setAgentDeliveries] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [agentResp, livraisonsResp] = await Promise.all([
          usersService.getAgentById(id),
          salesService.getLivraisons(),
        ]);
        if (!mounted) return;
        const normalizeAgent = (a: any) => {
          if (!a) return a;
          const user = a.user || {};
          // names
          const firstname = a.firstname || a.first_name || user.first_name || user.firstname || '';
          const lastname = a.lastname || a.last_name || user.last_name || user.lastname || '';
          // contact
          const phone = a.phone || a.phone_number || user.phone_number || user.phone || a.contact || '';
          const email = a.email || user.email || '';
          // photo
          const photoUrl = a.photoUrl || a.photo_url || user.photoUrl || user.photo_url || user.avatar || null;
          // tricycle / plate fields
          const tricycle = a.tricycle || (a.tricycle_plate ? { plate: a.tricycle_plate } : (a.tricycle || null));
          // identification
          const identificationNumber = a.identificationNumber || a.identification_number || '';
          // dates
          const dateOfHire = a.date_embauche || a.dateOfHire || user.date_embauche || user.dateOfHire || null;
          // totals
          const totalDeliveries = a.totalDeliveries ?? a.total_deliveries ?? a.deliveries ?? 0;
          const revenue = a.revenue ?? a.revenu ?? 0;
          // coords
          const lat = a.lat ?? a.latitude ?? a.gps_lat ?? a.gpsLat ?? null;
          const lng = a.lng ?? a.longitude ?? a.gps_lng ?? a.gpsLng ?? null;

          // restore locally-stored identification number if missing
          try {
            if (!identificationNumber && typeof window !== 'undefined') {
              const usernameKey = user.username || a.username || '';
              if (usernameKey) {
                const stored = localStorage.getItem(`agent_ident_${usernameKey}`);
                if (stored) return { ...a, firstname, lastname, phone, email, photoUrl, tricycle, identificationNumber: stored, dateOfHire, totalDeliveries, revenue, lat, lng };
              }
            }
          } catch (e) { }

          return { ...a, firstname, lastname, phone, email, photoUrl, tricycle, identificationNumber, dateOfHire, totalDeliveries, revenue, lat, lng };
        };

        if (agentResp) {
          setAgent(normalizeAgent(agentResp));
        }

        if (Array.isArray(livraisonsResp)) {
          const agentKey = String(agentResp?.id ?? (agentResp?.user as any)?.id ?? id);
          setAgentDeliveries(livraisonsResp.filter((d: any) => String(d.agentId ?? d.agent_id ?? d.agent) === agentKey));
        }
      } catch (e) {
        // fallback to mock
        setAgentDeliveries([]);
      }
    })();
    return () => { mounted = false };
  }, [id]);

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Agent non trouvé</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (date: string) => {
    if (!date) return '—';
    const d = new Date(date);
    if (!isFinite(d.getTime())) return '—';
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(d);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/agents')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profil de l&apos;agent</h1>
          <p className="text-gray-500 dark:text-gray-400">{agent.identificationNumber}</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
          <Edit className="h-4 w-4" />
          Modifier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
          <div className="flex flex-col items-center text-center">
            <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
              {agent.photoUrl ? (
                <Image src={agent.photoUrl} alt={`${agent.firstname} ${agent.lastname}`} fill className="object-cover" />
              ) : (
                <div className="h-24 w-24 flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM2 18a8 8 0 1116 0H2z" />
                  </svg>
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{agent.firstname} {agent.lastname}</h2>
            {
              (() => {
                const cfg = (statusConfig as any)[agent.status] ?? { label: (agent.status || 'Inconnu'), class: 'bg-gray-100 text-gray-700' };
                return <Badge className={cn('mt-2', cfg.class)}>{cfg.label}</Badge>;
              })()
            }

            <div className="w-full mt-6 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{agent.phone}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{agent.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Truck className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{agent.tricycle?.plate ?? '—'}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Embauché le {formatDate(agent.dateOfHire)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats & Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{agent.totalDeliveries}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Livraisons</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(agent.revenue)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Revenus</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">92%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Performance</p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">15</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Zones couvertes</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('map')}
                className={cn(
                  'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                  activeTab === 'map'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                Position
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={cn(
                  'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                  activeTab === 'history'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                Historique
              </button>
            </div>

            {activeTab === 'map' && (
              <MapLeaflet
                center={agent.lat && agent.lng ? [agent.lat, agent.lng] : undefined}
                zoom={15}
              />
            )}

            {activeTab === 'history' && (
              <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dernières livraisons</h3>
                <div className="space-y-4">
                  {agentDeliveries.slice(0, 5).map(delivery => (
                    <div
                      key={delivery.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{delivery.clientName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{delivery.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(delivery.amount)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(delivery.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
