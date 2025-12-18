"use client";

import { DataTable } from '@/components/essivi/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { Client, mockClients } from '@/lib/essivi-mock';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { Mail, MapPin, Phone, Plus, Store } from 'lucide-react';
import { useState } from 'react';

const typeConfig = {
  boutique: { label: 'Boutique', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  restaurant: { label: 'Restaurant', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  hotel: { label: 'Hôtel', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  particulier: { label: 'Particulier', class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  entreprise: { label: 'Entreprise', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
};

export default function ClientsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'client',
      header: 'Client',
      cell: ({ row }) => {
        const client = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Store className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{client.storeName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{client.code}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'ownerName',
      header: 'Propriétaire',
      cell: ({ row }) => (
        <span className="text-gray-900 dark:text-white">{row.original.ownerName}</span>
      ),
    },
    {
      accessorKey: 'contact',
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
      accessorKey: 'address',
      header: 'Adresse',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 max-w-48">
          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="truncate text-gray-700 dark:text-gray-300">{row.original.address}</span>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <Badge className={cn('text-xs font-medium', typeConfig[type].class)}>
            {typeConfig[type].label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'totalOrders',
      header: 'Commandes',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900 dark:text-white">{row.original.totalOrders}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clients</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez les clients et points de vente
          </p>
        </div>
        
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter un client
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={mockClients}
        searchPlaceholder="Rechercher un client..."
        onExport={() => console.log('Export clients')}
      />
    </div>
  );
}
