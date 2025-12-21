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
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
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
          delta={0} // To be implemented
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
          value={`35 min`} // Mocked for now
          icon={Clock}
          color="primary"
        />
        <KpiCard
          title="Taux de satisfaction"
          value={98} // Mocked for now
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
        <AgentActivity />
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
