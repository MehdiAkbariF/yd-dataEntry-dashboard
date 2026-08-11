import { apiClient } from '@/lib/axios';
import { PaginatedResponse } from '@/types/api';
import { CommentListItem, CommentFilterParams } from '@/features/comments/types';

export const commentService = {
  // دریافت لیست دیدگاه‌ها
  async getComments(params: CommentFilterParams): Promise<PaginatedResponse<CommentListItem>> {
    const response = await apiClient.get<PaginatedResponse<CommentListItem>>(
      '/api/Admin/A_Product/ProductComments',
      { params }
    );
    return response.data;
  },

  // تایید دیدگاه (ConfirmProductComment)
  async confirmComment(commentId: string): Promise<any> {
    const formData = new FormData();
    formData.append('CommentId', commentId);

    const response = await apiClient.put(
      '/api/Admin/A_Product/ConfirmProductComment',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },
};