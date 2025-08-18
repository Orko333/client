import React, { useState } from 'react';
import { useAuth } from '../state/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useFetch } from '../hooks/useFetch';
import api from '../api/client';
import { useToast } from '../ui/ToastProvider';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useFetch<any>('/api/client/profile/stats', []);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    email: '',
    phone: ''
  });
  const { notify } = useToast();

  usePageTitle('Профіль – StudentWorks');

  const handleSave = async () => {
    try {
      await api.put('/api/client/profile', editData);
  setIsEditing(false);
  notify({ message: 'Профіль оновлено', type: 'success' });
  // refresh stats after successful profile update
  try { refetchStats && refetchStats(); } catch (e) { /* ignore */ }
    } catch {
      notify({ message: 'Помилка оновлення профілю', type: 'error' });
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="section-title text-4xl lg:text-5xl">
            Особистий кабінет
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Керуйте своїм профілем та відстежуйте активність
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Profile Card */}
          <div className="card p-8 bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-slate-900/95 dark:to-slate-800/95 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                      {user.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm">
                      ✓
                    </div>
                  </div>
                  
                  {/* Basic Info */}
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {user.username}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-semibold">
                        Активний клієнт
                      </span>
                      <span className="text-slate-500 dark:text-slate-400 text-sm">
                        ID: {user.user_id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`btn-secondary px-4 py-2 text-sm transition-all ${
                    isEditing ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : ''
                  }`}
                >
                  {isEditing ? '❌ Скасувати' : '✏️ Редагувати'}
                </button>
              </div>

              {/* Profile Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Ім'я користувача
                    </label>
                      {isEditing ? (
                      <input
                        type="text"
                        value={editData.username}
                        onChange={(e) => setEditData({...editData, username: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200/60 dark:border-slate-600/40 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-800 dark:text-white"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-600/40 text-slate-800 dark:text-slate-200">
                        {user.username}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200/60 dark:border-slate-600/40 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-800 dark:text-white"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-600/40 text-slate-800 dark:text-slate-200">
                        {'Не вказано'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Телефон
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-slate-200/60 dark:border-slate-600/40 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-800 dark:text-white"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-600/40 text-slate-800 dark:text-slate-200">
                        {'Не вказано'}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Дата реєстрації
                    </label>
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-600/40 text-slate-800 dark:text-slate-200">
                      {'Невідома'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleSave}
                    className="btn-primary px-6 py-3 hover:scale-105 transition-transform"
                  >
                    💾 Зберегти зміни
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className="card p-6 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-slate-700/50">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <span>🔒</span>
              Безпека та налаштування
            </h3>
            <div className="space-y-4 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Додаткові налаштування безпеки будуть доступні в майбутніх оновленнях
              </p>
              <div className="text-4xl opacity-50">�</div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Activity Stats */}
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/40 dark:border-blue-800/40">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <span>📊</span>
              Статистика
            </h3>
              <div className="space-y-4">
                {statsLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/5" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                  </div>
                ) : statsError ? (
                  <div className="text-sm text-red-600">Не вдалось завантажити статистику</div>
                ) : (
                  (() => {
                    const nf = new Intl.NumberFormat('uk-UA');
                    const total = stats?.total_orders ?? 0;
                    const completed = stats?.completed_orders ?? 0;
                    const spent = stats?.total_spent ?? 0;
                    return (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-400">Замовлень:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">{nf.format(total)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-400">Завершено:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{nf.format(completed)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 dark:text-slate-400">Витрачено:</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400">{nf.format(spent)} грн</span>
                        </div>
                        {stats?.active_orders !== undefined && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600 dark:text-slate-400">Активних:</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{nf.format(stats.active_orders)}</span>
                          </div>
                        )}
                        {stats?.last_order_date && (
                          <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                            <span>Останнє замовлення:</span>
                            <span>{new Date(stats.last_order_date).toLocaleString('uk-UA')}</span>
                          </div>
                        )}
                      </>
                    );
                  })()
                )}
              </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200/40 dark:border-emerald-800/40">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <span>⚡</span>
              Швидкі дії
            </h3>
            <div className="space-y-3">
              <Link to="/orders/new" className="w-full btn-primary py-3 text-sm block text-center">
                ✨ Нове замовлення
              </Link>
              <Link to="/orders" className="w-full btn-secondary py-3 text-sm block text-center">
                📄 Історія замовлень
              </Link>
            </div>
          </div>

          {/* Achievement Badge */}
          <div className="card p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/40 dark:border-amber-800/40 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-2">
              Постійний клієнт
            </h4>
            <p className="text-sm text-amber-700/70 dark:text-amber-300/70">
              Дякуємо за довіру до нашої платформи!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
