'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { deliveryStatusData } from '@/lib/mock-data/dashboard';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const statusColors = {
  'Livrées': '#10B981', // green-500
  'En cours': '#3B82F6', // blue-500
  'En retard': '#EF4444', // red-500
};

export function DeliveryDonutChart() {
  const data = {
    labels: deliveryStatusData.map(item => item.status),
    datasets: [
      {
        data: deliveryStatusData.map(item => item.value),
        backgroundColor: deliveryStatusData.map(item => statusColors[item.status as keyof typeof statusColors]),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}% (${value})`;
          },
        },
      },
    },
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Livrées':
        return <CheckCircle className="h-4 w-4 text-green-500 mr-2" />;
      case 'En cours':
        return <Clock className="h-4 w-4 text-blue-500 mr-2" />;
      case 'En retard':
        return <AlertCircle className="h-4 w-4 text-red-500 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Statut des livraisons</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-6">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {deliveryStatusData.find(d => d.status === 'Livrées')?.value}%
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Terminé</p>
            </div>
          </div>
        </div>
        <div className="w-full space-y-3">
          {deliveryStatusData.map((item) => (
            <div key={item.status} className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(item.status)}
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.status}</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
