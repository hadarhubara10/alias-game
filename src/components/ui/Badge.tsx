import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-600 text-slate-100',
  success: 'bg-emerald-600 text-emerald-100',
  warning: 'bg-amber-600 text-amber-100',
  danger: 'bg-rose-600 text-rose-100',
  info: 'bg-blue-600 text-blue-100',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({ variant = 'default', size = 'md', children }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
      `}
    >
      {children}
    </span>
  );
}
