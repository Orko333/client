import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { usePageTitle } from '../hooks/usePageTitle';

interface FAQItem { key: string; question: string; answer: string; }

export default function FAQPage() {
  const { data, loading, error } = useFetch<FAQItem[]>('/api/client/faq', []);
  const [open, setOpen] = useState<string | null>(null);

  usePageTitle('Часті запитання – StudentWorks');

  const toggle = (k: string) => setOpen(prev => prev === k ? null : k);

  // Navigate to support chat page
  const navigate = useNavigate();
  const openSupport = () => navigate('/support');

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="section-title mb-2 text-4xl lg:text-5xl">
            Часті запитання
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            Знайдіть відповіді на найпоширеніші питання про наші послуги, 
            процес роботи та умови співпраці
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/40 dark:border-blue-800/40 text-center">
            <div className="text-3xl mb-2">❓</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data?.length || 0}+
            </div>
            <div className="text-sm text-blue-700/70 dark:text-blue-300/70">Відповідей</div>
          </div>
          <div className="card p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200/40 dark:border-emerald-800/40 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">24/7</div>
            <div className="text-sm text-emerald-700/70 dark:text-emerald-300/70">Доступність</div>
          </div>
          <div className="card p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200/40 dark:border-purple-800/40 text-center">
            <div className="text-3xl mb-2">💬</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">5 хв</div>
            <div className="text-sm text-purple-700/70 dark:text-purple-300/70">Швидка відповідь</div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="card p-6 space-y-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="card p-8 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-red-200/40 dark:border-red-800/40 max-w-lg mx-auto">
            <div className="text-4xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-2">
              Щось пішло не так
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">
              Не вдалося завантажити часті запитання. Спробуйте оновити сторінку.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary bg-red-600 hover:bg-red-700"
            >
              🔄 Спробувати знову
            </button>
          </div>
        </div>
      )}

      {/* FAQ Items */}
      {!loading && !error && data && (
        <div className="grid gap-6 md:grid-cols-2">
          {data.map((item, index) => {
            const opened = open === item.key;
            const colorClass = index % 3 === 0 
              ? 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/40 dark:border-blue-800/40'
              : index % 3 === 1
              ? 'from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200/40 dark:border-purple-800/40'
              : 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200/40 dark:border-emerald-800/40';
            
            const iconColor = index % 3 === 0 
              ? 'bg-blue-600 text-white'
              : index % 3 === 1
              ? 'bg-purple-600 text-white'
              : 'bg-emerald-600 text-white';

            return (
              <div key={item.key} className="group">
                <button
                  onClick={() => toggle(item.key)}
                  className={`w-full text-left card p-6 transition-all duration-500 hover:shadow-xl hover:scale-[1.02] ${
                    opened 
                      ? `bg-gradient-to-br ${colorClass} ring-2 ring-blue-500/30 dark:ring-blue-400/30` 
                      : 'bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-900/90 dark:to-slate-800/90 hover:from-white dark:hover:from-slate-900 border-slate-200/60 dark:border-slate-600/40'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`mt-1 w-12 h-12 flex items-center justify-center rounded-xl text-sm font-bold shrink-0 transition-all duration-300 ${
                      opened 
                        ? iconColor
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`}>
                      {opened ? '📝' : '❓'}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className={`font-bold text-lg leading-snug pr-4 transition-colors ${
                          opened 
                            ? 'text-slate-800 dark:text-slate-100' 
                            : 'text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                        }`}>
                          {item.question}
                        </h3>
                        <div className={`text-xl transition-transform duration-300 ${
                          opened ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-blue-500'
                        }`}>
                          ⌄
                        </div>
                      </div>
                      
                      {/* Answer */}
                      <div className={`overflow-hidden transition-all duration-500 ${
                        opened ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <div className="pt-2 border-t border-slate-200/50 dark:border-slate-600/30">
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Contact CTA */}
      {!loading && !error && (
        <div className="text-center py-12">
          <div className="card p-8 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-slate-800/50 max-w-2xl mx-auto">
            <div className="text-4xl mb-4">🤔</div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
              Не знайшли відповідь?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Наша служба підтримки готова допомогти вам 24/7. 
              Зв'яжіться з нами будь-яким зручним способом.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={openSupport}
                className="btn-primary px-6 py-3"
                aria-label="Написати в чат"
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
