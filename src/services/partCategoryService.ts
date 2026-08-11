import { apiClient } from '@/lib/axios';
import { PaginatedResponse } from '@/types/api';
import { PartCategoryListItem, PartCategoryFilterParams } from '@/features/part-categories/types';

export const partCategoryService = {
  // دریافت لیست دسته‌بندی‌ها با فیلتر پیش‌فرض IsDeleted = false
  async getCategories(params: PartCategoryFilterParams): Promise<PaginatedResponse<PartCategoryListItem>> {
    const response = await apiClient.get<PaginatedResponse<PartCategoryListItem>>(
      '/api/A_Part/PartCategoryList',
      {
        params: {
          isDeleted: false, // ⚠️ پیش‌فرض
          ...params,
        },
      }
    );
    return response.data;
  },

  // دریافت یک دسته‌بندی با Id
  async getCategoryById(id: string): Promise<any> {
    const response = await apiClient.get<any>('/api/A_Part/PartCategory', {
      params: { Id: id },
    });
    const result = response.data;
    return Array.isArray(result) ? result[0] : result;
  },

  // ایجاد دسته‌بندی جدید (multipart/form-data)
  async createCategory(formData: FormData): Promise<any> {
    const response = await apiClient.post('/api/A_Part/PartCategory', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ویرایش دسته‌بندی (multipart/form-data)
  async updateCategory(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/A_Part/PartCategory', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // حذف دسته‌بندی
  async deleteCategory(id: string): Promise<any> {
    const response = await apiClient.delete('/api/A_Part/PartCategory', {
      data: { id },
    });
    return response.data;
  },
};