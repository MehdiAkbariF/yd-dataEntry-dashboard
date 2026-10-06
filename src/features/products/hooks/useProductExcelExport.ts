// src/features/products/hooks/useProductExcelExport.ts
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { productService } from '@/services/productService';
import { apiClient } from '@/lib/axios';
import { ProductListItem } from '../types';
import { toast } from 'sonner';

// کش سراسری برای جلوگیری از درخواست تکراری به ازای هر propertyId
const propertyNameCache = new Map<string, string>();

const fetchPropertyName = async (propertyId: string): Promise<string> => {
  if (propertyNameCache.has(propertyId)) {
    return propertyNameCache.get(propertyId)!;
  }

  try {
    const res = await apiClient.get<any>('/api/A_Part/Property', {
      params: { Id: propertyId },
    });

    // ممکنه آرایه باشه یا آبجکت مستقیم
    const data = res.data;
    const prop = Array.isArray(data) ? data[0] : data;
    const name: string = prop?.name || `ویژگی ${propertyId.slice(0, 8)}`;

    propertyNameCache.set(propertyId, name);
    return name;
  } catch (err) {
    console.error(`Failed to fetch property ${propertyId}:`, err);
    const fallback = `ویژگی ${propertyId.slice(0, 8)}`;
    propertyNameCache.set(propertyId, fallback);
    return fallback;
  }
};

export const useProductExcelExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportProductsToExcel = async (products: ProductListItem[]) => {
    if (!products || products.length === 0) {
      toast.error('محصولی برای دانلود وجود ندارد.');
      return;
    }

    setIsExporting(true);
    toast.info('در حال آماده‌سازی فایل اکسل...');

    try {
      // ۱. گرفتن جزئیات همه محصولات به صورت موازی
      const detailsResults = await Promise.all(
        products.map(async (product) => {
          try {
            const details = await productService.getProductDetails(product.id);
            return { productId: product.id, details: details || [] };
          } catch {
            return { productId: product.id, details: [] };
          }
        })
      );

      // ۲. جمع‌آوری propertyId های یکتا به ترتیب ظهور
      const orderedPropIds: string[] = [];
      const seen = new Set<string>();

      detailsResults.forEach(({ details }) => {
        details.forEach((d: any) => {
          const pid = d.propertyId || d.property?.id;
          if (pid && !seen.has(pid)) {
            seen.add(pid);
            orderedPropIds.push(pid);
          }
        });
      });

      // ۳. گرفتن اسم همه property ها به صورت موازی
      const propNameEntries = await Promise.all(
        orderedPropIds.map(async (pid) => [pid, await fetchPropertyName(pid)] as const)
      );
      const propertyNameMap = new Map<string, string>(propNameEntries);

      // ۴. مپ دسترسی سریع به جزئیات هر محصول
      const detailsMap = new Map<string, any[]>();
      detailsResults.forEach(({ productId, details }) => {
        detailsMap.set(productId, details);
      });

      // ۵. ساخت ردیف‌ها
      const rows = products.map((product, index) => {
        const details = detailsMap.get(product.id) || [];
        const detailMap = new Map<string, string>();

        details.forEach((d: any) => {
          const pid = d.propertyId || d.property?.id;
          if (pid) {
            detailMap.set(pid, d.value || '');
          }
        });

        const row: Record<string, any> = {
          'ردیف': index + 1,
          'کد محصول': product.productCode || '',
          'نام محصول': product.title || '',
          'عنوان انگلیسی': product.englishTitle || '',
        };

        orderedPropIds.forEach((propId) => {
          const colName = propertyNameMap.get(propId) || `ویژگی ${propId.slice(0, 8)}`;
          row[colName] = detailMap.get(propId) || '';
        });

        return row;
      });

      // ۶. ساخت worksheet
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

      // ۷. تنظیم عرض ستون‌ها
      const firstRow = rows[0] || {};
      worksheet['!cols'] = Object.keys(firstRow).map((key) => ({
        wch: Math.min(Math.max(key.length + 4, 15), 50),
      }));

      // ۸. ذخیره فایل
      const now = new Date();
      const fileName = `products-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${now.getTime()}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success(`فایل اکسل با ${products.length} محصول دانلود شد.`);
    } catch (err) {
      console.error('Excel export error:', err);
      toast.error('خطا در ساخت فایل اکسل.');
    } finally {
      setIsExporting(false);
    }
  };

  return { exportProductsToExcel, isExporting };
};