import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

const NavLink: React.FC<{to: string; children: React.ReactNode}> = ({to, children}) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group backdrop-blur-sm
      ${active 
        ? 'bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 shadow-lg ring-1 ring-slate-200/70 dark:ring-slate-700/70' 
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60'
      }`}
      to={to}
    >
      <span className="relative z-10">{children}</span>
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl" />
      )}
      {active && (
        <span className="absolute inset-x-2 -bottom-px h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />
      )}
    </Link>
  );
};

export default function Layout({children}:{children: React.ReactNode}) {
  const { user, logout } = useAuth();
  // Force dark theme globally (remove light theme support)
  React.useEffect(()=>{
    document.documentElement.classList.add('dark');
  },[]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/30 transition-colors duration-500">
      <header className="sticky top-0 z-50 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80 border-b border-slate-200/40 dark:border-slate-800/40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo - moved further left */}
          <Link to="/" className="flex items-center gap-3 group -ml-6">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                SW
              </div>
              <div className="absolute inset-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
            </div>
            <div className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              StudentWorks
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200/40 dark:border-slate-700/40 shadow-lg">
            <NavLink to="/">Головна</NavLink>
            <NavLink to="/prices">Ціни</NavLink>
            <NavLink to="/faq">FAQ</NavLink>
            <NavLink to="/feedbacks">Відгуки</NavLink>
            {user && <NavLink to="/orders">Замовлення</NavLink>}
            {user && <NavLink to="/referrals">Реферали</NavLink>}
            {user && <NavLink to="/profile">Профіль</NavLink>}
            {user && <NavLink to="/support">Підтримка</NavLink>}
          </nav>
          
          {/* Actions - moved further right */}
          <div className="flex items-center gap-3 mr-2">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">{user.username}</span>
                </div>
                <button 
                  onClick={logout} 
                  className="btn-secondary"
                >
                  Вийти
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary">
                Увійти
              </Link>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {user && (
          <div className="md:hidden px-6 pb-4">
            <nav className="flex gap-2 overflow-x-auto">
              <NavLink to="/orders">Замовлення</NavLink>
              <NavLink to="/referrals">Реферали</NavLink>
              <NavLink to="/profile">Профіль</NavLink>
              <NavLink to="/support">Підтримка</NavLink>
            </nav>
          </div>
        )}
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      
      <footer className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/50" />
        <div className="relative border-t border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  SW
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  © {new Date().getFullYear()} StudentWorks • Всі права захищені
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-500">
                <Link to="/faq" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                  Допомога
                </Link>
                <Link to="/feedbacks" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                  Відгуки
                </Link>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Онлайн</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
