import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { partDescriptionService } from '@/services/partDescriptionService';
import { PartDescriptionFilterParams } from '../types';

export const useGetPartCarDescriptions = (params: PartDescriptionFilterParams) => {
  return useQuery({
    queryKey: ['part-car-descriptions', params],
    queryFn: () => partDescriptionService.getPartCarDescriptions(params),
  });
};

export const useGetPartCarDescriptionById = (id: string) => {
  return useQuery({
    queryKey: ['part-car-description', id],
    queryFn: () => partDescriptionService.getPartCarDescriptionById(id),
    enabled: !!id,
  });
};

export const useTogglePartCarDescriptionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      partDescriptionService.togglePartCarDescriptionStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['part-car-descriptions'] });
    },
  });
};

export const useDeletePartCarDescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => partDescriptionService.deletePartCarDescription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['part-car-descriptions'] });
    },
  });
};

// برای CarTypePartDescription
export const useGetCarTypePartDescriptions = (params: PartDescriptionFilterParams) => {
  return useQuery({
    queryKey: ['car-type-part-descriptions', params],
    queryFn: () => partDescriptionService.getCarTypePartDescriptions(params),
  });
};

export const useGetCarTypePartDescriptionById = (id: string) => {
  return useQuery({
    queryKey: ['car-type-part-description', id],
    queryFn: () => partDescriptionService.getCarTypePartDescriptionById(id),
    enabled: !!id,
  });
};

export const useCreatePartDescription = (type: 'car' | 'carType') => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      type === 'car'
        ? partDescriptionService.createPartCarDescription(formData)
        : partDescriptionService.createCarTypePartDescription(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['part-car-descriptions'] });
      queryClient.invalidateQueries({ queryKey: ['car-type-part-descriptions'] });
    },
  });
};

export const useUpdatePartDescription = (type: 'car' | 'carType') => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      type === 'car'
        ? partDescriptionService.updatePartCarDescription(formData)
        : partDescriptionService.updateCarTypePartDescription(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['part-car-descriptions'] });
      queryClient.invalidateQueries({ queryKey: ['car-type-part-descriptions'] });
    },
  });
};