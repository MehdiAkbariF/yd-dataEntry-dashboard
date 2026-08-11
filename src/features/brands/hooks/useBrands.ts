import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { BrandFilterParams } from '../types';

export const useGetBrands = (params: BrandFilterParams) => {
  return useQuery({
    queryKey: ['brands', params],
    queryFn: () => brandService.getBrands(params),
  });
};

export const useGetBrandById = (id: string) => {
  return useQuery({
    queryKey: ['brand', id],
    queryFn: () => brandService.getBrandById(id),
    enabled: !!id,
  });
};

export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => brandService.createBrand(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => brandService.updateBrand(formData),
    onSuccess: (_, variables) => {
      const id = variables.get('Id') as string;
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({ queryKey: ['brand', id] });
    },
  });
};

export const useConfirmBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isConfirmed }: { id: string; isConfirmed: boolean }) =>
      brandService.confirmBrand(id, isConfirmed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};

export const useDeleteBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => brandService.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
    },
  });
};