
"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Search, Filter, LayoutGrid, List, Calendar, MapPin, 
  ArrowUpRight, Share2, Ticket, Trash2, SlidersHorizontal, Clock
} from 'lucide-react';
import { useFavoriteStore } from '@/store/use-favorite-store';
import { useEventStore } from '@/store/use-event-store';
import { PremiumButton } from '@/components/ui/premium-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EventCard } from '@/components/event-card';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export default function FavoritesPage() {
  const { favoriteIds, toggleFavorite } = useFavoriteStore();
  const { events } = useEventStore();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'date' | 'alpha'>('newest');

  const favoriteEvents = useMemo(() => {
    return events.filter(e => favoriteIds.includes(e.id));
  }, [events, favoriteIds]);

  const filteredFavorites = useMemo(() => {
    let filtered = favoriteEvents.filter(e => 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === 'date') {
      filtered = [...filtered].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    } else if (sortBy === 'alpha') {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    }
    
    return filtered;
  }, [favoriteEvents, searchQuery, sortBy]);

  const upcomingFavorites = favoriteEvents.filter(e => new Date(e.startDate) > new Date());

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <Heart className="w-5 h-5 fill-current" />
            <span className="text-xs font-bold uppercase tracking-widest">Your Collection</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Events</h1>
          <p className="text-muted-foreground">Manage the experiences you've saved for later.</p>
        </div>
        <Link href="/explore">
          <PremiumButton variant="outline" size="sm" icon={<ArrowUpRight size={16} />}>
            Explore More
          </PremiumButton>
        </Link>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Saved', value: favoriteEvents.length, icon: Heart, color: 'text-rose-500' },
          { label: 'Upcoming', value: upcomingFavorites.length, icon: Calendar, color: 'text-primary' },
          { label: 'Categories', value: new Set(favoriteEvents.map(e => e.category)).size, icon: SlidersHorizontal, color: 'text-accent' },
          { label: 'Drafted', value: favoriteEvents.filter(e => e.status === 'Draft').length, icon: Clock, color: 'text-muted-foreground' },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border/40 rounded-[1.5rem] p-6 shadow-sm flex items-center gap-5">
            <div className={cn("w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center", stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center pb-4 border-b border-border/40">
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search your favorites..." 
              className="pl-12 h-11 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-11 px-4 rounded-xl border border-border/40 bg-secondary/30 text-sm font-medium focus:outline-none"
          >
            <option value="newest">Newest Saved</option>
            <option value="date">Event Date</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </div>

        <div className="flex bg-secondary/50 p-1 rounded-xl">
          <button 
            className={cn("p-2 rounded-lg transition-all", view === 'grid' ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}
            onClick={() => setView('grid')}
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            className={cn("p-2 rounded-lg transition-all", view === 'list' ? "bg-white shadow-sm text-primary" : "text-muted-foreground")}
            onClick={() => setView('list')}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {filteredFavorites.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-32 flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="w-24 h-24 bg-secondary rounded-[2rem] flex items-center justify-center relative">
              <Heart size={40} className="text-muted-foreground/20" />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <PlusIcon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Your wishlist is empty</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">Discover events that inspire you and save them here to track their availability and updates.</p>
            </div>
            <Link href="/explore">
              <PremiumButton icon={<ArrowUpRight size={18} />}>Explore Events</PremiumButton>
            </Link>
          </motion.div>
        ) : view === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredFavorites.map((event) => (
              <EventCard key={event.id} {...event} date={new Date(event.startDate).toDateString()} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredFavorites.map((event) => (
              <div 
                key={event.id} 
                className="group bg-card border border-border/40 rounded-[1.5rem] p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-lg transition-all"
              >
                <div className="w-full md:w-48 aspect-video md:aspect-square relative rounded-xl overflow-hidden shrink-0">
                  <Image src={event.image} fill alt="" className="object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-white/90 text-foreground border-none font-black text-[8px] uppercase tracking-widest px-2 py-0.5">{event.category}</Badge>
                  </div>
                </div>
                
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{event.title}</h3>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-secondary rounded-xl text-muted-foreground transition-colors"><Share2 size={16} /></button>
                      <button 
                        onClick={() => toggleFavorite(event.id)}
                        className="p-2 hover:bg-rose-50 rounded-xl text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-medium"><Calendar size={14} /> {new Date(event.startDate).toDateString()}</span>
                    <span className="flex items-center gap-1.5 font-medium"><MapPin size={14} /> {event.location}</span>
                    <span className="flex items-center gap-1.5 font-bold text-primary"><Ticket size={14} /> £{event.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="pt-4 flex items-center justify-between">
                    <Badge variant="secondary" className="rounded-full px-3 py-1 font-bold text-[9px] uppercase tracking-widest">{event.status}</Badge>
                    <Link href={`/events/${event.id}`}>
                      <PremiumButton variant="outline" size="sm" className="h-9 px-4 rounded-xl">Book Now</PremiumButton>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="M12 5v14"/>
    </svg>
  );
}
