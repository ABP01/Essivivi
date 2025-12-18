"use client";

import { DeliveryBarChart, DeliveryDonutChart, RevenueChart } from '@/components/essivi/dashboard';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart3, CalendarIcon, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useState } from 'react';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rapports</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Générez et exportez des rapports d&apos;activité
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filtres</h3>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Période</label>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
              <CalendarIcon className="h-4 w-4" />
              {format(dateRange.from, 'dd MMM yyyy', { locale: fr })} - {format(dateRange.to, 'dd MMM yyyy', { locale: fr })}
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Agent</label>
            <select className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm min-w-[200px]">
              <option value="all">Tous les agents</option>
              <option value="agent-1">Kofi Mensah</option>
              <option value="agent-2">Ama Asante</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Zone</label>
            <select className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm min-w-[200px]">
              <option value="all">Toutes les zones</option>
              <option value="lome-centre">Lomé Centre</option>
              <option value="tokoin">Tokoin</option>
              <option value="be">Bè</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Export Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
              <FileSpreadsheet className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">Export Excel</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Données complètes</p>
            </div>
            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
              <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">Export PDF</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rapport formaté</p>
            </div>
            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">Export CSV</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Données brutes</p>
            </div>
            <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </Card>
      </div>

      {/* Charts Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <DeliveryBarChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Summary Stats */}
          <Card className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Résumé de la période</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {format(dateRange.from, 'dd MMM yyyy', { locale: fr })} - {format(dateRange.to, 'dd MMM yyyy', { locale: fr })}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">15,750,000</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Revenus (FCFA)</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,245</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Livraisons</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">42</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Clients actifs</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">94.5%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Satisfaction</p>
              </div>
            </div>
          </Card>
        </div>
        <DeliveryDonutChart />
      </div>
    </div>
  );
}
