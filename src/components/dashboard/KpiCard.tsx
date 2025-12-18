import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  delta?: number;
  icon: React.ElementType;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  format?: 'currency' | 'percent' | 'number';
}

export function KpiCard({ 
  title, 
  value, 
  delta, 
  icon: Icon, 
  color = 'primary',
  format = 'number'
}: KpiCardProps) {
  // Formater la valeur en fonction du format spécifié
  const formatValue = (val: string | number) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'XOF',
        maximumFractionDigits: 0 
      }).format(Number(val));
    }
    if (format === 'percent') {
      return `${val}%`;
    }
    return val;
  };

  // Couleurs dynamiques en fonction de la prop color
  const colorClasses = {
    bg: {
      primary: 'bg-primary-50 dark:bg-primary-900/30',
      success: 'bg-green-50 dark:bg-green-900/30',
      warning: 'bg-yellow-50 dark:bg-yellow-900/30',
      danger: 'bg-red-50 dark:bg-red-900/30',
    },
    text: {
      primary: 'text-primary-600 dark:text-primary-400',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      danger: 'text-red-600 dark:text-red-400',
    },
    border: {
      primary: 'border-l-4 border-primary-500',
      success: 'border-l-4 border-green-500',
      warning: 'border-l-4 border-yellow-500',
      danger: 'border-l-4 border-red-500',
    },
  };

  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg shadow p-4",
      colorClasses.border[color]
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-shrink-0">
          <div className={cn(
            "p-3 rounded-lg inline-flex",
            colorClasses.bg[color]
          )}>
            <Icon className={cn("h-6 w-6", colorClasses.text[color])} />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {title}
          </p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {formatValue(value)}
            </p>
            {delta !== undefined && (
              <span
                className={cn(
                  delta >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400',
                  'ml-2 text-sm font-medium flex items-center'
                )}
              >
                {delta > 0 ? (
                  <ArrowUp className="h-4 w-4" />
                ) : delta < 0 ? (
                  <ArrowDown className="h-4 w-4" />
                ) : (
                  <Minus className="h-4 w-4" />
                )}
                <span className="ml-1">{Math.abs(delta)}%</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
