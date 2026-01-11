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

interface AgentPerformanceItem {
  name: string;
  deliveries: number;
  photo: string | null;
}

export function AgentActivity({ performanceData = [] }: { performanceData?: AgentPerformanceItem[] }) {
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

  // Map performance data to agent status info if available
  const displayData = performanceData.length > 0
    ? performanceData.map(p => {
      const agent = agents.find(a => `${a.firstname} ${a.lastname}` === p.name || a.username === p.name);
      return {
        ...p,
        status: agent?.status || 'active',
        tricycle: agent?.tricycle
      };
    })
    : agents.filter((a: any) => a.status !== 'inactive').slice(0, 5).map(a => ({
      name: `${a.firstname} ${a.lastname}`,
      deliveries: a.totalDeliveries || 0,
      photo: a.photoUrl,
      status: a.status,
      tricycle: a.tricycle
    }));

  return (
    <Card className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Performance des agents</CardTitle>
        <Link href="/agents" className="text-sm text-blue-600 hover:underline">
          Voir tout
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayData.map((agent, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="relative">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 italic">
                {agent.photo ? (
                  <Image
                    src={agent.photo}
                    alt={agent.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm font-semibold">
                    {agent.name?.[0] || 'A'}
                  </div>
                )}
              </div>
              {
                (() => {
                  const cfg = (statusConfig as any)[agent.status] ?? { icon: '🟢' };
                  return <span className="absolute -bottom-0.5 -right-0.5 text-xs">{cfg.icon}</span>;
                })()
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {agent.name}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Truck className="h-3 w-3" />
                <span>{agent.tricycle?.plate || 'Tricycle A-1'}</span>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', (statusConfig as any)[agent.status]?.class || statusConfig.active.class)}>
                {(statusConfig as any)[agent.status]?.label || 'Disponible'}
              </Badge>
              <p className="text-xs font-semibold text-primary mt-1">
                {agent.deliveries} livraisons
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
