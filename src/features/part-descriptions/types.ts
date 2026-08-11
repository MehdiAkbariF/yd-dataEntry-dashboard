import { BaseFilterParams } from '@/types/api';

export interface PartCarDescriptionListItem {
  id: string;
  part: string;
  cars: {
    id: string;
    model: string;
    englishTitle: string;
    cover: string | null;
  }[];
  creator: string;
  updater: string;
  createDate: string;
  updateDate: string | null;
  isActive: boolean;
}

export interface CarTypePartDescriptionListItem {
  id: string;
  part: string;
  carType: {
    id: string;
    name: string;
    englishTitle: string;
  } | null;
  creator: string;
  updater: string;
  createDate: string;
  updateDate: string | null;
  isActive: boolean;
}

export interface PartDescriptionFilterParams extends BaseFilterParams {
  id?: string;
  partId?: string;
  carId?: string;
  carTypeId?: string;
  description?: string;
  searchedValue?: string;
  creatorId?: string;
  updaterId?: string;
}