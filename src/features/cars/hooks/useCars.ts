import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carService } from '@/services/carService';
import { CarFilterParams } from '../types';

export const useGetCars = (params: CarFilterParams) => {
  return useQuery({
    queryKey: ['cars', params],
    queryFn: () => carService.getCars(params),
  });
};

export const useGetCarById = (id: string) => {
  return useQuery({
    queryKey: ['car', id],
    queryFn: () => carService.getCarById(id),
    enabled: !!id,
  });
};

export const useCreateCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => carService.createCar(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
};

export const useUpdateCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => carService.updateCar(formData),
    onSuccess: (_, variables) => {
      const id = variables.get('Id') as string;
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['car', id] });
    },
  });
};

export const useDeleteCar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => carService.deleteCar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
};