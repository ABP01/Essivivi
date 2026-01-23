"use client";
import { MoreDotIcon } from "@/icons";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Product icons/colors mapping
const productColors: Record<string, { bg: string; text: string; iconBg: string }> = {
  'Vitale': {
    bg: 'bg-blue-500',
    text: 'text-blue-500',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30'
  },
  'Voltic': {
    bg: 'bg-emerald-500',
    text: 'text-emerald-500',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30'
  },
  'Autres': {
    bg: 'bg-amber-500',
    text: 'text-amber-500',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30'
  },
};

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // ApexCharts options for donut chart
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
      fontFamily: 'inherit',
    },
    labels: [],
    colors: ['#3b82f6', '#10b981', '#f59e0b'],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 600,
              color: '#374151',
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 700,
              color: '#1f2937',
              formatter: (val: string) => `${val}%`,
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              color: '#6b7280',
              formatter: () => '100%',
            },
          },
        },
      },
    },
    stroke: {
      width: 0,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
  };

  const chartSeries: number[] = [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Distribution des Produits
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Répartition des livraisons par marque
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Détails
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Exporter
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="flex justify-center py-6 my-4">
        <div className="w-[240px] h-[240px]">
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            height={240}
          />
        </div>
      </div>

      {/* Product breakdown */}
      <div className="space-y-5">
        {([] as any[]).map((product) => {
          const colors = productColors[product.name] || productColors['Autres'];
          return (
            <div key={product.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${colors.iconBg}`}>
                  <svg
                    className={`w-5 h-5 ${colors.text}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                    {product.name}
                  </p>
                  <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                    Eau minérale
                  </span>
                </div>
              </div>

              <div className="flex w-full max-w-[140px] items-center gap-3">
                <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                  <div
                    className={`absolute left-0 top-0 flex h-full items-center justify-center rounded-sm ${colors.bg} text-xs font-medium text-white`}
                    style={{ width: `${product.value}%` }}
                  ></div>
                </div>
                <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {product.value}%
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
