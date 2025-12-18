"use client";
import { revenueChartData } from "@/lib/essivi-mock";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import ChartTab from "../common/ChartTab";

// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Format currency for tooltip
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
    notation: 'compact',
  }).format(value);
};

export default function StatisticsChart() {
  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#10B981"], // Blue for revenue, green for deliveries
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: [3, 3],
    },

    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "category",
      categories: revenueChartData.map(d => d.month),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
        formatter: (val: number) => formatCurrency(val),
      },
      title: {
        text: "Revenus (XOF)",
        style: {
          fontSize: "12px",
          color: "#6B7280",
        },
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
      y: {
        formatter: (val: number, { seriesIndex }: { seriesIndex: number }) => 
          seriesIndex === 0 ? formatCurrency(val) : `${val} livraisons`,
      },
    },
  };

  const series = [
    {
      name: "Revenus",
      data: revenueChartData.map(d => d.revenue),
    },
    {
      name: "Livraisons",
      data: revenueChartData.map(d => d.deliveries),
    },
  ];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Revenus Mensuels
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Évolution des revenus et livraisons
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
