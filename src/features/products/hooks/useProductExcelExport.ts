// src/features/products/hooks/useProductExcelExport.ts
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { productService } from '@/services/productService';
import { apiClient } from '@/lib/axios';
import { ProductListItem } from '../types';
import { toast } from 'sonner';

// ─── کش‌ها ────────────────────────────────────────────────
const propertyNameCache = new Map<string, string>();
const propertyTypeCache = new Map<string, string>();
const multiSelectValuesCache = new Map<string, Map<string, string>>();

// ─── ۱. گرفتن اطلاعات یک property (name + type) ─────────────
const fetchPropertyInfo = async (propertyId: string) => {
  if (propertyNameCache.has(propertyId) && propertyTypeCache.has(propertyId)) {
    return {
      name: propertyNameCache.get(propertyId)!,
      type: propertyTypeCache.get(propertyId)!,
    };
  }

  try {
    const res = await apiClient.get<any>('/api/A_Part/Property', {
      params: { Id: propertyId },
    });

    const data = res.data;
    const prop = Array.isArray(data) ? data[0] : data;
    const name: string = prop?.name || `ویژگی ${propertyId.slice(0, 8)}`;
    const type: string = prop?.type || 'Input';

    propertyNameCache.set(propertyId, name);
    propertyTypeCache.set(propertyId, type);
    return { name, type };
  } catch (err) {
    console.error(`Failed to fetch property ${propertyId}:`, err);
    const fallback = `ویژگی ${propertyId.slice(0, 8)}`;
    propertyNameCache.set(propertyId, fallback);
    propertyTypeCache.set(propertyId, 'Input');
    return { name: fallback, type: 'Input' };
  }
};

// ─── ۲. گرفتن لیست مقادیر MultiSelect (id → value) ──────────
const fetchMultiSelectValues = async (propertyId: string): Promise<Map<string, string>> => {
  if (multiSelectValuesCache.has(propertyId)) {
    return multiSelectValuesCache.get(propertyId)!;
  }

  const map = new Map<string, string>();
  try {
    const res = await apiClient.get<any>('/api/A_Part/PropertyMultiSelect', {
      params: { PropertyId: propertyId, PageNumber: 1, PageSize: 9999, isDeleted: false },
    });

    const items = res.data?.items || res.data || [];
    items.forEach((item: any) => {
      if (item.id && item.value) {
        map.set(item.id, item.value);
      }
    });
  } catch (err) {
    console.error(`Failed to fetch multiselect values for ${propertyId}:`, err);
  }

  multiSelectValuesCache.set(propertyId, map);
  return map;
};

// ─── ۳. تبدیل مقدار MultiSelect از id به متن ────────────────
const resolveMultiSelectValue = (
  rawValue: string,
  valueMap: Map<string, string>
): string => {
  if (!rawValue) return '';

  const ids = String(rawValue)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const resolved = ids.map((id) => valueMap.get(id) || id);
  return resolved.join('، ');
};

// ─── ۴. گرفتن نام برند از API جزئیات محصول ─────────────────
const fetchBrandName = async (productId: string): Promise<string> => {
  try {
    const data = await productService.getProductById(productId);
    return (
      data?.brand?.name ||
      data?.brand?.englishTitle ||
      ''
    );
  } catch (err) {
    console.error(`Failed to fetch brand for product ${productId}:`, err);
    return '';
  }
};

// ─── هوک اصلی ────────────────────────────────────────────────
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
      // ۱. جزئیات ویژگی‌ها + نام برند همه محصولات موازی
      const [detailsResults, brandResults] = await Promise.all([
        Promise.all(
          products.map(async (product) => {
            try {
              const details = await productService.getProductDetails(product.id);
              return { productId: product.id, details: details || [] };
            } catch {
              return { productId: product.id, details: [] };
            }
          })
        ),
        Promise.all(
          products.map(async (product) => ({
            productId: product.id,
            brandName: await fetchBrandName(product.id),
          }))
        ),
      ]);

      // مپ برند
      const brandMap = new Map<string, string>();
      brandResults.forEach(({ productId, brandName }) => {
        brandMap.set(productId, brandName);
      });

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

      // ۳. اسم و نوع همه property ها موازی
      const propInfoEntries = await Promise.all(
        orderedPropIds.map(async (pid) => [pid, await fetchPropertyInfo(pid)] as const)
      );
      const propertyInfoMap = new Map(propInfoEntries);

      // ۴. مقادیر MultiSelect ها موازی
      const multiSelectPropIds = orderedPropIds.filter(
        (pid) => propertyInfoMap.get(pid)?.type === 'MultiSelect'
      );

      const multiSelectEntries = await Promise.all(
        multiSelectPropIds.map(async (pid) => [pid, await fetchMultiSelectValues(pid)] as const)
      );
      const multiSelectMap = new Map(multiSelectEntries);

      // ۵. مپ دسترسی سریع به جزئیات هر محصول
      const detailsMap = new Map<string, any[]>();
      detailsResults.forEach(({ productId, details }) => {
        detailsMap.set(productId, details);
      });

      // ۶. ساخت ردیف‌ها
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
          'برند': brandMap.get(product.id) || '',   // 👈 جدید
        };

        orderedPropIds.forEach((propId) => {
          const info = propertyInfoMap.get(propId);
          const colName = info?.name || `ویژگی ${propId.slice(0, 8)}`;
          const rawValue = detailMap.get(propId) || '';

          if (info?.type === 'MultiSelect') {
            const valueMap = multiSelectMap.get(propId);
            row[colName] = valueMap ? resolveMultiSelectValue(rawValue, valueMap) : rawValue;
          } else {
            row[colName] = rawValue;
          }
        });

        return row;
      });

      // ۷. ساخت worksheet
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

      // ۸. عرض ستون‌ها
      const firstRow = rows[0] || {};
      worksheet['!cols'] = Object.keys(firstRow).map((key) => ({
        wch: Math.min(Math.max(key.length + 4, 15), 50),
      }));

      // ۹. ذخیره فایل
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