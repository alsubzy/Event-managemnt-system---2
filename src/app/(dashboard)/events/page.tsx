
"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  MapPin, 
  TrendingUp,
  LayoutGrid,
  List as ListIcon,
  Ticket,
  Copy,
  Archive,
  Trash2,
  ExternalLink,
  ChevronDown,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useEventStore, EventStatus } from '@/store/use-event-store';
import { PremiumButton } from '@/components/ui/premium-button';
import { cn } from '@/lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const statusColors: Record<EventStatus, string> = {
  Draft: "bg-zinc-500",
  Published: "bg-blue-500",
  Scheduled: "bg-indigo-500",
  Live: "bg-emerald-500",
  Completed: "bg-purple-500",
  Cancelled: "bg-rose-500",
  Archived: "bg-amber-600"
};

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

  const stats = useMemo(() => {
    const total = events.length;
    const live = events.filter(e => e.status === 'Live').length;
    const draft = events.filter(e => e.status === 'Draft').length;
    const totalRevenue = events.reduce((acc, e) => acc + e.revenue, 0);
    return { total, live, draft, totalRevenue };
  }, [events]);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">My Events</h1>
          <p className="text-muted-foreground font-medium text-lg">Manage, track, and scale your event empire.</p>
        </div>
        <Link href="/events/create">
          <PremiumButton icon={<Plus size={20} />}>
            Create New Event
          </PremiumButton>
        </Link>
      </div>

      {/* Analytics Overview Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Events', value: stats.total, icon: Calendar, color: 'text-primary' },
          { label: 'Live Now', value: stats.live, icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Drafts', value: stats.draft, icon: Clock, color: 'text-amber-500' },
          { label: 'Total Revenue', value: `£${stats.totalRevenue.toLocaleString()}`, icon: Ticket, color: 'text-indigo-500' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-3xl border-border/50 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center", stat.color)}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black tracking-tight">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center p-4 bg-white dark:bg-zinc-900 border border-border/50 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0">
          {(['All', 'Live', 'Draft', 'Published', 'Archived'] as const).map((status) => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={cn(
                "rounded-2xl px-6 h-11 font-bold transition-all whitespace-nowrap",
                statusFilter === status 
                  ? "bg-[#0B1221] text-white shadow-lg" 
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by title or venue..." 
              className="pl-12 rounded-2xl h-12 border-border/50 bg-secondary/30 focus:bg-background transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex bg-secondary/30 p-1.5 rounded-2xl border border-border/50">
            <button 
              className={cn("rounded-xl h-10 w-10 flex items-center justify-center transition-all", view === 'grid' && "bg-white dark:bg-zinc-800 shadow-sm text-primary")}
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              className={cn("rounded-xl h-10 w-10 flex items-center justify-center transition-all", view === 'list' && "bg-white dark:bg-zinc-800 shadow-sm text-primary")}
              onClick={() => setView('list')}
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-secondary/10 rounded-[3rem] border-2 border-dashed border-border/50">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
            <Calendar className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No events found</h3>
          <p className="text-muted-foreground max-w-sm mb-8 font-medium">Ready to host something amazing? Create your first event now.</p>
          <Link href="/events/create">
            <PremiumButton icon={<Plus size={20} />}>Create Event</PremiumButton>
          </Link>
        </div>
      )}

      {/* Grid View */}
      <AnimatePresence mode="wait">
        {view === 'grid' && filteredEvents.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="rounded-[2.5rem] border-border/50 overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-white dark:bg-zinc-900">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <Image src={event.image} fill alt={event.title} className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4">
                      <Badge className={cn(
                        "rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border-0 text-white shadow-lg",
                        statusColors[event.status]
                      )}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                      <div className="flex gap-3 w-full">
                        <Link href={`/events/${event.id}`} className="flex-1">
                          <PremiumButton className="w-full h-12 text-sm">Manage</PremiumButton>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-7">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-colors">
                            <MoreVertical size={18} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[180px]">
                          <DropdownMenuItem className="rounded-xl py-3 font-medium" onClick={() => duplicateEvent(event.id)}>
                            <Copy className="w-4 h-4 mr-2" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl py-3 font-medium" onClick={() => archiveEvent(event.id)}>
                            <Archive className="w-4 h-4 mr-2" /> Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="rounded-xl py-3 font-medium text-destructive" onClick={() => deleteEvent(event.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <Calendar className="w-4 h-4 text-primary" /> 
                        {new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <MapPin className="w-4 h-4 text-primary" /> {event.location}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-dashed">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Tickets Sold</p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-black">{event.ticketsSold}</p>
                          <span className="text-xs text-muted-foreground font-bold">/ {event.capacity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-widest">Revenue</p>
                        <p className="text-lg font-black text-primary">£{event.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* List View */}
        {view === 'list' && filteredEvents.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="overflow-x-auto rounded-[2.5rem] border border-border/50 bg-white dark:bg-zinc-900"
          >
            <table className="w-full text-left">
              <thead className="bg-secondary/30 border-b">
                <tr>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Event</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Details</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Status</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Sales</th>
                  <th className="px-8 py-6 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Revenue</th>
                  <th className="px-8 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y border-border/50">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="group hover:bg-secondary/10 transition-colors">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 relative rounded-2xl overflow-hidden shadow-sm shrink-0">
                          <Image src={event.image} fill alt="" className="object-cover" />
                        </div>
                        <div>
                          <p className="font-black text-lg group-hover:text-primary transition-colors">{event.title}</p>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{event.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold flex items-center gap-1.5">
                          <Calendar size={14} className="text-primary" /> 
                          {new Date(event.startDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                          <MapPin size={12} className="text-primary" /> {event.location}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <Badge className={cn(
                        "rounded-full px-4 py-1 font-bold text-[10px] uppercase tracking-widest border-0 text-white",
                        statusColors[event.status]
                      )}>{event.status}</Badge>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>{event.ticketsSold} Sold</span>
                          <span className="text-muted-foreground">{Math.round((event.ticketsSold/event.capacity)*100)}%</span>
                        </div>
                        <div className="h-2 w-32 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${(event.ticketsSold/event.capacity)*100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <span className="font-black text-lg text-primary">£{event.revenue.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/events/${event.id}`}>
                          <button className="w-10 h-10 rounded-xl bg-secondary/50 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                            <ArrowUpRight size={18} />
                          </button>
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-10 h-10 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors">
                              <MoreVertical size={18} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[180px]">
                            <DropdownMenuItem className="rounded-xl py-3 font-medium" onClick={() => duplicateEvent(event.id)}>
                              <Copy className="w-4 h-4 mr-2" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-3 font-medium" onClick={() => archiveEvent(event.id)}>
                              <Archive className="w-4 h-4 mr-2" /> Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="rounded-xl py-3 font-medium text-destructive" onClick={() => deleteEvent(event.id)}>
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
