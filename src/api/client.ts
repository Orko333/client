import axios from 'axios';

// Централізована база URL (можна змінити через Vite env: VITE_API_URL)
const baseURL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('client_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
export { baseURL };
