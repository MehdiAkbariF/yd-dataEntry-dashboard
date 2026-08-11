import { BaseFilterParams } from '@/types/api';

export interface CommentListItem {
  id: string;
  productId: string;
  comment: string;
  commentCreator: string;
  rate: number | null;
  likes: number;
  dislikes: number;
  parentId: string | null;
  isConfirmed: boolean;
  isSellerComment: boolean;
  isBuyerUser: boolean;
  isIncognito: boolean;
  createDate: string;
  product?: {
    id: string;
    productCode: number;
    title: string;
    englishTitle: string;
    image: string | null;
  } | null;
}

export interface CommentFilterParams extends BaseFilterParams {
  productId?: string;
  searchedValue?: string;
  isConfirmed?: boolean;
  isReply?: boolean;
  isIncognito?: boolean;
}