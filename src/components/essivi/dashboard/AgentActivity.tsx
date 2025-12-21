"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MapPin, Truck, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import usersService from '@/services/users.service';

const statusConfig = {
  active: { label: 'Actif', class: 'bg-green-500/10 text-green-600 border-green-500/20', icon: '🟢' },
  inactive: { label: 'Inactif', class: 'bg-gray-500/10 text-gray-500 border-gray-500/20', icon: '⚫' },
  on_delivery: { label: 'En livraison', class: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: '🔵' },
};

export function AgentActivity() {
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const agentsResp = await usersService.getAgents();
        if (!mounted) return;
        if (Array.isArray(agentsResp)) setAgents(agentsResp);
      } catch (e) {
        // keep empty list
      }
    })();
    return () => { mounted = false };
  }, []);

  const activeAgents = agents.filter((a: any) => a.status !== 'inactive').slice(0, 5);

  return (
    <Card className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Activité des agents</CardTitle>
        <Link href="/agents" className="text-sm text-blue-600 hover:underline">
          Voir tout
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeAgents.map((agent) => (
          <div
            key={agent.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="relative">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src={agent.photoUrl}
                  alt={`${agent.firstname} ${agent.lastname}`}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              {
                (() => {
                  const cfg = (statusConfig as any)[agent.status] ?? { label: (agent.status || 'inconnu'), class: 'bg-gray-100 text-gray-700', icon: '❔' };
                  return <span className="absolute -bottom-0.5 -right-0.5 text-xs">{cfg.icon}</span>;
                })()
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {agent.firstname} {agent.lastname}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Truck className="h-3 w-3" />
                <span>{agent.tricycle?.plate ?? '—'}</span>
              </div>
            </div>
            <div className="text-right">
              {
                (() => {
                  const cfg = (statusConfig as any)[agent.status] ?? { label: (agent.status || 'Inconnu'), class: 'bg-gray-100 text-gray-700', icon: '❔' };
                  return (
                    <>
                      <Badge variant="outline" className={cn('text-xs', cfg.class)}>{cfg.label}</Badge>
                    </>
                  );
                })()
              }
              <p className="text-xs text-gray-500 mt-1">
                {agent.totalDeliveries} livraisons
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
