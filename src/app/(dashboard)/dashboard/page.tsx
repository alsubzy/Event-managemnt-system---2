
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CreditCard, 
  Plus, 
  MoreHorizontal,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const chartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1100 },
];

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
    <div className="flex flex-col gap-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back, Jane! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your events today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl border-2">Download Report</Button>
          <Link href="/events/create">
            <Button className="rounded-2xl shadow-lg shadow-primary/20 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Revenue', value: '£24,560', change: '+12.5%', trend: 'up', icon: CreditCard, color: 'bg-primary' },
          { title: 'Active Events', value: '12', change: '+2', trend: 'up', icon: Calendar, color: 'bg-accent' },
          { title: 'Total Attendees', value: '1,429', change: '+18%', trend: 'up', icon: Users, color: 'bg-emerald-500' },
          { title: 'Customer Satisfaction', value: '98%', change: '-2%', trend: 'down', icon: TrendingUp, color: 'bg-blue-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="rounded-3xl border-border/50 overflow-hidden relative group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-3 rounded-2xl text-white shadow-lg", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className={cn(
                    "rounded-full px-2 py-0",
                    stat.trend === 'up' ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                  )}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
              <div className="absolute -bottom-2 -right-2 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <stat.icon className="w-24 h-24" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 rounded-3xl border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div>
              <CardTitle className="text-xl font-bold">Revenue Analytics</CardTitle>
              <CardDescription>Daily revenue breakdown for the past week</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="rounded-full h-8 px-4 font-bold bg-primary/10 text-primary">Week</Button>
              <Button variant="ghost" size="sm" className="rounded-full h-8 px-4 font-bold">Month</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} tickFormatter={(value) => `£${value}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
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
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 rounded-3xl border-border/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <CardTitle className="text-xl font-bold">Ticket Sales</CardTitle>
            <Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="w-4 h-4" /></Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--secondary))', radius: 8}}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-10 bg-primary rounded-full" />
                  <div>
                    <p className="text-sm font-bold">VIP Tickets</p>
                    <p className="text-xs text-muted-foreground">Premium access</p>
                  </div>
                </div>
                <p className="font-bold">420 sold</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-10 bg-accent rounded-full" />
                  <div>
                    <p className="text-sm font-bold">Regular Tickets</p>
                    <p className="text-xs text-muted-foreground">Standard admission</p>
                  </div>
                </div>
                <p className="font-bold">892 sold</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="rounded-3xl border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">Recent Bookings</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary font-bold group">
              View All <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: 'Marcus Aurelius', event: 'The Golden Gala', amount: '£150.00', status: 'Success', date: '2 mins ago' },
                { name: 'Diana Prince', event: 'Royal Garden Party', amount: '£45.00', status: 'Pending', date: '15 mins ago' },
                { name: 'Arthur Curry', event: 'Oceanic Dinner', amount: '£220.00', status: 'Success', date: '1 hour ago' },
                { name: 'Selina Kyle', event: 'Midnight Masquerade', amount: '£95.00', status: 'Success', date: '3 hours ago' },
              ].map((booking, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                      {booking.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{booking.name}</p>
                      <p className="text-xs text-muted-foreground">{booking.event}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{booking.amount}</p>
                    <p className={cn("text-xs font-medium", booking.status === 'Success' ? 'text-emerald-500' : 'text-amber-500')}>{booking.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="rounded-3xl border-border/50">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Quick Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/50">
              {[
                { title: 'Payout Request', desc: 'Your payout of £1,200 is being processed.', time: 'Today, 10:45 AM', icon: CreditCard, color: 'bg-primary' },
                { title: 'New Event Published', desc: 'Autumn Pastry Workshop is now live.', time: 'Yesterday, 4:20 PM', icon: Calendar, color: 'bg-accent' },
                { title: 'Ticket Alert', desc: 'VIP tickets for "Royal Gala" are 90% sold out.', time: '2 days ago', icon: TrendingUp, color: 'bg-rose-500' },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className={cn("absolute -left-10 w-6 h-6 rounded-full flex items-center justify-center border-4 border-background shadow-sm", item.color)}>
                    <item.icon className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{item.time}</p>
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
