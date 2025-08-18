import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import api, { baseURL } from '../api/client';
import socketService from '../services/socketService';
import StatusBadge, { statusToDot } from '../ui/StatusBadge';
import { useToast } from '../ui/ToastProvider';
import Skeleton, { TextSkeleton } from '../ui/Skeleton';
import { usePageTitle } from '../hooks/usePageTitle';

function ScrollToBottomAnchor({ containerId }: { containerId: string }) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const el = document.getElementById(containerId);
    if (!el) return;
    const onScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
      setVisible(!nearBottom);
    };
    el.addEventListener('scroll', onScroll);
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [containerId]);
  if (!visible) return null;
  return (
    <button
      onClick={() => { const el = document.getElementById(containerId); if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); }}
      className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-700/80 text-xs text-slate-600 dark:text-slate-200 shadow border border-slate-200/60 dark:border-slate-600/50 hover:bg-white"
    >До низу ↓</button>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { data: order, loading: orderLoading, refetch: refetchOrder } = useFetch<any>(`/api/client/order/${id}`, [id]);
  const { data: messages, loading: messagesLoading, refetch: refetchMessages } = useFetch<any[]>(`/api/client/order/${id}/messages`, [id]);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [realTimeMessages, setRealTimeMessages] = useState<any[]>([]);
  const [pendingMessages, setPendingMessages] = useState<any[]>([]);
  const { notify } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  usePageTitle(order ? `Замовлення #${id} – StudentWorks` : 'Замовлення – StudentWorks');
  const allMessages = [...(messages || []), ...realTimeMessages, ...pendingMessages];

  // Автоскрол до останнього повідомлення
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  // Socket.IO інтеграція
  useEffect(() => {
    if (!id) return;

    // Приєднуємося до кімнати замовлення
    socketService.joinOrderRoom(id);

    // Слухаємо нові повідомлення
    socketService.onNewMessage((message) => {
      if (message.client_message_id) {
        setPendingMessages(p => p.filter(m => m.id !== message.client_message_id));
      }
      setRealTimeMessages(prev => [...prev, message]);
    });

    // Очищення при unmount
    return () => {
      socketService.leaveOrderRoom(id);
      socketService.removeAllListeners();
    };
  }, [id]);

  const sendMessage = async (e?: React.FormEvent | any) => {
    e?.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    const tempId = `tmp_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
    const optimistic = { id: tempId, text, direction: 'in', created_at: new Date().toISOString(), _optimistic: true };
    setPendingMessages(p => [...p, optimistic]);
    try {
      socketService.sendMessage(id!, text, tempId);
      setText('');
    } catch { 
      setPendingMessages(p => p.filter(m => m.id !== tempId));
      notify({ message: 'Помилка надсилання повідомлення', type: 'error'}); 
    } finally { 
      setSending(false); 
    }
  };

  const uploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
  try { 
    await api.post(`/api/client/order/${id}/upload`, form);
    notify({ message: 'Файл завантажено', type: 'success'});
    refetchOrder();
  } catch { notify({ message: 'Помилка завантаження файлу', type: 'error'}); }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="section-title m-0 text-3xl">Замовлення #{id}</h1>
          {order?.status && <StatusBadge status={order.status} />}
        </div>
  {/* action buttons removed per request */}
      </div>

      {/* Loading State */}
      {orderLoading && (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="card lg:col-span-2 p-8 space-y-6">
            <Skeleton className="h-6 w-48" />
            <TextSkeleton lines={6} />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <Skeleton className="h-5 w-40" />
              <div className="space-y-3">
                {Array.from({length:3}).map((_,i)=>(<Skeleton key={i} className="h-12 w-full" />))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Details */}
      {order && !orderLoading && (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="card p-8 bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-slate-900/95 dark:to-slate-800/95">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3">Опис замовлення</h3>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/40 dark:border-blue-800/40 rounded-xl p-6">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Тема</h4>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{order.topic}</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {order.subject && (
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border border-purple-200/40 dark:border-purple-800/40 rounded-xl p-4">
                      <div className="font-semibold text-purple-800 dark:text-purple-200 mb-1">Предмет</div>
                      <div className="text-purple-700 dark:text-purple-300">{order.subject}</div>
                    </div>
                  )}
                  
                  {order.deadline && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/40 dark:border-amber-800/40 rounded-xl p-4">
                      <div className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Дедлайн</div>
                      <div className="text-amber-700 dark:text-amber-300 flex items-center gap-2">
                        <span>⏰</span>
                        {order.deadline}
                      </div>
                    </div>
                  )}
                  
                  {order.volume && (
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/40 dark:border-emerald-800/40 rounded-xl p-4">
                      <div className="font-semibold text-emerald-800 dark:text-emerald-200 mb-1">Обсяг</div>
                      <div className="text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                        <span>📄</span>
                        {order.volume}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 border border-rose-200/40 dark:border-rose-800/40 rounded-xl p-4">
                    <div className="font-semibold text-rose-800 dark:text-rose-200 mb-1">Ціна</div>
                    <div className="text-2xl font-bold text-rose-700 dark:text-rose-300 flex items-center gap-2">
                      <span>💰</span>
                      {order.price ?? 0} грн
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Вимоги до роботи</h4>
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-600/40 rounded-xl p-6">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                      {order.requirements}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Files Section */}
            {order.files?.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <span>📎</span>
                  Прикріплені файли
                </h3>
                <div className="grid gap-3">
                  {order.files.map((f:any)=> (
                    <div key={f.file_id} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200/60 dark:border-slate-600/40 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-lg">
                          �
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{f.file_name}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Завантажено: {new Date(f.created_at).toLocaleDateString('uk-UA')}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => window.open(`${baseURL}/api/client/order/${id}/files/${f.file_id}`, '_blank')}
                        className="btn-primary px-4 py-2 text-sm hover:scale-105 transition-transform"
                      >
                        ⬇ Завантажити
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status History */}
            {order.status_history?.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <span>📋</span>
                  Історія статусів
                </h3>
                <div className="space-y-3">
                  {order.status_history.reverse().map((h:any,i:number)=> (
                    <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl border border-slate-200/60 dark:border-slate-600/40">
                      <div className="flex items-center gap-4">
                        <div className={`w-4 h-4 rounded-full ${statusToDot(h.status)}`}></div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {h.status === 'pending' ? 'Очікує підтвердження' :
                           h.status === 'in_progress' ? 'В роботі' :
                           h.status === 'completed' ? 'Завершено' :
                           h.status === 'cancelled' ? 'Скасовано' : h.status}
                        </span>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(h.changed_at).toLocaleString('uk-UA')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chat */}
            <form onSubmit={sendMessage} className="card p-6 bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-slate-900/95 dark:to-slate-800/95">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <span>💬</span>
                Чат з підтримкою
              </h3>
              
              {/* Messages */}
              <div className="relative h-80 overflow-auto bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 rounded-xl border border-slate-200/60 dark:border-slate-600/40 p-4 space-y-4 mb-4" id="messages-scroll">
                {allMessages.length === 0 && (
                  <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    <div className="text-4xl mb-4">💬</div>
                    <p className="text-sm">Поки що повідомлень немає</p>
                  </div>
                )}
                
                {allMessages.map((m, index) => {
                  const isClient = m.direction === 'in';
                  return (
                    <div key={m.id || index} className={`flex ${isClient ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                      <div className={`group relative max-w-[85%] ${isClient ? 'order-2' : 'order-1'}`}>
                        <div className={`px-4 py-3 rounded-2xl shadow-sm backdrop-blur border ${
                          isClient 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-400/30 rounded-br-md' 
                            : 'bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border-slate-200/60 dark:border-slate-600/40 rounded-bl-md'
                        }`}>
                          <div className="leading-relaxed whitespace-pre-wrap break-words text-sm">
                            {m.text}
                          </div>
                          <div className={`flex items-center justify-end gap-1 text-xs mt-2 opacity-70 ${
                            isClient ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            <span>
                              {m.created_at ? new Date(m.created_at).toLocaleTimeString('uk-UA',{hour:'2-digit',minute:'2-digit'}) : ''}
                            </span>
                            {m._optimistic && <span className="animate-pulse">⏳</span>}
                            {!m._optimistic && isClient && <span className="text-blue-200">✓</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
                <ScrollToBottomAnchor containerId="messages-scroll" />
              </div>
              
              {/* Message Input */}
              <div className="flex gap-3">
                <textarea 
                  value={text}
                  onChange={e=>setText(e.target.value)}
                  placeholder="Напишіть повідомлення..."
                  className="flex-1 border border-slate-200/60 dark:border-slate-600/40 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-400/40 resize-none bg-white/80 dark:bg-slate-800/80 backdrop-blur"
                  rows={3}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button 
                  type="submit"
                  aria-label="Надіслати повідомлення"
                  disabled={sending || !text.trim()} 
                  className="btn-primary px-4 py-3 whitespace-nowrap self-end hover:scale-105 transition-transform disabled:scale-100"
                >
                  {sending ? '⏳' : '📤'}
                </button>
              </div>
            </form>

            {/* File Upload */}
            <form onSubmit={uploadFile} className="card p-6 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-slate-700/50">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <span>📁</span>
                Додати файл
              </h3>
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={e=>setFile(e.target.files?.[0] || null)} 
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 file:font-semibold hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 file:cursor-pointer cursor-pointer"
                  />
                </div>
                <button 
                  disabled={!file} 
                  className="btn-secondary w-full hover:scale-105 transition-transform disabled:scale-100 disabled:opacity-50"
                >
                  📤 Завантажити файл
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
