import { apiClient } from '@/lib/axios';
import { PaginatedResponse } from '@/types/api';
import {
  BlogCategoryListItem,
  BlogCategoryFilterParams,
  BlogPostListItem,
  BlogPostFilterParams,
  BlogPostCommentListItem,
  BlogPostCommentFilterParams,
} from '@/features/blogs/types';

export const blogService = {
  // ==========================================
  // 1. دسته‌بندی بلاگ (A_BlogCategory)
  // ==========================================
  async getCategories(params: BlogCategoryFilterParams): Promise<PaginatedResponse<BlogCategoryListItem>> {
    const response = await apiClient.get<PaginatedResponse<BlogCategoryListItem>>(
      '/api/A_BlogCategory/BlogCategories',
      {
        params: {
          isDeleted: false,
          ...params,
        },
      }
    );
    return response.data;
  },

  async getCategoryById(id: string): Promise<BlogCategoryListItem> {
    const response = await apiClient.get<BlogCategoryListItem>('/api/A_BlogCategory/BlogCategory', {
      params: { Id: id },
    });
    return response.data;
  },

  async createCategory(formData: FormData): Promise<any> {
    const response = await apiClient.post('/api/A_BlogCategory/BlogCategory', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async updateCategory(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/A_BlogCategory/BlogCategory', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deleteCategory(id: string): Promise<any> {
    const response = await apiClient.delete('/api/A_BlogCategory/BlogCategory', {
      data: { id },
    });
    return response.data;
  },

  // ==========================================
  // 2. مقالات بلاگ (A_BlogPost)
  // ==========================================
  async getPosts(params: BlogPostFilterParams): Promise<PaginatedResponse<BlogPostListItem>> {
    const response = await apiClient.get<PaginatedResponse<BlogPostListItem>>(
      '/api/A_BlogPost/BlogPosts',
      {
        params: {
          isDeleted: false,
          ...params,
        },
      }
    );
    return response.data;
  },

  async getPostById(id: string): Promise<BlogPostListItem> {
    const response = await apiClient.get<BlogPostListItem>('/api/A_BlogPost/BlogPost', {
      params: { Id: id },
    });
    return response.data;
  },

  async createPost(formData: FormData): Promise<any> {
    const response = await apiClient.post('/api/A_BlogPost/BlogPost', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async updatePost(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/A_BlogPost/BlogPost', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deletePost(id: string): Promise<any> {
    const response = await apiClient.delete('/api/A_BlogPost/BlogPost', {
      data: { id },
    });
    return response.data;
  },

  async publishPost(id: string): Promise<any> {
    const response = await apiClient.put('/api/A_BlogPost/PublishBlogPost', { id });
    return response.data;
  },

  // متدهای اتصال اضافی پست
  async savePostFAQs(blogPostId: string, faQs: { question: string; answer: string }[]): Promise<any> {
    const response = await apiClient.post('/api/A_BlogPost/BlogPostFAQs', { blogPostId, faQs });
    return response.data;
  },

  async deletePostFAQs(ids: string[]): Promise<any> {
    const response = await apiClient.delete('/api/A_BlogPost/BlogPostFAQs', { data: { ids } });
    return response.data;
  },

  async setPostCarTypes(blogPostId: string, carTypeIds: string[]): Promise<any> {
    const response = await apiClient.post('/api/A_BlogPost/BlogPostCarTypes', { blogPostId, carTypeIds });
    return response.data;
  },

  async setPostParts(blogPostId: string, partIds: string[]): Promise<any> {
    const response = await apiClient.post('/api/A_BlogPost/BlogPostParts', { blogPostId, partIds });
    return response.data;
  },

  // ==========================================
  // 3. دیدگاه‌های بلاگ (A_BlogPostComment)
  // ==========================================
  async getComments(params: BlogPostCommentFilterParams): Promise<PaginatedResponse<BlogPostCommentListItem>> {
    const response = await apiClient.get<PaginatedResponse<BlogPostCommentListItem>>(
      '/api/A_BlogPostComment/BlogPostComments',
      {
        params: {
          isDeleted: false,
          ...params,
        },
      }
    );
    return response.data;
  },

  async getCommentById(id: string): Promise<BlogPostCommentListItem> {
    const response = await apiClient.get<BlogPostCommentListItem>('/api/A_BlogPostComment/BlogPostComment', {
      params: { Id: id },
    });
    return response.data;
  },

  async confirmComment(commentId: string): Promise<any> {
    const formData = new FormData();
    formData.append('CommentId', commentId);
    const response = await apiClient.put('/api/A_BlogPostComment/ConfirmBlogPostComment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async replyComment(blogPostCommentId: string, comment: string): Promise<any> {
    const formData = new FormData();
    formData.append('BlogPostCommentId', blogPostCommentId);
    formData.append('Comment', comment);
    const response = await apiClient.post('/api/A_BlogPostComment/ReplyBlogPostComment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};