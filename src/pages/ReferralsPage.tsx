import React, { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { usePageTitle } from '../hooks/usePageTitle';
import { useToast } from '../ui/ToastProvider';

export default function ReferralsPage() {
  const { data: referrals } = useFetch<any[]>('/api/client/referrals', []);
  const [referralCode] = useState('REF123456'); // This would come from user data
  const { notify } = useToast();

  usePageTitle('Реферальна програма – StudentWorks');

  const copyReferralLink = () => {
    const link = `https://t.me/studentworks_bot?start=${referralCode}`;
    navigator.clipboard.writeText(link);
    notify({ message: 'Посилання скопійовано!', type: 'success' });
  };

  const totalEarnings = referrals?.reduce((sum, ref) => sum + (ref.reward || 0), 0) || 0;
  const activeReferrals = referrals?.filter(ref => ref.is_active).length || 0;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="section-title text-4xl lg:text-5xl">
            Реферальна програма
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Запрошуйте друзів та отримуйте 10% з кожного їхнього замовлення. 
            Заробляйте разом з нами!
          </p>
        </div>

        {/* Referral Link Card */}
        <div className="card p-8 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200/40 dark:border-emerald-800/40 max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-4">
            Ваше реферальне посилання
          </h3>
          <div className="flex gap-3">
            <div className="flex-1 px-4 py-3 bg-white/80 dark:bg-slate-800/80 border border-emerald-200/60 dark:border-emerald-700/60 rounded-xl text-emerald-700 dark:text-emerald-300 font-mono text-sm">
              https://t.me/studentworks_bot?start={referralCode}
            </div>
            <button 
              onClick={copyReferralLink}
              className="btn-primary px-6 py-3 bg-emerald-600 hover:bg-emerald-700 hover:scale-105 transition-transform"
            >
              📋 Копіювати
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="card p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/40 dark:border-blue-800/40 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl mb-3">
            👥
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {referrals?.length || 0}
          </div>
          <div className="text-sm text-blue-700/70 dark:text-blue-300/70 font-medium">Всього рефералів</div>
        </div>

        <div className="card p-6 text-center bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200/40 dark:border-emerald-800/40 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-xl mb-3">
            ⚡
          </div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            {activeReferrals}
          </div>
          <div className="text-sm text-emerald-700/70 dark:text-emerald-300/70 font-medium">Активних</div>
        </div>

        <div className="card p-6 text-center bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200/40 dark:border-amber-800/40 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl mb-3">
            💰
          </div>
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
            {totalEarnings} грн
          </div>
          <div className="text-sm text-amber-700/70 dark:text-amber-300/70 font-medium">Заробіток</div>
        </div>

        <div className="card p-6 text-center bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border-purple-200/40 dark:border-purple-800/40 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
          <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-white text-xl mb-3">
            🎯
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            10%
          </div>
          <div className="text-sm text-purple-700/70 dark:text-purple-300/70 font-medium">Відсоток</div>
        </div>
      </div>

      {/* Referrals List */}
      {referrals && referrals.length > 0 && (
        <div className="card p-8 bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-slate-900/95 dark:to-slate-800/95">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
            <span>👥</span>
            Ваші реферали
          </h2>
          <div className="grid gap-4">
            {referrals.map((referral, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200/60 dark:border-slate-600/40 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {referral.referred_username?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {referral.referred_username || 'Користувач'}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Приєднався: {new Date(referral.created_at).toLocaleDateString('uk-UA')}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        referral.is_active 
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {referral.is_active ? '✅ Активний' : '⏸️ Неактивний'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    +{referral.reward || 0} грн
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">винагорода</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="card p-8 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-slate-700/50">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-8 text-center">
          Як працює реферальна програма?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
              📤
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Поділіться посиланням</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Надішліть своє реферальне посилання друзям та знайомим
              </p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
              👤
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Друг приєднується</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Ваш друг реєструється через ваше посилання
              </p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
              📝
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Робить замовлення</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Друг створює та оплачує своє перше замовлення
              </p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
              💰
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Ви заробляєте</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Отримуєте 10% з кожного замовлення вашого реферала
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-12">
        <div className="card p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/40 dark:border-blue-800/40 max-w-2xl mx-auto">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Почніть заробляти вже сьогодні!
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Поділіться посиланням з друзями та отримуйте пасивний дохід з кожного їхнього замовлення
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={copyReferralLink}
              className="btn-primary px-6 py-3 hover:scale-105 transition-transform"
            >
              📋 Копіювати посилання
            </button>
            <button className="btn-secondary px-6 py-3 hover:scale-105 transition-transform">
              📊 Переглянути статистику
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
