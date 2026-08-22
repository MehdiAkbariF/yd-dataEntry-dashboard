import { BaseFilterParams, SEOInformation, UserAuditSummary } from '@/types/api';

// --- دسته‌بندی بلاگ ---
export interface BlogCategoryListItem {
  id: string;
  title: string;
  iconUrl: string | null;
  createDate: string;
  updateDate: string | null;
  isActive: boolean;
  isDeleted: boolean;
  creator?: UserAuditSummary | null;
  updater?: UserAuditSummary | null;
}

export interface BlogCategoryFilterParams extends BaseFilterParams {
  title?: string;
}

// --- مقالات بلاگ ---
export interface BlogPostFAQ {
  id?: string;
  question: string;
  answer: string;
}

export interface BlogPostListItem {
  id: string;
  blogCategoryId: string;
  status: 'Published' | 'Draft' | string;
  title: string;
  englishTitle: string | null;
  summary?: string | null;
  description?: string;
  imageUrl: string | null;
  imageAlt: string | null;
  readTime: number;
  publishTime: string | null;
  createDate: string;
  updateDate: string | null;
  isActive: boolean;
  isDeleted: boolean;
  blogCategory?: BlogCategoryListItem | null;
  seoInformation?: SEOInformation | null;
  faQs?: BlogPostFAQ[];
  carTypes?: { id: string; name: string; englishTitle?: string }[];
  parts?: { id: string; name: string }[];
  creator?: UserAuditSummary | null;
  updater?: UserAuditSummary | null;
}

export interface BlogPostFilterParams extends BaseFilterParams {
  title?: string;
  blogCategoryId?: string;
  carTypeIds?: string[];
  partIds?: string[];
  userId?: string;
}

// --- دیدگاه‌های مقالات بلاگ ---
export interface BlogPostCommentReply {
  id: string;
  commentCreator: string;
  comment: string;
  createDate: string;
}

export interface BlogPostCommentListItem {
  id: string;
  blogPostId: string;
  commentCreator: string;
  comment: string;
  parentId: string | null;
  isConfirmed: boolean;
  isIncognito: boolean;
  hasReply: boolean;
  createDate: string;
  isActive: boolean;
  isDeleted: boolean;
  blogPost?: {
    id: string;
    title: string;
    englishTitle: string | null;
    imageUrl: string | null;
  } | null;
  replies?: BlogPostCommentReply[];
  creator?: UserAuditSummary | null;
}

export interface BlogPostCommentFilterParams extends BaseFilterParams {
  blogPostId?: string;
  searchedValue?: string;
  isConfirmed?: boolean;
  hasReply?: boolean;
  isReply?: boolean;
  isIncognito?: boolean;
}