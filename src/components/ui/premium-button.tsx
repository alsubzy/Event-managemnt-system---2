"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function PremiumButton({ 
  children, 
  className, 
  icon, 
  loading, 
  variant = 'primary', 
  size = 'md',
  ...props 
}: PremiumButtonProps) {
  const baseStyles = "relative flex items-center justify-center gap-2 font-semibold tracking-tight transition-all duration-200 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const variants = {
    primary: "bg-[#0B1221] text-white hover:bg-black/90 shadow-sm",
    outline: "bg-transparent border border-border/60 text-foreground hover:bg-secondary/50",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/50",
    danger: "bg-rose-500 text-white hover:bg-rose-600 shadow-sm"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs rounded-xl",
    md: "px-6 py-3 text-sm rounded-[1rem]",
    lg: "px-8 py-4 text-base rounded-[1.25rem]"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}