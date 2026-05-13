"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Mail, Lock, ArrowRight, Github, Chrome, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuthStore, UserRole } from '@/store/use-auth-store';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen flex bg-background">
      {/* Left Side: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-20 xl:px-32 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 p-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Calendar className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Arwa <span className="text-primary">Cakes</span>
            </span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto"
        >
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to manage your events and bookings.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button variant="outline" className="rounded-2xl h-12 gap-2 font-semibold">
              <Chrome className="w-5 h-5" /> Google
            </Button>
            <Button variant="outline" className="rounded-2xl h-12 gap-2 font-semibold">
              <Github className="w-5 h-5" /> GitHub
            </Button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-semibold tracking-widest">Or continue with</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-12 h-12 rounded-2xl border-border/50 bg-secondary/30 focus:bg-background transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" size="sm" className="text-sm font-bold text-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-12 h-12 rounded-2xl border-border/50 bg-secondary/30 focus:bg-background transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" className="rounded-md border-primary" />
              <Label htmlFor="remember" className="text-sm font-medium cursor-pointer">Remember for 30 days</Label>
            </div>

            <Button 
              type="submit"
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-10 text-center text-muted-foreground">
            Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Create Account</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side: Visual */}
      <div className="hidden lg:block flex-1 bg-zinc-950 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image 
            src="https://picsum.photos/seed/auth/1200/1600" 
            fill 
            alt="Auth Visual" 
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-950/80 to-transparent" />
        
        <div className="relative h-full flex flex-col justify-end p-8 max-w-lg">
          <div className="w-20 h-1 bg-primary mb-8 rounded-full" />
          <h2 className="text-5xl font-bold text-white mb-6 leading-[1.2]">Events that inspire and <span className="text-primary italic">connect</span> people.</h2>
          <p className="text-xl text-zinc-400 mb-8 font-medium">Join 15,000+ creators and organizers building the next generation of event experiences.</p>
          
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
            <p className="text-lg text-white font-medium mb-4 italic">"The most intuitive event platform I've ever used. The attention to detail is just phenomenal."</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-primary overflow-hidden relative">
                 <Image src="https://picsum.photos/seed/testimonial/100/100" fill alt="Testimonial" className="object-cover" />
              </div>
              <div>
                <p className="text-white font-bold">Sarah Jenkins</p>
                <p className="text-zinc-400 text-sm">Director at Luxury Events Co.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
