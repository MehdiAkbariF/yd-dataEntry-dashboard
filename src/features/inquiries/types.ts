import { BaseFilterParams } from '@/types/api';

export interface InquiryListItem {
  id: string;
  productId: string;
  comment: string;
  inquiryCreator: string;
  parentId: string | null;
  replyCount: number;
  isConfirmed: boolean;
  likes: number;
  dislikes: number;
  isSellerComment: boolean;
  isBuyerUser: boolean;
  createDate: string;
  product?: {
    id: string;
    productCode: number;
    title: string;
    englishTitle: string;
    image: string | null;
  } | null;
}

export interface InquiryFilterParams extends BaseFilterParams {
  productId?: string;
  searchedValue?: string;
  isConfirmed?: boolean;
  isReply?: boolean;
}