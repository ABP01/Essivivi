"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import ComponentCard from "@/components/common/ComponentCard";
import { revenueChartData } from "@/lib/essivi-mock";
import { formatCurrencyXOF } from "@/lib/format";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function RevenueChartLogic() {
  const categories = revenueChartData.map((d) => d.month);
  const series = [
    {
      name: "Revenus",
      data: revenueChartData.map((d) => d.revenue),
    },
  ];

  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#465FFF"], // keep Free's primary chart color
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 300,
      type: "area",
      toolbar: { show: false },
    },
    stroke: {
      curve: "straight",
      width: 3,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.45,
        opacityTo: 0,
      },
    },
    grid: {
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => formatCurrencyXOF(val, true),
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => formatCurrencyXOF(val, false),
      },
    },
  };

  return (
    <ComponentCard title="Revenus mensuels">
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px]">
          <ReactApexChart options={options} series={series} type="area" height={300} />
        </div>
      </div>
    </ComponentCard>
  );
}
