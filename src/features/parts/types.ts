import { BaseFilterParams } from '@/types/api';

export interface PartListItem {
  id: string;
  name: string;
  englishTitle: string | null;
  productNameEntryStandard: string | null;
  icon: string | null;
  partCategoryId: string;
  partCategory: string;
  yadakchiProfitPercent: number;
  isDeleted: boolean;
  creator: string;
  updater: string;
  qualityAssurer: string;
  qualityAssurerDate: string | null;
  isActive: boolean;
}

export interface PartFilterParams extends BaseFilterParams {
  id?: string;
  name?: string;
  englishTitle?: string;
  description?: string;
  hasSeo?: boolean;
  hasDescription?: boolean;
  creatorId?: string;
  updaterId?: string;
  partCategoryId?: string;
}