import { apiClient } from '@/lib/axios';
import { PaginatedResponse } from '@/types/api';

export interface UserItem {
  id: string;
  userName: string;
  fullName: string | null;
  phoneNumber: string;
}

export const userService = {
  // گرفتن لیست کاربران برای دراپ‌داون‌های فیلتر
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
    return response.data.items || [];
  },
};