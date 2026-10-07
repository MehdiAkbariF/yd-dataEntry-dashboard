// src/features/page-builder/blocks/media/Image.tsx

import { cn } from '@/lib/utils';

export interface ImageProps {
  src: string;
  alt: string;
  caption?: string;
  align: 'right' | 'center' | 'left';
  rounded: boolean;
  width: 'full' | '3/4' | '1/2' | '1/3';
}

export function Image({
  src,
  alt,
  caption,
  align,
  rounded,
  width,
}: ImageProps) {
  const widthMap = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
  };

  const alignMap = {
    right: 'mr-0 ml-auto',
    center: 'mx-auto',
    left: 'ml-0 mr-auto',
  };

  if (!src) {
    return (
      <div className="w-full my-4 p-8 border-2 border-dashed border-muted rounded-xl flex items-center justify-center">
        <span className="text-xs text-muted-foreground font-iran-yekan">
          تصویری انتخاب نشده است
        </span>
      </div>
    );
  }

  return (
    <figure className={cn('my-4', alignMap[align])}>
      <div className={cn(widthMap[width], 'mx-auto')}>
        <img
          src={src}
          alt={alt || ''}
          className={cn(
            'w-full h-auto object-cover',
            rounded && 'rounded-xl'
          )}
        />
        {caption && (
          <figcaption className="text-xs text-muted-foreground text-center mt-2 font-iran-yekan">
            {caption}
          </figcaption>
        )}
      </div>
    </figure>
  );
}

export const ImageConfig = {
  label: 'تصویر (Image)',
  fields: {
    src: { type: 'text' as const, label: 'آدرس تصویر (URL)' },
    alt: { type: 'text' as const, label: 'متن جایگزین (Alt)' },
    caption: { type: 'text' as const, label: 'توضیح زیر تصویر' },
    align: {
      type: 'radio' as const,
      label: 'چینش',
      options: [
        { label: 'راست', value: 'right' },
        { label: 'وسط', value: 'center' },
        { label: 'چپ', value: 'left' },
      ],
    },
    width: {
      type: 'select' as const,
      label: 'عرض',
      options: [
        { label: 'کامل', value: 'full' },
        { label: '۳/۴', value: '3/4' },
        { label: '۱/۲', value: '1/2' },
        { label: '۱/۳', value: '1/3' },
      ],
    },
    rounded: {
      type: 'radio' as const,
      label: 'گوشه‌های گرد',
      options: [
        { label: 'بله', value: true },
        { label: 'خیر', value: false },
      ],
    },
  },
  defaultProps: {
    src: '',
    alt: '',
    caption: '',
    align: 'center' as const,
    width: 'full' as const,
    rounded: true,
  },
  render: Image,
};