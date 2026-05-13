"use client";

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Ticket, ArrowLeft, Edit, ExternalLink, BarChart3, Settings } from 'lucide-react';
import { useEventStore } from '@/store/use-event-store';
import { Badge } from '@/components/ui/badge';
import { PremiumButton } from '@/components/ui/premium-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyChartData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { events } = useEventStore();
  const event = useMemo(() => events.find(e => e.id === id), [events, id]);

  if (!event) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <PremiumButton variant="outline" size="sm" className="w-10 h-10 p-0 rounded-full" onClick={() => router.push('/events')}>
            <ArrowLeft size={16} />
          </PremiumButton>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{event.title}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Calendar size={14} /> {new Date(event.startDate).toDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PremiumButton variant="outline" size="sm" icon={<Edit size={16} />}>Edit</PremiumButton>
          <PremiumButton size="sm" icon={<ExternalLink size={16} />}>View Public</PremiumButton>
        </div>
      </div>

      {/* Hero */}
      <div className="relative aspect-[21/9] rounded-2xl overflow-hidden border border-border/40 shadow-sm bg-muted">
        <Image src={event.image} fill alt="" className="object-cover" />
        <div className="absolute top-6 left-6">
          <Badge className="bg-white text-foreground border-none shadow-sm px-4 py-1.5 font-bold uppercase tracking-widest text-[10px]">{event.status}</Badge>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Current Revenue', value: `£${event.revenue.toLocaleString()}`, icon: ArrowLeft },
          { label: 'Tickets Sold', value: event.ticketsSold, icon: Ticket },
          { label: 'Capacity', value: event.capacity, icon: Users },
          { label: 'Conversion', value: '12.5%', icon: BarChart3 },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-card border border-border/40 rounded-2xl shadow-sm space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-10">
        <TabsList className="bg-transparent h-auto p-0 border-b rounded-none w-full justify-start gap-8">
          {['Overview', 'Analytics', 'Settings'].map((tab) => (
            <TabsTrigger 
              key={tab} 
              value={tab.toLowerCase()} 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent p-3 text-sm font-bold shadow-none"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="space-y-10">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">About this event</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{event.description || "No description provided."}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="p-6 bg-secondary/20 rounded-2xl border border-border/50">
                  <h4 className="font-bold mb-2">Venue</h4>
                  <p className="text-sm text-muted-foreground">{event.location}, {event.city}</p>
                </div>
                <div className="p-6 bg-secondary/20 rounded-2xl border border-border/50">
                  <h4 className="font-bold mb-2">Duration</h4>
                  <p className="text-sm text-muted-foreground">3 hours approx.</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-6 bg-card border border-border/50 rounded-2xl space-y-6">
                <h3 className="font-bold">Sales Progress</h3>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(event.ticketsSold/event.capacity)*100}%` }} />
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <span>{event.ticketsSold} Sold</span>
                  <span>{event.capacity} Capacity</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dummyChartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
}