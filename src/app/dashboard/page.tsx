"use client";

import { AgentActivity, DeliveryBarChart, DeliveryDonutChart, KpiCard, RecentDeliveries, RevenueChart } from '@/components/essivi/dashboard';
import { MapLeaflet } from '@/components/essivi/map/MapLeaflet';
import { dashboardKPIs } from '@/lib/essivi-mock';
import { Clock, DollarSign, ShoppingCart, Star, Truck, UserCircle, Users } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
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
          value={dashboardKPIs.totalRevenue}
          delta={dashboardKPIs.revenueChange}
          icon={DollarSign}
          color="primary"
          format="currency"
        />
        <KpiCard
          title="Livraisons"
          value={dashboardKPIs.totalDeliveries}
          delta={dashboardKPIs.deliveriesChange}
          icon={Truck}
          color="success"
        />
        <KpiCard
          title="Agents actifs"
          value={dashboardKPIs.activeAgents}
          delta={dashboardKPIs.agentsChange}
          icon={Users}
          color="warning"
        />
        <KpiCard
          title="Clients actifs"
          value={dashboardKPIs.activeClients}
          delta={dashboardKPIs.clientsChange}
          icon={UserCircle}
          color="primary"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Commandes en attente"
          value={dashboardKPIs.pendingOrders}
          icon={ShoppingCart}
          color="warning"
        />
        <KpiCard
          title="Temps moyen livraison"
          value={`${dashboardKPIs.avgDeliveryTime} min`}
          icon={Clock}
          color="primary"
        />
        <KpiCard
          title="Taux de satisfaction"
          value={dashboardKPIs.satisfactionRate}
          icon={Star}
          color="success"
          format="percent"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <DeliveryBarChart />
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
