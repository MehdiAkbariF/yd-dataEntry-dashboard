import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partCategoryService } from '@/services/partCategoryService';
import { PartCategoryFilterParams } from '../types';

export const useGetPartCategories = (params: PartCategoryFilterParams) => {
  return useQuery({
    queryKey: ['part-categories', params],
    queryFn: () => partCategoryService.getCategories(params),
  });
};

export const useGetPartCategoryById = (id: string) => {
  return useQuery({
    queryKey: ['part-category', id],
    queryFn: () => partCategoryService.getCategoryById(id),
    enabled: !!id,
  });
};

export const useCreatePartCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => partCategoryService.createCategory(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['part-categories'] });
    },
  });
};

export const useUpdatePartCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => partCategoryService.updateCategory(formData),
    onSuccess: (_, variables) => {
      const id = variables.get('Id') as string;
      queryClient.invalidateQueries({ queryKey: ['part-categories'] });
      queryClient.invalidateQueries({ queryKey: ['part-category', id] });
    },
  });
};

export const useDeletePartCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partCategoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['part-categories'] });
    },
  });
};