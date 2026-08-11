import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yadakchi.com');

export const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json',
  },
});

// Interceptor مدیریت خطاهای سراسری (400, 401, 500)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      // ⚠️ هندلینگ سراسری خطاهای 400 (Validation)
      if (status === 400) {
        if (data?.errors && typeof data.errors === 'object') {
          Object.entries(data.errors).forEach(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(' - ') : messages;
            toast.error(`خطا در ${field}: ${msg}`);
          });
        } else if (data?.message || data?.title) {
          toast.error(data.message || data.title);
        } else {
          toast.error('اطلاعات ارسالی نامعتبر است (خطای 400)');
        }
      }

      // ⚠️ هندلینگ سراسری خطای 401
      if (status === 401) {
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          toast.error('نشست کاری شما منقضی شد.');
          window.location.href = '/login?expired=true';
        }
      }

      // ⚠️ هندلینگ خطاهای 500 سرور
      if (status >= 500) {
        toast.error('خطای داخلی سرور. لطفاً بعداً تلاش کنید.');
      }
    }
    return Promise.reject(error);
  }
);