import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '@/services/blogService';
import {
  BlogCategoryFilterParams,
  BlogPostFilterParams,
  BlogPostCommentFilterParams,
} from '../types';

// =======================
// دسته‌بندی‌ها
// =======================
export const useGetBlogCategories = (params: BlogCategoryFilterParams) => {
  return useQuery({
    queryKey: ['blog-categories', params],
    queryFn: () => blogService.getCategories(params),
  });
};

export const useGetBlogCategoryById = (id: string) => {
  return useQuery({
    queryKey: ['blog-category', id],
    queryFn: () => blogService.getCategoryById(id),
    enabled: !!id,
  });
};

export const useCreateBlogCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => blogService.createCategory(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog-categories'] }),
  });
};

export const useUpdateBlogCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => blogService.updateCategory(formData),
    onSuccess: (_, variables) => {
      const id = variables.get('Id') as string;
      queryClient.invalidateQueries({ queryKey: ['blog-categories'] });
      if (id) queryClient.invalidateQueries({ queryKey: ['blog-category', id] });
    },
  });
};

export const useDeleteBlogCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogService.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog-categories'] }),
  });
};

// =======================
// مقالات
// =======================
export const useGetBlogPosts = (params: BlogPostFilterParams) => {
  return useQuery({
    queryKey: ['blog-posts', params],
    queryFn: () => blogService.getPosts(params),
  });
};

export const useGetBlogPostById = (id: string) => {
  return useQuery({
    queryKey: ['blog-post', id],
    queryFn: () => blogService.getPostById(id),
    enabled: !!id,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => blogService.createPost(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog-posts'] }),
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => blogService.updatePost(formData),
    onSuccess: (_, variables) => {
      const id = variables.get('Id') as string;
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      if (id) queryClient.invalidateQueries({ queryKey: ['blog-post', id] });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogService.deletePost(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog-posts'] }),
  });
};

export const usePublishBlogPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blogService.publishPost(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog-posts'] }),
  });
};

// =======================
// نظرات بلاگ
// =======================
export const useGetBlogComments = (params: BlogPostCommentFilterParams) => {
  return useQuery({
    queryKey: ['blog-comments', params],
    queryFn: () => blogService.getComments(params),
  });
};

export const useConfirmBlogComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => blogService.confirmComment(commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog-comments'] }),
  });
};

export const useReplyBlogComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, replyText }: { commentId: string; replyText: string }) =>
      blogService.replyComment(commentId, replyText),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blog-comments'] }),
  });
};