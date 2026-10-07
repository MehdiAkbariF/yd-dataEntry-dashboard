// src/features/page-builder/blocks/content/Text.tsx

import { cn } from '@/lib/utils';

export interface TextProps {
  content: string;
  align: 'right' | 'center' | 'left' | 'justify';
  color?: string;
  size: 'sm' | 'base' | 'lg';
}

export function Text({ content, align, color, size = 'base' }: TextProps) {
  const sizeMap = {
    sm: 'text-xs md:text-sm',
    base: 'text-sm md:text-base',
    lg: 'text-base md:text-lg',
  };

  const alignMap = {
    right: 'text-right',
    center: 'text-center',
    left: 'text-left',
    justify: 'text-justify',
  };

  return (
    <p
      style={{ color: color || undefined }}
      className={cn(
        sizeMap[size],
        alignMap[align],
        'leading-loose text-foreground/90 font-iran-yekan my-2 whitespace-pre-wrap'
      )}
    >
      {content || 'متن خود را وارد کنید'}
    </p>
  );
}

export const TextConfig = {
  label: 'متن (Text)',
  fields: {
    content: { type: 'textarea' as const, label: 'محتوای متن' },
    align: {
      type: 'radio' as const,
      label: 'چینش',
      options: [
        { label: 'راست', value: 'right' },
        { label: 'وسط', value: 'center' },
        { label: 'چپ', value: 'left' },
        { label: 'هم‌تراز', value: 'justify' },
      ],
    },
    size: {
      type: 'select' as const,
      label: 'اندازه',
      options: [
        { label: 'کوچک', value: 'sm' },
        { label: 'متوسط', value: 'base' },
        { label: 'بزرگ', value: 'lg' },
      ],
    },
    color: { type: 'text' as const, label: 'رنگ (hex, اختیاری)' },
  },
  defaultProps: {
    content: 'متن جدید خود را اینجا بنویسید...',
    align: 'right' as const,
    size: 'base' as const,
    color: '',
  },
  render: Text,
};