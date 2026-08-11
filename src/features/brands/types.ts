import { BaseFilterParams } from '@/types/api';

export interface BrandListItem {
  id: string;
  name: string;
  englishTitle: string | null;
  image: string | null;
  imageAlt: string | null;
  country: string | null;
  countryId: string | null;
  isInMain: boolean;
  isConfirmed: boolean | null;
  isActive: boolean;
}

export interface BrandFilterParams extends BaseFilterParams {
  ids?: string[];
  name?: string;
  englishTitle?: string;
  countryId?: string;
  creatorId?: string;
  updaterId?: string;
  isInMain?: boolean;
  isConfirmed?: boolean;
}