"use client";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, DollarLineIcon, GroupIcon, UserCircleIcon } from "@/icons";
import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import { dashboardKPIs } from "@/lib/essivi-mock";
import Badge from "../ui/badge/Badge";

// Format currency in XOF
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value);
};

// Format number with French locale
const formatNumber = (value: number) => {
  return new Intl.NumberFormat('fr-FR').format(value);
};

export const EcommerceMetrics = () => {
  const [kpisData, setKpisData] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stats = await dashboardService.getStats();
        if (!mounted) return;
        setKpisData(stats.kpis);
      } catch (e) {
        // fallback to mock
        setKpisData({
          totalRevenue: dashboardKPIs.totalRevenue,
          totalDeliveries: dashboardKPIs.totalDeliveries,
          activeAgents: dashboardKPIs.activeAgents,
          activeClients: dashboardKPIs.activeClients,
          revenueChange: dashboardKPIs.revenueChange,
          deliveriesChange: dashboardKPIs.deliveriesChange,
          agentsChange: dashboardKPIs.agentsChange,
          clientsChange: dashboardKPIs.clientsChange,
        });
      }
    })();
    return () => { mounted = false };
  }, []);

  const data = kpisData;

  const kpis = [
    {
      title: "Revenus Total",
      value: formatCurrency(data ? data.total_revenue ?? data.totalRevenue : dashboardKPIs.totalRevenue),
      delta: data ? data.revenueChange ?? data.revenue_change ?? 0 : dashboardKPIs.revenueChange,
      icon: DollarLineIcon,
      iconBg: "bg-brand-50 dark:bg-brand-500/15",
      iconColor: "text-brand-500 dark:text-brand-400",
    },
    {
      title: "Livraisons",
      value: formatNumber(data ? data.total_deliveries ?? data.totalDeliveries : dashboardKPIs.totalDeliveries),
      delta: data ? data.deliveriesChange ?? data.deliveries_change ?? 0 : dashboardKPIs.deliveriesChange,
      icon: BoxIconLine,
      iconBg: "bg-success-50 dark:bg-success-500/15",
      iconColor: "text-success-600 dark:text-success-500",
    },
    {
      title: "Agents Actifs",
      value: (data ? data.active_agents ?? data.activeAgents : dashboardKPIs.activeAgents).toString(),
      delta: data ? data.agentsChange ?? data.agents_change ?? 0 : dashboardKPIs.agentsChange,
      icon: UserCircleIcon,
      iconBg: "bg-warning-50 dark:bg-warning-500/15",
      iconColor: "text-warning-600 dark:text-warning-500",
    },
    {
      title: "Clients Actifs",
      value: formatNumber(data ? data.active_clients ?? data.activeClients : dashboardKPIs.activeClients),
      delta: data ? data.clientsChange ?? data.clients_change ?? 0 : dashboardKPIs.clientsChange,
      icon: GroupIcon,
      iconBg: "bg-blue-light-50 dark:bg-blue-light-500/15",
      iconColor: "text-blue-light-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${kpi.iconBg}`}>
            <kpi.icon className={`size-6 ${kpi.iconColor}`} />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {kpi.title}
              </span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                {kpi.value}
              </h4>
            </div>
            <Badge color={kpi.delta >= 0 ? "success" : "error"}>
              {kpi.delta >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon className="text-error-500" />}
              {Math.abs(kpi.delta)}%
            </Badge>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            vs mois dernier
          </p>
        </div>
      ))}
    </div>
  );
};
