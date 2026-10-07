// src/features/page-builder/constants/pageBuilder.constants.ts

export const PAGE_BUILDER_CONSTANTS = {
  // پیشوند برای تشخیص محتوای Puck در فیلد content
  PUCK_CONTENT_PREFIX: '__PUCK__:',

  // مسیرها
  ROUTES: {
    LIST: '/pages',
    NEW: '/pages/new',
    EDIT: (id: string) => `/pages/${id}/edit`,
    PREVIEW: (id: string) => `/pages/${id}/preview`,
  },

  // اسلاگ
  SLUG_PATTERN: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

  // Puck
  PUCK: {
    DEFAULT_MAX_WIDTH: 'lg' as const,
    CANVAS_DIR: 'rtl' as const,
  },

  // API
  API: {
    STATIC_PAGES: '/api/Admin/A_Miscellanies/StaticPages',
    STATIC_PAGE: '/api/Admin/A_Miscellanies/StaticPage',
    STATIC_PAGE_CATEGORIES: '/api/Admin/A_Miscellanies/StaticPageCategories',
  },
} as const;

export const BLOCK_CATEGORIES = {
  LAYOUT: 'layout',
  CONTENT: 'content',
  MEDIA: 'media',
  COMMERCE: 'commerce',
} as const;

export type BlockCategory =
  (typeof BLOCK_CATEGORIES)[keyof typeof BLOCK_CATEGORIES];