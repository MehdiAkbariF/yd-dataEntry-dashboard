import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partService } from '@/services/partService';
import { PartFilterParams } from '../types';

export const useGetParts = (params: PartFilterParams) => {
  return useQuery({
    queryKey: ['parts', params],
    queryFn: () => partService.getParts(params),
  });
};

export const useGetPartById = (id: string) => {
  return useQuery({
    queryKey: ['part', id],
    queryFn: () => partService.getPartById(id),
    enabled: !!id,
  });
};

export const useTogglePartStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      partService.toggleActiveStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
    },
  });
};

export const useDeletePart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partService.deletePart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
    },
  });
};

export const useCreatePart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => partService.createPart(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
    },
  });
};

export const useUpdatePart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => partService.updatePart(formData),
    onSuccess: (_, variables) => {
      const id = variables.get('Id') as string;
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      queryClient.invalidateQueries({ queryKey: ['part', id] });
    },
  });
};