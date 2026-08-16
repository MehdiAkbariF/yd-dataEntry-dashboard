import { BaseFilterParams } from '@/types/api';

export interface PropertyListItem {
  id: string;
  priority: number;
  type: 'Input' | 'MultiSelect' | string;
  name: string;
  unitId: string | null;
  unit: string | null;
  propertyParentId: string;
  propertyParent: {
    id: string;
    name: string;
    priority: number;
  } | null;
  isMain: boolean;
  isFilter: boolean;
  isSearch: boolean;
  isActive: boolean;
  isDeleted: boolean;
  partsCount?: number;
}

export interface PropertyParentListItem {
  id: string;
  priority: number;
  icon: string | null;
  iconAlt: string | null;
  name: string;
  isActive: boolean;
  isDeleted: boolean;
  createDate: string;
  creator?: any;
  updater?: any;
}

export interface PropertyMultiSelectListItem {
  id: string;
  propertyId: string;
  value: string;
  isActive: boolean;
  isDeleted: boolean;
  createDate: string;
  property: PropertyListItem | null;
  creator?: any;
}

export interface PropertyFilterParams extends BaseFilterParams {
  id?: string;
  priority?: number;
  type?: string;
  name?: string;
  isMain?: boolean;
  isFilter?: boolean;
  isSearch?: boolean;
  parentId?: string;
}

export interface PropertyParentFilterParams extends BaseFilterParams {
  id?: string;
  priority?: number;
  name?: string;
}

export interface PropertyMultiSelectFilterParams extends BaseFilterParams {
  id?: string;
  propertyId?: string;
  value?: string;
}