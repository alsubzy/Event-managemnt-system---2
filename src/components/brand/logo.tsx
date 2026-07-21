import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon';
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Logo({ variant = 'full', theme = 'auto', className, size = 'md' }: LogoProps) {
  // Map sizing
  const sizeMap = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-14',
  };

  const currentSize = sizeMap[size];

  // Theme text classes
  const textThemeClass = theme === 'auto' 
    ? 'text-slate-900 dark:text-white' 
    : theme === 'dark' 
      ? 'text-white' 
      : 'text-slate-900';

  // The actual SVG Mark
  const LogoMark = () => (
    <svg viewBox="0 0 100 100" className="w-auto h-full shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background/Base Shape */}
      <rect x="15" y="15" width="45" height="45" rx="12" fill="currentColor" className="text-primary" />
      {/* Overlapping Accent Shape */}
      <rect x="40" y="40" width="45" height="45" rx="12" fill="currentColor" className="text-emerald-500" style={{ mixBlendMode: 'multiply' }} />
      {/* Inner detailing */}
      <circle cx="37.5" cy="37.5" r="6" fill="white" />
      <circle cx="62.5" cy="62.5" r="6" fill="white" />
      <path d="M43.5 37.5 L62.5 56.5" stroke="white" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={cn('flex items-center', currentSize, className)}>
        <LogoMark />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2.5', currentSize, className)}>
        <LogoMark />
        <span className={cn('font-black tracking-tighter uppercase leading-none', textThemeClass)}>
          YEGLEEL
        </span>
      </div>
    );
  }

  // Full Variant
  return (
    <div className={cn('flex items-center gap-3', currentSize, className)}>
      <LogoMark />
      <div className={cn('flex flex-col justify-center', textThemeClass)}>
        <span className="font-black tracking-tighter uppercase text-[0.95em] leading-none mb-0.5">
          YEGLEEL
        </span>
        <span className="font-semibold tracking-[0.2em] uppercase text-[0.45em] leading-none text-slate-500 dark:text-slate-400">
          Event Management System
        </span>
      </div>
    </div>
  );
}
