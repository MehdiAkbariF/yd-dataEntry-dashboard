import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '@/services/tagService';
import { TagFilterParams } from '../types';

export const useGetTags = (params: TagFilterParams) => {
  return useQuery({
    queryKey: ['tags', params],
    queryFn: () => tagService.getTags(params),
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (value: string) => tagService.createTag(value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) =>
      tagService.updateTag(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tagService.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};