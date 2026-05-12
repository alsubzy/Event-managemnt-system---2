
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowRight, 
  Calendar, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  MapPin, 
  Clock,
  Heart,
  ChevronRight,
  Star
} from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

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
  const featureImg = PlaceHolderImages.find(img => img.id === 'feature-cakes');

  return (
    <div className="relative min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full opacity-10 blur-3xl pointer-events-none">
          <div className="w-full h-full bg-primary rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="flex flex-col gap-6"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full w-fit">
              <Sparkles className="w-4 h-4" />
              <span>Event Management Redefined</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              Crafting <span className="text-primary italic">Memorable</span> Events with Elegance.
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground max-w-lg">
              Arwa Cakes Pro is the ultimate platform to discover, book, and manage world-class events and premium catering with unmatched sophistication.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
              <Link href="/explore">
                <Button size="lg" className="rounded-full h-14 px-8 text-lg font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                  Browse Events <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/organizers">
                <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg font-semibold hover:bg-secondary/50">
                  Host an Event
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center gap-8 pt-10">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                    <Image src={`https://picsum.photos/seed/user${i}/100/100`} width={40} height={40} alt="User" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex text-primary">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-muted-foreground">Joined by <span className="font-bold text-foreground">10k+</span> event lovers</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-zinc-800">
              <Image 
                src={heroImg?.imageUrl || ''} 
                width={800} 
                height={1000} 
                alt="Event Hero" 
                className="w-full h-auto object-cover"
                data-ai-hint="event celebration"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-2">Featured Event</p>
                <h3 className="text-3xl font-bold">The Royal Gala 2024</h3>
                <div className="flex items-center gap-4 mt-4">
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                    <MapPin className="w-3 h-3" /> London, UK
                  </span>
                  <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs">
                    <Clock className="w-3 h-3" /> June 15, 2024
                  </span>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-10 -left-10 z-20 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-xl border"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                  <Users className="text-accent-foreground w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Attendees</p>
                  <p className="text-lg font-bold">1,200+</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-10 z-20 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl border"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 bg-primary rounded-full overflow-hidden">
                   <Image src="https://picsum.photos/seed/chef/100/100" width={48} height={48} alt="Chef" />
                </div>
                <div>
                  <p className="text-sm font-bold">Chef Marco</p>
                  <p className="text-xs text-muted-foreground">Executive Pastry Chef</p>
                </div>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[85%]" />
              </div>
              <p className="text-[10px] text-right mt-1 text-muted-foreground italic">Menu ready: 85%</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Events Hosted", value: "2,500+" },
              { label: "Happy Clients", value: "15,000+" },
              { label: "Catering Menus", value: "450+" },
              { label: "Expert Partners", value: "120+" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-3xl lg:text-5xl font-bold text-foreground mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div className="max-w-xl">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">Trending Near You</h2>
              <p className="text-lg text-muted-foreground">Handpicked experiences and luxury events happening soon.</p>
            </div>
            <Link href="/explore">
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 group">
                View all events <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group relative bg-card rounded-3xl overflow-hidden border soft-shadow"
              >
                <div className="aspect-[4/3] relative">
                  <Image 
                    src={PlaceHolderImages.find(img => img.id === `event-${i}`)?.imageUrl || ''} 
                    fill 
                    alt="Event" 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    data-ai-hint="luxury event"
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <Button size="icon" variant="secondary" className="rounded-full bg-white/80 backdrop-blur-md border-0 hover:bg-white transition-colors">
                      <Heart className="w-5 h-5 text-foreground hover:fill-primary hover:text-primary" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Bestseller</span>
                    <span className="bg-white/80 backdrop-blur-md text-foreground text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Catering Incl.</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-primary uppercase tracking-widest">Wedding & Reception</span>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" /> 4.9
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">The Serenity Garden Gala</h3>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Kensington Gardens, London
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Sat, 24 Aug • 18:30
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Tickets from</p>
                      <p className="text-2xl font-bold text-foreground">£120.00</p>
                    </div>
                    <Link href="/checkout">
                      <Button className="rounded-full">Book Now</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-zinc-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/5 opacity-30 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6">Designed for Seamless <span className="text-primary italic">Experiences</span></h2>
            <p className="text-xl text-zinc-400">Arwa Cakes Pro gives you the tools to create, manage, and enjoy world-class events without the complexity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Sparkles className="w-8 h-8" />, 
                title: "Premium Design", 
                desc: "A stunning UI designed for high-end events and sophisticated users." 
              },
              { 
                icon: <ShieldCheck className="w-8 h-8" />, 
                title: "Secure Payments", 
                desc: "Enterprise-grade security for all your bookings and financial transactions." 
              },
              { 
                icon: <TrendingUp className="w-8 h-8" />, 
                title: "Smart Analytics", 
                desc: "In-depth insights for organizers to optimize event performance and sales." 
              }
            ].map((feature, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl hover:bg-zinc-900 transition-colors">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center text-primary mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-16">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { name: "Starter", price: "0", features: ["Host up to 2 events", "Standard ticketing", "Email support"] },
              { name: "Professional", price: "49", features: ["Unlimited events", "Priority ticketing", "Advanced analytics", "24/7 Support"], featured: true },
              { name: "Enterprise", price: "Custom", features: ["Custom branding", "API access", "Dedicated account manager", "White-label solution"] }
            ].map((plan, i) => (
              <Card key={i} className={cn("rounded-3xl p-8 border-2 transition-all hover:scale-105", plan.featured ? "border-primary shadow-xl ring-4 ring-primary/10" : "border-border")}>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">£{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
                  </div>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <ShieldCheck className="w-4 h-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Button className={cn("w-full rounded-full h-12", plan.featured ? "" : "variant-outline")} variant={plan.featured ? "default" : "outline"}>
                  Choose {plan.name}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-50 dark:bg-zinc-950 border-t py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Calendar className="text-primary-foreground w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                Arwa <span className="text-primary">Cakes</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm text-lg">
              The premium destination for world-class events and unforgettable culinary journeys.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Platform</h4>
            <ul className="space-y-4 text-muted-foreground font-medium">
              <li><Link href="/explore" className="hover:text-primary transition-colors">Find Events</Link></li>
              <li><Link href="/organizers" className="hover:text-primary transition-colors">For Organizers</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-sm">Legal</h4>
            <ul className="space-y-4 text-muted-foreground font-medium">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-sm">© 2024 Arwa Cakes Pro. All rights reserved.</p>
          <div className="flex gap-6">
             {/* Social placeholders */}
             <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer text-muted-foreground hover:text-primary">
                <Heart className="w-5 h-5" />
             </div>
             <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer text-muted-foreground hover:text-primary">
                <Users className="w-5 h-5" />
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
