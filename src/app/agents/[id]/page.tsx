"use client";

import { MapLeaflet } from '@/components/essivi/map/MapLeaflet';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { mockAgents, mockDeliveries } from '@/lib/essivi-mock';
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
import { useState } from 'react';

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
  const agent = mockAgents.find(a => a.id === id);
  const agentDeliveries = mockDeliveries.filter(d => d.agentId === id);

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
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/essivi/agents')}
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
            <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4 bg-gray-100">
              <Image
                src={agent.photoUrl}
                alt={`${agent.firstname} ${agent.lastname}`}
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{agent.firstname} {agent.lastname}</h2>
            <Badge className={cn('mt-2', statusConfig[agent.status].class)}>
              {statusConfig[agent.status].label}
            </Badge>

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
                <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{agent.tricycle.plate}</span>
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
