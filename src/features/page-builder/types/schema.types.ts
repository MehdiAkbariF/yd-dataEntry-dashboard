// src/features/page-builder/types/schema.types.ts

export interface PageContent {
  html: string;
  css: string;
}

export type PageStatus = 'draft' | 'published' | 'archived';

export interface PageSeo {
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
}

export interface PageMeta {
  id: string;
  slug: string;
  title: string;
  englishTitle: string;
  url: string;
  seo: PageSeo | null;
  status: PageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FullPage {
  meta: PageMeta;
  content: PageContent;
}

export interface PageListItem {
  id: string;
  slug: string;
  title: string;
  status: PageStatus;
  updatedAt: string;
}

export interface CreatePageRequest {
  meta: {
    slug: string;
    title: string;
    englishTitle: string;
    seo?: Partial<PageSeo>;
  };
  content: PageContent;
}

export interface UpdatePageRequest {
  id: string;
  meta?: {
    slug?: string;
    title?: string;
    englishTitle?: string;
    seo?: Partial<PageSeo>;
  };
  content?: PageContent;
}

export interface PageApiResponse {
  id: string;
  slug: string;
  title: string;
  englishTitle: string;
  url: string;
  content: string; // JSON: { html, css }
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