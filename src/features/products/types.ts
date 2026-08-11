import { BaseFilterParams } from '@/types/api';

export interface ProductListItem {
  id: string;
  productCode: number;
  title: string;
  englishTitle: string | null;
  image: string | null;
  imageAlt: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  createDate: string;
  updateDate: string | null;
  creator: string;
  updater: string;
  qualityAssurer: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface ProductFilterParams extends BaseFilterParams {
  title?: string;
  productCode?: number | string;
  hasSeo?: boolean;
  brandId?: string;
  partId?: string;
  carId?: string;
}