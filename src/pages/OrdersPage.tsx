import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { usePageTitle } from '../hooks/usePageTitle';
import Skeleton from '../ui/Skeleton';
import StatusBadge from '../ui/StatusBadge';

interface Order { id: number; topic?: string; status?: string; created_at?: string; price?: number; }
const STATUS_LABEL: Record<string,string> = {
  pending: 'Очікує підтвердження', in_progress: 'В роботі', completed: 'Завершено', cancelled: 'Скасовано'
};

const STATUS_ICONS: Record<string,string> = {
  pending: '⏳', in_progress: '⚡', completed: '✅', cancelled: '❌'
};

export default function OrdersPage() {
  const { data: orders, loading } = useFetch<Order[]>('/api/client/orders', []);
  const [filter, setFilter] = useState<string>('all');
  const [compact, setCompact] = useState(false);
  
  usePageTitle('Мої замовлення – StudentWorks');
  
  const filtered = useMemo(()=>{
    if (!orders) return [];
    return filter==='all' ? orders : orders.filter(o=>o.status===filter);
  },[orders, filter]);

  const stats = useMemo(() => {
    if (!orders) return { total: 0, pending: 0, in_progress: 0, completed: 0 };
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      in_progress: orders.filter(o => o.status === 'in_progress').length,
      completed: orders.filter(o => o.status === 'completed').length,
    };
  }, [orders]);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="space-y-2">
          <h1 className="section-title m-0">Мої замовлення</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Відстежуйте прогрес та керуйте своїми навчальними роботами
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button 
            onClick={()=>setCompact(c=>!c)} 
            className="btn-secondary text-sm px-4 py-2.5"
          >
            {compact ? '📋 Детальний' : '📊 Компактний'}
          </button>
          <Link to="/orders/new" className="btn-primary px-6 py-2.5">
            ✨ Нове замовлення
          </Link>
        </div>
      </div>

      {/* Stats */}
      {!loading && orders && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/30 dark:border-blue-800/30">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-sm text-blue-700/70 dark:text-blue-300/70 font-medium">Всього</div>
          </div>
          <div className="card p-6 text-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/30 dark:border-amber-800/30">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</div>
            <div className="text-sm text-amber-700/70 dark:text-amber-300/70 font-medium">Очікують</div>
          </div>
          <div className="card p-6 text-center bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200/30 dark:border-purple-800/30">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.in_progress}</div>
            <div className="text-sm text-purple-700/70 dark:text-purple-300/70 font-medium">В роботі</div>
          </div>
          <div className="card p-6 text-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200/30 dark:border-emerald-800/30">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-300/70 font-medium">Завершено</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {['all','pending','in_progress','completed','cancelled'].map(s => (
          <button 
            key={s} 
            onClick={()=>setFilter(s)} 
            className={`px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-300 ${
              filter===s 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg scale-105' 
                : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur border-slate-200/60 dark:border-slate-600/60 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-105 text-slate-700 dark:text-slate-300'
            }`}
          >
            <span className="mr-2">{s === 'all' ? '📋' : STATUS_ICONS[s]}</span>
            {s==='all' ? 'Всі' : STATUS_LABEL[s] || s}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="card p-6 space-y-4 animate-pulse">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-16 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-5/6 rounded" />
              <Skeleton className="h-4 w-2/3 rounded" />
              <div className="pt-2">
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="card p-12 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-slate-800/50 border-dashed border-2 border-slate-300/50 dark:border-slate-600/50">
            <div className="text-6xl mb-6 opacity-60">📋</div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-3">
              {filter === 'all' ? 'Ще немає замовлень' : `Немає замовлень зі статусом "${STATUS_LABEL[filter] || filter}"`}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {filter === 'all' 
                ? 'Створіть своє перше замовлення, щоб розпочати роботу з нашою платформою' 
                : 'Спробуйте змінити фільтр або створити нове замовлення'
              }
            </p>
            <Link to="/orders/new" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
              <span>✨</span>
              Створити {filter === 'all' ? 'перше' : 'нове'} замовлення
            </Link>
          </div>
        </div>
      )}

      <div className={compact ? 'space-y-3' : 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'}>
        {filtered.map(o => compact ? (
          <Link 
            key={o.id} 
            to={`/orders/${o.id}`} 
            className="group flex items-center justify-between card px-5 py-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-gradient-to-r from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 border-slate-200/60 dark:border-slate-600/40"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <div className="font-bold text-slate-800 dark:text-slate-100 text-lg">#{o.id}</div>
                <StatusBadge status={o.status} />
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[280px] font-medium">
                {o.topic || 'Без теми'}
              </div>
              {o.price && (
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  {o.price} грн
                </div>
              )}
            </div>
            <div className="flex flex-col items-end text-right">
              {o.created_at && (
                <div className="text-xs text-slate-400 mb-1">
                  {new Date(o.created_at).toLocaleDateString('uk-UA')}
                </div>
              )}
              <div className="text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                →
              </div>
            </div>
          </Link>
        ) : (
          <Link 
            key={o.id} 
            to={`/orders/${o.id}`} 
            className="group card p-6 hover:shadow-xl hover:scale-[1.03] transition-all duration-500 bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-slate-900/95 dark:to-slate-800/95 border-slate-200/60 dark:border-slate-600/40 hover:border-blue-300/60 dark:hover:border-blue-600/60 relative overflow-hidden"
          >
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 transition-opacity duration-500" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    #{o.id}
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <div className="text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-lg">
                  →
                </div>
              </div>
              
              <div className="text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed min-h-[72px] mb-4 font-medium">
                {o.topic || 'Без теми'}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {o.price && (
                    <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-bold">
                      {o.price} грн
                    </div>
                  )}
                </div>
                {o.created_at && (
                  <div className="text-xs text-slate-400 font-medium">
                    {new Date(o.created_at).toLocaleDateString('uk-UA', {
                      day: '2-digit',
                      month: 'short'
                    })}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
