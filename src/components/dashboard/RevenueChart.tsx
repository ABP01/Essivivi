'use client';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { ArrowUpRight } from 'lucide-react';
import { dashboardKPIs, revenueData } from '@/lib/mock-data/dashboard';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function RevenueChart() {
  const data = {
    labels: revenueData.map(item => item.month),
    datasets: [
      {
        label: 'Revenus (FCFA)',
        data: revenueData.map(item => item.revenue / 1000), // Convertir en milliers pour l'affichage
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Revenu: ${context.raw} K FCFA`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return `${value}K`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Revenus mensuels</h3>
        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
          <ArrowUpRight className="h-4 w-4 mr-1" />
          <span>{dashboardKPIs.revenueChange}% vs mois dernier</span>
        </div>
      </div>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
