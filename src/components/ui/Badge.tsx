import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  className,
}: BadgeProps) {
  const variantMap = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger:  'badge-danger',
    info:    'badge-info',
    neutral: 'badge-neutral',
  };
  const sizeMap = {
    sm: 'px-1.5 py-0.5',
    md: 'px-2 py-0.5',
  };
  return (
    <span className={cn('badge', variantMap[variant], sizeMap[size], className)}>
      {children}
    </span>
  );
}