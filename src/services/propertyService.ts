import { apiClient } from '@/lib/axios';
import { PaginatedResponse } from '@/types/api';
import {
  PropertyListItem,
  PropertyFilterParams,
  PropertyParentListItem,
  PropertyParentFilterParams,
  PropertyMultiSelectListItem,
  PropertyMultiSelectFilterParams,
} from '@/features/properties/types';

export const propertyService = {
  // --- Properties ---
  async getProperties(params: PropertyFilterParams): Promise<PaginatedResponse<PropertyListItem>> {
    const response = await apiClient.get<PaginatedResponse<PropertyListItem>>(
      '/api/A_Part/Properties',
      { params: { isDeleted: false, ...params } }
    );
    return response.data;
  },

  async createProperty(data: any): Promise<any> {
    const response = await apiClient.post('/api/A_Part/Property', [data]);
    return response.data;
  },

  async updateProperty(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/A_Part/Property', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deleteProperty(id: string): Promise<any> {
    const response = await apiClient.delete('/api/A_Part/Property', { data: { id } });
    return response.data;
  },

  async assignPropertyToPart(partId: string, propertyId: string): Promise<any> {
    const formData = new FormData();
    formData.append('Id', partId);
    formData.append('PropertyId', propertyId);
    const response = await apiClient.put('/api/A_Part/Part', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // --- PropertyParents ---
  async getPropertyParents(params: PropertyParentFilterParams): Promise<PaginatedResponse<PropertyParentListItem>> {
    const response = await apiClient.get<PaginatedResponse<PropertyParentListItem>>(
      '/api/A_Part/PropertyParent',
      { params: { isDeleted: false, ...params } }
    );
    return response.data;
  },

  async createPropertyParent(formData: FormData): Promise<any> {
    const response = await apiClient.post('/api/A_Part/PropertyParent', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async updatePropertyParent(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/A_Part/PropertyParent', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deletePropertyParent(id: string): Promise<any> {
    const response = await apiClient.delete('/api/A_Part/PropertyParent', { data: { id } });
    return response.data;
  },

  // --- PropertyMultiSelect ---
  async getPropertyMultiSelects(params: PropertyMultiSelectFilterParams): Promise<PaginatedResponse<PropertyMultiSelectListItem>> {
    const response = await apiClient.get<PaginatedResponse<PropertyMultiSelectListItem>>(
      '/api/A_Part/PropertyMultiSelect',
      { params: { isDeleted: false, ...params } }
    );
    return response.data;
  },

  async createPropertyMultiSelect(formData: FormData): Promise<any> {
    const response = await apiClient.post('/api/A_Part/PropertyMultiSelect', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async updatePropertyMultiSelect(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/A_Part/PropertyMultiSelect', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deletePropertyMultiSelect(id: string): Promise<any> {
    const response = await apiClient.delete('/api/A_Part/PropertyMultiSelect', { data: { id } });
    return response.data;
  },
};