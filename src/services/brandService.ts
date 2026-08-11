import { apiClient } from '@/lib/axios';
import { PaginatedResponse } from '@/types/api';
import { BrandListItem, BrandFilterParams } from '@/features/brands/types';

export const brandService = {
  // دریافت لیست برندها با پیش‌فرض IsDeleted = false
  async getBrands(params: BrandFilterParams): Promise<PaginatedResponse<BrandListItem>> {
    const response = await apiClient.get<PaginatedResponse<BrandListItem>>(
      '/api/Admin/A_Product/BrandList',
      {
        params: {
          isDeleted: false, // ⚠️ پیش‌فرض
          ...params,
        },
      }
    );
    return response.data;
  },

  // دریافت اطلاعات کامل یک برند با Id
  async getBrandById(id: string): Promise<any> {
    const response = await apiClient.get<any>('/api/Admin/A_Product/Brand', {
      params: { Id: id },
    });
    return response.data;
  },

  // ایجاد برند جدید (multipart/form-data)
  async createBrand(formData: FormData): Promise<any> {
    const response = await apiClient.post('/api/Admin/A_Product/Brand', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ویرایش برند (multipart/form-data)
  async updateBrand(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/Admin/A_Product/Brand', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // تایید برند (ConfirmBrand)
  async confirmBrand(id: string, isConfirmed: boolean): Promise<any> {
    const formData = new FormData();
    formData.append('Id', id);
    formData.append('IsConfirmed', String(isConfirmed));

    const response = await apiClient.put('/api/Admin/A_Product/ConfirmBrand', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // حذف برند
  async deleteBrand(id: string): Promise<any> {
    const response = await apiClient.delete('/api/Admin/A_Product/Brand', {
      data: { id },
    });
    return response.data;
  },
};