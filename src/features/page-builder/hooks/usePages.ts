// src/features/page-builder/hooks/usePages.ts

import { useQuery } from '@tanstack/react-query';
import { pageService } from '../services/pageService';
import { FullPage, PageListItem } from '../types/schema.types';

export const pageBuilderKeys = {
  all: ['page-builder'] as const,
  lists: () => [...pageBuilderKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...pageBuilderKeys.lists(), params] as const,
  details: () => [...pageBuilderKeys.all, 'detail'] as const,
  detail: (id: string) => [...pageBuilderKeys.details(), id] as const,
  categories: () => [...pageBuilderKeys.all, 'categories'] as const,
};

export function usePagesList(params?: {
  title?: string;
  pageNumber?: number;
  pageSize?: number;
}) {
  return useQuery<PageListItem[]>({
    queryKey: pageBuilderKeys.list(params),
    queryFn: () => pageService.getList(params),
    staleTime: 30 * 1000,
  });
}

export function usePageDetails(id: string) {
  return useQuery<FullPage | null>({
    queryKey: pageBuilderKeys.detail(id),
    queryFn: () => pageService.getById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function usePageCategories() {
  return useQuery({
    queryKey: pageBuilderKeys.categories(),
    queryFn: () => pageService.getCategories(),
    staleTime: 10 * 60 * 1000,
  });
}