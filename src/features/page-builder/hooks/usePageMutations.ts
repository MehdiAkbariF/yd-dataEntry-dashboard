// src/features/page-builder/hooks/usePageMutations.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pageService } from '../services/pageService';
import { CreatePageRequest, UpdatePageRequest } from '../types/schema.types';
import { pageBuilderKeys } from './usePages';

export function useCreatePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      request,
      categoryId,
    }: {
      request: CreatePageRequest;
      categoryId: string;
    }) => pageService.create(request, categoryId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pageBuilderKeys.lists() });
    },
  });
}

export function useUpdatePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdatePageRequest) => pageService.update(request),
    onSuccess: (data) => {
      if (data) {
        qc.invalidateQueries({
          queryKey: pageBuilderKeys.detail(data.meta.id),
        });
      }
      qc.invalidateQueries({ queryKey: pageBuilderKeys.lists() });
    },
  });
}

export function useDeletePage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pageService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: pageBuilderKeys.lists() });
    },
  });
}