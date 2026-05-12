
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { EventCard } from '@/components/event-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, SlidersHorizontal, MapPin, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const EVENTS = [
  { id: 1, title: 'Summer Jazz Night', category: 'Concert', date: 'Aug 12, 2024', location: 'Hyde Park, London', price: '£45.00', image: 'https://picsum.photos/seed/jazz-1/800/600', isBestseller: true },
  { id: 2, title: 'Royal Pastry Workshop', category: 'Workshop', date: 'Sep 05, 2024', location: 'Mayfair Studio', price: '£120.00', image: 'https://picsum.photos/seed/pastry-1/800/600' },
  { id: 3, title: 'Tech Innovators Summit', category: 'Business', date: 'Oct 22, 2024', location: 'The Shard, London', price: '£299.00', image: 'https://picsum.photos/seed/tech-1/800/600' },
  { id: 4, title: 'Midnight Wine Tasting', category: 'Social', date: 'Jul 28, 2024', location: 'The Cellars', price: '£75.00', image: 'https://picsum.photos/seed/wine-1/800/600' },
  { id: 5, title: 'Garden Wedding Expo', category: 'Wedding', date: 'May 10, 2024', location: 'Chelsea Gardens', price: '£15.00', image: 'https://picsum.photos/seed/wedding-1/800/600' },
  { id: 6, title: 'Artisan Bread Masterclass', category: 'Workshop', date: 'Nov 12, 2024', location: 'Soho Kitchen', price: '£95.00', image: 'https://picsum.photos/seed/bread/800/600' },
  { id: 7, title: 'Vivaldi Four Seasons', category: 'Classical', date: 'Dec 05, 2024', location: 'St Pauls', price: '£55.00', image: 'https://picsum.photos/seed/classic/800/600' },
  { id: 8, title: 'Rooftop Cocktail Night', category: 'Social', date: 'Aug 20, 2024', location: 'The Sky Bar', price: '£35.00', image: 'https://picsum.photos/seed/sky/800/600', isBestseller: true },
  { id: 9, title: 'Modern Marketing 2024', category: 'Business', date: 'Oct 15, 2024', location: 'Design Museum', price: '£150.00', image: 'https://picsum.photos/seed/design/800/600' },
];

const CATEGORIES = ['All', 'Concert', 'Workshop', 'Business', 'Social', 'Wedding', 'Classical'];

export default function ExplorePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = EVENTS.filter(event => {
    const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 space-y-4">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight">Explore <span className="text-primary italic">Events</span></h1>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl">Discover and book the most exclusive culinary and lifestyle events happening worldwide.</p>
          </div>

          <div className="bg-card border border-border/50 p-4 rounded-[2rem] shadow-sm mb-12 flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search events, cities, or categories..." 
                className="pl-14 h-14 rounded-2xl border-none bg-secondary/30 focus-visible:bg-white focus-visible:ring-primary/20 transition-all text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <Button variant="outline" className="h-14 rounded-2xl px-6 gap-2 border-2 font-bold flex-1 lg:flex-none">
                <MapPin className="w-5 h-5 text-primary" /> London, UK
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl px-6 gap-2 border-2 font-bold flex-1 lg:flex-none">
                <CalendarIcon className="w-5 h-5 text-primary" /> Any Date
              </Button>
              <Button size="icon" className="h-14 w-14 rounded-2xl shadow-lg shadow-primary/20">
                <SlidersHorizontal className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'ghost'}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full h-11 px-8 font-bold whitespace-nowrap transition-all",
                  activeCategory === cat ? "shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <EventCard {...event} />
              </motion.div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-32 space-y-6">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-3xl font-bold">No events found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
              <Button variant="outline" onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="rounded-xl border-2 font-bold">Clear All Filters</Button>
            </div>
          )}

          {filteredEvents.length > 0 && (
            <div className="mt-20 flex justify-center items-center gap-3">
              <Button variant="outline" className="rounded-xl h-12 w-12 font-bold border-2">1</Button>
              <Button variant="ghost" className="rounded-xl h-12 w-12 font-bold">2</Button>
              <Button variant="ghost" className="rounded-xl h-12 w-12 font-bold">3</Button>
              <div className="w-10 text-center text-muted-foreground font-bold">...</div>
              <Button variant="ghost" className="rounded-xl h-12 w-12 font-bold">12</Button>
              <Button variant="outline" className="rounded-xl h-12 px-6 font-bold border-2 gap-2">Next <ArrowRight className="w-4 h-4" /></Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
