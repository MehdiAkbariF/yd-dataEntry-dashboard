// src/features/page-builder/types/schema.types.ts

import type { Data as PuckData } from '@measured/puck';

/**
 * Schema خروجی Puck
 * این همون چیزیه که در DB ذخیره میشه
 */
export type PageSchema = PuckData;

/**
 * وضعیت صفحه
 */
export type PageStatus = 'draft' | 'published' | 'archived';

/**
 * اطلاعات SEO صفحه
 */
export interface PageSeo {
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
}

/**
 * متادیتای صفحه (جدا از Puck)
 */
export interface PageMeta {
  id: string;
  slug: string;
  title: string;
  englishTitle: string;
  url: string;
  seo: PageSeo | null;
  status: PageStatus;
  version: number;
  authorId: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * صفحه کامل = Meta + Schema
 */
export interface FullPage {
  meta: PageMeta;
  schema: PageSchema;
}

/**
 * آیتم لیست صفحات
 */
export interface PageListItem {
  id: string;
  slug: string;
  title: string;
  status: PageStatus;
  version: number;
  updatedAt: string;
  authorName: string;
}

/**
 * درخواست ساخت صفحه جدید
 */
export interface CreatePageRequest {
  meta: {
    slug: string;
    title: string;
    englishTitle: string;
    seo?: Partial<PageSeo>;
  };
  schema: PageSchema;
}

/**
 * درخواست ویرایش صفحه
 */
export interface UpdatePageRequest {
  id: string;
  meta?: Partial<Omit<PageMeta, 'id' | 'createdAt'>>;
  schema?: PageSchema;
}

/**
 * پاسخ API
 */
export interface PageApiResponse {
  id: string;
  slug: string;
  title: string;
  englishTitle: string;
  url: string;
  content: string; // JSON stringified Puck Data
  seoInformation: {
    id: string;
    title: string;
    description: string;
    keywords?: string;
    canonicalUrl?: string;
  } | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}