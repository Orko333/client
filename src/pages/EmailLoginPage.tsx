import React, { useState, useMemo } from 'react';
import { useAuth } from '../state';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../ui/ToastProvider';

// Простий email regex (достатній для клієнтської перевірки)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function EmailLoginPage() {
  const { loginWithEmail } = useAuth();
  const nav = useNavigate();
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailValid = useMemo(() => EMAIL_RE.test(email.trim()), [email]);
  const passwordOk = password.length >= 6;
  const formValid = emailValid && passwordOk && !loading;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginWithEmail || !formValid) return;
    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      // (Опціонально) Зберегти email для автозаповнення
      if (remember) localStorage.setItem('last_login_email', email.trim());
      nav('/orders');
    } catch (e: any) {
      notify({ message: e.message || 'Помилка входу', type: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800/40 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
          </div>
          <form onSubmit={submit} className="relative p-10 space-y-8">
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                ✉️
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Вхід через Email
              </h1>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                Увійдіть у свій акаунт. Якщо ще не маєте — <Link to="/register" className="text-indigo-300 hover:text-indigo-200 underline decoration-dotted">створіть його</Link>.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <span className="inline-flex w-7 h-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-300">@</span>
                  Email
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    name="email"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    onBlur={()=>setTouched(t=>({...t,email:true}))}
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`peer w-full px-4 py-3 rounded-xl bg-slate-800/70 border transition shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 backdrop-blur placeholder-slate-500 text-slate-100/90 ${
                      touched.email && !emailValid ? 'border-rose-500/60' : 'border-slate-700 hover:border-slate-600'
                    }`}
                    required
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm">
                    {email && (
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${emailValid ? 'bg-emerald-600/20 text-emerald-300' : 'bg-rose-600/20 text-rose-300'}`}>
                        {emailValid ? 'OK' : 'ERR'}
                      </span>
                    )}
                  </div>
                </div>
                {touched.email && !emailValid && (
                  <p className="text-xs text-rose-400">Введіть коректний email (формат: name@domain). </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label htmlFor="password" className="flex items-center justify-between text-sm font-medium text-slate-300">
                  <span>Пароль</span>
                  {touched.password && !passwordOk && <span className="text-rose-400 font-normal">мін. 6 символів</span>}
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    name="password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    onBlur={()=>setTouched(t=>({...t,password:true}))}
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`peer w-full px-4 py-3 pr-12 rounded-xl bg-slate-800/70 border transition shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 backdrop-blur placeholder-slate-500 text-slate-100/90 ${
                      touched.password && !passwordOk ? 'border-rose-500/60' : 'border-slate-700 hover:border-slate-600'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={()=>setShowPwd(s=>!s)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200 transition"
                    aria-label={showPwd ? 'Приховати пароль' : 'Показати пароль'}
                  >
                    {showPwd ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Remember & links */}
              <div className="flex flex-col gap-3 text-xs text-slate-400">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={remember} onChange={()=>setRemember(r=>!r)} className="rounded border-slate-600 bg-slate-800/70 text-indigo-500 focus:ring-indigo-500/40" />
                  <span>Запам'ятати email</span>
                </label>
                <div>
                  Забули пароль? <span className="text-slate-500">(функція буде додана пізніше)</span>
                </div>
              </div>
            </div>

            <div className="space-y-5 pt-2">
              <button
                disabled={!formValid}
                className={`w-full h-12 rounded-xl font-semibold text-sm tracking-wide relative overflow-hidden transition shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/60 ${
                  formValid ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-400 hover:via-purple-500 hover:to-indigo-500 text-white' : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  {loading ? 'Вхід...' : 'Увійти'}
                </span>
              </button>
              {/* Google login removed per request */}
              <div className="text-sm text-center text-slate-400">
                Немає акаунта? <Link to="/register" className="text-indigo-300 hover:text-indigo-200 underline decoration-dotted">Реєстрація</Link>
                <span className="mx-2 text-slate-600">|</span>
                <Link to="/login" className="text-slate-500 hover:text-slate-300">Telegram</Link>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/70 text-[11px] leading-relaxed text-slate-500 text-center">
              Авторизуючись, ви погоджуєтесь з нашими умовами використання. Дані передаються через захищене з'єднання.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
