import { BaseFilterParams } from '@/types/api';

export interface PartCategoryListItem {
  id: string;
  name: string;
  englishTitle: string | null;
  thumbnail: string | null;
  thumbnailAlt: string | null;
  icon: string | null;
  parent: string | null;
  isDeleted: boolean;
  isActive: boolean;
  creator: string | null;
  updater: string | null;
}

export interface PartCategoryFilterParams extends BaseFilterParams {
  id?: string;
  name?: string;
  englishTitle?: string;
  thumbnail?: string;
  thumbnailAlt?: string;
  parent?: string;
  creatorId?: string;
  updaterId?: string;
}