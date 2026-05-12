
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { EventCard } from '@/components/event-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Users,
  MapPin,
  Clock,
  Star,
  PlayCircle,
  CheckCircle2
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const heroImg = PlaceHolderImages.find(img => img.id === 'hero-bg');
  
  const featuredEvents = [
    { id: 1, title: 'Summer Jazz Night', category: 'Concert', date: 'Aug 12, 2024', location: 'Hyde Park, London', price: '£45.00', image: 'https://picsum.photos/seed/jazz-1/800/600', isBestseller: true },
    { id: 2, title: 'Royal Pastry Workshop', category: 'Workshop', date: 'Sep 05, 2024', location: 'Mayfair Studio', price: '£120.00', image: 'https://picsum.photos/seed/pastry-1/800/600' },
    { id: 3, title: 'Tech Innovators Summit', category: 'Business', date: 'Oct 22, 2024', location: 'The Shard, London', price: '£299.00', image: 'https://picsum.photos/seed/tech-1/800/600' },
  ];

  return (
    <div className="relative min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-full lg:w-1/2 h-full opacity-10 blur-[100px] pointer-events-none bg-primary rounded-full translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="flex flex-col gap-8"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full w-fit uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Event Management Redefined</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-6xl lg:text-8xl font-black tracking-tighter text-foreground leading-[0.9] lg:max-w-xl">
              Crafting <span className="text-primary italic font-serif">Memorable</span> Moments.
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Discover and host world-class events with elegance. From luxury gala dinners to intimate pastry workshops, we make every moment count.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-5 pt-4">
              <Link href="/explore">
                <Button size="lg" className="rounded-2xl h-16 px-10 text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                  Browse Events <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
              <Link href="/organizers">
                <Button size="lg" variant="outline" className="rounded-2xl h-16 px-10 text-lg font-bold hover:bg-secondary/50 border-2">
                  Host an Event
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-10 pt-10">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-2xl border-4 border-background bg-muted overflow-hidden shadow-xl ring-2 ring-primary/5">
                    <Image src={`https://picsum.photos/seed/user-${i}/100/100`} width={48} height={48} alt="User" />
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex text-primary">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm font-bold text-muted-foreground">Trusted by <span className="text-foreground">25,000+</span> creators</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, type: 'spring' }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border-[12px] border-white dark:border-zinc-900 aspect-[4/5] max-w-[500px] ml-auto">
              <Image 
                src={heroImg?.imageUrl || ''} 
                fill
                alt="Event Hero" 
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 text-white">
                <Badge className="mb-4 bg-primary text-white border-0 px-4 py-1 font-bold tracking-widest uppercase text-[10px]">Upcoming Highlight</Badge>
                <h3 className="text-4xl font-bold mb-4 leading-tight">The Royal Pastel Gala 2024</h3>
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <MapPin className="w-4 h-4 text-primary" /> Kensington, London
                  </span>
                  <span className="flex items-center gap-2 text-sm font-medium text-white/80">
                    <Clock className="w-4 h-4 text-primary" /> June 15 • 19:00
                  </span>
                </div>
              </div>
              
              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center group hover:bg-white hover:scale-110 transition-all">
                <PlayCircle className="w-12 h-12 text-white group-hover:text-primary fill-current" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 px-6 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">Curated <span className="text-primary italic">Experiences</span></h2>
              <p className="text-xl text-muted-foreground font-medium">Discover handpicked premium events and workshops happening near you.</p>
            </div>
            <Link href="/explore">
              <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10 group text-lg">
                View all events <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredEvents.map((event, i) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight">The <span className="text-primary underline decoration-primary/30 underline-offset-8">Gold Standard</span> in Event Tech</h2>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed">Arwa Cakes Pro gives you the sophisticated tools needed to manage luxury events at scale, without the headache.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Sparkles className="w-8 h-8" />, 
                title: "Premium Aesthetics", 
                desc: "A stunning, world-class UI designed for high-end events and sophisticated organizers." 
              },
              { 
                icon: <ShieldCheck className="w-8 h-8" />, 
                title: "Secure Ticketing", 
                desc: "Enterprise-grade security for all your bookings and financial transactions with QR codes." 
              },
              { 
                icon: <TrendingUp className="w-8 h-8" />, 
                title: "Advanced Analytics", 
                desc: "In-depth insights for organizers to track real-time sales and audience behavior." 
              }
            ].map((feature, i) => (
              <div key={i} className="premium-card group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-zinc-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-7xl font-bold tracking-tight">Trusted by World-Class <span className="text-primary italic">Organizers</span>.</h2>
            <p className="text-xl text-zinc-400 font-medium">Join 15,000+ creators and professional organizers building the future of premium events.</p>
            <div className="space-y-4">
              {["Smart Seat Selection", "Automated Billing & Invoices", "Multi-tier Ticket Management"].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span className="text-lg font-bold text-zinc-100">{item}</span>
                </div>
              ))}
            </div>
            <Button size="lg" className="rounded-2xl h-16 px-10 text-lg font-bold">Start Hosting for Free</Button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-6 pt-12">
               <div className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800">
                  <p className="text-lg font-medium italic mb-6">"The most intuitive event platform I've ever used. The attention to detail is phenomenal."</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary" />
                    <div>
                      <p className="font-bold">Sarah Jenkins</p>
                      <p className="text-sm text-zinc-500">Director, Luxury Events</p>
                    </div>
                  </div>
               </div>
               <div className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800">
                  <p className="text-lg font-medium italic mb-6">"Our ticket sales increased by 40% after switching to Arwa Pro's checkout flow."</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500" />
                    <div>
                      <p className="font-bold">James Miller</p>
                      <p className="text-sm text-zinc-500">Workshop Organizer</p>
                    </div>
                  </div>
               </div>
            </div>
            <div className="space-y-6">
               <div className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800">
                  <p className="text-lg font-medium italic mb-6">"The analytics help us understand our audience better than any other tool."</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500" />
                    <div>
                      <p className="font-bold">Elena Rossi</p>
                      <p className="text-sm text-zinc-500">Chef & Caterer</p>
                    </div>
                  </div>
               </div>
               <div className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800">
                  <p className="text-lg font-medium italic mb-6">"Simply the best. Support is top-notch and the design is beautiful."</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500" />
                    <div>
                      <p className="font-bold">David Chen</p>
                      <p className="text-sm text-zinc-500">Conference Lead</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
