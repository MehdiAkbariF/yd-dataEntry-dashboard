// src/features/car-type-part-descriptions/hooks/useCarTypePartDescriptions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import {
  CarTypePartDescriptionFilterParams,
  CarTypePartDescriptionListItem,
  CarTypePartDescriptionDetail,
} from '../types';

const BASE = '/api/A_Part/CarTypePartDescription';
const BASE_LIST = '/api/A_Part/CarTypePartDescriptionList';

interface ListResponse {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  items: CarTypePartDescriptionListItem[];
}

export const carTypePartDescriptionService = {
  getList: async (params: CarTypePartDescriptionFilterParams): Promise<ListResponse> => {
    const res = await apiClient.get<ListResponse>(BASE_LIST, { params });
    return res.data;
  },

  getById: async (id: string): Promise<CarTypePartDescriptionDetail> => {
    const res = await apiClient.get<CarTypePartDescriptionDetail>(BASE, {
      params: { Id: id },
    });
    return res.data;
  },

  create: async (formData: FormData) => {
    const res = await apiClient.post(BASE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  update: async (formData: FormData) => {
    const res = await apiClient.put(BASE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  delete: async (id: string) => {
    const res = await apiClient.delete(BASE, { data: { id } });
    return res.data;
  },

  toggleActive: async (id: string, isActive: boolean) => {
    const fd = new FormData();
    fd.append('Id', id);
    fd.append('IsActive', String(isActive));
    const res = await apiClient.put(
      '/api/A_Part/UpdateCarTypePartDescriptionActiveStatus',
      fd,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return res.data;
  },
};

// ─── Queries & Mutations ───────────────────────────────────────────

export const useGetCarTypePartDescriptions = (
  params: CarTypePartDescriptionFilterParams
) =>
  useQuery({
    queryKey: ['car-type-part-descriptions', params],
    queryFn: () => carTypePartDescriptionService.getList(params),
  });

export const useGetCarTypePartDescriptionById = (id: string) =>
  useQuery({
    queryKey: ['car-type-part-description', id],
    queryFn: () => carTypePartDescriptionService.getById(id),
    enabled: !!id,
  });

export const useCreateCarTypePartDescription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fd: FormData) => carTypePartDescriptionService.create(fd),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['car-type-part-descriptions'] }),
  });
};

export const useUpdateCarTypePartDescription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (fd: FormData) => carTypePartDescriptionService.update(fd),
    onSuccess: (_, fd) => {
      const id = fd.get('Id') as string;
      qc.invalidateQueries({ queryKey: ['car-type-part-descriptions'] });
      qc.invalidateQueries({ queryKey: ['car-type-part-description', id] });
    },
  });
};

export const useDeleteCarTypePartDescription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => carTypePartDescriptionService.delete(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['car-type-part-descriptions'] }),
  });
};

export const useToggleCarTypePartDescriptionStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      carTypePartDescriptionService.toggleActive(id, isActive),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ['car-type-part-descriptions'] }),
  });
};