"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, MoreVertical, Calendar, MapPin,
  LayoutGrid, List as ListIcon, Ticket, Clock,
  ArrowUpRight, Copy, Archive, Trash2, Edit,
  Eye, TrendingUp, Filter,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useEventStore, EventStatus } from '@/store/use-event-store';
import { PremiumButton } from '@/components/ui/premium-button';
import { PageHeader } from '@/components/ui/page-header';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

/* ── Status Config ──────────────────────────────────────── */
const statusConfig: Record<string, { label: string; className: string }> = {
  Live:      { label: 'Live',      className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  Draft:     { label: 'Draft',     className: 'bg-slate-100 text-slate-600 border border-slate-200' },
  Published: { label: 'Published', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  Archived:  { label: 'Archived',  className: 'bg-slate-100 text-slate-400 border border-slate-200' },
  Scheduled: { label: 'Scheduled', className: 'bg-violet-50 text-violet-700 border border-violet-200' },
  Completed: { label: 'Completed', className: 'bg-slate-100 text-slate-500 border border-slate-200' },
  Cancelled: { label: 'Cancelled', className: 'bg-red-50 text-red-600 border border-red-200' },
};

const ALL_STATUSES = ['All', 'Live', 'Published', 'Draft', 'Scheduled', 'Completed', 'Archived'] as const;

export default function MyEventsDashboard() {
  const { events, deleteEvent, duplicateEvent, archiveEvent, publishEvent } = useEventStore();
  const { toast } = useToast();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'All'>('All');

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  const countByStatus = (status: EventStatus | 'All') =>
    status === 'All' ? events.length : events.filter(e => e.status === status).length;

  const handleDelete = (id: string, title: string) => {
    deleteEvent(id);
    toast({ title: 'Event deleted', description: `"${title}" has been removed.` });
  };

  const handleDuplicate = (id: string) => {
    duplicateEvent(id);
    toast({ title: 'Event duplicated', description: 'A draft copy has been created.' });
  };

  const totalRevenue = events.reduce((acc, e) => acc + e.revenue, 0);
  const liveCount    = events.filter(e => e.status === 'Live').length;

  return (
    <div className="space-y-7 animate-fade-in">

      {/* Header */}
      <PageHeader
        title="My Events"
        description="Create, manage, and track all your experiences."
      >
        <Link href="/events/create">
          <PremiumButton size="md" icon={<Plus size={15} />}>New Event</PremiumButton>
        </Link>
      </PageHeader>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Events',  value: events.length,             icon: Calendar,    color: 'bg-primary/10 text-primary' },
          { label: 'Live Now',      value: liveCount,                  icon: TrendingUp,  color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Total Revenue', value: `£${totalRevenue.toLocaleString()}`, icon: Ticket, color: 'bg-violet-50 text-violet-600' },
          { label: 'Drafts',        value: events.filter(e => e.status === 'Draft').length, icon: Clock, color: 'bg-amber-50 text-amber-600' },
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
      <div className="flex flex-col gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {ALL_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as any)}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                statusFilter === s
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              {s}
              <span className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                statusFilter === s ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              )}>
                {countByStatus(s as any)}
              </span>
            </button>
          ))}
        </div>

        {/* Search + View Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 h-9 bg-white border border-slate-200 rounded-lg text-sm
                         placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20
                         focus:border-primary/40 transition-all"
            />
          </div>
          <div className="flex bg-white border border-slate-200 p-1 rounded-lg gap-0.5">
            <button
              onClick={() => setView('grid')}
              className={cn('p-1.5 rounded-md transition-all', view === 'grid' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700')}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn('p-1.5 rounded-md transition-all', view === 'list' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700')}
            >
              <ListIcon size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {filteredEvents.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <Calendar size={28} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No events found</h3>
            <p className="text-sm text-slate-500 mt-1.5 max-w-xs">
              {searchQuery ? 'No events match your search. Try adjusting your filters.' : 'Get started by creating your first event.'}
            </p>
            {!searchQuery && (
              <Link href="/events/create" className="mt-5">
                <PremiumButton size="md" icon={<Plus size={15} />}>Create Your First Event</PremiumButton>
              </Link>
            )}
          </motion.div>

        ) : view === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredEvents.map((event, idx) => {
              const sConfig = statusConfig[event.status] ?? statusConfig.Draft;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="premium-card overflow-hidden group"
                >
                  {/* Image */}
                  <div className="aspect-video relative overflow-hidden bg-slate-100">
                    <Image
                      src={event.image} fill alt={event.title}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3">
                      <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border backdrop-blur-sm bg-white/90', sConfig.className)}>
                        {event.status}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-slate-600 hover:bg-white transition-colors shadow-sm">
                            <MoreVertical size={13} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl p-1.5 w-44 shadow-xl border-slate-200">
                          <DropdownMenuItem asChild>
                            <Link href={`/events/${event.id}`} className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer">
                              <Eye size={13} /> View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer">
                            <Edit size={13} /> Edit Event
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(event.id)} className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer">
                            <Copy size={13} /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => archiveEvent(event.id)} className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer">
                            <Archive size={13} /> Archive
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(event.id, event.title)}
                            className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                          >
                            <Trash2 size={13} /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-semibold text-slate-900 leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1"><Calendar size={11} />{new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1"><MapPin size={11} />{event.city}</span>
                    </div>

                    {/* Progress */}
                    <div className="mt-4">
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="text-slate-500 font-medium">{event.ticketsSold} / {event.capacity} sold</span>
                        <span className="font-semibold text-slate-700">{Math.round((event.ticketsSold / event.capacity) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${Math.min((event.ticketsSold / event.capacity) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium">Revenue</p>
                        <p className="text-base font-bold text-slate-900">£{event.revenue.toLocaleString()}</p>
                      </div>
                      <Link href={`/events/${event.id}`}>
                        <PremiumButton variant="outline" size="sm" iconPosition="right" icon={<ArrowUpRight size={13} />}>
                          Manage
                        </PremiumButton>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        ) : (
          /* List View */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="premium-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {['Event', 'Date', 'Location', 'Tickets', 'Revenue', 'Status', ''].map(h => (
                      <th key={h} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEvents.map((event) => {
                    const sConfig = statusConfig[event.status] ?? statusConfig.Draft;
                    return (
                      <tr key={event.id} className="saas-table-row group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-slate-100 shrink-0">
                              <Image src={event.image} fill alt="" className="object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 group-hover:text-primary transition-colors line-clamp-1">
                                {event.title}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">{event.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-600 font-medium whitespace-nowrap">
                          {new Date(event.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-600 max-w-[160px] truncate">{event.city}</td>
                        <td className="px-5 py-4 text-xs font-medium text-slate-700">
                          {event.ticketsSold}/{event.capacity}
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-slate-900">
                          £{event.revenue.toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border', sConfig.className)}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                                <MoreVertical size={14} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl p-1.5 w-44 shadow-xl border-slate-200">
                              <DropdownMenuItem asChild>
                                <Link href={`/events/${event.id}`} className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer">
                                  <Eye size={13} /> View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDuplicate(event.id)} className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer">
                                <Copy size={13} /> Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(event.id, event.title)}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                              >
                                <Trash2 size={13} /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}