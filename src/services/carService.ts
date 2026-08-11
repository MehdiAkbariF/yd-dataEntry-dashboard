import { apiClient } from '@/lib/axios';
import { PaginatedResponse } from '@/types/api';
import { CarListItem, CarFilterParams } from '@/features/cars/types';

export const carService = {
  // دریافت لیست خودروها با پیش‌فرض IsDeleted = false
  async getCars(params: CarFilterParams): Promise<PaginatedResponse<CarListItem>> {
    const response = await apiClient.get<PaginatedResponse<CarListItem>>(
      '/api/Admin/A_Product/Car',
      {
        params: {
          isDeleted: false, // ⚠️ پیش‌فرض
          ...params,
        },
      }
    );
    return response.data;
  },

  // دریافت اطلاعات کامل یک خودرو با Id
  async getCarById(id: string): Promise<any> {
    const response = await apiClient.get<any>('/api/Admin/A_Product/Car', {
      params: { Ids: [id] },
    });
    const items = response.data?.items || response.data;
    return Array.isArray(items) ? items[0] : items;
  },

  // ایجاد خودرو جدید (multipart/form-data)
  async createCar(formData: FormData): Promise<any> {
    const response = await apiClient.post('/api/Admin/A_Product/Car', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ویرایش خودرو (multipart/form-data)
  async updateCar(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/Admin/A_Product/Car', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // حذف خودرو
  async deleteCar(id: string): Promise<any> {
    const response = await apiClient.delete('/api/Admin/A_Product/Car', {
      data: { id },
    });
    return response.data;
  },

  // دریافت لیست خودروسازان
  async getCarManufacturers(query?: string): Promise<any[]> {
    const response = await apiClient.get<any>('/api/Admin/A_Product/CarManufacturer', {
      params: { Name: query, PageSize: 50, IsDeleted: false },
    });
    return response.data?.items || response.data || [];
  },

  // دریافت لیست انواع خودرو (CarTypes)
  async getCarTypes(query?: string): Promise<any[]> {
    const response = await apiClient.get<any>('/api/Admin/A_Product/CarType', {
      params: { Name: query, PageSize: 50, IsDeleted: false },
    });
    return response.data?.items || response.data || [];
  },
};