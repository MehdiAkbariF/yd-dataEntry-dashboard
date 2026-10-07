// src/features/page-builder/blocks/layout/Section.tsx

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps {
  paddingY: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background: 'none' | 'primary' | 'muted' | 'card' | 'custom';
  customBackground?: string;
  rounded: boolean;
  container: boolean;
  children?: ReactNode;
}

export function Section({
  paddingY,
  background,
  customBackground,
  rounded,
  container,
  children,
}: SectionProps) {
  const paddingMap = {
    none: 'py-0',
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12',
    xl: 'py-16',
  };

  const bgMap = {
    none: '',
    primary: 'bg-primary/5',
    muted: 'bg-muted/30',
    card: 'bg-card',
    custom: '',
  };

  return (
    <section
      style={
        background === 'custom' && customBackground
          ? { backgroundColor: customBackground }
          : {}
      }
      className={cn(
        paddingMap[paddingY],
        bgMap[background],
        rounded && 'rounded-2xl',
        'my-4'
      )}
    >
      {container ? (
        <div className="max-w-6xl mx-auto px-4">{children}</div>
      ) : (
        children
      )}
    </section>
  );
}

export const SectionConfig = {
  label: 'بخش (Section)',
  fields: {
    paddingY: {
      type: 'select' as const,
      label: 'فاصله عمودی',
      options: [
        { label: 'بدون فاصله', value: 'none' },
        { label: 'کم', value: 'sm' },
        { label: 'متوسط', value: 'md' },
        { label: 'زیاد', value: 'lg' },
        { label: 'خیلی زیاد', value: 'xl' },
      ],
    },
    background: {
      type: 'select' as const,
      label: 'پس‌زمینه',
      options: [
        { label: 'بدون رنگ', value: 'none' },
        { label: 'رنگ برند (کم‌رنگ)', value: 'primary' },
        { label: 'خاکستری', value: 'muted' },
        { label: 'کارت', value: 'card' },
        { label: 'رنگ دلخواه', value: 'custom' },
      ],
    },
    customBackground: {
      type: 'text' as const,
      label: 'رنگ دلخواه (hex)',
    },
    rounded: {
      type: 'radio' as const,
      label: 'گوشه‌های گرد',
      options: [
        { label: 'بله', value: true },
        { label: 'خیر', value: false },
      ],
    },
    container: {
      type: 'radio' as const,
      label: 'داخل Container',
      options: [
        { label: 'بله', value: true },
        { label: 'خیر', value: false },
      ],
    },
    content: {
      type: 'slot' as const,
    },
  },
  defaultProps: {
    paddingY: 'md' as const,
    background: 'none' as const,
    customBackground: '',
    rounded: false,
    container: true,
  },
  render: Section,
};