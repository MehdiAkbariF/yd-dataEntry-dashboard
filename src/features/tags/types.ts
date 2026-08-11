import { BaseFilterParams } from '@/types/api';

export interface TagListItem {
  id: string;
  value: string;
  ip: string;
  creatorId: string | null;
  updaterId: string | null;
  createDate: string;
  updateDate: string | null;
  removeDate: string | null;
  isActive: boolean;
  isDeleted: boolean;
  creator: any;
  updater: any;
}

export interface TagFilterParams extends BaseFilterParams {
  id?: string;
  value?: string;
}