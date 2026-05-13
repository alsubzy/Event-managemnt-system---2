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
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Activity
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
    <div className="max-w-[1400px] mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Overview</h1>
          <p className="text-muted-foreground text-sm font-medium">Monitoring your event ecosystem performance in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <PremiumButton variant="outline" size="sm">Export Report</PremiumButton>
          <Link href="/events/create">
            <PremiumButton size="sm" icon={<Plus size={16} />}>Create Event</PremiumButton>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: '£24,560', change: '+12.5%', trend: 'up', icon: CreditCard },
          { title: 'Active Events', value: '12', change: '+2', trend: 'up', icon: Calendar },
          { title: 'Total Attendees', value: '1,429', change: '+18%', trend: 'up', icon: Users },
          { title: 'Conversion Rate', value: '14.2%', change: '-2.4%', trend: 'down', icon: Activity },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="rounded-2xl border-border/40 shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-secondary/50 rounded-xl text-primary/80">
                    <stat.icon size={18} />
                  </div>
                  <Badge className={cn(
                    "rounded-full px-2 py-0 border-none font-bold text-[10px]",
                    stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.title}</p>
                  <p className="text-2xl font-black tracking-tight mt-1">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2 rounded-[2rem] border-border/40 shadow-sm overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold">Revenue Velocity</CardTitle>
                <CardDescription>Daily breakdown of ticket sales volume</CardDescription>
              </div>
              <div className="flex bg-secondary/50 p-1 rounded-xl">
                <button className="px-4 py-1.5 text-xs font-bold bg-white shadow-sm rounded-lg">Week</button>
                <button className="px-4 py-1.5 text-xs font-bold text-muted-foreground">Month</button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 11, fill: '#888', fontWeight: 600}} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 11, fill: '#888', fontWeight: 600}} 
                  tickFormatter={(val) => `£${val}`} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="rounded-[2rem] border-border/40 shadow-sm overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xl font-bold text-primary">Activity Stream</CardTitle>
            <CardDescription>Latest events and transaction alerts</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-border/60">
              {[
                { title: 'New Booking', desc: 'Marcus booked "Jazz Night"', time: '2m ago', color: 'bg-emerald-500' },
                { title: 'Payout Sent', desc: '£1,200 transferred to bank', time: '1h ago', color: 'bg-blue-500' },
                { title: 'Event Sold Out', desc: 'Masterclass is fully booked', time: '3h ago', color: 'bg-rose-500' },
                { title: 'Profile Updated', desc: 'Biography changed', time: 'Yesterday', color: 'bg-amber-500' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 relative z-10">
                  <div className={cn("w-6 h-6 rounded-full border-4 border-white shadow-sm shrink-0", item.color)} />
                  <div className="space-y-1">
                    <p className="text-sm font-bold leading-none">{item.title}</p>
                    <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
                    <p className="text-[10px] text-muted-foreground/60 uppercase font-black tracking-widest">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}