import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/brand/logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footerText?: React.ReactNode;
}

export function AuthLayout({ children, title, description, footerText }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden py-12 px-4 sm:px-6">
      
      {/* Subtle Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-[100%] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="group inline-flex transition-transform hover:scale-105 active:scale-95 duration-200">
            <Logo variant="icon" size="xl" />
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">{title}</h1>
            <p className="text-sm text-slate-500 font-medium">{description}</p>
          </div>

          {children}

        </div>

        {footerText && (
          <div className="mt-8 text-center text-sm font-medium text-slate-500">
            {footerText}
          </div>
        )}
      </motion.div>
    </div>
  );
}
