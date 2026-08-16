import { apiClient } from '@/lib/axios';
import { PaginatedResponse } from '@/types/api';

export interface UserItem {
  id: string;
  userName: string;
  fullName: string | null;
  phoneNumber: string;
  status?: string;
  email?: string | null;
  roles?: any[];
}

export const userService = {
  // دریافت لیست کاربران برای دراپ‌داون‌ها
  async getUsers(searchedValue?: string): Promise<UserItem[]> {
    const response = await apiClient.get<PaginatedResponse<UserItem>>(
      '/api/Admin/A_User/Users',
      {
        params: {
          PageNumber: 1,
          PageSize: 50,
          SearchedValue: searchedValue || undefined,
        },
      }
    );
    return response.data?.items || [];
  },

  // ⚠️ دریافت اطلاعات کامل پروفایل یک کاربر با Id
  async getUserById(id: string): Promise<UserItem> {
    const response = await apiClient.get<UserItem>('/api/Admin/A_User/User', {
      params: { Id: id },
    });
    return response.data;
  },
};