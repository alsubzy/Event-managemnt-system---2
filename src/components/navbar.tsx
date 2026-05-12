"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Calendar, Search, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/use-ui-store';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        scrolled ? 'bg-background/80 backdrop-blur-md border-b shadow-sm py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Calendar className="text-primary-foreground w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Arwa <span className="text-primary">Cakes</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/explore" className="hover:text-primary transition-colors">Explore</Link>
          <Link href="/categories" className="hover:text-primary transition-colors">Categories</Link>
          <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? '🌙' : '☀️'}
          </Button>
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button className="rounded-full px-6 shadow-md hover:shadow-lg transition-all">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b p-6 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            <Link href="/explore" className="text-lg font-medium">Explore</Link>
            <Link href="/categories" className="text-lg font-medium">Categories</Link>
            <Link href="/pricing" className="text-lg font-medium">Pricing</Link>
            <hr />
            <Link href="/login">
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}