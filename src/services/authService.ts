import { apiClient } from '@/lib/axios';

export interface AdminAuthPayload {
  phoneNumber: string;
}

export interface ConfirmAuthPayload {
  phoneNumber: string;
  code: string;
}

export const authService = {
  // مرحله اول: درخواست کد ورود OTP
  async requestOtp(phoneNumber: string): Promise<any> {
    const response = await apiClient.post(
      '/api/Login/AdminAuthentication',
      { phoneNumber },
      {
        headers: {
          'X-Client-Type': 'web',
        },
      }
    );
    return response.data;
  },

  // مرحله دوم: تایید کد ورود OTP
  async confirmOtp(payload: ConfirmAuthPayload): Promise<any> {
    const response = await apiClient.post(
      '/api/Login/ConfirmAuthentication',
      payload,
      {
        headers: {
          'X-Client-Type': 'web',
        },
      }
    );
    return response.data;
  },

  // ⚠️ خروج از حساب متصل به ای‌پي‌آی سرور
  async logout(): Promise<void> {
    try {
      // ارسال درخواست خروج برای ابطال کوکی سمت سرور
      await apiClient.post(
        '/api/Login/Logout',
        {},
        {
          headers: {
            'X-Client-Type': 'web',
          },
        }
      );
    } catch (e) {
      console.error('Server logout failed:', e);
    } finally {
      // در هر صورت کاربر به لاگین هدایت می‌شود
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },
};