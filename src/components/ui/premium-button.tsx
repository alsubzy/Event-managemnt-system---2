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
  const baseStyles = "relative flex items-center justify-center gap-2 font-bold tracking-tight transition-all duration-300 cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none overflow-hidden";
  
  const variants = {
    primary: "bg-[#0B1221] text-white hover:bg-black hover:shadow-xl hover:shadow-black/20",
    outline: "bg-transparent border-2 border-border/60 text-foreground hover:bg-secondary/40 hover:border-primary/20",
    ghost: "bg-transparent text-muted-foreground hover:text-primary hover:bg-secondary/40",
    danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
  };

  const sizes = {
    sm: "px-6 py-2.5 text-[10px] uppercase tracking-widest rounded-2xl",
    md: "px-8 py-3.5 text-sm rounded-2xl",
    lg: "px-10 py-5 text-base rounded-[1.5rem]"
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
          {icon && <span className="shrink-0 transition-transform group-hover:scale-110">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}