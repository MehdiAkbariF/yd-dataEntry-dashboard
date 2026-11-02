// src/features/car-type-part-descriptions/types.ts
import { BaseFilterParams } from '@/types/api';

export interface CarTypeInfo {
  id: string;
  name: string;
  englishTitle: string | null;
  description: string | null;
  isActive: boolean;
  isDeleted: boolean;
}

export interface CarTypePartDescriptionListItem {
  id: string;
  part: string;              // فقط اسم part برمی‌گرده (رشته)
  carType: CarTypeInfo | null;
  creator: string;
  updater: string;
  createDate: string;
  updateDate: string | null;
  qualityAssurerDate: string | null;
  qualityAssurer: string;
  isActive: boolean;
  creatorId: string;
  updaterId: string | null;
}

export interface CarTypePartDescriptionFilterParams extends BaseFilterParams {
  Id?: string;
  PartId?: string;
  CarTypeId?: string;
  Description?: string;
  CreatorId?: string;
  UpdaterId?: string;
  UserId?: string;
  IsActive?: boolean;
  IsDeleted?: boolean;
}

export interface CarTypePartDescriptionDetail {
  id: string;
  partId: string;
  partName?: string;
  carTypeId: string;
  carTypeName?: string;
  description: string;
  descriptionImageFiles?: string[];
  descriptionVideoFiles?: string[];
  seoInformation?: {
    id?: string;
    title?: string;
    description?: string;
    canonicalUrl?: string;
  };
}