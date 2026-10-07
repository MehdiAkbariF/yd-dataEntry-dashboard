// src/features/page-builder/blocks/content/Button.tsx

import { cn } from '@/lib/utils';

export interface ButtonProps {
  label: string;
  href: string;
  variant: 'primary' | 'outline' | 'ghost';
  align: 'right' | 'center' | 'left';
  size: 'sm' | 'md' | 'lg';
}

export function Button({
  label,
  href,
  variant,
  align,
  size,
}: ButtonProps) {
  const variantMap = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input bg-background hover:bg-accent',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };

  const sizeMap = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  const alignMap = {
    right: 'justify-start',
    center: 'justify-center',
    left: 'justify-end',
  };

  return (
    <div className={cn('flex w-full my-3', alignMap[align])}>
      <a
        href={href || '#'}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors font-iran-yekan',
          variantMap[variant],
          sizeMap[size]
        )}
      >
        {label || 'دکمه'}
      </a>
    </div>
  );
}

export const ButtonConfig = {
  label: 'دکمه (Button)',
  fields: {
    label: { type: 'text' as const, label: 'متن دکمه' },
    href: { type: 'text' as const, label: 'لینک (URL)' },
    variant: {
      type: 'radio' as const,
      label: 'نوع دکمه',
      options: [
        { label: 'اصلی', value: 'primary' },
        { label: 'دورخط', value: 'outline' },
        { label: 'شبح', value: 'ghost' },
      ],
    },
    size: {
      type: 'select' as const,
      label: 'اندازه',
      options: [
        { label: 'کوچک', value: 'sm' },
        { label: 'متوسط', value: 'md' },
        { label: 'بزرگ', value: 'lg' },
      ],
    },
    align: {
      type: 'radio' as const,
      label: 'چینش',
      options: [
        { label: 'راست', value: 'right' },
        { label: 'وسط', value: 'center' },
        { label: 'چپ', value: 'left' },
      ],
    },
  },
  defaultProps: {
    label: 'دکمه جدید',
    href: '#',
    variant: 'primary' as const,
    size: 'md' as const,
    align: 'center' as const,
  },
  render: Button,
};