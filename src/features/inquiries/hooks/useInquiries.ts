import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inquiryService } from '@/services/inquiryService';
import { InquiryFilterParams } from '../types';

export const useGetInquiries = (params: InquiryFilterParams) => {
  return useQuery({
    queryKey: ['product-inquiries', params],
    queryFn: () => inquiryService.getInquiries(params),
  });
};

export const useConfirmInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (inquiryId: string) => inquiryService.confirmInquiry(inquiryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-inquiries'] });
    },
  });
};