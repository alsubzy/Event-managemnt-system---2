
"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { EventCard } from '@/components/event-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Calendar as CalendarIcon, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useEventStore } from '@/store/use-event-store';
import { cn } from '@/lib/utils';

const CATEGORIES = ['All', 'Concert', 'Workshop', 'Business', 'Social', 'Wedding', 'Classical'];

export default function ExplorePage() {
  const { events } = useEventStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            event.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [events, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 space-y-4">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
              <span className="w-10 h-[1px] bg-primary"></span>
              Live Experiences
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight">Explore <span className="text-primary italic font-serif">Events</span></h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl">Discover and book the most exclusive culinary and lifestyle events happening worldwide.</p>
          </div>

          <div className="bg-card border border-border/40 p-4 rounded-[2.5rem] shadow-sm mb-16 flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search events, cities, or categories..." 
                className="pl-16 h-16 rounded-[1.5rem] border-none bg-secondary/30 focus-visible:bg-white focus-visible:ring-primary/10 transition-all text-lg font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <Button variant="outline" className="h-16 rounded-[1.5rem] px-8 gap-3 border-2 font-bold flex-1 lg:flex-none">
                <MapPin className="w-5 h-5 text-primary" /> London, UK
              </Button>
              <Button size="icon" className="h-16 w-16 rounded-[1.5rem] shadow-xl shadow-primary/10 bg-[#0B1221] text-white hover:opacity-95">
                <SlidersHorizontal className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-16 overflow-x-auto pb-4 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'ghost'}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full h-12 px-8 font-black text-xs uppercase tracking-widest transition-all",
                  activeCategory === cat 
                    ? "bg-[#0B1221] text-white shadow-xl shadow-black/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <EventCard {...event} date={new Date(event.startDate).toDateString()} />
              </motion.div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-40 space-y-8">
              <div className="w-32 h-32 bg-secondary rounded-[3rem] flex items-center justify-center mx-auto relative">
                <Search className="w-12 h-12 text-muted-foreground/30" />
                <div className="absolute inset-0 bg-primary/5 rounded-[3rem] animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tight text-foreground">No matches found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto font-medium">Try adjusting your filters or search query to find what you're looking for.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} 
                className="h-14 px-8 rounded-2xl border-2 font-black uppercase tracking-widest text-xs"
              >
                Clear All Filters
              </Button>
            </div>
          )}

          {filteredEvents.length > 0 && (
            <div className="mt-24 flex justify-center items-center gap-3">
              <div className="flex items-center bg-secondary/50 p-1.5 rounded-2xl">
                <Button variant="default" className="rounded-xl h-11 w-11 font-black bg-[#0B1221]">1</Button>
                <Button variant="ghost" className="rounded-xl h-11 w-11 font-black">2</Button>
                <Button variant="ghost" className="rounded-xl h-11 w-11 font-black">3</Button>
                <div className="w-11 text-center text-muted-foreground font-black">...</div>
                <Button variant="ghost" className="rounded-xl h-11 w-11 font-black">12</Button>
              </div>
              <Button variant="outline" className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-xs border-2 gap-3 hover:bg-primary hover:text-white transition-all">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
