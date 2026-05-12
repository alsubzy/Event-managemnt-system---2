
"use client";

import React from 'react';
import Link from 'next/link';
import { Calendar, Instagram, Twitter, Linkedin, Facebook, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-950 border-t py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="col-span-1 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Calendar className="text-primary-foreground w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              Arwa <span className="text-primary">Cakes</span>
            </span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            The premium destination for world-class events, luxury catering, and unforgettable culinary journeys. We bring sophistication to every celebration.
          </p>
          <div className="flex gap-4">
            {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
              <Button key={i} variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                <Icon className="w-5 h-5" />
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-foreground">Platform</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/explore" className="hover:text-primary transition-colors">Find Events</Link></li>
            <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
            <li><Link href="/organizers" className="hover:text-primary transition-colors">For Organizers</Link></li>
            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-foreground">Support</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
            <li><Link href="/safety" className="hover:text-primary transition-colors">Safety Guidelines</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-foreground">Join our newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4">Get the latest event invitations and news from the culinary world.</p>
          <div className="space-y-3">
            <Input placeholder="Enter your email" className="rounded-xl h-12 bg-white dark:bg-zinc-900" />
            <Button className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/20">Subscribe</Button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-muted-foreground text-xs font-medium">
          © {new Date().getFullYear()} Arwa Cakes Pro. All rights reserved.
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          Made with <Heart className="w-3 h-3 text-primary fill-primary" /> by the Arwa Team
        </div>
      </div>
    </footer>
  );
}
