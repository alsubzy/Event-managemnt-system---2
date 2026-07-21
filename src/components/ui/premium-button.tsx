"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

const variantStyles = {
  default:     'bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20',
  outline:     'border border-border bg-white text-foreground hover:bg-slate-50 hover:border-slate-300',
  ghost:       'text-muted-foreground hover:bg-slate-100 hover:text-foreground',
  destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-200',
  success:     'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-200',
};

const sizeStyles = {
  sm:   'h-8  px-3   text-xs  gap-1.5 rounded-lg',
  md:   'h-10 px-4   text-sm  gap-2   rounded-lg',
  lg:   'h-11 px-5   text-sm  gap-2   rounded-xl',
  icon: 'h-9  w-9    text-sm  rounded-lg justify-center',
};

export function PremiumButton({
  variant = 'default',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  className,
  children,
  disabled,
  ...props
}: PremiumButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center font-medium transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1',
        'disabled:pointer-events-none disabled:opacity-50',
        'active:scale-[0.98]',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
      ) : (
        icon && iconPosition === 'left' && (
          <span className="shrink-0">{icon}</span>
        )
      )}
      {children && <span>{children}</span>}
      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
}