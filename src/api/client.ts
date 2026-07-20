import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 120000, // 2 min for analysis
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexus_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nexus_token');
      localStorage.removeItem('nexus_user');
      window.location.href = '/auth';
    }
    return Promise.reject(err);
  }
);

export const analyzeUrl = (url: string) =>
  api.post('/analysis/analyze', { url }).then(r => r.data);

export const getScan = (id: string) =>
  api.get(`/analysis/scan/${id}`).then(r => r.data);

export const getUserScans = (page = 1, limit = 10) =>
  api.get(`/analysis/history?page=${page}&limit=${limit}`).then(r => r.data);

export const deleteScan = (id: string) =>
  api.delete(`/analysis/scan/${id}`).then(r => r.data);

export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password }).then(r => r.data);

export const register = (email: string, password: string, name?: string) =>
  api.post('/auth/register', { email, password, name }).then(r => r.data);

export const getMe = () =>
  api.get('/auth/me').then(r => r.data);

export default api;
