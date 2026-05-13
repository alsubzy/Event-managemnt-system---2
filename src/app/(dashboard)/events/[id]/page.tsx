
"use client";

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Ticket, 
  TrendingUp, 
  ArrowLeft, 
  Settings, 
  BarChart3, 
  MoreVertical,
  Edit,
  ExternalLink,
  Users2,
  PieChart as PieChartIcon,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useEventStore } from '@/store/use-event-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PremiumButton } from '@/components/ui/premium-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const revenueData = [
  { day: 'Mon', sales: 12 },
  { day: 'Tue', sales: 18 },
  { day: 'Wed', sales: 15 },
  { day: 'Thu', sales: 25 },
  { day: 'Fri', sales: 35 },
  { day: 'Sat', sales: 45 },
  { day: 'Sun', sales: 30 },
];

export default function EventDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { events } = useEventStore();
  
  const event = useMemo(() => events.find(e => e.id === id), [events, id]);

  if (!event) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-bold mb-4">Event not found</h2>
        <PremiumButton onClick={() => router.push('/events')}>Return to Events</PremiumButton>
      </div>
    );
  }

  return (
    <div className="pb-20 space-y-10">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <PremiumButton 
          variant="outline" 
          onClick={() => router.push('/events')}
          icon={<ArrowLeft size={18} />}
          className="rounded-xl h-10 px-4"
        >
          Back to Events
        </PremiumButton>
        <div className="flex gap-3">
          <PremiumButton variant="outline" className="rounded-xl h-10 px-4">
            <Edit size={16} className="mr-2" /> Edit
          </PremiumButton>
          <PremiumButton className="rounded-xl h-10 px-4">
            <ExternalLink size={16} className="mr-2" /> View Public Page
          </PremiumButton>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative aspect-[21/7] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800">
        <Image src={event.image} fill alt="" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Badge className="bg-primary text-white border-0 px-4 py-1 font-bold tracking-widest uppercase text-[10px]">
              {event.status}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <span className="flex items-center gap-2 text-sm font-bold">
                <Calendar className="w-4 h-4 text-primary" /> 
                {new Date(event.startDate).toLocaleDateString('en-GB', { dateStyle: 'long' })}
              </span>
              <span className="flex items-center gap-2 text-sm font-bold">
                <MapPin className="w-4 h-4 text-primary" /> {event.location}
              </span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20 min-w-[200px]">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Current Revenue</p>
            <p className="text-3xl font-black text-white">£{event.revenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-secondary/50 p-1.5 rounded-2xl border border-border/50 h-auto gap-2">
          <TabsTrigger value="overview" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-md">Overview</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-md">Analytics</TabsTrigger>
          <TabsTrigger value="attendees" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-md">Attendees</TabsTrigger>
          <TabsTrigger value="settings" className="rounded-xl px-6 py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-md">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="rounded-[2.5rem] border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">About this event</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                    {event.description}
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="rounded-[2.5rem] border-border/50 p-8 flex items-center gap-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Ticket size={32} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Ticket Price</p>
                    <p className="text-3xl font-black">£{event.price}</p>
                  </div>
                </Card>
                <Card className="rounded-[2.5rem] border-border/50 p-8 flex items-center gap-6">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                    <Users size={32} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Total Capacity</p>
                    <p className="text-3xl font-black">{event.capacity}</p>
                  </div>
                </Card>
              </div>
            </div>

            <div className="space-y-8">
              <Card className="rounded-[2.5rem] border-border/50">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Ticket Sales</CardTitle>
                  <CardDescription>Real-time progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative aspect-square rounded-full border-[16px] border-secondary flex items-center justify-center">
                    <div 
                      className="absolute inset-[-16px] rounded-full border-[16px] border-primary transition-all duration-1000"
                      style={{ 
                        clipPath: `polygon(50% 50%, 50% 0%, ${event.ticketsSold/event.capacity > 0.5 ? '100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%' : '100% 0%, 100% 100%, 50% 100%'})`,
                        transform: `rotate(${(event.ticketsSold/event.capacity) * 360}deg)`
                      }}
                    />
                    <div className="text-center">
                      <p className="text-4xl font-black">{Math.round((event.ticketsSold/event.capacity)*100)}%</p>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sold Out</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-4">
                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" /> Sold ({event.ticketsSold})</span>
                    <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-secondary" /> Remaining ({event.capacity - event.ticketsSold})</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="rounded-[2.5rem] border-border/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Daily Ticket Sales</CardTitle>
                <CardDescription>Last 7 days of performance</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border-border/50">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Conversion Rate</CardTitle>
                <CardDescription>Visits vs. Ticket Sales</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Visits', value: 1200, fill: 'hsl(var(--secondary))' },
                    { name: 'Interested', value: 450, fill: 'hsl(var(--accent))' },
                    { name: 'Sales', value: event.ticketsSold, fill: 'hsl(var(--primary))' },
                  ]}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
