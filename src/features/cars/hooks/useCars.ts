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

// خودروسازان (CarManufacturer)
export const useCreateCarManufacturer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => carService.createCarManufacturer(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['car-manufacturers'] });
    },
  });
};

export const useUpdateCarManufacturer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => carService.updateCarManufacturer(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['car-manufacturers'] });
    },
  });
};

export const useDeleteCarManufacturer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => carService.deleteCarManufacturer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['car-manufacturers'] });
    },
  });
};

// انواع خودرو (CarType)
export const useCreateCarType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => carService.createCarType(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['car-types'] });
    },
  });
};

export const useUpdateCarType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => carService.updateCarType(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['car-types'] });
    },
  });
};

export const useDeleteCarType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => carService.deleteCarType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['car-types'] });
    },
  });
};