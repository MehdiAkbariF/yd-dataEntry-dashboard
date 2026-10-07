// src/features/page-builder/services/pageService.ts

import { apiClient } from '@/lib/axios';
import {
  FullPage,
  PageListItem,
  CreatePageRequest,
  UpdatePageRequest,
  PageSchema,
  PageApiResponse,
} from '../types/schema.types';
import { PAGE_BUILDER_CONSTANTS } from '../constants/pageBuilder.constants';

const PUCK_PREFIX = '__PUCK__:';

/**
 * سرویس مدیریت صفحات Page Builder
 * متصل به API واقعی:
 *   GET    /api/Admin/A_Miscellanies/StaticPages
 *   GET    /api/Admin/A_Miscellanies/StaticPage?Id=...
 *   POST   /api/Admin/A_Miscellanies/StaticPage
 *   PUT    /api/Admin/A_Miscellanies/StaticPage
 *   DELETE /api/Admin/A_Miscellanies/StaticPage
 */

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

/**
 * تشخیص اینکه content رشته JSON Puck هست یا HTML قدیمی
 */
function isPuckContent(content: string): boolean {
  return typeof content === 'string' && content.startsWith(PUCK_PREFIX);
}

/**
 * از رشته content، Schema استخراج کن
 */
function parsePuckContent(content: string): PageSchema | null {
  if (!isPuckContent(content)) return null;
  try {
    const raw = content.slice(PUCK_PREFIX.length);
    return JSON.parse(raw) as PageSchema;
  } catch {
    return null;
  }
}

/**
 * Schema رو به رشته content تبدیل کن
 */
function serializePuckContent(schema: PageSchema): string {
  return `${PUCK_PREFIX}${JSON.stringify(schema)}`;
}

/**
 * ساخت schema خالی
 */
function emptySchema(): PageSchema {
  return {
    root: { props: {} },
    content: [],
    zones: {},
  } as unknown as PageSchema;
}

export const pageService = {
  /**
   * لیست همه صفحات
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
      }>('/api/Admin/A_Miscellanies/StaticPages', {
        params: {
          Title: params?.title || '',
          PageNumber: params?.pageNumber || 1,
          PageSize: params?.pageSize || 100,
        },
      });

      const items = response.data.items || [];

      return items.map((item) => ({
        id: item.id,
        slug: item.englishTitle,
        title: item.title,
        status: 'published' as const,
        version: 1,
        updatedAt: new Date().toISOString(),
        authorName: 'Admin',
      }));
    } catch (error) {
      console.error('[pageService] getList failed:', error);
      return [];
    }
  },

  /**
   * دریافت یک صفحه با id (یا slug)
   */
  async getById(id: string): Promise<FullPage | null> {
    try {
      const response = await apiClient.get<PageApiResponse>(
        '/api/Admin/A_Miscellanies/StaticPage',
        { params: { Id: id } }
      );

      const data = response.data;
      if (!data || !data.id) return null;

      const schema =
        parsePuckContent(data.content) || {
          ...emptySchema(),
          root: { props: {} },
        };

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
          version: 1,
          authorId: 'admin',
          publishedAt: null,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        },
        schema,
      };
    } catch (error) {
      console.error('[pageService] getById failed:', error);
      return null;
    }
  },

  /**
   * دریافت صفحه با slug (englishTitle)
   * API فعلی فقط با Id کار می‌کنه، پس باید لیست رو بگیریم و فیلتر کنیم
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
   * API نیازمند categoryId هست
   */
  async create(
    request: CreatePageRequest,
    categoryId: string
  ): Promise<FullPage | null> {
    try {
      const slug = slugify(request.meta.slug);
      const schema = request.schema;

      const body = {
        title: request.meta.title,
        englishTitle: slug,
        url: `/page/${slug}`,
        content: serializePuckContent(schema),
        categoryId: categoryId,
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
        '/api/Admin/A_Miscellanies/StaticPage',
        body
      );

      const data = response.data;
      if (!data || !data.id) return null;

      return this.getById(data.id);
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
      // اول صفحه فعلی رو بگیر تا categoryId و مقادیر دیگه رو داشته باشیم
      const current = await this.getById(request.id);
      if (!current) throw new Error('صفحه یافت نشد');

      const meta = request.meta || {};
      const schema = request.schema;

      const slug = meta.slug ? slugify(meta.slug) : current.meta.slug;
      const title = meta.title || current.meta.title;

      const body = {
        id: request.id,
        title,
        englishTitle: slug,
        url: `/page/${slug}`,
        content: schema ? serializePuckContent(schema) : undefined,
        categoryId: undefined as string | undefined, // در صورتی که نیاز شد اضافه کن
        seoInformation: meta.seo
          ? {
              id: undefined,
              title: meta.seo.metaTitle || title,
              description: meta.seo.metaDescription || title,
              canonicalUrl: meta.seo.canonicalUrl || `/page/${slug}`,
            }
          : undefined,
        isActive: true,
      };

      await apiClient.put('/api/Admin/A_Miscellanies/StaticPage', body);

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
      await apiClient.delete('/api/Admin/A_Miscellanies/StaticPage', {
        data: { id },
      });
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
        items: Array<{
          id: string;
          title: string;
          isActive: boolean;
        }>;
      }>('/api/Admin/A_Miscellanies/StaticPageCategories', {
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