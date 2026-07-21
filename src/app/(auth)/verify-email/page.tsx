"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { AuthLayout } from '@/components/auth/auth-layout';
import { PremiumButton } from '@/components/ui/premium-button';

export default function VerifyEmailPage() {
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Simulate verification delay
    const timer = setTimeout(() => {
      setVerifying(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthLayout
      title={verifying ? "Verifying your email" : "Email verified"}
      description={
        verifying 
          ? "Please wait while we verify your email address..." 
          : "Your email address has been successfully verified."
      }
    >
      <div className="flex flex-col items-center justify-center py-4">
        {verifying ? (
          <div className="w-16 h-16 bg-slate-50 text-primary rounded-full flex items-center justify-center mb-6">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} />
            </div>
            
            <Link href="/login" className="w-full mt-2">
              <PremiumButton className="w-full" iconPosition="right" icon={<ArrowRight size={16} />}>
                Continue to sign in
              </PremiumButton>
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
