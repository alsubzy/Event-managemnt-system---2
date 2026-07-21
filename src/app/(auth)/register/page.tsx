"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { AuthLayout } from '@/components/auth/auth-layout';
import { PremiumButton } from '@/components/ui/premium-button';

export default function RegisterPage() {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullname || !email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulation of registration delay
      await new Promise(r => setTimeout(r, 1000));
      
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });

      router.push('/login');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Start managing world-class events with YEGLEEL today."
      footerText={
        <>
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleRegister} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullname" className="text-xs font-semibold text-slate-600">Full Name</Label>
          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              id="fullname" 
              type="text" 
              placeholder="John Doe" 
              className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors text-sm rounded-xl"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>

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
          <Label htmlFor="password" className="text-xs font-semibold text-slate-600">Password</Label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors text-sm rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="flex items-start gap-2 py-1">
          <Checkbox id="terms" className="rounded-md border-slate-300 mt-0.5" required />
          <Label htmlFor="terms" className="text-xs font-medium text-slate-600 leading-relaxed cursor-pointer">
            I agree to the <Link href="/terms" className="text-primary hover:underline font-semibold">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline font-semibold">Privacy Policy</Link>.
          </Label>
        </div>

        <PremiumButton 
          type="submit" 
          className="w-full h-11 text-sm mt-2" 
          disabled={loading}
          icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </PremiumButton>
      </form>
    </AuthLayout>
  );
}
