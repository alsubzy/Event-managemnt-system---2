"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import {
  TrendingUp, Users, Calendar, CreditCard, Plus, ArrowUpRight,
  ArrowDownRight, Activity, Ticket, Clock, CheckCircle2, Zap,
  MapPin, ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PremiumButton } from '@/components/ui/premium-button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/page-header';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/use-auth-store';
import { useEventStore } from '@/store/use-event-store';
import { useBookingStore } from '@/store/use-booking-store';

/* ── Mock Data ─────────────────────────────────────────── */
const revenueData = [
  { name: 'Mon', revenue: 4500, bookings: 18 },
  { name: 'Tue', revenue: 5200, bookings: 22 },
  { name: 'Wed', revenue: 4800, bookings: 19 },
  { name: 'Thu', revenue: 6100, bookings: 28 },
  { name: 'Fri', revenue: 5900, bookings: 25 },
  { name: 'Sat', revenue: 8200, bookings: 35 },
  { name: 'Sun', revenue: 7400, bookings: 30 },
];

const upcomingEvents = [
  { id: 'u1', title: 'Summer Jazz Night', date: 'Aug 12, 2024', location: 'Hyde Park, London', status: 'Live', tickets: 850, capacity: 1000 },
  { id: 'u2', title: 'Royal Pastry Workshop', date: 'Sep 5, 2024', location: 'Mayfair Studio', status: 'Draft', tickets: 0, capacity: 25 },
  { id: 'u3', title: 'Tech Leadership Summit', date: 'Sep 18, 2024', location: 'Canary Wharf', status: 'Published', tickets: 120, capacity: 200 },
];

const recentActivity = [
  { id: 'a1', title: 'New Booking',      desc: 'Marcus Chen booked "Jazz Night"',    time: '2m ago',    type: 'booking' },
  { id: 'a2', title: 'Payout Processed', desc: '£1,200 transferred to bank account', time: '1h ago',    type: 'payment' },
  { id: 'a3', title: 'Event Sold Out',   desc: '"Masterclass" is fully booked',      time: '3h ago',    type: 'event' },
  { id: 'a4', title: 'New Registration', desc: 'Sarah P. registered for Workshop',   time: '5h ago',    type: 'booking' },
  { id: 'a5', title: 'Profile Updated',  desc: 'Biography and contact info changed', time: 'Yesterday', type: 'profile' },
];

/* ── Stat Card ─────────────────────────────────────────── */
function StatCard({
  title, value, change, trend, icon: Icon, color, delay = 0,
}: {
  title: string; value: string; change: string;
  trend: 'up' | 'down'; icon: React.ElementType;
  color: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
    >
      <div className="stat-card group">
        <div className="flex items-start justify-between mb-4">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', color)}>
            <Icon size={18} />
          </div>
          <span className={cn(
            'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full',
            trend === 'up'
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-red-50 text-red-500'
          )}>
            {trend === 'up' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {change}
          </span>
        </div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
    </motion.div>
  );
}

/* ── Custom Tooltip ────────────────────────────────────── */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 min-w-[120px]">
        <p className="text-[11px] font-semibold text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-900">£{payload[0]?.value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}

/* ── Status Badge ──────────────────────────────────────── */
const statusBadge: Record<string, string> = {
  Live:      'badge-success',
  Draft:     'badge-neutral',
  Published: 'badge-info',
  Completed: 'badge-neutral',
  Cancelled: 'badge-danger',
};

/* ── Dashboard Page ────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuthStore();
  const { events } = useEventStore();
  const { bookings } = useBookingStore();
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');

  const totalRevenue = events.reduce((acc, e) => acc + e.revenue, 0);
  const totalAttendees = events.reduce((acc, e) => acc + e.ticketsSold, 0);
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Welcome Banner ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 font-medium">{dateStr}</p>
          <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
            {greeting}, {user?.name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with YEGLEEL today.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/events/create">
            <PremiumButton size="md" icon={<Plus size={15} />}>
              Create Event
            </PremiumButton>
          </Link>
        </div>
      </div>

      {/* ── KPI Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue" value={`£${totalRevenue.toLocaleString()}`}
          change="+12.5%" trend="up" icon={CreditCard}
          color="bg-primary/10 text-primary" delay={0}
        />
        <StatCard
          title="Active Events" value={String(events.length)}
          change="+2 new" trend="up" icon={Calendar}
          color="bg-emerald-50 text-emerald-600" delay={0.06}
        />
        <StatCard
          title="Total Attendees" value={totalAttendees.toLocaleString()}
          change="+18.3%" trend="up" icon={Users}
          color="bg-violet-50 text-violet-600" delay={0.12}
        />
        <StatCard
          title="Confirmed Bookings" value={String(confirmedBookings)}
          change="-2.1%" trend="down" icon={Ticket}
          color="bg-amber-50 text-amber-600" delay={0.18}
        />
      </div>

      {/* ── Charts Row ──────────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Revenue Chart */}
        <Card className="premium-card lg:col-span-2">
          <CardHeader className="pb-0 px-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
                <CardDescription className="text-xs mt-0.5">Daily revenue for the current week</CardDescription>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg gap-0.5">
                {(['week', 'month'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setChartPeriod(p)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                      chartPeriod === p
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    )}
                  >
                    {p === 'week' ? 'This Week' : 'This Month'}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="hsl(221, 83%, 53%)" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }} dy={8} />
                <YAxis axisLine={false} tickLine={false}
                  tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 500 }}
                  tickFormatter={v => `£${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey="revenue"
                  stroke="hsl(221, 83%, 53%)" strokeWidth={2.5}
                  fill="url(#revGrad)" animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="premium-card">
          <CardHeader className="px-5 pt-5 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
              <Link href="/notifications">
                <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                  View all <ChevronRight size={12} />
                </button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-4">
              {recentActivity.map((item, idx) => (
                <div key={item.id} className="flex gap-3">
                  <div className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                    item.type === 'booking' ? 'bg-emerald-50 text-emerald-500' :
                    item.type === 'payment' ? 'bg-blue-50 text-blue-500' :
                    item.type === 'event'   ? 'bg-violet-50 text-violet-500' :
                                              'bg-slate-100 text-slate-500'
                  )}>
                    {item.type === 'booking' ? <Ticket size={13} /> :
                     item.type === 'payment' ? <CreditCard size={13} /> :
                     item.type === 'event'   ? <Calendar size={13} /> :
                                               <Activity size={13} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{item.desc}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Upcoming Events ─────────────────────────────── */}
      <Card className="premium-card">
        <CardHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Upcoming Events</CardTitle>
              <CardDescription className="text-xs mt-0.5">Your next scheduled experiences</CardDescription>
            </div>
            <Link href="/events">
              <PremiumButton variant="outline" size="sm" iconPosition="right" icon={<ArrowUpRight size={13} />}>
                Manage All
              </PremiumButton>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-all group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar size={17} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock size={10} /> {event.date}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin size={10} /> {event.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-700">{event.tickets}/{event.capacity}</p>
                    <p className="text-[10px] text-slate-400">tickets sold</p>
                  </div>
                  <div className="w-24">
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${(event.tickets / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className={cn(
                    'text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border',
                    statusBadge[event.status] ?? 'badge-neutral'
                  )}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Quick Stats Row ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Avg. Ticket Price', value: '£72', icon: Ticket, color: 'text-primary' },
          { label: 'Sell-Through Rate', value: '84%', icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Avg. Event Duration', value: '4.2h', icon: Clock, color: 'text-amber-500' },
          { label: 'Customer Satisfaction', value: '4.9/5', icon: Zap, color: 'text-violet-500' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.06, duration: 0.3 }}
          >
            <div className="stat-card flex items-center gap-4">
              <div className={cn('shrink-0', s.color)}>
                <s.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{s.label}</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{s.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}