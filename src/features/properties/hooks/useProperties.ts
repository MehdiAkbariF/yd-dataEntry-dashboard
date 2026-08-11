import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/services/propertyService';
import { PropertyFilterParams, PropertyParentFilterParams } from '../types';

export const useGetProperties = (params: PropertyFilterParams) => {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => propertyService.getProperties(params),
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => propertyService.createProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => propertyService.updateProperty(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => propertyService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

// گروه‌های اصلی PropertyParent
export const useGetPropertyParents = (params: PropertyParentFilterParams) => {
  return useQuery({
    queryKey: ['property-parents', params],
    queryFn: () => propertyService.getPropertyParents(params),
  });
};

export const useCreatePropertyParent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => propertyService.createPropertyParent(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-parents'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useUpdatePropertyParent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => propertyService.updatePropertyParent(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-parents'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useDeletePropertyParent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => propertyService.deletePropertyParent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['property-parents'] });
    },
  });
};