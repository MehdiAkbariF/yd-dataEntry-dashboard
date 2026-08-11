import { apiClient } from '@/lib/axios';
import { PaginatedResponse } from '@/types/api';
import { InquiryListItem, InquiryFilterParams } from '@/features/inquiries/types';

export const inquiryService = {
  // دریافت لیست پرسش‌ها
  async getInquiries(params: InquiryFilterParams): Promise<PaginatedResponse<InquiryListItem>> {
    const response = await apiClient.get<PaginatedResponse<InquiryListItem>>(
      '/api/Admin/A_Product/ProductInquiries',
      { params }
    );
    return response.data;
  },

  // تایید پرسش (ConfirmProductInquiry)
  async confirmInquiry(inquiryId: string): Promise<any> {
    const formData = new FormData();
    formData.append('InquiryId', inquiryId);

    const response = await apiClient.put(
      '/api/Admin/A_Product/ConfirmProductInquiry',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },
};