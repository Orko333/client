import React, { useEffect, useState } from 'react';

export default function ScrollToBottomAnchor({ containerId }: { containerId: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
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
      onClick={() => {
        const el = document.getElementById(containerId); if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }}
      className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-700/80 text-xs text-slate-600 dark:text-slate-200 shadow border border-slate-200/60 dark:border-slate-600/50 hover:bg-white"
    >До низу ↓</button>
  );
}
