import axios from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';
import { API_BASE_URL } from '@/lib/config';

const BASE_URL = typeof window !== 'undefined' ? '' : API_BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ارسال خودکار کوکی HttpOnly مرورگر
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const url = error.config?.url || '';

      // ۱. خطاهای 400 Validation
      if (status === 400) {
        if (data?.errors && typeof data.errors === 'object') {
          Object.entries(data.errors).forEach(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(' - ') : messages;
            toast.error(`خطا در ${field}: ${msg}`);
          });
        } else if (data?.message || data?.title) {
          toast.error(data.message || data.title);
        }
      }

      // ۲. ⚠️ خطای 401: هدایت اتوماتیک به لاگین با حفظ علت (توسط کوئری پارامتر expired)
      if (status === 401) {
        if (!url.includes('/api/Login/')) {
          console.warn('⚠️ 401 Unauthorized Error on URL:', url);
          useAuthStore.getState().logoutState(); // ریست استور کلاینت
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            window.location.href = '/login?expired=true';
          }
        }
      }

      // ۳. خطای 500 سرور
      if (status >= 500) {
        toast.error('خطای داخلی سرور. لطفاً بعداً تلاش کنید.');
      }
    }
    return Promise.reject(error);
  }
);