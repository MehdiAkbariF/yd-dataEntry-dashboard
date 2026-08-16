import { apiClient } from '@/lib/axios';
import { PaginatedResponse } from '@/types/api';
import { CarListItem, CarFilterParams } from '@/features/cars/types';

export const carService = {
  // ۱. مدل‌های خودرو (Car)
  async getCars(params: CarFilterParams): Promise<PaginatedResponse<CarListItem>> {
    const response = await apiClient.get<PaginatedResponse<CarListItem>>(
      '/api/Admin/A_Product/Car',
      {
        params: {
          isDeleted: false,
          ...params,
        },
      }
    );
    return response.data;
  },

  async getCarById(id: string): Promise<any> {
    const response = await apiClient.get<any>('/api/Admin/A_Product/Car', {
      params: {
        Ids: id,
        PageNumber: 1,
        PageSize: 30,
      },
    });
    const items = response.data?.items || [];
    return items.length > 0 ? items[0] : null;
  },

  async createCar(formData: FormData): Promise<any> {
    const response = await apiClient.post('/api/Admin/A_Product/Car', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async updateCar(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/Admin/A_Product/Car', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deleteCar(id: string): Promise<any> {
    const response = await apiClient.delete('/api/Admin/A_Product/Car', {
      data: { id },
    });
    return response.data;
  },

  // ۲. شرکت‌های خودروساز (CarManufacturer)
  async getCarManufacturers(query?: string): Promise<any[]> {
    const response = await apiClient.get<any>('/api/Admin/A_Product/CarManufacturer', {
      params: { Name: query, PageSize: 50, IsDeleted: false },
    });
    return response.data?.items || response.data || [];
  },

  async createCarManufacturer(formData: FormData): Promise<any> {
    const response = await apiClient.post('/api/Admin/A_Product/CarManufacturer', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async updateCarManufacturer(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/Admin/A_Product/CarManufacturer', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deleteCarManufacturer(id: string): Promise<any> {
    const response = await apiClient.delete('/api/Admin/A_Product/CarManufacturer', {
      data: { id },
    });
    return response.data;
  },

  // ۳. انواع خودرو (CarType)
  async getCarTypes(query?: string): Promise<any[]> {
    const response = await apiClient.get<any>('/api/Admin/A_Product/CarType', {
      params: { Name: query, PageSize: 50, IsDeleted: false },
    });
    return response.data?.items || response.data || [];
  },

  async createCarType(formData: FormData): Promise<any> {
    const response = await apiClient.post('/api/Admin/A_Product/CarType', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async updateCarType(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/Admin/A_Product/CarType', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deleteCarType(id: string): Promise<any> {
    const response = await apiClient.delete('/api/Admin/A_Product/CarType', {
      data: { id },
    });
    return response.data;
  },
};