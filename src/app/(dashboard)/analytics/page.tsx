"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, TrendingUp, Users, Ticket, Download, Calendar,
  ArrowUpRight, ArrowDownRight, Target, RefreshCw, Filter,
  MoreHorizontal, MousePointer2, FileText, Share2,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { PremiumButton } from '@/components/ui/premium-button';
import { PageHeader } from '@/components/ui/page-header';
import { useAnalyticsStore, DateRange } from '@/store/use-analytics-store';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const CHART_COLORS = ['hsl(221,83%,53%)', 'hsl(160,70%,45%)', 'hsl(38,92%,50%)', 'hsl(267,67%,58%)'];

const PERIOD_LABELS: Record<DateRange, string> = {
  today: 'Today',
  '7d':  'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 90 Days',
  '1y':  'Last Year',
  'custom': 'Custom Range',
};

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 min-w-[120px]">
      <p className="text-[11px] font-semibold text-slate-500 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name === 'value' ? `£${p.value?.toLocaleString()}` : p.value}
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const { data, range, setRange, isLoading, fetchData } = useAnalyticsStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleExport = (type: string) => {
    toast({ title: `Exporting ${type}`, description: `Preparing your ${type} report…` });
    setTimeout(() => toast({ title: 'Export Complete', description: `${type} report downloaded.` }), 2000);
  };

  const stats = [
    { label: 'Total Revenue',  value: `£${data.revenue.toLocaleString()}`, change: '+12.5%', trend: 'up',   icon: TrendingUp, color: 'bg-primary/10 text-primary' },
    { label: 'Total Bookings', value: data.bookings.toLocaleString(),        change: '+8.2%',  trend: 'up',   icon: Ticket,     color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Attendees',      value: data.attendees.toLocaleString(),        change: '+14.1%', trend: 'up',   icon: Users,      color: 'bg-violet-50 text-violet-600' },
    { label: 'Conversion',     value: `${data.conversionRate}%`,             change: '-2.4%',  trend: 'down', icon: Target,     color: 'bg-amber-50 text-amber-600' },
  ];

  const filteredEvents = data.eventPerformance.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-7 animate-fade-in">

      <PageHeader title="Intelligence" description="Global performance metrics, predictive analytics, and business insights.">
        <PremiumButton
          variant="outline" size="sm"
          icon={<RefreshCw size={13} className={cn(isLoading && 'animate-spin')} />}
          onClick={() => fetchData()}
          disabled={isLoading}
        >
          Refresh
        </PremiumButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <PremiumButton size="sm" icon={<Download size={14} />}>Export</PremiumButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl p-1.5 shadow-xl border-slate-200">
            <DropdownMenuItem onClick={() => handleExport('CSV')} className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-xs">
              <FileText size={13} /> Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('PDF')} className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-xs">
              <FileText size={13} /> Export PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleExport('Report')} className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-xs">
              <Share2 size={13} /> Share Dashboard
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </PageHeader>

      {/* Period Filter */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
        {(Object.keys(PERIOD_LABELS) as DateRange[]).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
              range === r
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            )}
          >
            {PERIOD_LABELS[r]}
          </button>
        ))}
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-white border border-dashed border-slate-300 text-slate-500 hover:bg-slate-50 transition-all">
          <Calendar size={11} /> Custom Range
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={range}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-7"
        >

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <div className="stat-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.color)}>
                      <s.icon size={17} />
                    </div>
                    <span className={cn(
                      'inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full',
                      s.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
                    )}>
                      {s.trend === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      {s.change}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Main Charts */}
          <Tabs defaultValue="overview" className="space-y-5">
            <TabsList className="bg-transparent h-auto p-0 gap-6 justify-start border-b border-slate-200 rounded-none w-full pb-0">
              {['Overview', 'Events', 'Engagement', 'Geographic'].map(tab => (
                <TabsTrigger
                  key={tab}
                  value={tab.toLowerCase()}
                  className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none px-0 pb-3 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground data-[state=active]:text-primary transition-all"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-5 pt-2">
              <div className="grid lg:grid-cols-7 gap-5">

                {/* Revenue Area Chart */}
                <Card className="premium-card lg:col-span-4">
                  <CardHeader className="px-6 pt-5 pb-0">
                    <CardTitle className="text-base font-semibold">Revenue Velocity</CardTitle>
                    <CardDescription className="text-xs mt-0.5">Growth trends for the selected period</CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-5 pt-3 h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.revenueChart} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                        <defs>
                          <linearGradient id="revGradAnalytics" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor={CHART_COLORS[0]} stopOpacity={0.12} />
                            <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0}   />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={6} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `£${v}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2.5} fill="url(#revGradAnalytics)" animationDuration={1500} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Pie Chart */}
                <Card className="premium-card lg:col-span-3">
                  <CardHeader className="px-6 pt-5 pb-0">
                    <CardTitle className="text-base font-semibold">Segment Analysis</CardTitle>
                    <CardDescription className="text-xs mt-0.5">Revenue share by event category</CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-5">
                    <div className="h-[180px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.categoryDistribution}
                            cx="50%" cy="50%"
                            innerRadius={60} outerRadius={80}
                            paddingAngle={4} dataKey="value"
                            animationDuration={1500}
                          >
                            {data.categoryDistribution.map((_, idx) => (
                              <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '12px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 mt-2">
                      {data.categoryDistribution.map((entry, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                          <div>
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{entry.name}</p>
                            <p className="text-sm font-bold text-slate-900">{entry.value}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Table */}
              <Card className="premium-card overflow-hidden">
                <CardHeader className="px-6 py-4 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base font-semibold">Performance Matrix</CardTitle>
                      <CardDescription className="text-xs mt-0.5">Comparative success analysis across all events</CardDescription>
                    </div>
                    <div className="relative">
                      <input
                        placeholder="Filter events…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-3 pr-3 h-8 w-56 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                      />
                    </div>
                  </div>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/60">
                        {['Event', 'Revenue', 'Tickets Sold', 'Conversion', 'Impact', ''].map(h => (
                          <th key={h} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEvents.map((event) => (
                        <tr key={event.id} className="saas-table-row group">
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-slate-800">{event.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">ID: {event.id.toUpperCase()}</p>
                          </td>
                          <td className="px-5 py-4 text-sm font-bold text-slate-900">£{event.revenue.toLocaleString()}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-slate-800">{event.ticketsSold}</span>
                              <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${(event.ticketsSold / 500) * 100}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                              <TrendingUp size={13} /> {event.conversion}%
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={cn(
                              'text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide',
                              event.status === 'High'   ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              event.status === 'Medium' ? 'bg-amber-50  text-amber-700  border-amber-200'  :
                                                          'bg-red-50    text-red-600    border-red-200'
                            )}>
                              {event.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                              <MoreHorizontal size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-5 pt-2">
              <div className="grid lg:grid-cols-2 gap-5">
                <Card className="premium-card p-8 flex flex-col items-center justify-center text-center gap-5">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                    <MousePointer2 size={36} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Granular Event Drilldown</h3>
                    <p className="text-sm text-slate-500 mt-1.5 max-w-xs mx-auto">
                      Select a specific event to visualize engagement heatmaps, churn funnels, and retention curves.
                    </p>
                  </div>
                  <PremiumButton icon={<ArrowUpRight size={15} />}>Launch Analyzer</PremiumButton>
                </Card>

                <Card className="premium-card">
                  <CardHeader className="px-5 pt-5 pb-0">
                    <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Booking Intensity</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.bookingsChart} margin={{ top: 10, right: 5, bottom: 0, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" hide />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '12px' }} />
                        <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} barSize={36} animationDuration={1500} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Engagement Tab */}
            <TabsContent value="engagement" className="pt-2">
              <div className="grid lg:grid-cols-3 gap-5">
                {[
                  { label: 'Email Open Rate',   value: '32.4%', change: '+4.2%',  color: CHART_COLORS[0] },
                  { label: 'Click-Through',      value: '8.1%',  change: '+1.8%',  color: CHART_COLORS[1] },
                  { label: 'Repeat Attendees',   value: '64%',   change: '+9.3%',  color: CHART_COLORS[2] },
                ].map((m, i) => (
                  <Card key={i} className="premium-card p-6 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">{m.label}</p>
                    <p className="text-4xl font-bold" style={{ color: m.color }}>{m.value}</p>
                    <span className="text-xs text-emerald-500 font-semibold mt-2 inline-flex items-center gap-1">
                      <ArrowUpRight size={12} />{m.change} vs last period
                    </span>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Geographic Tab */}
            <TabsContent value="geographic" className="pt-2">
              <Card className="premium-card p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[280px]">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300">
                  <BarChart3 size={32} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-700">Geographic Distribution</h3>
                  <p className="text-sm text-slate-400 mt-1">Map visualizations coming soon</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}