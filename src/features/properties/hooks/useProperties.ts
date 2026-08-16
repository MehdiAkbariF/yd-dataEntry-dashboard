import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '@/services/propertyService';
import { PropertyFilterParams, PropertyParentFilterParams, PropertyMultiSelectFilterParams } from '../types';

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => propertyService.updateProperty(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => propertyService.deleteProperty(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
  });
};

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['property-parents'] }),
  });
};

// --- Property Multi Select Hooks ---
export const useGetPropertyMultiSelects = (params: PropertyMultiSelectFilterParams) => {
  return useQuery({
    queryKey: ['property-multi-selects', params],
    queryFn: () => propertyService.getPropertyMultiSelects(params),
  });
};

export const useCreatePropertyMultiSelect = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => propertyService.createPropertyMultiSelect(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['property-multi-selects'] }),
  });
};

export const useUpdatePropertyMultiSelect = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => propertyService.updatePropertyMultiSelect(formData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['property-multi-selects'] }),
  });
};

export const useDeletePropertyMultiSelect = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => propertyService.deletePropertyMultiSelect(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['property-multi-selects'] }),
  });
};