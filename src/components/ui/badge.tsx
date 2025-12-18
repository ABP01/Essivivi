import { cn } from '@/lib/utils';
import * as React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantClasses = {
      default: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      destructive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      outline: 'border border-gray-200 dark:border-gray-700 bg-transparent',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };

