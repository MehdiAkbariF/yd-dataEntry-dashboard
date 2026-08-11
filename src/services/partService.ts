import { apiClient } from '@/lib/axios';
import { PaginatedResponse } from '@/types/api';
import { PartListItem, PartFilterParams } from '@/features/parts/types';

export const partService = {
  // دریافت لیست قطعات با فیلترها و Paging
  async getParts(params: PartFilterParams): Promise<PaginatedResponse<PartListItem>> {
    const response = await apiClient.get<PaginatedResponse<PartListItem>>(
      '/api/A_Part/PartList',
      { params }
    );
    return response.data;
  },

  // دریافت اطلاعات کامل یک قطعه با Id
  async getPartById(id: string): Promise<any> {
    const response = await apiClient.get<any>('/api/A_Part/Part', {
      params: { Id: id },
    });
    return response.data;
  },

  // ایجاد قطعه جدید (multipart/form-data)
  async createPart(formData: FormData): Promise<any> {
    const response = await apiClient.post('/api/A_Part/Part', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ویرایش قطعه (multipart/form-data)
  async updatePart(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/A_Part/Part', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // تغییر سریع وضعیت فعال/غیرفعال بودن قطعه
  async toggleActiveStatus(id: string, isActive: boolean): Promise<any> {
    const formData = new FormData();
    formData.append('Id', id);
    formData.append('IsActive', String(isActive));

    const response = await apiClient.put('/api/A_Part/UpdatePartActiveStatus', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // حذف قطعه
  async deletePart(id: string): Promise<any> {
    const response = await apiClient.delete('/api/A_Part/Part', {
      data: { id },
    });
    return response.data;
  },

  // دریافت لیست نام دسته‌بندی‌های قطعات
  async getPartCategoriesName(query?: string): Promise<any[]> {
    const response = await apiClient.get<any>('/api/A_Part/PartCategoriesName', {
      params: { Name: query, PageSize: 50 },
    });
    return response.data?.items || response.data || [];
  },

  // دریافت لیست ویژگی‌های پایه برای انتخاب چندتایی (Properties)
  async getProperties(query?: string): Promise<any[]> {
    const response = await apiClient.get<any>('/api/A_Part/Properties', {
      params: { Name: query, PageSize: 50 },
    });
    return response.data?.items || response.data || [];
  },
};