import React, { useState, useMemo } from 'react';
import { useAuth } from '../state';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../ui/ToastProvider';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const USERNAME_RE = /^[A-Za-z0-9_\-]{3,20}$/;

export default function RegisterPage() {
  const { registerWithEmail } = useAuth();
  const nav = useNavigate();
  const { notify } = useToast();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({ email:false, username:false, password:false, confirm:false });
  const [loading, setLoading] = useState(false);

  const emailValid = useMemo(()=>EMAIL_RE.test(email.trim()), [email]);
  const usernameValid = useMemo(()=>USERNAME_RE.test(username.trim()), [username]);

  const strength = useMemo(()=>{
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-ZА-Я]/.test(password)) score++;
    if (/[a-zа-я]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }, [password]);
  const strengthLabel = ['Дуже слабкий','Слабкий','Середній','Непоганий','Сильний','Дуже сильний'][strength];
  const passwordOk = strength >= 3;
  const passwordsMatch = password && confirm && password === confirm;

  const formValid = emailValid && usernameValid && passwordOk && passwordsMatch && !loading;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerWithEmail || !formValid) return;
    setLoading(true);
    try {
      await registerWithEmail(email.trim(), username.trim(), password);
      nav('/orders');
    } catch (e: any) {
      notify({ message: e.message || 'Помилка реєстрації', type: 'error' });
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[72vh] flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-5 gap-10">
        {/* Left / promo */}
        <div className="hidden lg:flex flex-col lg:col-span-2 rounded-3xl border border-slate-800/50 bg-gradient-to-br from-indigo-700/30 via-slate-900 to-slate-900 p-10 relative overflow-hidden">
          <div className="absolute -top-24 -left-16 w-72 h-72 bg-purple-600/25 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-600/25 rounded-full blur-3xl" />
            <div className="relative space-y-8">
              <div>
                <h2 className="text-4xl font-extrabold leading-tight bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-300 bg-clip-text text-transparent">
                  Створіть акаунт
                </h2>
                <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-sm">Керуйте замовленнями, спілкуйтесь з підтримкою та отримуйте оновлення в одному місці.</p>
              </div>
              <ul className="space-y-4 text-sm text-slate-300/90">
                <li className="flex gap-3"><span>⚡</span><span>Швидкий старт без зайвого</span></li>
                <li className="flex gap-3"><span>🔔</span><span>Миттєві сповіщення про статус</span></li>
                <li className="flex gap-3"><span>💬</span><span>Єдиний чат підтримки</span></li>
                <li className="flex gap-3"><span>🛡️</span><span>Надійне зберігання паролів</span></li>
              </ul>
              <div className="pt-6 border-t border-slate-700/60 text-[11px] text-slate-500 leading-relaxed">
                Дані шифруються та не передаються третім особам.
              </div>
            </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="relative lg:col-span-3 rounded-3xl overflow-hidden shadow-2xl border border-slate-800/40 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-10 space-y-10">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
          </div>
          <div className="relative space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl">🧾</div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Реєстрація</h1>
                <p className="mt-1 text-sm text-slate-400">Маєте акаунт? <Link to="/email-login" className="text-indigo-300 hover:text-indigo-200 underline decoration-dotted">Увійти</Link></p>
              </div>
            </div>
          </div>

          <div className="relative grid gap-8">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <span className="inline-flex w-7 h-7 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-300">@</span>
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  onBlur={()=>setTouched(t=>({...t,email:true}))}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-800/70 border transition shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 backdrop-blur placeholder-slate-500 text-slate-100/90 ${touched.email && !emailValid ? 'border-rose-500/60' : 'border-slate-700 hover:border-slate-600'}`}
                  required
                />
                {email && (
                  <span className={`absolute top-1/2 -translate-y-1/2 right-3 px-2 py-0.5 rounded-md text-[11px] font-medium ${emailValid ? 'bg-emerald-600/20 text-emerald-300' : 'bg-rose-600/20 text-rose-300'}`}>{emailValid ? 'OK':'ERR'}</span>
                )}
              </div>
              {touched.email && !emailValid && <p className="text-xs text-rose-400">Невірний формат email.</p>}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label htmlFor="username" className="flex items-center justify-between text-sm font-medium text-slate-300">
                <span>Ім'я користувача</span>
                {touched.username && !usernameValid && <span className="text-rose-400 font-normal">3-20 символів A-Z 0-9 _ -</span>}
              </label>
              <input
                id="username"
                value={username}
                onChange={e=>setUsername(e.target.value)}
                onBlur={()=>setTouched(t=>({...t,username:true}))}
                placeholder="username"
                autoComplete="username"
                className={`w-full px-4 py-3 rounded-xl bg-slate-800/70 border transition shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 backdrop-blur placeholder-slate-500 text-slate-100/90 ${touched.username && !usernameValid ? 'border-rose-500/60' : 'border-slate-700 hover:border-slate-600'}`}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="flex items-center justify-between text-sm font-medium text-slate-300">
                <span>Пароль</span>
                {touched.password && !passwordOk && <span className="text-rose-400 font-normal">посиліть пароль</span>}
              </label>
              <div className="relative">
                <input
                  id="password"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  onBlur={()=>setTouched(t=>({...t,password:true}))}
                  type={showPwd ? 'text':'password'}
                  placeholder="Мін. 8 символів"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-slate-800/70 border transition shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 backdrop-blur placeholder-slate-500 text-slate-100/90 ${touched.password && !passwordOk ? 'border-rose-500/60' : 'border-slate-700 hover:border-slate-600'}`}
                  required
                />
                <button type="button" onClick={()=>setShowPwd(s=>!s)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200" aria-label={showPwd?'Приховати пароль':'Показати пароль'}>{showPwd ? '🙈':'👁️'}</button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${strength <= 1 ? 'bg-rose-500' : strength === 2 ? 'bg-amber-500' : strength === 3 ? 'bg-yellow-400' : strength === 4 ? 'bg-emerald-500' : 'bg-emerald-400'}`} style={{ width: `${(strength/5)*100}%` }} />
                </div>
                <span className="text-[11px] font-medium text-slate-400">{strengthLabel}</span>
              </div>
            </div>

            {/* Confirm */}
            <div className="space-y-2">
              <label htmlFor="confirm" className="flex items-center justify-between text-sm font-medium text-slate-300">
                <span>Підтвердження</span>
                {touched.confirm && !passwordsMatch && <span className="text-rose-400 font-normal">не співпадає</span>}
              </label>
              <div className="relative">
                <input
                  id="confirm"
                  value={confirm}
                  onChange={e=>setConfirm(e.target.value)}
                  onBlur={()=>setTouched(t=>({...t,confirm:true}))}
                  type={showConfirm ? 'text':'password'}
                  placeholder="Повторіть пароль"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-slate-800/70 border transition shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 backdrop-blur placeholder-slate-500 text-slate-100/90 ${touched.confirm && !passwordsMatch ? 'border-rose-500/60' : 'border-slate-700 hover:border-slate-600'}`}
                  required
                />
                <button type="button" onClick={()=>setShowConfirm(s=>!s)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200" aria-label={showConfirm?'Приховати пароль':'Показати пароль'}>{showConfirm ? '🙈':'👁️'}</button>
              </div>
            </div>
          </div>

          <div className="relative space-y-6 pt-2">
            <button
              disabled={!formValid}
              className={`w-full h-12 rounded-xl font-semibold text-sm tracking-wide relative overflow-hidden transition shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/60 ${formValid ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-400 hover:via-purple-500 hover:to-indigo-500 text-white' : 'bg-slate-700 text-slate-400 cursor-not-allowed'}`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                {loading ? 'Реєстрація...' : 'Створити акаунт'}
              </span>
            </button>
            {/* Google login removed per request */}
            <div className="text-sm text-center text-slate-400">
              Маєте акаунт? <Link to="/email-login" className="text-indigo-300 hover:text-indigo-200 underline decoration-dotted">Увійти</Link>
              <span className="mx-2 text-slate-600">|</span>
              <Link to="/login" className="text-slate-500 hover:text-slate-300">Telegram</Link>
            </div>
            <div className="text-[11px] text-slate-500 leading-relaxed text-center pt-4 border-t border-slate-700/60">
              Натискаючи кнопку, ви погоджуєтесь з умовами використання та політикою конфіденційності.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
