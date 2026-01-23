"use client";

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import salesService from '@/services/sales.service';
import usersService from '@/services/users.service';

const statusConfig = {
  pending: { label: 'En attente', class: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  validated: { label: 'Validée', class: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  delivered: { label: 'Livrée', class: 'bg-green-500/10 text-green-600 border-green-500/20' },
  cancelled: { label: 'Annulée', class: 'bg-red-500/10 text-red-600 border-red-500/20' },
};

export function RecentDeliveries() {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [commandesResp, agentsResp] = await Promise.all([
          salesService.getCommandes(),
          usersService.getAgents(),
        ]);
        if (mounted && Array.isArray(commandesResp)) {
          // Map Commandes to the UI format
          const mappedData = commandesResp.map((cmd: any) => ({
            id: cmd.id,
            clientName: cmd.client_name || 'Client',
            agentName: cmd.agent_name || 'En attente',
            agentId: cmd.agent,
            amount: parseFloat(cmd.montant),
            status: cmd.statut,
            timestamp: cmd.created_at
          }));

          setDeliveries(mappedData);
        }
        if (mounted && Array.isArray(agentsResp)) setAgents(agentsResp);
      } catch (e) {
        setDeliveries([]);
      }
    })();
    return () => { mounted = false };
  }, []);

  const recentDeliveries = [...deliveries]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const getAgentPhoto = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return agent?.photoUrl;
  };

  const formatDate = (timestamp: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Commandes récentes</CardTitle>
        <Link href="/deliveries" className="text-sm text-blue-600 hover:underline">
          Voir tout
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentDeliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {getAgentPhoto(delivery.agentId) ? (
                <Image
                  src={getAgentPhoto(delivery.agentId) as string}
                  alt={delivery.agentName}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <div className="h-10 w-10 flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM2 18a8 8 0 1116 0H2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{delivery.clientName}</p>
              <p className="text-xs text-gray-500 truncate">
                Par {delivery.agentName} • {formatDate(delivery.timestamp)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{formatCurrency(delivery.amount)}</p>
              <Badge
                variant="outline"
                className={cn('text-xs', (statusConfig as any)[delivery.status]?.class)}
              >
                {(statusConfig as any)[delivery.status]?.label}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
