import { apiClient } from '@/lib/axios';
import { PaginatedResponse } from '@/types/api';
import {
  PartCarDescriptionListItem,
  CarTypePartDescriptionListItem,
  PartDescriptionFilterParams,
} from '@/features/part-descriptions/types';

export const partDescriptionService = {
  // ۱. دریافت لیست توضیحات قطعه - مدل‌های خودرو (PartCarDescriptionList)
  async getPartCarDescriptions(params: PartDescriptionFilterParams): Promise<PaginatedResponse<PartCarDescriptionListItem>> {
    const response = await apiClient.get<PaginatedResponse<PartCarDescriptionListItem>>(
      '/api/A_Part/PartCarDescriptionList',
      { params: { isDeleted: false, ...params } }
    );
    return response.data;
  },

  // دریافت یک مورد توضیحات قطعه-خودرو با Id (همراه با PageNumber و PageSize الزامی)
  async getPartCarDescriptionById(id: string): Promise<any> {
    const response = await apiClient.get<any>('/api/A_Part/PartCarDescription', {
      params: {
        Id: id,
        PageNumber: 1, // ⚠️ الزامی طبق مستندات سرور
        PageSize: 30,  // ⚠️ الزامی طبق مستندات سرور
      },
    });
    const items = response.data?.items || [];
    return items.length > 0 ? items[0] : null; // بازگرداندن null به جای undefined
  },

  // ایجاد توضیحات قطعه-خودرو
  async createPartCarDescription(formData: FormData): Promise<any> {
    const response = await apiClient.post('/api/A_Part/PartCarDescription', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ویرایش توضیحات قطعه-خودرو
  async updatePartCarDescription(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/A_Part/PartCarDescription', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // تغییر وضعیت فعال/غیرفعال بودن
  async togglePartCarDescriptionStatus(id: string, isActive: boolean): Promise<any> {
    const formData = new FormData();
    formData.append('Id', id);
    formData.append('IsActive', String(isActive));

    const response = await apiClient.put('/api/A_Part/UpdatePartCarDescriptionActiveStatus', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // حذف
  async deletePartCarDescription(id: string): Promise<any> {
    const response = await apiClient.delete('/api/A_Part/PartCarDescription', {
      data: { id },
    });
    return response.data;
  },

  // ۲. دریافت لیست توضیحات قطعه - نوع خودرو (CarTypePartDescriptionList)
  async getCarTypePartDescriptions(params: PartDescriptionFilterParams): Promise<PaginatedResponse<CarTypePartDescriptionListItem>> {
    const response = await apiClient.get<PaginatedResponse<CarTypePartDescriptionListItem>>(
      '/api/A_Part/CarTypePartDescriptionList',
      { params: { isDeleted: false, ...params } }
    );
    return response.data;
  },

  // دریافت با Id برای CarTypePartDescription (همراه با PageNumber و PageSize الزامی)
  async getCarTypePartDescriptionById(id: string): Promise<any> {
    const response = await apiClient.get<any>('/api/A_Part/CarTypePartDescription', {
      params: {
        Id: id,
        PageNumber: 1, // ⚠️ الزامی طبق مستندات سرور
        PageSize: 30,  // ⚠️ الزامی طبق مستندات سرور
      },
    });
    const items = response.data?.items || [];
    return items.length > 0 ? items[0] : null; // بازگرداندن null به جای undefined
  },

  // ایجاد CarTypePartDescription
  async createCarTypePartDescription(formData: FormData): Promise<any> {
    const response = await apiClient.post('/api/A_Part/CarTypePartDescription', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ویرایش CarTypePartDescription
  async updateCarTypePartDescription(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/A_Part/CarTypePartDescription', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // تغییر وضعیت فعال CarTypePartDescription
  async toggleCarTypePartDescriptionStatus(id: string, isActive: boolean): Promise<any> {
    const formData = new FormData();
    formData.append('Id', id);
    formData.append('IsActive', String(isActive));

    const response = await apiClient.put('/api/A_Part/UpdateCarTypePartDescriptionActiveStatus', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // حذف CarTypePartDescription
  async deleteCarTypePartDescription(id: string): Promise<any> {
    const response = await apiClient.delete('/api/A_Part/CarTypePartDescription', {
      data: { id },
    });
    return response.data;
  },
};