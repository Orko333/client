import axios from 'axios';

// Централізована база URL (можна змінити через Vite env: VITE_API_URL)
// Normalize VITE_API_URL: if it's set but missing protocol, prefix with https://
const rawApiUrl = (import.meta as any).env?.VITE_API_URL;
let baseURL = rawApiUrl || 'http://localhost:5000';
if (rawApiUrl && !/^https?:\/\//i.test(rawApiUrl)) {
  baseURL = `https://${rawApiUrl}`;
}

const api = axios.create({ baseURL });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('client_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
export { baseURL };
