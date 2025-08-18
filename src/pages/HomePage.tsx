import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';

const features = [
  { icon: '⚡', title: 'Швидкий старт', text: 'Створення замовлення займає менше 1 хвилини', color: 'from-amber-500 to-orange-500' },
  { icon: '📂', title: 'Файли та чат', text: 'Усе спілкування і матеріали в одному місці', color: 'from-blue-500 to-cyan-500' },
  { icon: '🔔', title: 'Статуси', text: 'Прозора історія змін та push-оновлення', color: 'from-emerald-500 to-teal-500' },
  { icon: '💬', title: 'Підтримка', text: 'Оперативні відповіді напряму в замовленні', color: 'from-purple-500 to-pink-500' },
  { icon: '💸', title: 'Промокоди', text: 'Гнучкі знижки й персональні пропозиції', color: 'from-rose-500 to-red-500' },
  { icon: '🤝', title: 'Реферали', text: 'Отримуйте бонуси за друзів', color: 'from-indigo-500 to-violet-500' },
];

export default function HomePage() {
  const { user } = useAuth();
  usePageTitle('Головна – StudentWorks');
  
  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-12 md:p-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white shadow-2xl animate-fade-in">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_60%)]" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}} />
        
        <div className="relative max-w-4xl space-y-10 z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-sm font-medium animate-bounce-slow">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            24/7 підтримка активна
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
            Академічні роботи
            <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-white animate-glow">
              без зайвого стресу
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-50 leading-relaxed font-light max-w-3xl">
            Сучасний сервіс для оформлення, відстеження та комунікації по навчальним роботам. 
            Прозорість, швидкість та професійність в одному місці.
          </p>
          
          <div className="flex flex-wrap gap-6 pt-4">
            <Link to="/prices" className="btn-primary text-lg px-8 py-4 animate-pulse-glow">
              🚀 Переглянути ціни
            </Link>
            {user ? (
              <Link to="/orders/new" className="btn-secondary bg-white/20 border-white/30 text-white hover:bg-white/30 text-lg px-8 py-4 backdrop-blur-md">
                ✨ Нове замовлення
              </Link>
            ) : (
              <Link to="/login" className="btn-secondary bg-white/20 border-white/30 text-white hover:bg-white/30 text-lg px-8 py-4 backdrop-blur-md">
                👋 Увійти
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-8 pt-6 text-blue-100">
            <div className="flex items-center gap-2">
              <span className="text-yellow-300">⭐⭐⭐⭐⭐</span>
              <span className="text-sm font-medium">4.9/5 рейтинг</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-16 animate-slide-up">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-semibold">
            Переваги платформи
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-slate-100 dark:via-slate-300 dark:to-slate-100 bg-clip-text text-transparent">
            Чому саме ми
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Сервіс створений навколо реальних потреб студентів: швидкість, прозорість та максимальний комфорт
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={f.title} className="card interactive-card group relative overflow-hidden animate-fade-in" style={{animationDelay: `${i * 0.1}s`}}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-700" />
              
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} text-white flex items-center justify-center text-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative z-10`}>
                <span className="filter drop-shadow-sm">{f.icon}</span>
              </div>
              
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {f.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors duration-300">
                {f.text}
              </p>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-3xl p-12 md:p-16 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-slate-100 relative overflow-hidden shadow-2xl animate-fade-in">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(99,102,241,0.3),transparent_60%)]" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}} />
        </div>
        
        <div className="relative max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center z-10">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Готові до співпраці
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Готові спростити 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> навчальний процес?</span>
              </h2>
            </div>
            
            <p className="text-xl text-slate-300 leading-relaxed">
              Почніть зараз і отримайте повний контроль над прогресом кожної роботи. 
              Ми працюємо швидко, акуратно і завжди на зв'язку.
            </p>
            
            <div className="flex flex-wrap gap-6">
              {user ? (
                <Link to="/orders/new" className="btn-primary text-lg px-8 py-4">
                  🚀 Створити замовлення
                </Link>
              ) : (
                <Link to="/login" className="btn-primary text-lg px-8 py-4">
                  👋 Увійти
                </Link>
              )}
              <Link to="/faq" className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-4 backdrop-blur-md">
                ❓ FAQ
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: '24/7', label: 'Підтримка', icon: '🛟' },
              { value: '10k+', label: 'Файлів', icon: '📁' },
              { value: '5k+', label: 'Повідомлень', icon: '💬' },
              { value: '98%', label: 'Задоволеність', icon: '⭐' },
            ].map((stat, i) => (
              <div key={stat.label} className="material-surface p-6 rounded-2xl text-center group hover:scale-105 transition-transform duration-300 animate-fade-in" style={{animationDelay: `${i * 0.1 + 0.5}s`}}>
                <div className="text-2xl mb-2 group-hover:animate-bounce">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm uppercase tracking-wide text-slate-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
