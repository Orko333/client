import React from 'react';

const MAP: Record<string, { label: string; cls: string; } > = {
  pending: { label: 'Очікує підтвердження', cls: 'bg-amber-100 text-amber-700' },
  in_progress: { label: 'В роботі', cls: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Завершено', cls: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Скасовано', cls: 'bg-rose-100 text-rose-700' },
};

export const statusToDot = (status?: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-400';
    case 'in_progress': return 'bg-blue-400';
    case 'completed': return 'bg-green-400';
    case 'cancelled': return 'bg-red-400';
    default: return 'bg-gray-400';
  }
};

export default function StatusBadge({status, className = ''}:{status?: string; className?: string;}) {
  if (!status) return null;
  const m = MAP[status] || { label: status, cls: 'bg-slate-100 text-slate-600' };
  return <span className={`text-[11px] px-2 py-1 rounded-full capitalize tracking-wide ${m.cls} ${className}`}>{m.label}</span>;
}
