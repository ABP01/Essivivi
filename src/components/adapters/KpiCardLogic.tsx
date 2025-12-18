"use client";
import React from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { formatCurrencyXOF, formatNumberFR } from "@/lib/format";

export type KpiColor = 'primary' | 'success' | 'warning' | 'destructive';

export interface KpiCardProps {
  title: string;
  value: string | number;
  delta?: number;
  color?: KpiColor;
  format?: 'number' | 'currency' | 'percent';
  icon?: React.ReactNode; // Use existing icons from Free or provide a node
}

function renderValue(value: string | number, format: KpiCardProps['format']) {
  if (typeof value === 'number') {
    if (format === 'currency') return formatCurrencyXOF(value);
    if (format === 'percent') return `${value}%`;
    return formatNumberFR(value);
  }
  return value;
}

export default function KpiCardLogic({ title, value, delta, color = 'primary', format = 'number', icon }: KpiCardProps) {
  // We keep Free's design by using ComponentCard and Free utility classes only.
  return (
    <ComponentCard title={title} className="h-full">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">{renderValue(value, format)}</p>
          {typeof delta === 'number' && (
            <div className="flex items-center gap-1 text-sm">
              <span className={
                delta === 0
                  ? 'text-gray-500'
                  : delta > 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }>
                {delta === 0 ? '—' : delta > 0 ? '▲' : '▼'} {Math.abs(delta)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400">vs mois dernier</span>
            </div>
          )}
        </div>
        <div className="shrink-0">
          {icon}
        </div>
      </div>
    </ComponentCard>
  );
}
