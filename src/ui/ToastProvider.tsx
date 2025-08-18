import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export interface ToastOptions {
  id?: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // ms
}

interface ToastContextValue {
  notify: (opts: ToastOptions) => string; 
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

interface ToastInternal extends ToastOptions { id: string; created: number; };

const typeStyles: Record<string,string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-rose-600 text-white',
  info: 'bg-slate-800 text-white',
  warning: 'bg-amber-500 text-slate-900'
};

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [toasts, setToasts] = useState<ToastInternal[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const notify = useCallback((opts: ToastOptions) => {
    const id = opts.id || `t_${Date.now()}_${idRef.current++}`;
    setToasts(t => [...t, { id, created: Date.now(), duration: 4000, type: 'info', ...opts }]);
    return id;
  }, []);

  // auto dismiss
  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map(t => {
      const remaining = (t.duration || 4000) - (Date.now() - t.created);
      return setTimeout(() => dismiss(t.id), Math.max(remaining, 500));
    });
    return () => { timers.forEach(clearTimeout); };
  }, [toasts, dismiss]);

  return (
    <ToastContext.Provider value={{ notify, dismiss }}>
      {children}
      <div className="fixed inset-0 pointer-events-none flex flex-col gap-2 items-end px-4 py-6 z-[100]">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto w-full max-w-sm shadow-lg rounded-xl overflow-hidden ring-1 ring-black/5 backdrop-blur bg-white/90 dark:bg-slate-900/80 dark:text-slate-100 animate-slide-in-right ${t.type && typeStyles[t.type] ? '' : ''}`}>
            <div className={`p-4 text-sm flex gap-3 ${t.type && typeStyles[t.type] ? typeStyles[t.type] : ''}`}>
              <div className="flex-1 space-y-1">
                {t.title && <div className="font-semibold text-sm leading-tight">{t.title}</div>}
                <div className="leading-snug">{t.message}</div>
              </div>
              <button onClick={() => dismiss(t.id)} className="text-xs opacity-70 hover:opacity-100">✕</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
