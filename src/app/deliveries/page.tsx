"use client";

import RequireAuth from '@/components/auth/RequireAuth';
import { DataTable } from '@/components/essivi/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { Delivery } from '@/lib/essivi-mock';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { Camera, MapPin, Package, PenTool } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import salesService from '@/services/sales.service';
import usersService from '@/services/users.service';

const statusConfig = {
  pending: { label: 'En attente', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  in_progress: { label: 'En cours', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  completed: { label: 'Terminée', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  cancelled: { label: 'Annulée', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getAgentPhoto = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    return agent?.photoUrl;
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [data, agentsResp] = await Promise.all([
          salesService.getLivraisons(),
          usersService.getAgents(),
        ]);
        if (mounted && Array.isArray(data)) setDeliveries(data);
        if (mounted && Array.isArray(agentsResp)) setAgents(agentsResp);
      } catch (e) {
        // fallback to mockDeliveries
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (timestamp: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const columns: ColumnDef<Delivery>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-gray-900 dark:text-white">{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'agent',
      header: 'Agent',
      cell: ({ row }) => {
        const delivery = row.original;
        const photoUrl = getAgentPhoto(delivery.agentId);
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-100">
              {photoUrl && (
                <Image
                  src={photoUrl}
                  alt={delivery.agentName}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{delivery.agentName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'client',
      header: 'Client',
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.original.clientName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{row.original.clientPhone}</p>
        </div>
      ),
    },
    {
      accessorKey: 'address',
      header: 'Adresse',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 max-w-40">
          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm truncate text-gray-700 dark:text-gray-300">{row.original.address}</span>
        </div>
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Quantité',
      cell: ({ row }) => {
        const q = row.original.quantity;
        return (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-900 dark:text-white">
              V: {q.vitale} | Vol: {q.voltic} | A: {q.other}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Montant',
      cell: ({ row }) => (
        <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(row.original.amount)}</span>
      ),
    },
    {
      accessorKey: 'timestamp',
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(row.original.timestamp)}</span>
      ),
    },
    {
      accessorKey: 'proof',
      header: 'Preuves',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.photoUrl && (
            <div className="h-7 w-7 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Camera className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          )}
          {row.original.signatureUrl && (
            <div className="h-7 w-7 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <PenTool className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge className={cn('text-xs font-medium', statusConfig[status].class)}>
            {statusConfig[status].label}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Livraisons</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Historique et suivi des livraisons
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {deliveries.filter(d => d.status === 'completed').length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Terminées</p>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {deliveries.filter(d => d.status === 'in_progress').length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">En cours</p>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {deliveries.filter(d => d.status === 'pending').length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">En attente</p>
        </div>
        <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {deliveries.filter(d => d.status === 'cancelled').length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Annulées</p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={deliveries}
        searchPlaceholder="Rechercher une livraison..."
        onExport={() => console.log('Export deliveries')}
        loading={loading}
      />
    </div>
  );

}

export default function ProtectedDeliveriesPage() {
  return (
    <RequireAuth>
      <DeliveriesPage />
    </RequireAuth>
  );
}
