"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Search, LayoutGrid, List, Calendar, MapPin,
  ArrowUpRight, Share2, Ticket, Trash2, SlidersHorizontal, Clock, Plus,
} from 'lucide-react';
import { useFavoriteStore } from '@/store/use-favorite-store';
import { useEventStore } from '@/store/use-event-store';
import { PremiumButton } from '@/components/ui/premium-button';
import { PageHeader } from '@/components/ui/page-header';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function FavoritesPage() {
  const { favoriteIds, toggleFavorite } = useFavoriteStore();
  const { events } = useEventStore();
  const { toast } = useToast();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'date' | 'alpha'>('newest');

  const favoriteEvents = useMemo(() =>
    events.filter(e => favoriteIds.includes(e.id)),
    [events, favoriteIds]
  );

  const filteredFavorites = useMemo(() => {
    let filtered = favoriteEvents.filter(e =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortBy === 'date')  filtered = [...filtered].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    if (sortBy === 'alpha') filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    return filtered;
  }, [favoriteEvents, searchQuery, sortBy]);

  const upcomingFavorites = favoriteEvents.filter(e => new Date(e.startDate) > new Date());

  const handleRemoveFavorite = (id: string, title: string) => {
    toggleFavorite(id);
    toast({ title: 'Removed from collection', description: `"${title}" was removed.` });
  };

  const statusConfig: Record<string, string> = {
    Live:      'bg-emerald-50 text-emerald-700 border-emerald-200',
    Draft:     'bg-slate-100  text-slate-500   border-slate-200',
    Published: 'bg-blue-50   text-blue-700   border-blue-200',
    Archived:  'bg-slate-100  text-slate-400   border-slate-200',
  };

  return (
    <div className="space-y-7 animate-fade-in">

      <PageHeader
        title="Collection"
        description="Events you've saved and want to track."
      >
        <Link href="/events">
          <PremiumButton variant="outline" size="sm" icon={<ArrowUpRight size={14} />}>
            Explore Events
          </PremiumButton>
        </Link>
      </PageHeader>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Saved',  value: favoriteEvents.length,                               icon: Heart,            color: 'bg-rose-50 text-rose-500'    },
          { label: 'Upcoming',     value: upcomingFavorites.length,                             icon: Calendar,         color: 'bg-primary/10 text-primary'  },
          { label: 'Categories',   value: new Set(favoriteEvents.map(e => e.category)).size,    icon: SlidersHorizontal,color: 'bg-violet-50 text-violet-600' },
          { label: 'Drafts',       value: favoriteEvents.filter(e => e.status === 'Draft').length, icon: Clock,         color: 'bg-amber-50 text-amber-600'  },
        ].map((s, i) => (
          <div key={i} className="stat-card flex items-center gap-3.5">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', s.color)}>
              <s.icon size={17} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{s.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search collection..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-9 bg-white border border-slate-200 rounded-lg text-sm
                         placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20
                         focus:border-primary/40 transition-all"
            />
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="newest">Newest Saved</option>
            <option value="date">Event Date</option>
            <option value="alpha">Alphabetical</option>
          </select>
        </div>

        <div className="flex bg-white border border-slate-200 p-1 rounded-lg gap-0.5">
          <button
            onClick={() => setView('grid')}
            className={cn('p-1.5 rounded-md transition-all', view === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-700')}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn('p-1.5 rounded-md transition-all', view === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-700')}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {filteredFavorites.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-28 flex flex-col items-center justify-center text-center"
          >
            <div className="relative w-20 h-20 mb-5">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center">
                <Heart size={36} className="text-slate-200" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-white rounded-full border border-slate-200 shadow-sm flex items-center justify-center">
                <Plus size={16} className="text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Your collection is empty</h3>
            <p className="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto">
              {searchQuery
                ? 'No saved events match your search.'
                : 'Discover events that inspire you and save them here to track availability and updates.'}
            </p>
            {!searchQuery && (
              <Link href="/events" className="mt-5">
                <PremiumButton icon={<ArrowUpRight size={15} />}>Browse Events</PremiumButton>
              </Link>
            )}
          </motion.div>

        ) : view === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredFavorites.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="premium-card overflow-hidden group"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                  <Image src={event.image} fill alt={event.title} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 left-3">
                    <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full border bg-white/90 backdrop-blur-sm uppercase tracking-wide', statusConfig[event.status] ?? 'bg-slate-100 text-slate-500 border-slate-200')}>
                      {event.status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(event.id, event.title)}
                    className="absolute top-3 right-3 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                    title="Remove from collection"
                  >
                    <Heart size={13} className="fill-current" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={10} />{new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    <span className="flex items-center gap-1"><MapPin size={10} />{event.city}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <p className="text-sm font-bold text-primary">£{event.price.toLocaleString()}</p>
                    <Link href={`/events/${event.id}`}>
                      <button className="text-[10px] font-bold text-slate-500 hover:text-primary flex items-center gap-1 transition-colors">
                        View <ArrowUpRight size={11} />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {filteredFavorites.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="premium-card p-4 flex flex-col sm:flex-row items-center gap-4 group"
              >
                <div className="w-full sm:w-24 aspect-video sm:aspect-square relative rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <Image src={event.image} fill alt={event.title} className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>

                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors truncate">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                        title="Share"
                      >
                        <Share2 size={13} />
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(event.id, event.title)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium"><Calendar size={11} />{new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="flex items-center gap-1 font-medium"><MapPin size={11} />{event.location}</span>
                    <span className="flex items-center gap-1 font-bold text-primary"><Ticket size={11} />£{event.price.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide', statusConfig[event.status] ?? 'bg-slate-100 text-slate-500 border-slate-200')}>
                      {event.status}
                    </span>
                    <Link href={`/events/${event.id}`}>
                      <PremiumButton variant="outline" size="sm" iconPosition="right" icon={<ArrowUpRight size={12} />}>
                        Book Now
                      </PremiumButton>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
