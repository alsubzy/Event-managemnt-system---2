import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  badge?: React.ReactNode;
}

export function PageHeader({ title, description, children, className, badge }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4', className)}>
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="page-title truncate">{title}</h1>
          {badge}
        </div>
        {description && (
          <p className="page-description">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2.5 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
