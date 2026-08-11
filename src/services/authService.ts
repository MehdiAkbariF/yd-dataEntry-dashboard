import { apiClient } from '@/lib/axios';

export interface AdminAuthPayload {
  phoneNumber: string;
}

export interface ConfirmAuthPayload {
  phoneNumber: string;
  code: string;
}

export const authService = {
  // مرحله اول: درخواست ارسال کد OTP به شماره موبایل
  async requestOtp(phoneNumber: string): Promise<any> {
    const response = await apiClient.post('/api/Login/AdminAuthentication', {
      phoneNumber,
    });
    return response.data;
  },

  // مرحله دوم: تایید کد ورود و ثبت کوکی HttpOnly روی مرورگر
  async confirmOtp(payload: ConfirmAuthPayload): Promise<any> {
    const response = await apiClient.post('/api/Login/ConfirmAuthentication', payload);
    return response.data;
  },

  // خروج از حساب و ابطال کوکی
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/Login/Logout');
    } catch (e) {
      console.error('Logout failed:', e);
    } finally {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  },
};