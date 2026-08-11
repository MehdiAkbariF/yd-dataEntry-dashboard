import axios from 'axios';

// در سمت مرورگر (Client) از مسیر نسبی استفاده می‌کنیم تا به پروکسی Next.js هدایت شود
const BASE_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yadakchi.com');

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ارسال خودکار HttpOnly Cookie
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json',
  },
});

// Interceptor مدیریت 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        console.warn('جلسه کاری منقضی شد.');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);