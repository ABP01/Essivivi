import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'actif':
    case 'livré':
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400';
    case 'en cours':
    case 'pending':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400';
    case 'en attente':
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400';
    case 'inactif':
    case 'annulé':
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}
