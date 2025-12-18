"use client";

import { DataTable } from '@/components/essivi/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { Agent, mockAgents } from '@/lib/essivi-mock';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Eye, Mail, Phone, Plus, Trash2, Truck } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const statusConfig = {
  active: { label: 'Actif', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  inactive: { label: 'Inactif', class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  on_delivery: { label: 'En livraison', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
};

export default function AgentsPage() {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const columns: ColumnDef<Agent>[] = [
    {
      accessorKey: 'agent',
      header: 'Agent',
      cell: ({ row }) => {
        const agent = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100">
              <Image
                src={agent.photoUrl}
                alt={`${agent.firstname} ${agent.lastname}`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{agent.firstname} {agent.lastname}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{agent.identificationNumber}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'phone',
      header: 'Contact',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
            <Phone className="h-3 w-3 text-gray-400" />
            {row.original.phone}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Mail className="h-3 w-3" />
            {row.original.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'tricycle',
      header: 'Tricycle',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-gray-400" />
          <span className="font-mono text-sm text-gray-900 dark:text-white">{row.original.tricycle.plate}</span>
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
    {
      accessorKey: 'totalDeliveries',
      header: 'Livraisons',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900 dark:text-white">{row.original.totalDeliveries}</span>
      ),
    },
    {
      accessorKey: 'revenue',
      header: 'Revenus',
      cell: ({ row }) => (
        <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(row.original.revenue)}</span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const agent = row.original;
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => router.push(`/essivi/agents/${agent.id}`)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700"
              title="Voir détails"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700"
              title="Modifier"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500 hover:text-red-700"
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agents</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez les agents de livraison ESSIVI
          </p>
        </div>
        
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter un agent
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={mockAgents}
        searchPlaceholder="Rechercher un agent..."
        onExport={() => console.log('Export agents')}
      />
    </div>
  );
}
