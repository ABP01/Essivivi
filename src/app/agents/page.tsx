"use client";

import RequireAuth from '@/components/auth/RequireAuth';
import CreateAgentModal from '@/components/essivi/modals/CreateAgentModal';
import { DataTable } from '@/components/essivi/ui/DataTable';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import reportsService from '@/services/reports.service';
import usersService from '@/services/users.service';
import { Agent } from '@/types/legacy_mock_types';
import { ColumnDef } from '@tanstack/react-table';
import { saveAs } from 'file-saver';
import { Edit, Eye, Mail, Phone, Plus, Trash2, Truck } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const statusConfig = {
  active: { label: 'Actif', class: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  inactive: { label: 'Inactif', class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  on_delivery: { label: 'En livraison', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
};

function AgentsPage() {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await usersService.getAgents();
        if (mounted && Array.isArray(data)) {
          // normalize agent objects so UI fields are consistent
          const normalized = data.map((a: any) => normalizeAgent(a));
          setAgents(normalized);
        }
      } catch (e) {
        // fallback to mockAgents
        setAgents([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false };
  }, []);

  const normalizeAgent = (a: any) => {
    const user = a.user || {};
    // try multiple possible field names
    const usernameFallback = (user.username || a.username || (user.email || a.email || '').split('@')[0] || '').toString();
    const firstname = a.firstname || user.first_name || user.firstname || usernameFallback;
    let lastname = a.lastname || user.last_name || user.lastname || '';
    if (!lastname) {
      // try to split username into first/last using common delimiters
      const uname = usernameFallback;
      if (uname) {
        const delim = uname.includes('.') ? '.' : (uname.includes('_') ? '_' : (uname.includes('-') ? '-' : null));
        if (delim) {
          const parts = uname.split(delim).filter(Boolean);
          if (parts.length >= 2) lastname = parts.slice(-1).join(' ');
        } else {
          const parts = uname.split(/\s+/).filter(Boolean);
          if (parts.length >= 2) lastname = parts.slice(-1).join(' ');
        }
      }
    }
    const phone = a.phone || a.phone_number || user.phone_number || user.phone || '';
    const email = a.email || user.email || '';
    const identificationNumber = a.identificationNumber || a.identification_number || (() => {
      try {
        if (typeof window !== 'undefined') {
          const username = user.username || a.username;
          const key = username ? `agent_ident_${username}` : null;
          return key ? localStorage.getItem(key) : null;
        }
      } catch (e) { }
      return null;
    })();
    const tricycle = a.tricycle || (a.tricycle_plate ? { plate: a.tricycle_plate } : (a.tricycle || null));
    return {
      ...a,
      firstname,
      lastname,
      phone,
      email,
      identificationNumber: identificationNumber || a.identificationNumber || '',
      tricycle,
      totalDeliveries: a.totalDeliveries ?? a.total_deliveries ?? a.deliveries ?? 0,
      revenue: a.revenue ?? 0,
    };
  };

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
            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {agent.photoUrl ? (
                <Image
                  src={agent.photoUrl}
                  alt={`${agent.firstname} ${agent.lastname}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-10 w-10 flex items-center justify-center text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM2 18a8 8 0 1116 0H2z" />
                  </svg>
                </div>
              )}
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
          <span className="font-mono text-sm text-gray-900 dark:text-white">{row.original.tricycle?.plate ?? '—'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => {
        const status = row.original.status;
        const cfg = statusConfig[status] ?? { label: (status || 'Inconnu'), class: 'bg-gray-100 text-gray-700' };
        return (
          <Badge className={cn('text-xs font-medium', cfg.class)}>
            {cfg.label}
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
        const handleEdit = () => {
          router.push(`/agents/${agent.id}/edit`);
        };
        const handleDelete = async () => {
          const ok = window.confirm(`Supprimer l'agent ${agent.firstname} ${agent.lastname} ?`);
          if (!ok) return;
          // optimistic remove
          const prev = agents;
          try {
            setAgents(prev => prev.filter(a => a.id !== agent.id));
            await usersService.deleteAgent(agent.id);
          } catch (err) {
            // revert and notify
            setAgents(prev);
            console.error('delete agent failed', err);
            alert('Impossible de supprimer l\'agent.');
          }
        };

        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => router.push(`/agents/${agent.id}`)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700"
              title="Voir détails"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700"
              title="Modifier"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
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

      <CreateAgentModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onCreated={(agent) => setAgents(prev => [agent, ...prev])}
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={agents}
        searchPlaceholder="Rechercher un agent..."
        onExport={async () => {
          try {
            const blob = await reportsService.export('csv');
            const file = new Blob([blob], { type: 'text/csv;charset=utf-8' });
            saveAs(file, `agents-${new Date().toISOString().slice(0, 10)}.csv`);
          } catch (err) {
            console.error('export agents failed', err);
            alert('Impossible d\'exporter la liste des agents.');
          }
        }}
        loading={loading}
      />
    </div>
  );

}

export default function ProtectedAgentsPage() {
  return (
    <RequireAuth>
      <AgentsPage />
    </RequireAuth>
  );
}
