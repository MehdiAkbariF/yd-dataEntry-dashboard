// src/features/page-builder/blocks/layout/Divider.tsx

import { cn } from '@/lib/utils';

export interface DividerProps {
  style: 'solid' | 'dashed' | 'dotted';
  color: string;
  thickness: number;
  spacing: number;
}

export function Divider({
  style = 'solid',
  color = '',
  thickness = 1,
  spacing = 16,
}: DividerProps) {
  return (
    <div
      style={{
        marginTop: `${spacing}px`,
        marginBottom: `${spacing}px`,
      }}
      aria-hidden="true"
    >
      <hr
        style={{
          borderStyle: style,
          borderColor: color || undefined,
          borderTopWidth: `${thickness}px`,
        }}
      />
    </div>
  );
}

export const DividerConfig = {
  label: 'جداکننده (Divider)',
  fields: {
    style: {
      type: 'radio' as const,
      label: 'سبک',
      options: [
        { label: 'خط ساده', value: 'solid' },
        { label: 'خط تیره', value: 'dashed' },
        { label: 'خط نقطه‌ای', value: 'dotted' },
      ],
    },
    color: { type: 'text' as const, label: 'رنگ (hex, اختیاری)' },
    thickness: {
      type: 'number' as const,
      label: 'ضخامت (پیکسل)',
      min: 1,
      max: 10,
    },
    spacing: {
      type: 'number' as const,
      label: 'فاصله بالا/پایین',
      min: 0,
      max: 100,
    },
  },
  defaultProps: {
    style: 'solid' as 'solid' | 'dashed' | 'dotted',
    color: '',
    thickness: 1,
    spacing: 16,
  },
  render: Divider,
};