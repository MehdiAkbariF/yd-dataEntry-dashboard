import { apiClient } from '@/lib/axios';
import { PaginatedResponse } from '@/types/api';
import { ProductListItem, ProductFilterParams } from '@/features/products/types';

export const productService = {
  // گرفتن لیست محصولات با فیلترها و Paging
  async getProducts(params: ProductFilterParams): Promise<PaginatedResponse<ProductListItem>> {
    const response = await apiClient.get<PaginatedResponse<ProductListItem>>(
      '/api/Admin/A_Product/ProductList',
      { params }
    );
    return response.data;
  },

  // دریافت اطلاعات کامل یک محصول با Id جهت ویرایش
  async getProductById(productId: string): Promise<any> {
    const response = await apiClient.get<any>('/api/Admin/A_Product/Product', {
      params: { ProductId: productId },
    });
    return response.data;
  },

  // ایجاد محصول جدید (multipart/form-data)
  async createProduct(formData: FormData): Promise<any> {
    const response = await apiClient.post('/api/Admin/A_Product/Product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // ویرایش محصول موجود (multipart/form-data)
  async updateProduct(formData: FormData): Promise<any> {
    const response = await apiClient.put('/api/Admin/A_Product/Product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // تغییر وضعیت فعال/غیرفعال بودن محصول
  async toggleActiveStatus(id: string, isActive: boolean): Promise<any> {
    const formData = new FormData();
    formData.append('Id', id);
    formData.append('IsActive', String(isActive));

    const response = await apiClient.put(
      '/api/Admin/A_Product/UpdateProductActiveStatus',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  // حذف محصول
  async deleteProduct(id: string): Promise<any> {
    const response = await apiClient.delete('/api/Admin/A_Product/Product', {
      data: { id, isDelete: true },
    });
    return response.data;
  },

  // آپلود گالری تصاویر محصول
  async uploadProductImages(productId: string, files: File[], imageAlts: string[]): Promise<any> {
    const formData = new FormData();
    formData.append('ProductId', productId);
    files.forEach((file) => formData.append('Images', file));
    imageAlts.forEach((alt) => formData.append('ImageAlts', alt));

    const response = await apiClient.post('/api/Admin/A_Product/ProductImage', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // حذف یک تصویر از گالری محصول
  async deleteProductImage(imageId: string): Promise<any> {
    const response = await apiClient.delete('/api/Admin/A_Product/ProductImage', {
      data: { id: imageId },
    });
    return response.data;
  },

  // اتصال محصولات مرتبط
  async setProductRelations(productId: string, relatedProductIds: string[]): Promise<any> {
    const formData = new FormData();
    formData.append('Id', productId);
    relatedProductIds.forEach((id) => formData.append('RelatedProductIds', id));

    const response = await apiClient.post('/api/Admin/A_Product/ProductRelation', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};