import { BaseFilterParams } from '@/types/api';

export interface CarListItem {
  id: string;
  carTypeId: string;
  carManufacturerId: string;
  model: string;
  englishTitle: string | null;
  isAutomatic: boolean;
  cover: string | null;
  coverAlt: string | null;
  description: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createDate: string;
  updateDate: string | null;
  creator: any;
  updater: any;
  carType: {
    id: string;
    name: string;
    englishTitle: string;
  } | null;
  carManufacturer: {
    id: string;
    name: string;
    englishTitle: string;
    icon: string | null;
  } | null;
  seoInformation: {
    id: string;
    title: string;
    description: string;
    canonicalUrl: string;
  } | null;
}

export interface CarFilterParams extends BaseFilterParams {
  ids?: string[];
  carTypeId?: string;
  carManufacturerId?: string;
  vehicleType?: 'خودروسبک' | 'خودروسنگین';
  model?: string;
  englishTitle?: string;
  isAutomatic?: boolean;
  seoInformationId?: string;
  description?: string;
  creatorId?: string;
  updaterId?: string;
}