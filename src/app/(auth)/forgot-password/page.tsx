"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AuthLayout } from '@/components/auth/auth-layout';
import { PremiumButton } from '@/components/ui/premium-button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 1000));
      setIsSent(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <AuthLayout
        title="Check your email"
        description={`We've sent a password reset link to ${email}.`}
        footerText={
          <Link href="/login" className="flex items-center justify-center gap-1.5 text-primary hover:text-primary/80 font-semibold transition-colors">
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        }
      >
        <div className="flex flex-col items-center justify-center py-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
            <Mail size={24} />
          </div>
          <p className="text-sm text-slate-500 text-center px-4 leading-relaxed">
            Click the link in the email to create a new password. If you don't see it, check your spam folder.
          </p>
          <PremiumButton 
            variant="outline"
            className="w-full mt-6"
            onClick={() => setIsSent(false)}
          >
            Try another email
          </PremiumButton>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset password"
      description="Enter your email and we'll send you a reset link."
      footerText={
        <Link href="/login" className="flex items-center justify-center gap-1.5 text-primary hover:text-primary/80 font-semibold transition-colors">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      }
    >
      <form onSubmit={handleReset} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-semibold text-slate-600">Email Address</Label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors text-sm rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>

        <PremiumButton 
          type="submit" 
          className="w-full h-11 text-sm mt-2" 
          disabled={loading}
          icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
        >
          {loading ? 'Sending link...' : 'Send reset link'}
        </PremiumButton>
      </form>
    </AuthLayout>
  );
}
