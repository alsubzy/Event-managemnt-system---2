"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Mail, Lock, Github, Chrome, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore, UserRole } from '@/store/use-auth-store';
import { useToast } from '@/hooks/use-toast';

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
    <div className="min-h-screen flex flex-col justify-center items-center bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-200">
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-md space-y-6"
      >
        {/* Brand logo & header */}
        <div className="flex flex-col items-center text-center">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-zinc-900 dark:bg-zinc-50 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 duration-200">
              <Calendar className="text-zinc-50 dark:text-zinc-950 w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Arwa <span className="text-zinc-500 dark:text-zinc-400">Pro</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-xl shadow-zinc-200/5 dark:shadow-none p-6 sm:p-8 space-y-6 backdrop-blur-md">
          <div className="space-y-1.5 text-center sm:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Welcome Back</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Sign in to continue to your dashboard.</p>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-xl h-11 border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-50 font-medium text-xs gap-2 transition-all duration-200"
            >
              <Chrome className="w-4 h-4 text-zinc-500 dark:text-zinc-400" /> Google
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="rounded-xl h-11 border-zinc-200 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-50 font-medium text-xs gap-2 transition-all duration-200"
            >
              <Github className="w-4 h-4 text-zinc-500 dark:text-zinc-400" /> GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800/80"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-400 dark:text-zinc-500 font-semibold tracking-wider">
                Or continue with
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10 pr-4 h-11 rounded-xl border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-zinc-950 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all duration-200 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Password
                </Label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="pl-10 pr-10 h-11 rounded-xl border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 focus:bg-white dark:focus:bg-zinc-950 focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all duration-200 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 py-1">
              <Checkbox id="remember" className="rounded-md border-zinc-300 dark:border-zinc-700 data-[state=checked]:bg-zinc-900 data-[state=checked]:text-zinc-50 dark:data-[state=checked]:bg-zinc-50 dark:data-[state=checked]:text-zinc-950" />
              <Label htmlFor="remember" className="text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer">
                Remember me
              </Label>
            </div>

            {/* Sign In Button */}
            <Button 
              type="submit"
              className="w-full h-11 rounded-xl text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-950 transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <span>Sign in</span>
              )}
            </Button>
          </form>

          {/* Bottom links */}
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="font-bold text-zinc-900 dark:text-zinc-50 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
