
"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'danger';
}

export function PremiumButton({ 
  children, 
  className, 
  icon, 
  loading, 
  variant = 'primary', 
  ...props 
}: PremiumButtonProps) {
  const baseStyles = "relative flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-2xl transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#0B1221] text-white hover:opacity-90 hover:scale-[1.02]",
    outline: "bg-transparent border-2 border-[#0B1221] text-[#0B1221] hover:bg-[#0B1221]/5",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
