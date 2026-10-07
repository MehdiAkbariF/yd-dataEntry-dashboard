// src/features/page-builder/config/custom-fields.tsx

import { ColorPickerField } from '../components/Fields/ColorPickerField';
import { ImagePickerField } from '../components/Fields/ImagePickerField';
import { SpacingField } from '../components/Fields/SpacingField';

/**
 * رجیستری fieldهای سفارشی برای Puck
 * این‌ها در فایل config اصلی Puck استفاده می‌شن
 */
export const customFields = {
  color: {
    type: 'text' as const,
    label: 'رنگ',
  },
  image: {
    type: 'text' as const,
    label: 'تصویر (URL)',
  },
  spacing: {
    type: 'number' as const,
    label: 'فاصله',
  },
};

/**
 * کامپوننت‌های رندر سفارشی
 * Puck در نسخه 0.18 این‌ها رو مستقیم ساپورت نمیکنه، پس باید
 * در تنظیمات Puck با usePuck یا با overrideField در بالاترین سطح انجام بشه
 */

// ============================================
// راه‌حل قطعی برای Puck 0.18:
// استفاده از Custom Field در Puck با `render` override
// ============================================

/**
 * تابع کمکی که فیلد سفارشی می‌سازه
 * Puck از این ساختار استفاده می‌کنه:
 * {
 *   type: 'custom',
 *   render: ({ value, onChange, field, name }) => <CustomField />
 * }
 *
 * ولی چون Puck 0.18 'custom' رو به عنوان type قبول نمیکنه،
 * از type 'text' استفاده میکنیم و در PuckEditor با override
 * فیلد رو با کامپوننت دلخواه جایگزین میکنیم
 */