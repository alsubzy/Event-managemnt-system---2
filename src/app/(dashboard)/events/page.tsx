
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  MapPin, 
  Users, 
  ArrowUpRight,
  ChevronDown,
  LayoutGrid,
  List as ListIcon,
  Ticket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const MOCK_EVENTS = [
  { id: 1, title: 'Summer Jazz Night', status: 'Live', date: 'Aug 12, 2024', location: 'Hyde Park, London', tickets: '850/1000', price: '£45.00', image: 'https://picsum.photos/seed/event-jazz/800/600' },
  { id: 2, title: 'Royal Pastry Workshop', status: 'Draft', date: 'Sep 05, 2024', location: 'Mayfair Studio', tickets: '0/25', price: '£120.00', image: 'https://picsum.photos/seed/event-pastry/800/600' },
  { id: 3, title: 'Tech Innovators Summit', status: 'Live', date: 'Oct 22, 2024', location: 'The Shard, London', tickets: '120/150', price: '£299.00', image: 'https://picsum.photos/seed/event-tech/800/600' },
  { id: 4, title: 'Garden Wedding Expo', status: 'Past', date: 'May 10, 2024', location: 'Chelsea Gardens', tickets: '450/500', price: '£15.00', image: 'https://picsum.photos/seed/event-wedding/800/600' },
  { id: 5, title: 'Midnight Wine Tasting', status: 'Live', date: 'Jul 28, 2024', location: 'The Cellars', tickets: '45/60', price: '£75.00', image: 'https://picsum.photos/seed/event-wine/800/600' },
];

export default function EventsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [activeStatus, setActiveStatus] = useState('All');

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">My Events</h1>
          <p className="text-muted-foreground">Manage your event listings and track ticket sales.</p>
        </div>
        <Link href="/events/create">
          <Button size="lg" className="rounded-2xl shadow-xl shadow-primary/20 h-14 px-8 font-bold gap-2">
            <Plus className="w-5 h-5" /> Create New Event
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center p-4 bg-card border border-border/50 rounded-3xl shadow-sm">
        <div className="flex items-center gap-2 w-full lg:w-auto">
          {['All', 'Live', 'Draft', 'Past'].map((status) => (
            <Button 
              key={status}
              onClick={() => setActiveStatus(status)}
              variant={activeStatus === status ? 'default' : 'ghost'} 
              className={cn("rounded-2xl px-6 h-10 font-bold", activeStatus === status ? "shadow-md" : "")}
            >
              {status}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search events..." 
              className="pl-12 rounded-2xl h-12 border-border/50 bg-secondary/30 focus:bg-background transition-all"
            />
          </div>
          <div className="flex bg-secondary/30 p-1 rounded-2xl border border-border/50">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("rounded-xl h-10 w-10", view === 'grid' && "bg-background shadow-sm text-primary")}
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("rounded-xl h-10 w-10", view === 'list' && "bg-background shadow-sm text-primary")}
              onClick={() => setView('list')}
            >
              <ListIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {view === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_EVENTS.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="rounded-3xl border-border/50 overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <Image src={event.image} fill alt={event.title} className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <Badge className={cn(
                      "rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest border-0",
                      event.status === 'Live' ? "bg-emerald-500 text-white" : 
                      event.status === 'Draft' ? "bg-amber-500 text-white" : "bg-zinc-500 text-white"
                    )}>
                      {event.status}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                    <Link href={`/events/${event.id}`} className="w-full">
                      <Button className="w-full rounded-2xl h-12 gap-2 font-bold shadow-lg shadow-primary/20">
                        View Details <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <Calendar className="w-4 h-4 text-primary" /> {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <MapPin className="w-4 h-4 text-primary" /> {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                      <Ticket className="w-4 h-4 text-primary" /> {event.tickets} Tickets Sold
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-dashed">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Price per ticket</p>
                      <p className="text-2xl font-bold">{event.price}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary"><MoreVertical className="w-5 h-5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px]">
                        <DropdownMenuItem className="rounded-xl py-3 font-medium">Edit Event</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl py-3 font-medium">Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl py-3 font-medium text-destructive">Delete Event</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {/* Create New Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group"
          >
            <Link href="/events/create" className="h-full">
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-3xl group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <Plus className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Create New Event</h3>
                <p className="text-muted-foreground text-center">Ready to host something amazing? Get started now.</p>
              </div>
            </Link>
          </motion.div>
        </div>
      ) : (
        /* List View */
        <Card className="rounded-3xl border-border/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/30 border-b">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Event</th>
                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Date & Location</th>
                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Tickets Sold</th>
                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Price</th>
                <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {MOCK_EVENTS.map((event) => (
                <tr key={event.id} className="group hover:bg-secondary/10 transition-colors">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 relative rounded-xl overflow-hidden shrink-0">
                        <Image src={event.image} fill alt="" className="object-cover" />
                      </div>
                      <span className="font-bold text-base group-hover:text-primary transition-colors">{event.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">{event.date}</span>
                      <span className="text-xs text-muted-foreground">{event.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-bold">{event.tickets}</span>
                      <div className="h-1.5 w-32 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(parseInt(event.tickets.split('/')[0]) / parseInt(event.tickets.split('/')[1])) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="font-bold">{event.price}</span>
                  </td>
                  <td className="px-6 py-6">
                    <Badge variant="secondary" className={cn(
                      "rounded-full px-3 py-1 font-bold",
                      event.status === 'Live' ? 'text-emerald-500 bg-emerald-50' : 'text-amber-500 bg-amber-50'
                    )}>{event.status}</Badge>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="w-5 h-5" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
