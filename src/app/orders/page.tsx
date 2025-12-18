"use client";

import { DataTable } from '@/components/essivi/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { mockAgents, mockOrders, Order } from '@/lib/essivi-mock';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { Clock, Package, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

const statusConfig = {
  pending: { label: 'En attente', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  assigned: { label: 'Assignée', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  in_progress: { label: 'En cours', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  completed: { label: 'Terminée', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  cancelled: { label: 'Annulée', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

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
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const handleAssign = (order: Order) => {
    setSelectedOrder(order);
    setIsAssignOpen(true);
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'id',
      header: 'Commande',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-gray-900 dark:text-white">{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'clientName',
      header: 'Client',
      cell: ({ row }) => (
        <p className="font-medium text-gray-900 dark:text-white">{row.original.clientName}</p>
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Quantité',
      cell: ({ row }) => {
        const q = row.original.quantity;
        const total = q.vitale + q.voltic + q.other;
        return (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{total} sachets</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'totalAmount',
      header: 'Montant',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(row.original.totalAmount)}</span>
      ),
    },
    {
      accessorKey: 'requestedAt',
      header: 'Demandée le',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(row.original.requestedAt)}</span>
      ),
    },
    {
      accessorKey: 'preferredAt',
      header: 'Livraison souhaitée',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Clock className="h-4 w-4 text-gray-400" />
          {formatDate(row.original.preferredAt)}
        </div>
      ),
    },
    {
      accessorKey: 'assignedAgentName',
      header: 'Agent assigné',
      cell: ({ row }) => {
        const order = row.original;
        if (order.assignedAgentId) {
          const agent = mockAgents.find(a => a.id === order.assignedAgentId);
          return (
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 rounded-full overflow-hidden bg-gray-100">
                {agent?.photoUrl && (
                  <Image
                    src={agent.photoUrl}
                    alt={order.assignedAgentName || ''}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <span className="text-sm text-gray-900 dark:text-white">{order.assignedAgentName}</span>
            </div>
          );
        }
        return (
          <button
            onClick={() => handleAssign(order)}
            className="inline-flex items-center gap-1 px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <UserPlus className="h-4 w-4" />
            Assigner
          </button>
        );
      },
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

  const pendingCount = mockOrders.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Commandes</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Gérez et assignez les commandes clients
        </p>
      </div>

      {/* Pending Orders Alert */}
      {pendingCount > 0 && (
        <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-medium text-amber-700 dark:text-amber-400">
              {pendingCount} commandes en attente d&apos;assignation
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Assignez un agent pour démarrer la livraison
            </p>
          </div>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={mockOrders}
        searchPlaceholder="Rechercher une commande..."
        onExport={() => console.log('Export orders')}
      />
    </div>
  );
}
