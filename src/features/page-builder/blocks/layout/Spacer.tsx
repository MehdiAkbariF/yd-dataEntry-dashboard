// src/features/page-builder/blocks/layout/Spacer.tsx

export interface SpacerProps {
  height: number;
}

export function Spacer({ height = 32 }: SpacerProps) {
  return <div style={{ height: `${height}px` }} aria-hidden="true" />;
}

export const SpacerConfig = {
  label: 'فاصله (Spacer)',
  fields: {
    height: {
      type: 'number' as const,
      label: 'ارتفاع (پیکسل)',
      min: 4,
      max: 400,
    },
  },
  defaultProps: {
    height: 32,
  },
  render: Spacer,
};