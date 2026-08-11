import { apiClient } from '@/lib/axios';
import { PaginatedResponse } from '@/types/api';
import { TagListItem, TagFilterParams } from '@/features/tags/types';

export const tagService = {
  // دریافت لیست تگ‌ها با پیش‌فرض IsDeleted = false
  async getTags(params: TagFilterParams): Promise<PaginatedResponse<TagListItem>> {
    const response = await apiClient.get<PaginatedResponse<TagListItem>>(
      '/api/A_Part/Tag',
      {
        params: {
          isDeleted: false, // ⚠️ پیش‌فرض
          ...params,
        },
      }
    );
    return response.data;
  },

  // ایجاد تگ جدید
  async createTag(value: string): Promise<any> {
    const response = await apiClient.post('/api/A_Part/Tag', { value });
    return response.data;
  },

  // ویرایش تگ
  async updateTag(id: string, value: string): Promise<any> {
    const response = await apiClient.put('/api/A_Part/Tag', { id, value });
    return response.data;
  },

  // حذف تگ
  async deleteTag(id: string): Promise<any> {
    const response = await apiClient.delete('/api/A_Part/Tag', {
      data: { id },
    });
    return response.data;
  },
};