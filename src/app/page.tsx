"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { EventCard } from '@/components/event-card';
import { PremiumButton } from '@/components/ui/premium-button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, ShieldCheck, TrendingUp, Users, MapPin, Clock, Star, PlayCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');
  
  const featuredEvents = [
    { id: '1', title: 'Summer Jazz Night', category: 'Concert', date: 'Aug 12, 2024', location: 'Hyde Park, London', price: '£45.00', image: 'https://picsum.photos/seed/jazz-1/800/600' },
    { id: '2', title: 'Royal Pastry Workshop', category: 'Workshop', date: 'Sep 05, 2024', location: 'Mayfair Studio', price: '£120.00', image: 'https://picsum.photos/seed/pastry-1/800/600' },
    { id: '3', title: 'Tech Innovators Summit', category: 'Business', date: 'Oct 22, 2024', location: 'The Shard, London', price: '£299.00', image: 'https://picsum.photos/seed/tech-1/800/600' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8 lg:pt-56 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-4xl"
          >
            <Badge className="bg-secondary/80 text-primary border-none rounded-full px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
              Next-Gen Event Management
            </Badge>
            <h1 className="text-6xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-[#0B1221]">
              Experiences worth <span className="text-muted-foreground/20 italic">remembering.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
              Arwa Pro is the high-performance platform for elite organizers to create, manage, and scale world-class events effortlessly.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link href="/explore">
              <PremiumButton size="lg" className="h-16 px-10">Browse Events</PremiumButton>
            </Link>
            <Link href="/register">
              <PremiumButton variant="outline" size="lg" className="h-16 px-10 border-2">Become Organizer</PremiumButton>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-6xl aspect-[21/9] rounded-[3rem] overflow-hidden border border-border shadow-2xl relative"
          >
            <Image src={heroImg?.imageUrl || ''} fill alt="Platform Preview" className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-12 left-12 text-left">
              <p className="text-white/60 font-black uppercase tracking-[0.3em] text-[10px] mb-2">Editor Choice</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">Pastry Masterclass 2024</h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-32 px-8 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight">Curated Experiences</h2>
              <p className="text-muted-foreground font-medium">Handpicked premium events happening near you.</p>
            </div>
            <Link href="/explore">
              <PremiumButton variant="ghost" icon={<ArrowRight size={16} />}>View All</PremiumButton>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto text-center space-y-24">
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-4xl font-black tracking-tight">Enterprise Standard</h2>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Powering over 25,000 successful events annually with sophisticated tools designed for scale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-left">
            {[
              { icon: Sparkles, title: "Artisan UX", desc: "A clean, focused interface that puts your content front and center." },
              { icon: ShieldCheck, title: "Vault Security", desc: "Enterprise-grade encryption for all transactions and user data." },
              { icon: TrendingUp, title: "Growth Intelligence", desc: "Predictive analytics to help you sell more tickets faster." }
            ].map((f, i) => (
              <div key={i} className="space-y-6">
                <div className="w-14 h-14 bg-secondary flex items-center justify-center rounded-2xl text-primary">
                  <f.icon size={24} />
                </div>
                <h4 className="text-xl font-bold tracking-tight">{f.title}</h4>
                <p className="text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}