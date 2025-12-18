export function formatCurrencyXOF(value: number, compact = false) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: compact ? 0 : 0,
    notation: compact ? 'compact' : 'standard',
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value}%`;
}

export function formatNumberFR(value: number) {
  return new Intl.NumberFormat('fr-FR').format(value);
}

export function formatDateFR(timestamp: string | number | Date) {
  const date = typeof timestamp === 'string' || typeof timestamp === 'number' ? new Date(timestamp) : timestamp;
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
