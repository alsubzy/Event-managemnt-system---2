"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore, UserRole } from '@/store/use-auth-store';
import { useToast } from '@/hooks/use-toast';
import { AuthLayout } from '@/components/auth/auth-layout';
import { PremiumButton } from '@/components/ui/premium-button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // For simulation, we determine role based on email if needed
      let role: UserRole = 'USER';
      if (email.includes('admin')) role = 'ADMIN';
      if (email.includes('organizer')) role = 'ORGANIZER';

      await login(email, role);
      
      toast({
        title: "Welcome back!",
        description: "Redirecting to your dashboard...",
      });

      router.push('/dashboard');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue to YEGLEEL Event Management System."
      footerText={
        <>
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:text-primary/80 font-bold transition-colors">
            Create account
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-5">
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

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-xs font-semibold text-slate-600">Password</Label>
            <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              className="pl-10 pr-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors text-sm rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 py-1">
          <Checkbox id="remember" className="rounded-md border-slate-300" />
          <Label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer">
            Remember me for 30 days
          </Label>
        </div>

        <PremiumButton 
          type="submit" 
          className="w-full h-11 text-sm mt-2" 
          disabled={loading}
          icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </PremiumButton>
      </form>
    </AuthLayout>
  );
}
