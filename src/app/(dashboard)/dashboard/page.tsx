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
    <div className="space-y-10 animate-fade-in">
      {/* Minimal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of your event performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/events/create">
            <PremiumButton size="sm" icon={<Plus size={16} />} className="h-10 px-5 text-xs">Create Event</PremiumButton>
          </Link>
        </div>
      </div>

      {/* Stats Grid - Ultra Simple */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Revenue', value: '£24,560', change: '+12%', trend: 'up', icon: CreditCard, color: 'text-blue-600' },
          { title: 'Events', value: '12', change: '+2', trend: 'up', icon: Calendar, color: 'text-slate-900' },
          { title: 'Attendees', value: '1,429', change: '+18%', trend: 'up', icon: Users, color: 'text-indigo-600' },
          { title: 'Conversion', value: '14.2%', change: '-2%', trend: 'down', icon: Activity, color: 'text-rose-600' },
        ].map((stat, i) => (
          <Card key={i} className="premium-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center", stat.color)}>
                  <stat.icon size={18} />
                </div>
                <Badge variant="secondary" className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-bold border-none",
                  stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{stat.title}</p>
                <p className="text-2xl font-bold mt-1 text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Simplified Chart */}
        <Card className="lg:col-span-2 premium-card">
          <CardHeader className="p-8 pb-0">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-bold">Revenue Velocity</CardTitle>
                <CardDescription className="text-xs font-medium">Daily monetary flow breakdown.</CardDescription>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-lg">
                <button className="px-4 py-1.5 text-[10px] font-bold bg-white shadow-sm rounded-md">Week</button>
                <button className="px-4 py-1.5 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors">Month</button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenueSimple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F172A" stopOpacity={0.05}/>
                    <stop offset="95%" stopColor="#0F172A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} tickFormatter={(val) => `£${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #F1F5F9', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0F172A" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorRevenueSimple)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Clean Activity Feed */}
        <Card className="premium-card">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
              {[
                { title: 'New Booking', desc: 'Marcus booked "Jazz Night"', time: '2m ago' },
                { title: 'Payout Sent', desc: '£1,200 transferred to bank', time: '1h ago' },
                { title: 'Event Sold Out', desc: 'Masterclass is fully booked', time: '3h ago' },
                { title: 'Profile Updated', desc: 'Biography changed', time: 'Yesterday' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 relative z-10 pl-1">
                  <div className="w-4 h-4 rounded-full bg-white border-2 border-slate-900 shrink-0 mt-1" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold leading-none text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/notifications" className="mt-8 block">
              <button className="w-full py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all flex items-center justify-center gap-2">
                All Logs <ArrowRight size={14} />
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}