"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Ticket, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  Share2,
  ChevronDown,
  RefreshCw,
  Target,
  MousePointer2
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PremiumButton } from '@/components/ui/premium-button';
import { useAnalyticsStore, DateRange } from '@/store/use-analytics-store';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const COLORS = ['#0B1221', '#3b82f6', '#10b981', '#f59e0b'];

export default function AnalyticsPage() {
  const { data, range, setRange, isLoading, fetchData } = useAnalyticsStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleExport = (type: string) => {
    toast({
      title: "Exporting Data",
      description: `Preparing your ${type} report for download...`,
    });
    setTimeout(() => {
      toast({
        title: "Export Successful",
        description: `Your ${type} report has been downloaded.`,
      });
    }, 2000);
  };

  const stats = [
    { label: 'Total Revenue', value: `£${data.revenue.toLocaleString()}`, change: '+12.5%', trend: 'up', icon: TrendingUp, color: 'text-primary' },
    { label: 'Bookings', value: data.bookings.toLocaleString(), change: '+8.2%', trend: 'up', icon: Ticket, color: 'text-blue-500' },
    { label: 'Attendees', value: data.attendees.toLocaleString(), change: '+14.1%', trend: 'up', icon: Users, color: 'text-emerald-500' },
    { label: 'Conversion', value: `${data.conversionRate}%`, change: '-2.4%', trend: 'down', icon: Target, color: 'text-rose-500' },
  ];

  const filteredEvents = data.eventPerformance.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2 opacity-60">
            <span className="w-8 h-[1px] bg-primary"></span>
            Intelligence
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[#0B1221]">System Intelligence</h1>
          <p className="text-muted-foreground font-medium">Global performance metrics and predictive analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <PremiumButton variant="outline" size="sm" onClick={() => fetchData()} disabled={isLoading} icon={<RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />} className="rounded-full">
            Refresh
          </PremiumButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <PremiumButton size="sm" icon={<Download size={16} />} className="rounded-full">Export Report</PremiumButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[200px] shadow-2xl">
              <DropdownMenuItem onClick={() => handleExport('CSV')} className="rounded-xl font-bold text-xs py-3 uppercase tracking-widest"><FileText className="mr-3 w-4 h-4" /> Export CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('PDF')} className="rounded-xl font-bold text-xs py-3 uppercase tracking-widest"><FileText className="mr-3 w-4 h-4" /> Export PDF</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('Analytics')} className="rounded-xl font-bold text-xs py-3 uppercase tracking-widest"><Share2 className="mr-3 w-4 h-4" /> Share Hub</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Date Range & Global Filters */}
      <div className="p-3 bg-secondary/30 rounded-[2.5rem] border border-border/40 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-2">
          {(['today', '7d', '30d', '90d', '1y'] as DateRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap",
                range === r 
                  ? "bg-[#0B1221] text-white shadow-xl shadow-black/10" 
                  : "text-muted-foreground/60 hover:text-foreground hover:bg-white"
              )}
            >
              {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : r === '90d' ? 'Last 90 Days' : r === '1y' ? 'Last Year' : 'Today'}
            </button>
          ))}
          <button className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-foreground hover:bg-white border-2 border-dashed border-border/60 flex items-center gap-2 transition-all duration-300">
            <Calendar size={12} /> Custom
          </button>
        </div>
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search intelligence hub..." 
            className="pl-14 h-14 rounded-2xl border-none bg-white shadow-sm focus-visible:ring-primary/5 text-sm font-bold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={range}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-12"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <Card key={i} className="rounded-[2rem] border-border/40 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-black/5 transition-all duration-500 bg-white">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className={cn("w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center transition-transform group-hover:scale-110", stat.color)}>
                      <stat.icon size={24} />
                    </div>
                    <Badge variant="secondary" className={cn(
                      "rounded-full px-4 py-1.5 font-black text-[9px] uppercase tracking-widest border-none",
                      stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {stat.trend === 'up' ? <ArrowUpRight size={10} className="mr-1.5" /> : <ArrowDownRight size={10} className="mr-1.5" />}
                      {stat.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-2">{stat.label}</p>
                    <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="space-y-12" onValueChange={setActiveTab}>
            <TabsList className="bg-transparent h-auto p-0 border-b border-border/40 rounded-none w-full justify-start gap-12">
              {['Overview', 'Events', 'Engagement', 'Geographic'].map((tab) => (
                <TabsTrigger 
                  key={tab} 
                  value={tab.toLowerCase()} 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0B1221] bg-transparent px-0 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 data-[state=active]:text-[#0B1221] transition-all shadow-none"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-12">
              <div className="grid lg:grid-cols-7 gap-10">
                {/* Revenue Area Chart */}
                <Card className="lg:col-span-4 rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-white">
                  <CardHeader className="p-10 pb-4 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-black">Revenue Velocity</CardTitle>
                      <CardDescription className="text-sm font-medium mt-1">Growth trends for the selected period.</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-xl transition-all"><ChevronDown size={18} /></button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2 shadow-2xl">
                        <DropdownMenuItem className="rounded-xl font-bold text-[10px] py-3 uppercase tracking-widest">Compare Period</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl font-bold text-[10px] py-3 uppercase tracking-widest text-primary">Cumulative View</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent className="p-10 h-[450px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.revenueChart}>
                        <defs>
                          <linearGradient id="colorRevenueAnalytics" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.08}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }} 
                          dy={20} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 900, fill: '#888' }} 
                          tickFormatter={(val) => `£${val}`} 
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
                          itemStyle={{ fontWeight: 900, color: '#000' }}
                          cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '5 5' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={5} 
                          fillOpacity={1} 
                          fill="url(#colorRevenueAnalytics)" 
                          animationDuration={2500}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card className="lg:col-span-3 rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-white">
                  <CardHeader className="p-10 pb-4">
                    <CardTitle className="text-xl font-black">Segment Analysis</CardTitle>
                    <CardDescription className="text-sm font-medium mt-1">Revenue share by event category.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-10 flex flex-col items-center">
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.categoryDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={100}
                            outerRadius={140}
                            paddingAngle={8}
                            dataKey="value"
                            animationDuration={2000}
                          >
                            {data.categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-6 w-full mt-10">
                      {data.categoryDistribution.map((entry, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-2xl transition-all hover:scale-[1.02]">
                          <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{entry.name}</span>
                            <span className="text-base font-black text-[#0B1221]">{entry.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Event Performance Table */}
              <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-white">
                <CardHeader className="p-10 border-b border-border/40">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-xl font-black">Performance Matrix</CardTitle>
                      <CardDescription className="text-sm font-medium mt-1">Comparative success analysis.</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative group w-64">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground group-focus-within:text-primary transition-colors" />
                         <Input placeholder="Filter matrix..." className="pl-10 h-10 rounded-xl border-border/40 bg-secondary/20 text-xs font-bold" />
                      </div>
                      <PremiumButton variant="outline" size="sm" icon={<Filter size={14} />} className="rounded-xl">Filters</PremiumButton>
                    </div>
                  </div>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-secondary/20 border-b border-border/40">
                      <tr>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">Event Intelligence</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">Revenue</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">Units Sold</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">Conversion</th>
                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60">Impact</th>
                        <th className="px-10 py-6"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {filteredEvents.map((event) => (
                        <tr key={event.id} className="group hover:bg-secondary/10 transition-all">
                          <td className="px-10 py-8">
                            <span className="font-black text-sm block text-[#0B1221]">{event.title}</span>
                            <span className="text-[9px] text-muted-foreground/40 font-black uppercase tracking-widest mt-1.5 block">UUID: {event.id.toUpperCase()}</span>
                          </td>
                          <td className="px-10 py-8 font-black text-base text-[#0B1221]">£{event.revenue.toLocaleString()}</td>
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-black text-[#0B1221]">{event.ticketsSold}</span>
                              <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-[#0B1221]" style={{ width: `${(event.ticketsSold / 500) * 100}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <div className="flex items-center gap-2">
                               <TrendingUp size={14} className="text-emerald-500" />
                               <span className="text-base font-black text-emerald-600">{event.conversion}%</span>
                            </div>
                          </td>
                          <td className="px-10 py-8">
                            <Badge className={cn(
                              "rounded-full px-5 py-1.5 font-black text-[9px] uppercase tracking-[0.2em] border-none shadow-sm",
                              event.status === 'High' ? 'bg-emerald-500 text-white' : 
                              event.status === 'Medium' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                            )}>
                              {event.status}
                            </Badge>
                          </td>
                          <td className="px-10 py-8 text-right">
                            <button className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl shadow-sm border-2 border-transparent hover:border-border/40 transition-all">
                              <MoreHorizontal size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-12">
              <div className="grid lg:grid-cols-2 gap-10">
                <Card className="rounded-[2.5rem] border-border/40 shadow-sm p-12 flex flex-col items-center justify-center text-center space-y-8 bg-white">
                   <div className="w-24 h-24 bg-secondary/50 rounded-[2rem] flex items-center justify-center text-[#0B1221] shadow-inner transition-transform hover:scale-110">
                     <MousePointer2 size={40} />
                   </div>
                   <div className="space-y-3">
                     <h3 className="text-2xl font-black">Granular Event Drilldown</h3>
                     <p className="text-muted-foreground max-w-sm mx-auto font-medium leading-relaxed">Select a specific asset to visualize engagement heatmaps, churn funnels, and retention curves.</p>
                   </div>
                   <PremiumButton icon={<ArrowUpRight size={20} />} className="rounded-full">Launch Analyzer</PremiumButton>
                </Card>
                
                <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden p-10 bg-white">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 mb-8">Booking Intensity Trends</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.bookingsChart}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="value" fill="#0B1221" radius={[10, 10, 0, 0]} barSize={40} animationDuration={2000} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}