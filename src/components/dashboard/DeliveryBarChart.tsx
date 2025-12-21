'use client';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Truck } from 'lucide-react';


// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export interface DeliveryBarChartProps {
  data: Array<{ day: string; deliveries: number }>;
}

export function DeliveryBarChart({ data: chartData }: DeliveryBarChartProps) {
  const data = {
    labels: chartData.map(item => item.day),
    datasets: [
      {
        label: 'Livraisons',
        data: chartData.map(item => item.deliveries),
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderRadius: 4,
        barThickness: 20,
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
          label: function (context: any) {
            return `${context.raw} livraisons`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 mr-3">
          <Truck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Livraisons quotidiennes</h3>
      </div>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
