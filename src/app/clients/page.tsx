"use client";

import RequireAuth from '@/components/auth/RequireAuth';
import { DataTable } from '@/components/essivi/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { Client } from '@/types/legacy_mock_types';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { Mail, MapPin, Phone, Plus, Store } from 'lucide-react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import reportsService from '@/services/reports.service';
import { saveAs } from 'file-saver';
import { useEffect, useState } from 'react';
import usersService from '@/services/users.service';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import CreateClientModal from '@/components/essivi/modals/CreateClientModal';

const typeConfig = {
  boutique: { label: 'Boutique', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  restaurant: { label: 'Restaurant', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  hotel: { label: 'Hôtel', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  particulier: { label: 'Particulier', class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  entreprise: { label: 'Entreprise', class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
};

function ClientsPage() {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await usersService.getClients();
        if (mounted && Array.isArray(data)) {
          // dedupe by sensible key (prefer id, then email, phone, code) and keep the most complete record
          const map = new Map<string, Client>();
          const keyOf = (c: any) => c?.id || c?.email || c?.phone || c?.code || (c?.storeName ? `store:${c.storeName}` : null) || JSON.stringify(c || {});
          const completeness = (c: any) => Object.values(c || {}).filter(v => v !== null && v !== undefined && String(v).trim() !== '').length;
          data.forEach((c: any) => {
            if (!c) return;
            // normalize variant field names returned by API
            const normalized = {
              ...c,
              storeName: c.storeName || c.store_name || c.nom_point_vente || c.company || c.name,
              ownerName: (c.ownerName || c.owner_name || c.owner || (c.user && (c.user.username || `${c.user.first_name || ''} ${c.user.last_name || ''}`))),
              phone: c.phone || c.phone_number || (c.user && c.user.phone_number) || c.contact || '',
              email: c.email || (c.user && c.user.email) || '',
              address: c.address || c.adresse || (c.user && c.user.address) || '',
            };
            const k = keyOf(normalized);
            const existing = map.get(k);
            if (!existing) map.set(k, normalized);
            else if (completeness(normalized) > completeness(existing)) map.set(k, normalized);
          });
          setClients(Array.from(map.values()));
        }
      } catch (e) {
        // fallback to mocks
        setClients([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'client',
      header: 'Client',
      cell: ({ row }) => {
        const client = row.original;
        // prefer storeName, otherwise fallback to ownerName or code
        const title = client.storeName || client.ownerName || client.code || 'Client';
        // owner display: try several possible fields returned by API (cast to any for legacy API fields)
        const owner = (client as any).ownerName || (client as any).owner_name || (client as any).owner || '';
        const contact = client.phone || client.email || '';
        const typeLabel = (client.type && typeConfig[client.type]) ? typeConfig[client.type].label : (client.type || '');

        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Store className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 dark:text-white">{title}</p>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                {owner ? <span className="truncate">{owner}</span> : null}
                {owner && contact ? <span className="hidden sm:inline">•</span> : null}
                {contact ? <span className="truncate">{contact}</span> : null}
                {((owner || contact) && typeLabel) ? <span className="hidden sm:inline">•</span> : null}
                {typeLabel ? <span className="truncate">{typeLabel}</span> : null}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'contact',
      header: 'Contact',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
            <Phone className="h-3 w-3 text-gray-400" />
            {row.original.phone || '—'}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Mail className="h-3 w-3" />
            {row.original.email || '—'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'address',
      header: 'Adresse',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
          <MapPin className="h-3 w-3 text-gray-400" />
          <span className="truncate">{row.original.address || '—'}</span>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => router.push(`/clients/${row.original.id}`)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700"
            title="Voir détails"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => router.push(`/clients/${row.original.id}/edit`)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={async () => {
              const ok = window.confirm(`Supprimer le client ${row.original.storeName || row.original.ownerName || row.original.email || row.original.id} ?`);
              if (!ok) return;
              const prev = clients;
              try {
                setClients(prev => prev.filter(c => c.id !== row.original.id));
                await usersService.deleteClient(row.original.id);
              } catch (err) {
                setClients(prev);
                console.error('delete client failed', err);
                alert('Impossible de supprimer le client.');
              }
            }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500 hover:text-red-700"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
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
      {/* Only show rows that have meaningful data; otherwise let DataTable show the global "Aucun résultat." row like Agents page */}
      <DataTable
        columns={columns}
        data={clients}
        searchPlaceholder="Rechercher un client..."
        onExport={async () => {
          try {
            // default to CSV export for clients list
            const blob = await reportsService.export('csv');
            const file = new Blob([blob], { type: 'text/csv;charset=utf-8' });
            saveAs(file, `clients-${new Date().toISOString().slice(0, 10)}.csv`);
          } catch (err) {
            console.error('export failed', err);
            alert('Impossible d\'exporter les clients.');
          }
        }}
        loading={loading}
        visibleColumnIds={['client', 'contact', 'address', 'actions']}
      />

      <CreateClientModal
        open={isAddOpen}
        onOpenChange={(o) => setIsAddOpen(o)}
        onCreated={(resp) => {
          const user = resp?.user || {};
          const ownerName = resp?.ownerName || resp?.owner_name || resp?.nom_proprietaire || resp?.owner || user?.username || resp?.username || resp?.name || '';
          const phone = resp?.phone || resp?.phone_number || user?.phone || user?.phone_number || '';
          const email = resp?.email || user?.email || '';
          const address = resp?.address || resp?.adresse || resp?.location || user?.address || '';
          const storeName = resp?.storeName || resp?.store_name || resp?.nom_point_vente || resp?.company || user?.username || resp?.username || 'Client';
          const newClient: any = {
            id: resp?.id || resp?.username || `client-${Date.now()}`,
            code: resp?.code || `CLI-${String(Date.now()).slice(-5)}`,
            storeName,
            ownerName,
            phone,
            email,
            address,
            lat: resp?.lat ?? resp?.gps_lat ?? resp?.gpsLat ?? 0,
            lng: resp?.lng ?? resp?.gps_lng ?? resp?.gpsLng ?? 0,
            type: resp?.type || '',
            totalOrders: resp?.totalOrders || 0,
            lastOrderDate: resp?.lastOrderDate || new Date().toISOString(),
          };
          setClients(prev => {
            // insert new client but avoid adding placeholder duplicates: use same key logic
            const keyOf = (c: any) => c?.id || c?.email || c?.phone || c?.code || (c?.storeName ? `store:${c.storeName}` : null) || JSON.stringify(c || {});
            const completeness = (c: any) => Object.values(c || {}).filter(v => v !== null && v !== undefined && String(v).trim() !== '').length;
            const map = new Map<string, any>();
            // start with new client
            map.set(keyOf(newClient), newClient);
            // merge existing
            prev.forEach(p => {
              const k = keyOf(p);
              const ex = map.get(k);
              if (!ex) map.set(k, p);
              else if (completeness(p) > completeness(ex)) map.set(k, p);
            });
            return Array.from(map.values());
          });
        }}
      />
    </div>
  );

}

export default function ProtectedClientsPage() {
  return (
    <RequireAuth>
      <ClientsPage />
    </RequireAuth>
  );
}
