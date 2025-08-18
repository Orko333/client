import { useEffect, useRef, useState, useCallback } from 'react';
import api from '../api/client';

export function useFetch<T>(url: string, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);
    api.get(url, { signal: controller.signal }).then(r => {
      setData(r.data);
    }).catch(e => {
      if (e.name !== 'CanceledError' && e.name !== 'AbortError') {
        setError(e.message || 'Error');
      }
    }).finally(() => setLoading(false));
  }, [url]);

  useEffect(() => { run(); return () => abortRef.current?.abort(); }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return { data, loading, error, refetch: run };
}
