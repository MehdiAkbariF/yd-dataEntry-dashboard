import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yadakchi.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ⚠️ حیاتی: برای ارسال خودکار HttpOnly Cookie توسط مرورگر
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json',
  },
});

// Interceptor برای مدیریت خطای 401 (انقضا یا عدم وجود کوکی HttpOnly)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        console.warn('جلسه کاری شما منقضی شده است. هدایت به صفحه ورود...');
        // هدایت مستقیم کاربر به صفحه لاگین
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);