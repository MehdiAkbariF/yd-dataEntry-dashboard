// ساختار عمومی پاسخ‌های صفحه‌بندی شده APIهای شما
export interface PaginatedResponse<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  items: T[];
  searchParams?: any;
}

// ساختار اطلاعات سازنده / ویرایش‌کننده
export interface UserAuditSummary {
  id: string;
  userName: string;
  fullName: string | null;
  phoneNumber: string;
  restrictionStatus: string;
  email: string | null;
  createDate: string;
}

// ساختار عمومی SEO Information
export interface SEOInformation {
  id?: string;
  title: string;
  description: string;
  canonicalUrl: string;
  isActive?: boolean;
}

// فیلترهای عمومی صفحه‌بندی
export interface BaseFilterParams {
  pageNumber?: number;
  pageSize?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  userId?: string;
}