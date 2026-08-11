import { apiClient } from '@/lib/axios';
import { PaginatedResponse } from '@/types/api';
import {
  PropertyListItem,
  PropertyFilterParams,
  PropertyParentListItem,
  PropertyParentFilterParams,
} from '@/features/properties/types';

export const propertyService = {
  // دریافت لیست ویژگی‌ها (Properties)
  async getProperties(params: PropertyFilterParams): Promise<PaginatedResponse<PropertyListItem>> {
    const response = await apiClient.get<PaginatedResponse<PropertyListItem>>(
      '/api/A_Part/Properties',
      {
        params: {
          isDeleted: false,
          ...params,
        },
      }
    );
    return response.data;
  },

  // ایجاد ویژگی جدید (application/json)
  async createProperty(data: any): Promise<any> {
    const response = await apiClient.post('/api/A_Part/Property', [data]);
    return response.data;
  },

  // ویرایش ویژگی (multipart/form-data)
  async updateProperty(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/A_Part/Property', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // حذف ویژگی
  async deleteProperty(id: string): Promise<any> {
    const response = await apiClient.delete('/api/A_Part/Property', {
      data: { id },
    });
    return response.data;
  },

  // دریافت لیست گروه‌های اصلی (PropertyParent)
  async getPropertyParents(params: PropertyParentFilterParams): Promise<PaginatedResponse<PropertyParentListItem>> {
    const response = await apiClient.get<PaginatedResponse<PropertyParentListItem>>(
      '/api/A_Part/PropertyParent',
      {
        params: {
          isDeleted: false,
          ...params,
        },
      }
    );
    return response.data;
  },

  // ایجاد گروه ویژگی جدید (multipart/form-data)
  async createPropertyParent(formData: FormData): Promise<any> {
    const response = await apiClient.post('/api/A_Part/PropertyParent', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ویرایش گروه ویژگی (multipart/form-data)
  async updatePropertyParent(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/A_Part/PropertyParent', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // حذف گروه ویژگی
  async deletePropertyParent(id: string): Promise<any> {
    const response = await apiClient.delete('/api/A_Part/PropertyParent', {
      data: { id },
    });
    return response.data;
  },
};