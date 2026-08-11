import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentService } from '@/services/commentService';
import { CommentFilterParams } from '../types';

export const useGetComments = (params: CommentFilterParams) => {
  return useQuery({
    queryKey: ['product-comments', params],
    queryFn: () => commentService.getComments(params),
  });
};

export const useConfirmComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentService.confirmComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-comments'] });
    },
  });
};