import React, { useEffect, useState, useRef } from 'react';
import socketService from '../services/socketService';
import { useAuth } from '../state/AuthContext';

interface SupportMessage {
  id?: number;
  client_message_id?: string; // optimistic local id
  user_id?: number;
  direction: string; // 'in' (from user) or 'bot'/admin reply
  text: string;
  created_at: string; // ISO or local datetime
  pending?: boolean; // local flag
  failed?: boolean;
}

const ClientChatPage: React.FC = () => {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom helper
  const scrollBottom = () => {
    requestAnimationFrame(() => {
      if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
    });
  };

  // Load history
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch('http://localhost:5000/api/client/support/messages', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then((data: SupportMessage[]) => {
        setMessages(data);
        scrollBottom();
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  // Socket listeners
  useEffect(() => {
    if (!token) return;
    socketService.joinUserRoom();
    const handler = (msg: SupportMessage) => {
      setMessages(prev => {
        // If this matches an optimistic message, reconcile
        if (msg.client_message_id) {
          const idx = prev.findIndex(m => m.client_message_id === msg.client_message_id);
          if (idx !== -1) {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], ...msg, pending: false };
            return copy;
          }
        }
        return [...prev, msg];
      });
      scrollBottom();
    };
    socketService.onNewSupportMessage(handler);
    return () => {
      // no specific off API; remove all to be safe
      socketService.removeAllListeners();
    };
  }, [token]);

  const send = () => {
    if (!input.trim() || !token) return;
    const text = input.trim();
    const clientId = `c_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    const optimistic: SupportMessage = {
      client_message_id: clientId,
      text,
      direction: 'in',
      created_at: new Date().toISOString(),
      pending: true
    };
    setMessages(prev => [...prev, optimistic]);
    setInput('');
    scrollBottom();
    setSending(true);
    try {
      socketService.sendUserMessage(text, clientId);
      // Fallback timeout: if not confirmed in 8s mark failed
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.client_message_id === clientId && m.pending ? { ...m, pending: false, failed: true } : m));
      }, 8000);
    } catch {
      setMessages(prev => prev.map(m => m.client_message_id === clientId ? { ...m, pending: false, failed: true } : m));
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!user) return <div className="max-w-2xl mx-auto">Потрібен вхід.</div>;

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[70vh] bg-slate-900/40 backdrop-blur rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white">CS</div>
        <div>
          <div className="font-semibold text-slate-100">Підтримка</div>
          <div className="text-xs text-slate-400">Наш менеджер відповість якнайшвидше</div>
        </div>
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
        {loading && <div className="text-slate-400">Завантаження...</div>}
        {!loading && messages.length === 0 && (
          <div className="text-slate-500 text-center mt-10">Ще немає повідомлень. Напишіть першим!</div>
        )}
        {messages.map(m => {
          const isUser = m.direction === 'in';
          return (
            <div key={m.id || m.client_message_id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 relative group ${isUser ? 'bg-indigo-600/90 text-white' : 'bg-slate-800/90 text-white'} ${m.failed ? 'ring-2 ring-red-500' : ''}`}>
                <div className="whitespace-pre-wrap break-words leading-relaxed">
                  {m.text}
                </div>
                <div className="mt-1 text-[10px] opacity-60 flex items-center gap-1">
                  <span>{new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  {m.pending && <span className="animate-pulse">...</span>}
                  {m.failed && <span className="text-red-400">не надіслано</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-slate-700 bg-slate-800/60">
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Напишіть повідомлення..."
            className="flex-1 resize-none rounded-xl bg-slate-900/60 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-100 placeholder-slate-500 p-3 h-20"
          />
          <button
            onClick={send}
            disabled={!input.trim() || sending}
            className="h-10 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow disabled:opacity-40 disabled:cursor-not-allowed hover:from-indigo-500 hover:to-purple-500 transition"
          >
            Надіслати
          </button>
        </div>
        <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Онлайн • Середній час відповіді ~10 хв
        </div>
      </div>
    </div>
  );
};

export default ClientChatPage;
