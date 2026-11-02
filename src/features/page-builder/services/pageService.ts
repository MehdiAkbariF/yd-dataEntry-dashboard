// src/features/page-builder/services/pageService.ts
import { apiClient } from '@/lib/axios';
import {
  FullPage,
  PageListItem,
  CreatePageRequest,
  UpdatePageRequest,
  PageContent,
  PageApiResponse,
} from '../types/schema.types';
import { isLegacyPuckContent, migratePuckToHtml } from '../lib/legacyMigration';

const API = {
  STATIC_PAGES: '/api/Admin/A_Miscellanies/StaticPages',
  STATIC_PAGE: '/api/Admin/A_Miscellanies/StaticPage',
  STATIC_PAGE_CATEGORIES: '/api/Admin/A_Miscellanies/StaticPageCategories',
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

function serializeContent(content: PageContent): string {
  return JSON.stringify({
    html: content.html || '',
    css: content.css || '',
  });
}

/**
 * تبدیل رشته content ذخیره‌شده در DB به PageContent
 * - اگر Puck قدیمی است → مهاجرت به HTML/CSS
 * - اگر JSON { html, css } است → همان
 * - اگر HTML خام است → html = raw، css = ''
 */
function parseContent(raw: string): PageContent {
  if (!raw) return { html: '', css: '' };

  // ① Puck قدیمی → مهاجرت
  if (isLegacyPuckContent(raw)) {
    console.warn('[pageService] Legacy Puck content detected → migrating');
    return migratePuckToHtml(raw);
  }

  // ② تلاش برای JSON { html, css }
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null) {
      return {
        html: typeof parsed.html === 'string' ? parsed.html : '',
        css: typeof parsed.css === 'string' ? parsed.css : '',
      };
    }
  } catch {
    // ③ HTML خام
    return { html: raw, css: '' };
  }

  return { html: '', css: '' };
}

// ─────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────

export const pageService = {
  /**
   * دریافت لیست صفحات
   */
  async getList(params?: {
    title?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PageListItem[]> {
    try {
      const response = await apiClient.get<{
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalCount: number;
        items: Array<{
          id: string;
          title: string;
          englishTitle: string;
          url: string;
        }>;
      }>(API.STATIC_PAGES, {
        params: {
          Title: params?.title || '',
          PageNumber: params?.pageNumber || 1,
          PageSize: params?.pageSize || 100,
        },
      });

      return (response.data.items || []).map((item) => ({
        id: item.id,
        slug: item.englishTitle,
        title: item.title,
        status: 'published' as const,
        updatedAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('[pageService] getList failed:', error);
      return [];
    }
  },

  /**
   * دریافت یک صفحه با ID
   */
  async getById(id: string): Promise<FullPage | null> {
    try {
      const response = await apiClient.get<PageApiResponse>(API.STATIC_PAGE, {
        params: { Id: id },
      });
      const data = response.data;
      if (!data || !data.id) return null;

      return {
        meta: {
          id: data.id,
          slug: data.englishTitle,
          title: data.title,
          englishTitle: data.englishTitle,
          url: data.url,
          seo: data.seoInformation
            ? {
                metaTitle: data.seoInformation.title || null,
                metaDescription: data.seoInformation.description || null,
                metaKeywords: data.seoInformation.keywords || null,
                canonicalUrl: data.seoInformation.canonicalUrl || null,
                ogImage: null,
              }
            : null,
          status: 'published',
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        },
        content: parseContent(data.content),
      };
    } catch (error) {
      console.error('[pageService] getById failed:', error);
      return null;
    }
  },

  /**
   * دریافت یک صفحه با slug (englishTitle)
   */
  async getBySlug(slug: string): Promise<FullPage | null> {
    try {
      const list = await this.getList({ pageSize: 500 });
      const found = list.find((p) => p.slug === slug);
      if (!found) return null;
      return this.getById(found.id);
    } catch {
      return null;
    }
  },

  /**
   * ساخت صفحه جدید
   */
  async create(
    request: CreatePageRequest,
    categoryId: string
  ): Promise<FullPage | null> {
    try {
      const slug = slugify(request.meta.slug);

      const body = {
        title: request.meta.title,
        englishTitle: slug,
        url: `/page/${slug}`,
        content: serializeContent(request.content),
        categoryId,
        seoInformation: request.meta.seo
          ? {
              title: request.meta.seo.metaTitle || request.meta.title,
              description:
                request.meta.seo.metaDescription || request.meta.title,
              canonicalUrl:
                request.meta.seo.canonicalUrl || `/page/${slug}`,
            }
          : {
              title: request.meta.title,
              description: request.meta.title,
              canonicalUrl: `/page/${slug}`,
            },
      };

      const response = await apiClient.post<PageApiResponse>(
        API.STATIC_PAGE,
        body
      );

      if (!response.data?.id) return null;
      return this.getById(response.data.id);
    } catch (error) {
      console.error('[pageService] create failed:', error);
      throw error;
    }
  },

  /**
   * ویرایش صفحه
   */
  async update(request: UpdatePageRequest): Promise<FullPage | null> {
    try {
      const current = await this.getById(request.id);
      if (!current) throw new Error('صفحه یافت نشد');

      const meta = request.meta || {};
      const content = request.content || current.content;
      const slug = meta.slug ? slugify(meta.slug) : current.meta.slug;
      const title = meta.title || current.meta.title;

      const body = {
        id: request.id,
        title,
        englishTitle: slug,
        url: `/page/${slug}`,
        content: serializeContent(content),
        seoInformation: meta.seo
          ? {
              title: meta.seo.metaTitle || title,
              description: meta.seo.metaDescription || title,
              canonicalUrl: meta.seo.canonicalUrl || `/page/${slug}`,
            }
          : undefined,
        isActive: true,
      };

      await apiClient.put(API.STATIC_PAGE, body);

      return this.getById(request.id);
    } catch (error) {
      console.error('[pageService] update failed:', error);
      throw error;
    }
  },

  /**
   * حذف صفحه
   */
  async remove(id: string): Promise<boolean> {
    try {
      await apiClient.delete(API.STATIC_PAGE, { data: { id } });
      return true;
    } catch (error) {
      console.error('[pageService] remove failed:', error);
      return false;
    }
  },

  /**
   * لیست دسته‌بندی‌های صفحات استاتیک
   */
  async getCategories(): Promise<
    Array<{ id: string; title: string; isActive: boolean }>
  > {
    try {
      const response = await apiClient.get<{
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalCount: number;
        items: Array<{ id: string; title: string; isActive: boolean }>;
      }>(API.STATIC_PAGE_CATEGORIES, {
        params: { PageNumber: 1, PageSize: 100 },
      });

      return (response.data.items || []).map((c) => ({
        id: c.id,
        title: c.title,
        isActive: c.isActive,
      }));
    } catch (error) {
      console.error('[pageService] getCategories failed:', error);
      return [];
    }
  },
};