"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, MoreVertical, Calendar, MapPin, LayoutGrid, List as ListIcon, 
  Ticket, Clock, ArrowUpRight, Copy, Archive, Trash2 
} from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useEventStore, EventStatus } from '@/store/use-event-store';
import { PremiumButton } from '@/components/ui/premium-button';
import { cn } from '@/lib/utils';

export default function MyEventsDashboard() {
  const { events, deleteEvent, duplicateEvent, archiveEvent } = useEventStore();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'All'>('All');

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           e.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
          <p className="text-muted-foreground">Manage and track your upcoming experiences.</p>
        </div>
        <Link href="/events/create">
          <PremiumButton icon={<Plus size={18} />}>
            Create New Event
          </PremiumButton>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Events', value: events.length, icon: Calendar },
          { label: 'Live Events', value: events.filter(e => e.status === 'Live').length, icon: Ticket },
          { label: 'Revenue', value: `£${events.reduce((acc, e) => acc + e.revenue, 0).toLocaleString()}`, icon: ArrowUpRight },
          { label: 'Drafts', value: events.filter(e => e.status === 'Draft').length, icon: Clock },
        ].map((stat, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center text-primary">
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center pb-4 border-b border-border/50">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full lg:w-auto">
          {(['All', 'Live', 'Draft', 'Published', 'Archived'] as const).map((status) => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all",
                statusFilter === status 
                  ? "bg-primary text-white" 
                  : "text-muted-foreground hover:bg-secondary"
              )}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-10 h-10 rounded-xl border-border/50 bg-secondary/20 focus:bg-background transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {filteredEvents.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="py-20 text-center space-y-4"
          >
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
              <Calendar className="text-muted-foreground" size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold">No events found</h3>
              <p className="text-muted-foreground">Adjust your filters or create a new event to get started.</p>
            </div>
          </motion.div>
        ) : view === 'grid' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredEvents.map((event) => (
              <div key={event.id} className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <Image src={event.image} fill alt="" className="object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-sm text-foreground border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                      {event.status}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-secondary rounded-md text-muted-foreground"><MoreVertical size={16} /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => duplicateEvent(event.id)}><Copy className="w-4 h-4 mr-2" /> Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => archiveEvent(event.id)}><Archive className="w-4 h-4 mr-2" /> Archive</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-rose-500" onClick={() => deleteEvent(event.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium mb-6">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(event.startDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.city}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Revenue</p>
                      <p className="font-bold text-lg">£{event.revenue.toLocaleString()}</p>
                    </div>
                    <Link href={`/events/${event.id}`}>
                      <PremiumButton variant="outline" size="sm" className="h-9 px-4 rounded-xl">Manage</PremiumButton>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-border/50 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-secondary/30 border-b">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Event</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">Revenue</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-muted">
                          <Image src={event.image} fill alt="" className="object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{new Date(event.startDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="secondary" className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{event.status}</Badge>
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-sm">£{event.revenue.toLocaleString()}</td>
                    <td className="px-6 py-5 text-right">
                      <Link href={`/events/${event.id}`}>
                        <PremiumButton variant="outline" size="sm" className="rounded-xl h-8">View</PremiumButton>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}