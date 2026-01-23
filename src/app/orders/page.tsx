"use client";

import RequireAuth from '@/components/auth/RequireAuth';
import { DataTable } from '@/components/essivi/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types/legacy_mock_types';
import { useEffect, useState } from 'react';
import salesService from '@/services/sales.service';
import usersService from '@/services/users.service';
import { cn } from '@/lib/utils';
import reportsService from '@/services/reports.service';
import { saveAs } from 'file-saver';
import { ColumnDef } from '@tanstack/react-table';
import { Clock, Package, UserPlus } from 'lucide-react';
import Image from 'next/image';

const statusConfig = {
  pending: { label: 'En attente', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  validated: { label: 'Validée', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  delivered: { label: 'Livrée', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  cancelled: { label: 'Annulée', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [data, agentsResp] = await Promise.all([
          salesService.getCommandes(),
          usersService.getAgents(),
        ]);
        if (mounted && Array.isArray(data)) setOrders(data);
        if (mounted && Array.isArray(agentsResp)) setAgents(agentsResp);
      } catch (e) {
        // fallback to mockOrders
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

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return 'N/A';
    try {
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(timestamp));
    } catch (e) {
      return timestamp;
    }
  };

  const handleAssign = (order: Order) => {
    setSelectedOrder(order);
    setSelectedAgentId('');
    setIsAssignOpen(true);
  };

  const handleSubmitAssignment = async () => {
    if (!selectedOrder || !selectedAgentId) return;

    setAssigning(true);
    try {
      await salesService.assignAgent(selectedOrder.id, selectedAgentId);
      // Refresh orders list
      const data = await salesService.getCommandes();
      const ordersResult = Array.isArray(data) ? data : ((data as any)?.results || []);
      setOrders(ordersResult);
      setIsAssignOpen(false);
      setSelectedOrder(null);
      setSelectedAgentId('');
    } catch (err) {
      console.error('Failed to assign agent', err);
      alert('Impossible d\'assigner l\'agent. Veuillez réessayer.');
    } finally {
      setAssigning(false);
    }
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
      accessorKey: 'client_name',
      header: 'Client',
      cell: ({ row }) => (
        <p className="font-medium text-gray-900 dark:text-white">{row.original.client_name || row.original.clientName}</p>
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Produit / Quantité',
      cell: ({ row }) => {
        const order = row.original;
        const q = order.quantity;
        if (q) {
          const total = (q.vitale || 0) + (q.voltic || 0) + (q.other || 0);
          return (
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">{total} sachets</span>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Eau Essivi</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'montant',
      header: 'Montant',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(row.original.montant || row.original.totalAmount || 0)}</span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Demandée le',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(row.original.created_at || row.original.requestedAt)}</span>
      ),
    },
    {
      accessorKey: 'date_souhaitee',
      header: 'Livraison souhaitée',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Clock className="h-4 w-4 text-gray-400" />
          {formatDate(row.original.date_souhaitee || row.original.preferredAt)}
        </div>
      ),
    },
    {
      accessorKey: 'agent_name',
      header: 'Agent assigné',
      cell: ({ row }) => {
        const order = row.original;
        const agentId = order.agent || order.assignedAgentId;
        const agentName = order.agent_name || order.assignedAgentName;

        if (agentId) {
          const agent = agents.find(a => a.id === agentId);
          return (
            <div className="flex items-center gap-2">
              <div className="relative h-7 w-7 rounded-full overflow-hidden bg-gray-100">
                {agent?.photoUrl && (
                  <Image
                    src={agent.photoUrl}
                    alt={agentName || ''}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <span className="text-sm text-gray-900 dark:text-white">{agentName}</span>
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
      accessorKey: 'statut',
      header: 'Statut',
      cell: ({ row }) => {
        const statusKey = (row.original.statut || row.original.status || 'pending') as keyof typeof statusConfig;
        const config = statusConfig[statusKey] || statusConfig.pending;
        return (
          <Badge className={cn('text-xs font-medium', config.class)}>
            {config.label}
          </Badge>
        );
      },
    },
  ];

  const pendingCount = orders.filter(o => (o.statut === 'pending' || o.status === 'pending')).length;

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
        data={orders}
        searchPlaceholder="Rechercher une commande..."
        onExport={async () => {
          try {
            const blob = await reportsService.export('csv', { type: 'orders' });
            const file = new Blob([blob], { type: 'text/csv;charset=utf-8' });
            saveAs(file, `commandes-${new Date().toISOString().slice(0, 10)}.csv`);
          } catch (err) {
            console.error('export orders failed', err);
            alert('Impossible d\'exporter les commandes.');
          }
        }}
        loading={loading}
      />

      {/* Assignment Modal */}
      {isAssignOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Assigner un agent
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Commande: <span className="font-mono">{selectedOrder.id}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Client: <span className="font-medium text-gray-900 dark:text-white">{selectedOrder.clientName}</span>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sélectionner un agent
              </label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Choisir un agent --</option>
                {agents.map((agent) => {
                  const user = agent.user || agent;
                  const displayName = user.first_name && user.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user.username || `Agent #${agent.id}`;
                  return (
                    <option key={agent.id} value={user.id}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsAssignOpen(false);
                  setSelectedOrder(null);
                  setSelectedAgentId('');
                }}
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                disabled={assigning}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmitAssignment}
                disabled={!selectedAgentId || assigning}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {assigning ? 'Assignation...' : 'Assigner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

export default function ProtectedOrdersPage() {
  return (
    <RequireAuth>
      <OrdersPage />
    </RequireAuth>
  );
}
