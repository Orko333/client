import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { usePageTitle } from '../hooks/usePageTitle';
import api from '../api/client';
import { useToast } from '../ui/ToastProvider';
import Skeleton, { TextSkeleton } from '../ui/Skeleton';

interface Feedback { id: number; username: string; text: string; stars: number; }

export default function FeedbacksPage() {
  const { data: list, loading, refetch } = useFetch<Feedback[]>('/api/client/feedbacks', []);
  const [text, setText] = useState('');
  const [stars, setStars] = useState(5);
  const { notify } = useToast();

  usePageTitle('Відгуки – StudentWorks');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || text.trim().length < 3) {
      notify({ message: 'Будь ласка, напишіть відгук (мінімум 3 символи)', type: 'error'});
      return;
    }
    try {
      const token = localStorage.getItem('client_token');
      if (token) {
        await api.post('/api/client/feedbacks', { text, stars });
      } else {
        await api.post('/api/client/feedbacks/public', { text, stars, username: 'Guest' });
      }
      notify({ message: 'Відгук надіслано', type: 'success'});
      setText('');
      setStars(5);
      // refresh list
      try { await refetch(); } catch (e) { /* ignore */ }
    } catch (e) {
      console.error(e);
      notify({ message: 'Не вдалося залишити відгук', type: 'error'});
    }
  };

  const averageRating = list?.length ? 
    list.reduce((sum, f) => sum + f.stars, 0) / list.length : 0;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="section-title text-4xl lg:text-5xl">
            Відгуки клієнтів
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Дізнайтеся, що думають наші клієнти про якість наших послуг та рівень сервісу
          </p>
        </div>

        {/* Stats */}
        {!loading && list && list.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/40 dark:border-amber-800/40 text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-amber-700/70 dark:text-amber-300/70">Середня оцінка</div>
            </div>
            <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/40 dark:border-blue-800/40 text-center">
              <div className="text-3xl mb-2">💬</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {list.length}
              </div>
              <div className="text-sm text-blue-700/70 dark:text-blue-300/70">Відгуків</div>
            </div>
            <div className="card p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200/40 dark:border-emerald-800/40 text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {list.filter(f => f.stars >= 4).length}
              </div>
              <div className="text-sm text-emerald-700/70 dark:text-emerald-300/70">Позитивних</div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="card p-6 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32 rounded-lg" />
                <Skeleton className="h-5 w-20 rounded-lg" />
              </div>
              <TextSkeleton lines={4} />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feedback Grid */}
      {!loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list?.map((f, index) => (
            <div 
              key={f.id} 
              className={`card p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-500 group relative overflow-hidden ${
                index % 3 === 0 
                  ? 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/40 dark:border-blue-800/40'
                  : index % 3 === 1
                  ? 'bg-gradient-to-br from-purple-50/80 to-violet-50/80 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200/40 dark:border-purple-800/40'
                  : 'bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200/40 dark:border-emerald-800/40'
              }`}
            >
              {/* Hover Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/20 to-transparent" />
              
              <div className="relative space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      index % 3 === 0 ? 'bg-gradient-to-br from-blue-500 to-indigo-500'
                      : index % 3 === 1 ? 'bg-gradient-to-br from-purple-500 to-violet-500'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-500'
                    }`}>
                      {(f.username || 'К')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {f.username || 'Користувач'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Клієнт
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {Array.from({length: 5}, (_, i) => (
                      <span 
                        key={i} 
                        className={`text-lg ${
                          i < f.stars ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                {/* Quote Icon */}
                <div className={`text-3xl opacity-20 ${
                  index % 3 === 0 ? 'text-blue-500'
                  : index % 3 === 1 ? 'text-purple-500'
                  : 'text-emerald-500'
                }`}>
                  "
                </div>

                {/* Review Text */}
                <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-5 italic">
                  {f.text}
                </blockquote>

                {/* Bottom */}
                <div className="flex justify-end">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    f.stars >= 4 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : f.stars >= 3
                      ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                      : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
                  }`}>
                    {f.stars >= 4 ? 'Відмінно' : f.stars >= 3 ? 'Добре' : 'Потребує покращення'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Reviews State */}
      {!loading && (!list || list.length === 0) && (
        <div className="text-center py-16">
          <div className="card p-12 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-slate-800/50 border-dashed border-2 border-slate-300/50 dark:border-slate-600/50 max-w-lg mx-auto">
            <div className="text-6xl mb-6 opacity-60">💬</div>
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Поки що відгуків немає
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Станьте першим, хто поділиться своїм досвідом роботи з нами
            </p>
          </div>
        </div>
      )}

      {/* Leave Review Form */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={submit} className="card p-8 bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-slate-900/95 dark:to-slate-800/95">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              Залишити відгук
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Поділіться своїм досвідом роботи з нашою платформою
            </p>
          </div>

          <div className="space-y-6">
            {/* Rating Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Ваша оцінка
              </label>
              <div className="flex items-center gap-4">
                <div className="flex gap-1 items-center">
                  {[1,2,3,4,5].map(n => (
                    <label
                      key={n}
                      className={`cursor-pointer select-none text-2xl transition-all duration-200 transform ${n <= stars ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'} hover:scale-110`}
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={n}
                        checked={stars === n}
                        onChange={() => setStars(n)}
                        className="sr-only"
                      />
                      ★
                    </label>
                  ))}
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {stars === 1 ? 'Погано' :
                   stars === 2 ? 'Незадовільно' :
                   stars === 3 ? 'Нормально' :
                   stars === 4 ? 'Добре' : 'Відмінно'}
                </span>
              </div>
            </div>

            {/* Review Text */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Ваш відгук
              </label>
              <textarea 
                placeholder="Поділіться деталями свого досвіду..." 
                value={text} 
                onChange={e=>setText(e.target.value)} 
                required 
                className="w-full border border-slate-200/60 dark:border-slate-600/40 rounded-xl px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 bg-white/80 dark:bg-slate-800/80 backdrop-blur text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 resize-none transition-all duration-300"
              />
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Мінімум 3 символи • {text.length}/500
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={!text.trim() || text.length < 3}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
            >
              ✨ Надіслати відгук
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
