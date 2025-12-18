"use client";

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { LucideIcon, Minus, TrendingDown, TrendingUp } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  delta?: number;
  icon: LucideIcon;
  color?: 'primary' | 'success' | 'warning' | 'destructive';
  format?: 'number' | 'currency' | 'percent';
}

const colorClasses = {
  primary: 'bg-blue-500/10 text-blue-600',
  success: 'bg-green-500/10 text-green-600',
  warning: 'bg-amber-500/10 text-amber-600',
  destructive: 'bg-red-500/10 text-red-600',
};

export function KpiCard({ title, value, delta, icon: Icon, color = 'primary', format = 'number' }: KpiCardProps) {
  const formatValue = () => {
    if (format === 'currency' && typeof value === 'number') {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        maximumFractionDigits: 0,
      }).format(value);
    }
    if (format === 'percent' && typeof value === 'number') {
      return `${value}%`;
    }
    if (typeof value === 'number') {
      return new Intl.NumberFormat('fr-FR').format(value);
    }
    return value;
  };

  const getTrendIcon = () => {
    if (delta === undefined || delta === 0) return <Minus className="h-3 w-3" />;
    return delta > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (delta === undefined || delta === 0) return 'text-gray-500';
    return delta > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatValue()}
          </p>
          {delta !== undefined && (
            <div className={cn('flex items-center gap-1 text-sm font-medium', getTrendColor())}>
              {getTrendIcon()}
              <span>{Math.abs(delta)}%</span>
              <span className="text-gray-500 dark:text-gray-400 font-normal">vs mois dernier</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', colorClasses[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
}
