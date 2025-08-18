import React, { useState } from 'react';
import api from '../api/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useToast } from '../ui/ToastProvider';
import { usePageTitle } from '../hooks/usePageTitle';

export default function CreateOrderPage() {
  const [topic, setTopic] = useState('');
  const [requirements, setRequirements] = useState('');
  const [orderType, setOrderType] = useState('');
  const [subject, setSubject] = useState('');
  const [deadline, setDeadline] = useState('');
  const [volume, setVolume] = useState('');
  const [promocode, setPromocode] = useState('');
  const [promoResult, setPromoResult] = useState<any>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const { data: prices } = useFetch<Record<string, any>>('/api/client/prices', []);
  const navigate = useNavigate();
  const { notify } = useToast();
  const location = useLocation();

  // Prefill orderType from query param ?type=serviceKey
  React.useEffect(() => {
    if (!prices) return;
    const params = new URLSearchParams(location.search);
    const t = params.get('type');
    if (t && prices[t]) setOrderType(t);
  }, [location.search, prices]);
  usePageTitle('Нове замовлення – StudentWorks');
  
  const validate = () => {
    const e: Record<string,string> = {};
    if (!topic.trim()) e.topic = 'Вкажіть тему';
    if (!requirements.trim()) e.requirements = 'Опишіть вимоги';
    if (deadline) { const today = new Date(); today.setHours(0,0,0,0); const d = new Date(deadline); if (d < today) e.deadline = 'Дата не може бути в минулому'; }
    if (volume && isNaN(Number(volume))) e.volume = 'Повинно бути числом';
    if (files && files.length > 10) e.files = 'Макс 10 файлів';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const applyPromocode = async () => {
    if (!promocode) return;
    try {
      const res = await api.post('/api/client/promocode/validate', { code: promocode, amount:  (calcPrice() || 0)});
      setPromoResult(res.data);
    } catch (e:any) {
      setPromoResult({ valid:false, error: e?.response?.data?.error || 'Помилка' });
    }
  };

  const calcPrice = () => {
    if (!orderType || !prices) return 0;
    const p = prices[orderType];
    if (!p) return 0;
    const base = p.base || 0;
    const vol = parseInt(volume || '0') || 0;
    if (p.per_page && vol) return base + p.per_page * vol;
    if (p.per_work && vol) return base + p.per_work * vol;
    return base;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const form = new FormData();
    form.append('topic', topic);
    form.append('requirements', requirements);
    if (orderType) form.append('order_type', orderType);
    if (subject) form.append('subject', subject);
    if (deadline) form.append('deadline', deadline);
    if (volume) form.append('volume', volume);
    if (promocode) form.append('promocode', promocode);
    if (files) Array.from(files).forEach(f => form.append('files', f));
    try {
      const res = await api.post('/api/client/orders', form);
      notify({ message: 'Замовлення створено', type: 'success'});
      navigate(`/orders/${res.data.order_id}`);
    } catch (e) {
      notify({ message: 'Помилка створення замовлення', type: 'error'});
    } finally { setLoading(false); }
  };

  const price = calcPrice();
  const finalPrice = promoResult?.valid ? Math.max(price - (promoResult.discount||0),0) : price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg">
              📝
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              Нове замовлення
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Заповніть форму нижче — ми автоматично розрахуємо попередню вартість, 
            а після підтвердження менеджер уточнить деталі в чаті
          </p>
        </div>

        <form onSubmit={submit} className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Основна інформація</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Тип роботи <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={orderType} 
                      onChange={e=>setOrderType(e.target.value)} 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">-- Оберіть тип роботи --</option>
                      {prices && Object.entries(prices).map(([k,v]:any)=>(
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Тема роботи <span className="text-red-500">*</span>
                    </label>
                    <input 
                      value={topic} 
                      onChange={e=>setTopic(e.target.value)} 
                      placeholder="Введіть тему вашої роботи"
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/40 focus:border-transparent ${
                        errors.topic ? 'border-red-400 ring-2 ring-red-200' : 'border-slate-300 dark:border-slate-600'
                      }`} 
                    />
                    {errors.topic && <div className="text-sm text-red-500 mt-2 flex items-center gap-1">
                      <span>⚠️</span> {errors.topic}
                    </div>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Предмет
                    </label>
                    <input 
                      value={subject} 
                      onChange={e=>setSubject(e.target.value)} 
                      placeholder="Назва предмету"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all duration-200" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Дедлайн
                      </label>
                      <input 
                        type="date" 
                        value={deadline} 
                        onChange={e=>setDeadline(e.target.value)} 
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/40 focus:border-transparent ${
                          errors.deadline ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'
                        }`} 
                      />
                      {errors.deadline && <div className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <span>⚠️</span> {errors.deadline}
                      </div>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Обсяг (стор./робіт)
                      </label>
                      <input 
                        value={volume} 
                        onChange={e=>setVolume(e.target.value)} 
                        placeholder="Кількість"
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/40 focus:border-transparent ${
                          errors.volume ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'
                        }`} 
                      />
                      {errors.volume && <div className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <span>⚠️</span> {errors.volume}
                      </div>}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Вимоги до роботи <span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      value={requirements} 
                      onChange={e=>setRequirements(e.target.value)} 
                      placeholder="Опишіть детальні вимоги до роботи, структуру, особливі побажання..."
                      rows={8}
                      className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/40 focus:border-transparent resize-y ${
                        errors.requirements ? 'border-red-400 ring-2 ring-red-200' : 'border-slate-300 dark:border-slate-600'
                      }`} 
                    />
                    {errors.requirements && <div className="text-sm text-red-500 mt-2 flex items-center gap-1">
                      <span>⚠️</span> {errors.requirements}
                    </div>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Файли (до 10)
                    </label>
                    <div className="relative">
                      <input 
                        type="file" 
                        multiple 
                        onChange={e=>setFiles(e.target.files)}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/40 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                          errors.files ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'
                        }`} 
                      />
                    </div>
                    {errors.files && <div className="text-sm text-red-500 mt-2 flex items-center gap-1">
                      <span>⚠️</span> {errors.files}
                    </div>}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Прикріпіть методичні вказівки, приклади робіт, додаткові матеріали
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Calculator */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center text-sm font-semibold">
                  💰
                </div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Розрахунок вартості</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-700/50 dark:to-slate-600/30 border border-slate-200/50 dark:border-slate-600/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600 dark:text-slate-400 text-sm">Попередня ціна</span> 
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{price} грн</span>
                  </div>
                  {promoResult?.valid && (
                    <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 mb-2">
                      <span className="text-sm">Знижка</span> 
                      <span className="font-medium">-{promoResult.discount} грн</span>
                    </div>
                  )}
                  <div className="h-px bg-slate-200 dark:bg-slate-600 my-3" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Фінальна ціна</span> 
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                      {finalPrice} грн
                    </span>
                  </div>
                </div>
              </div>

              {/* Promocode */}
              <div className="space-y-3 mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Промокод
                </label>
                <div className="flex gap-2">
                  <input 
                    value={promocode} 
                    onChange={e=>setPromocode(e.target.value)} 
                    placeholder="ABC2025"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/40 focus:border-transparent transition-all duration-200" 
                  />
                  <button 
                    type="button" 
                    onClick={applyPromocode}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:from-blue-600 hover:to-indigo-600 focus:ring-2 focus:ring-blue-500/40 transition-all duration-200 transform hover:scale-105"
                  >
                    OK
                  </button>
                </div>
                {promoResult && (
                  <div className={`text-sm p-3 rounded-xl ${promoResult.valid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700/30' : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/30'}`}>
                    {promoResult.valid ? `✅ Знижка: -${promoResult.discount} грн` : `❌ ${promoResult.error}`}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button 
                disabled={loading} 
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500/40 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Створення...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>🚀</span>
                    Створити замовлення
                  </div>
                )}
              </button>
              
              <div className="text-xs text-slate-400 dark:text-slate-500 text-center mt-3 leading-relaxed">
                Натискаючи кнопку, ви погоджуєтесь з <br/>
                <a href="#" className="text-blue-500 hover:text-blue-600 transition-colors">умовами обробки даних</a>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl p-6 border border-blue-200/50 dark:border-blue-700/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm">
                  💡
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Потрібна допомога?</h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Не знаєте як правильно оформити замовлення? Наші менеджери з радістю допоможуть!
              </p>
              <a 
                href="#" 
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <span>💬</span>
                Написати в підтримку
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
