"use client";
import React, { useEffect, useState } from 'react';
import RequireAuth from '@/components/auth/RequireAuth';
import { useRouter } from 'next/navigation';
import { AgentActivity, DeliveryBarChart, DeliveryDonutChart, KpiCard, RecentDeliveries, RevenueChart } from '@/components/essivi/dashboard';
import { MapLeaflet } from '@/components/essivi/map/MapLeaflet';
import { Clock, DollarSign, ShoppingCart, Star, Truck, UserCircle, Users } from 'lucide-react';
import { dashboardService, DashboardStats } from '@/services/dashboard.service';

function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);


  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    // If not authenticated, redirect to login page
    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStats();
        console.log('Dashboard stats loaded:', data);
        setStats(data);
        setLoading(false);
      } catch (error: any) {
        console.error('Failed to fetch dashboard stats:', error);
        console.error('Error response:', error?.response);
        console.error('Error message:', error?.message);

        const status = error?.response?.status || error?.status || null;
        if (status === 403) {
          setAccessError('Accès refusé — administrateur requis');
        } else if (status === 401) {
          setAccessError('Non authentifié - redirection vers login...');
          setTimeout(() => router.replace('/login'), 1500);
        } else {
          // Set default empty stats to prevent infinite loading
          setStats({
            kpis: {
              total_revenue: 0,
              total_deliveries: 0,
              total_pending_orders: 0,
              active_agents: 0,
              active_clients: 0,
              active_tricycles: 0,
              avg_delivery_time: 0,
            },
            charts: {
              revenue: [],
              deliveries: [],
            },
            agent_performance: []
          });
          setAccessError(`Erreur: ${error?.message || 'Impossible de charger les données'}`);
        }
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  useEffect(() => {
    // Prevent navigating back to login after successful authentication.
    // We push a history state and on `popstate` we re-push it so browser back button stays on dashboard.
    try {
      const handler = (e: PopStateEvent) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (token) {
          // re-instate the current state to block backward navigation
          window.history.pushState(null, '', window.location.href);
        } else {
          // if no token, allow navigation to proceed to login
          window.location.replace('/login');
        }
      };

      // push an initial state so there's something to re-push
      window.history.pushState(null, '', window.location.href);
      window.addEventListener('popstate', handler);
      return () => window.removeEventListener('popstate', handler);
    } catch (e) {
      // ignore in SSR or restricted environments
    }
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (accessError) {
    return (
      <div className="p-8 text-center text-red-600">
        {accessError}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Vue d&apos;ensemble de l&apos;activité ESSIVI-Sarl
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Revenus du mois"
          value={stats?.kpis.total_revenue || 0}
          delta={0}
          icon={DollarSign}
          color="primary"
          format="currency"
        />
        <KpiCard
          title="Livraisons"
          value={stats?.kpis.total_deliveries || 0}
          delta={0}
          icon={Truck}
          color="success"
        />
        <KpiCard
          title="Agents actifs"
          value={stats?.kpis.active_agents || 0}
          delta={0}
          icon={Users}
          color="warning"
        />
        <KpiCard
          title="Clients actifs"
          value={stats?.kpis.active_clients || 0}
          delta={0}
          icon={UserCircle}
          color="primary"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Commandes en attente"
          value={stats?.kpis.total_pending_orders || 0}
          icon={ShoppingCart}
          color="warning"
        />
        <KpiCard
          title="Temps moyen livraison"
          value={`${stats?.kpis.avg_delivery_time || 0} min`}
          icon={Clock}
          color="primary"
        />
        <KpiCard
          title="Taux de satisfaction"
          value={98}
          icon={Star}
          color="success"
          format="percent"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={stats?.charts.revenue || []} />
        <DeliveryBarChart data={stats?.charts.deliveries || []} />
      </div>

      {/* Map and Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapLeaflet />
        </div>
        <DeliveryDonutChart />
      </div>

      {/* Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentDeliveries />
        <AgentActivity performanceData={stats?.agent_performance || []} />
      </div>
    </div>
  );
}

export default function ProtectedDashboardPage() {
  return (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  );
}
