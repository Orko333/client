import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state';
import { useFetch } from '../hooks/useFetch';
import { usePageTitle } from '../hooks/usePageTitle';
import Skeleton from '../ui/Skeleton';

export default function PricesPage() {
  const { data, loading } = useFetch<Record<string, any>>('/api/client/prices', []);
  
  usePageTitle('Ціни – StudentWorks');

  const navigate = useNavigate();
  const auth = useAuth();

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="section-title m-0 text-4xl lg:text-5xl">
            Прозорі ціни
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Наша система ціноутворення базується на складності роботи та обсязі. 
            Ви завжди знатимете, скільки заплатите за свою роботу.
          </p>
        </div>
        
        {/* Pricing Info Card */}
        <div className="card p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/40 dark:border-blue-800/40 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl">📊</div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Базова ставка</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Фіксована ціна за тип роботи</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">📄</div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Доплата за обсяг</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Додаткова вартість за сторінки</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">✅</div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">Підтвердження</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Менеджер уточнить фінальну суму</p>
            </div>
          </div>
        </div>
      </div>

      {/* Price Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {loading && Array.from({length:6}).map((_,i)=>(
          <div key={i} className="card p-6 space-y-4 animate-pulse">
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        ))}
        
        {!loading && data && Object.entries(data).map(([key, item], index) => (
          <div 
            key={key} 
            className={`card p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-500 group relative overflow-hidden ${
              index % 3 === 0 
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/40 dark:border-blue-800/40'
                : index % 3 === 1
                ? 'bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200/40 dark:border-purple-800/40'
                : 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200/40 dark:border-emerald-800/40'
            }`}
          >
            {/* Hover effect overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/20 to-transparent" />
            
            <div className="relative space-y-4">
              {/* Service name with icon */}
              <div className="space-y-2">
                <div className={`text-2xl ${
                  index % 3 === 0 ? 'text-blue-600' 
                  : index % 3 === 1 ? 'text-purple-600' 
                  : 'text-emerald-600'
                }`}>
                  {getServiceIcon(key)}
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.label}
                </h3>
              </div>

              {/* Pricing info */}
              <div className="space-y-3">
                <div className={`p-4 rounded-xl ${
                  index % 3 === 0 ? 'bg-blue-100/60 dark:bg-blue-900/20' 
                  : index % 3 === 1 ? 'bg-purple-100/60 dark:bg-purple-900/20' 
                  : 'bg-emerald-100/60 dark:bg-emerald-900/20'
                }`}>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Базова ціна
                  </div>
                  <div className={`text-2xl font-bold ${
                    index % 3 === 0 ? 'text-blue-600 dark:text-blue-400' 
                    : index % 3 === 1 ? 'text-purple-600 dark:text-purple-400' 
                    : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {item.base} грн
                  </div>
                </div>

                {/* Additional pricing */}
                <div className="space-y-2">
                  {item.per_page && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">За сторінку:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">+{item.per_page} грн</span>
                    </div>
                  )}
                  {item.per_work && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">За роботу:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">+{item.per_work} грн</span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-600/30">
                <button
                  onClick={() => navigate(`/orders/new?type=${encodeURIComponent(key)}`)}
                  className={`w-full py-2 px-4 rounded-lg font-semibold transition-all ${
                  index % 3 === 0 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : index % 3 === 1
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                } hover:scale-105`}>
                  Замовити роботу
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      {!loading && (
        <div className="text-center py-12">
          <div className="card p-8 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-slate-800/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              Не знайшли потрібний тип роботи?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Зв'яжіться з нами для індивідуального розрахунку вартості
            </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/support')}
                  className="btn-primary px-6 py-3"
                >
                  💬 Написати в чат
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get service icons
function getServiceIcon(serviceKey: string): string {
  const icons: Record<string, string> = {
    essay: '📝',
    coursework: '📚',
    diploma: '🎓',
    report: '📊',
    presentation: '💼',
    translation: '🌐',
    research: '🔬',
    thesis: '📋',
    abstract: '📄',
    default: '📝'
  };
  
  return icons[serviceKey] || icons.default;
}
