import React, { useEffect } from 'react';
import { useAuth } from '../state/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../ui/ToastProvider';

// Проста інтеграція Telegram Login Widget через динамічний скрипт
export default function LoginPage() {
  const { user, loginWithTelegram } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/orders'); }, [user, navigate]);

  useEffect(() => {
  const BOT_USERNAME = 'Easy_Kyrsach_Bot'; // без @
  const container = document.getElementById('tg-login-container');
    if (!container) return;
    // очищаємо щоб не дублювати
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
  // Використовуємо змінну щоб не припуститися помилки у регістрі / символах
  script.setAttribute('data-telegram-login', BOT_USERNAME);
  // зробимо віджет більшим — 'large' працював як середній, xlarge дає помітніший вигляд
  script.setAttribute('data-size', 'xlarge');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-lang', 'uk');
    script.setAttribute('data-onauth', 'handleTelegramAuth(user)');
    container.appendChild(script);

    (window as any).handleTelegramAuth = (userData: any) => {
      loginWithTelegram(userData).catch(() => notify({ message: 'Помилка авторизації', type: 'error'}));
    };
  }, [loginWithTelegram]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800/40 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-10 text-center space-y-8">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
          </div>
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              📱
            </div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent tracking-tight">
              Авторизація
            </h1>
            <p className="text-slate-400 leading-relaxed text-sm max-w-sm mx-auto">
              Увійдіть через Telegram, щоб створювати замовлення та спілкуватися з нашою командою.
            </p>
          </div>
          
          <div className="space-y-4">
            <div id="tg-login-container" className="flex justify-center">
              <div style={{ width: 360, maxWidth: '90%' }} />
            </div>
            <div className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Використовуємо тільки ваш Telegram ID та ім'я. Паролі не потрібні.
            </div>
            <div className="text-sm text-slate-400 pt-2 border-t border-slate-700/60">
              Або <Link to="/email-login" className="text-indigo-300 hover:text-indigo-200 underline decoration-dotted">увійдіть по email</Link> <span className="text-slate-600">/</span> <Link to="/register" className="text-indigo-300 hover:text-indigo-200 underline decoration-dotted">реєстрація</Link>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-700/60">
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-300/90">Безпечно</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-indigo-300/90">Швидко</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-purple-300/90">Зручно</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
