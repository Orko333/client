import axios from 'axios';

// Normalize VITE_API_URL to an absolute URL and remove trailing slash
const _rawBase = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
let baseURL = String(_rawBase).trim();
if (!/^https?:\/\//i.test(baseURL)) {
  if (/^(localhost|127\.|0:0:0:0|\[::1\])/.test(baseURL) || baseURL.includes('localhost')) {
    baseURL = 'http://' + baseURL;
  } else {
    baseURL = 'https://' + baseURL;
  }
}
baseURL = baseURL.replace(/\/+$/, '');

const api = axios.create({ baseURL });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('client_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
export { baseURL };
