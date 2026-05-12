
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Mail, Lock, User, ArrowRight, Chrome, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function RegisterPage() {
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
            <h1 className="text-4xl font-bold tracking-tight mb-2">Create Account</h1>
            <p className="text-muted-foreground font-medium">Join our community of event enthusiasts today.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button variant="outline" className="rounded-2xl h-12 gap-2 font-semibold border-2">
              <Chrome className="w-5 h-5" /> Google
            </Button>
            <Button variant="outline" className="rounded-2xl h-12 gap-2 font-semibold border-2">
              <Github className="w-5 h-5" /> GitHub
            </Button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-bold tracking-widest">Or sign up with email</span>
            </div>
          </div>

          <form className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullname" className="font-bold">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="fullname" 
                  type="text" 
                  placeholder="John Doe" 
                  className="pl-12 h-12 rounded-2xl border-2 border-border/50 bg-secondary/30 focus:bg-background transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-12 h-12 rounded-2xl border-2 border-border/50 bg-secondary/30 focus:bg-background transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-12 h-12 rounded-2xl border-2 border-border/50 bg-secondary/30 focus:bg-background transition-all"
                />
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <Checkbox id="terms" className="rounded-md border-primary mt-1" />
              <Label htmlFor="terms" className="text-sm font-medium leading-tight cursor-pointer">
                I agree to the <Link href="/terms" className="text-primary font-bold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
              </Label>
            </div>

            <Button className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
              Create Account <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </form>

          <p className="mt-10 text-center text-muted-foreground font-medium">
            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side: Visual */}
      <div className="hidden lg:block flex-1 bg-zinc-950 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image 
            src="https://picsum.photos/seed/register-visual/1200/1600" 
            fill 
            alt="Auth Visual" 
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950 via-zinc-950/80 to-transparent" />
        
        <div className="relative h-full flex flex-col justify-end p-8 max-w-lg">
          <div className="w-20 h-1 bg-primary mb-8 rounded-full" />
          <h2 className="text-5xl font-bold text-white mb-6 leading-[1.2]">Experience events that <span className="text-primary italic">matter</span>.</h2>
          <p className="text-xl text-zinc-400 mb-8 font-medium">Start your journey today and gain access to the most exclusive event listings and culinary workshops.</p>
          
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10">
            <div className="flex items-center gap-1 mb-4 text-primary">
              {[1, 2, 3, 4, 5].map(i => <Calendar key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-lg text-white font-medium mb-6 italic">"The booking process was seamless, and the events are truly world-class. Best platform I've used!"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl border-2 border-primary overflow-hidden">
                 <Image src="https://picsum.photos/seed/user-reg/100/100" width={48} height={48} alt="Testimonial" />
              </div>
              <div>
                <p className="text-white font-bold">Michael Scott</p>
                <p className="text-zinc-400 text-sm font-medium">Event Enthusiast</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
