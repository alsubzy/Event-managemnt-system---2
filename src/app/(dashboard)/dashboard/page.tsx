"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CreditCard, 
  Plus, 
  ArrowUpRight,
  Activity,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PremiumButton } from '@/components/ui/premium-button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const revenueData = [
  { name: 'Mon', revenue: 4500 },
  { name: 'Tue', revenue: 5200 },
  { name: 'Wed', revenue: 4800 },
  { name: 'Thu', revenue: 6100 },
  { name: 'Fri', revenue: 5900 },
  { name: 'Sat', revenue: 8200 },
  { name: 'Sun', revenue: 7400 },
];

export default function UserDashboard() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2 opacity-60">
            <span className="w-8 h-[1px] bg-primary"></span>
            System Overview
          </div>
          <h1 className="text-4xl font-black tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground text-sm font-medium">Real-time intelligence and ecosystem performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <PremiumButton variant="outline" size="sm" className="rounded-full">Export Intelligence</PremiumButton>
          <Link href="/events/create">
            <PremiumButton size="sm" icon={<Plus size={16} />} className="rounded-full">Create Event</PremiumButton>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: 'Total Revenue', value: '£24,560', change: '+12.5%', trend: 'up', icon: CreditCard, color: 'text-emerald-600' },
          { title: 'Active Events', value: '12', change: '+2', trend: 'up', icon: Calendar, color: 'text-primary' },
          { title: 'Total Attendees', value: '1,429', change: '+18%', trend: 'up', icon: Users, color: 'text-blue-600' },
          { title: 'Conversion Rate', value: '14.2%', change: '-2.4%', trend: 'down', icon: Activity, color: 'text-rose-600' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="rounded-[2rem] border-border/40 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 overflow-hidden group bg-white">
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-secondary/50 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                    <stat.icon size={20} className={stat.color} />
                  </div>
                  <Badge className={cn(
                    "rounded-full px-3 py-1 border-none font-bold text-[10px] uppercase tracking-widest",
                    stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{stat.title}</p>
                  <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Main Chart */}
        <Card className="lg:col-span-2 rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-white">
          <CardHeader className="p-10 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-black">Revenue Velocity</CardTitle>
                <CardDescription className="text-sm font-medium mt-1">Daily breakdown of monetary flow.</CardDescription>
              </div>
              <div className="flex bg-secondary/40 p-1.5 rounded-[1rem]">
                <button className="px-6 py-2 text-xs font-black uppercase tracking-widest bg-white shadow-sm rounded-xl">Week</button>
                <button className="px-6 py-2 text-xs font-black uppercase tracking-widest text-muted-foreground/60 hover:text-muted-foreground transition-colors">Month</button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.08}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#888', fontWeight: 700}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#888', fontWeight: 700}} 
                  tickFormatter={(val) => `£${val}`} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 900, marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-white">
          <CardHeader className="p-10 pb-4">
            <CardTitle className="text-xl font-black">Activity Stream</CardTitle>
            <CardDescription className="text-sm font-medium mt-1">Real-time alerts and interactions.</CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <div className="space-y-10 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-border/60">
              {[
                { title: 'New Booking', desc: 'Marcus booked "Jazz Night"', time: '2m ago', color: 'bg-emerald-500' },
                { title: 'Payout Sent', desc: '£1,200 transferred to bank', time: '1h ago', color: 'bg-blue-500' },
                { title: 'Event Sold Out', desc: 'Masterclass is fully booked', time: '3h ago', color: 'bg-rose-500' },
                { title: 'Profile Updated', desc: 'Biography changed', time: 'Yesterday', color: 'bg-amber-500' },
              ].map((item, i) => (
                <div key={i} className="flex gap-8 relative z-10">
                  <div className={cn("w-6 h-6 rounded-full border-4 border-white shadow-md shrink-0 mt-1", item.color)} />
                  <div className="space-y-2">
                    <p className="text-sm font-black leading-none">{item.title}</p>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                    <p className="text-[9px] text-muted-foreground/40 uppercase font-black tracking-[0.2em]">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/notifications" className="mt-12 block">
              <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-border/60 text-xs font-black uppercase tracking-widest text-muted-foreground hover:border-primary/20 hover:text-primary transition-all">
                View All Activity <ArrowRight size={14} />
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}