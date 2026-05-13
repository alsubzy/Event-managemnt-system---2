
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
    <div className="max-w-[1600px] mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <BarChart3 className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Platform Intelligence</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground font-medium">Real-time insights and performance metrics for your event ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <PremiumButton variant="outline" size="sm" onClick={() => fetchData()} disabled={isLoading} icon={<RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />}>
            Refresh
          </PremiumButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <PremiumButton size="sm" icon={<Download size={16} />}>Export Report</PremiumButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[200px]">
              <DropdownMenuItem onClick={() => handleExport('CSV')} className="rounded-xl font-medium py-3"><FileText className="mr-2 w-4 h-4" /> Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('PDF')} className="rounded-xl font-medium py-3"><FileText className="mr-2 w-4 h-4" /> Export as PDF</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('Analytics')} className="rounded-xl font-medium py-3"><Share2 className="mr-2 w-4 h-4" /> Share Dashboard</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Date Range & Global Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-2 bg-secondary/20 rounded-[2rem] border border-border/40">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-2">
          {(['today', '7d', '30d', '90d', '1y'] as DateRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all",
                range === r ? "bg-[#0B1221] text-white shadow-xl shadow-black/10" : "text-muted-foreground hover:bg-white/50"
              )}
            >
              {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : r === '90d' ? 'Last 90 Days' : r === '1y' ? 'Last Year' : 'Today'}
            </button>
          ))}
          <button className="px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/50 border border-dashed border-border flex items-center gap-2">
            <Calendar size={14} /> Custom
          </button>
        </div>
        <div className="relative w-full lg:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search metrics..." 
            className="pl-12 h-12 rounded-[1.5rem] border-none bg-white shadow-sm focus-visible:ring-primary/10 text-sm font-medium"
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
          className="space-y-10"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-black/5 transition-all">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn("p-4 rounded-[1.5rem] bg-secondary/50", stat.color)}>
                      <stat.icon size={24} />
                    </div>
                    <Badge variant="secondary" className={cn(
                      "rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-widest border-none",
                      stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {stat.trend === 'up' ? <ArrowUpRight size={10} className="mr-1" /> : <ArrowDownRight size={10} className="mr-1" />}
                      {stat.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-3xl font-black">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="space-y-10" onValueChange={setActiveTab}>
            <TabsList className="bg-transparent h-auto p-0 border-b rounded-none w-full justify-start gap-10">
              {['Overview', 'Events', 'Engagement', 'Geographic'].map((tab) => (
                <TabsTrigger 
                  key={tab} 
                  value={tab.toLowerCase()} 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary bg-transparent px-0 py-4 text-sm font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground transition-all shadow-none"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-10">
              <div className="grid lg:grid-cols-7 gap-8">
                {/* Revenue Area Chart */}
                <Card className="lg:col-span-4 rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-10">
                    <div>
                      <CardTitle className="text-xl font-black">Revenue Velocity</CardTitle>
                      <CardDescription>Monetary performance trends for the selected period</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 mr-4">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Actual</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-secondary rounded-full transition-colors"><ChevronDown size={16} /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl">
                          <DropdownMenuItem>Compare to previous period</DropdownMenuItem>
                          <DropdownMenuItem>Show cumulative revenue</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.revenueChart}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fill: '#888' }} 
                          dy={10} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fill: '#888' }} 
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
                          strokeWidth={4} 
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                          animationDuration={1500}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card className="lg:col-span-3 rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-xl font-black">Segment Distribution</CardTitle>
                    <CardDescription>Event categories by revenue share</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.categoryDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={8}
                            dataKey="value"
                            animationDuration={1500}
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
                    <div className="grid grid-cols-2 gap-4 w-full mt-6">
                      {data.categoryDistribution.map((entry, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-2xl">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{entry.name}</span>
                            <span className="text-sm font-black">{entry.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Event Performance Table */}
              <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden">
                <CardHeader className="pb-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl font-black">Event Performance Ranking</CardTitle>
                      <CardDescription>Comparative analysis of individual event success metrics</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <PremiumButton variant="outline" size="sm" icon={<Filter size={14} />}>Advanced Filters</PremiumButton>
                    </div>
                  </div>
                </CardHeader>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-secondary/20 border-b border-border/40">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Event Title</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Revenue</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tickets Sold</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Conversion</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Impact</th>
                        <th className="px-8 py-5"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {filteredEvents.map((event) => (
                        <tr key={event.id} className="group hover:bg-secondary/10 transition-colors">
                          <td className="px-8 py-6">
                            <span className="font-bold text-sm block">{event.title}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">ID: {event.id}</span>
                          </td>
                          <td className="px-8 py-6 font-black text-sm">£{event.revenue.toLocaleString()}</td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold">{event.ticketsSold}</span>
                              <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${(event.ticketsSold / 500) * 100}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-sm font-black text-emerald-600">{event.conversion}%</span>
                          </td>
                          <td className="px-8 py-6">
                            <Badge className={cn(
                              "rounded-full px-4 py-1 font-bold text-[9px] uppercase tracking-widest border-none",
                              event.status === 'High' ? 'bg-emerald-500 text-white' : 
                              event.status === 'Medium' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                            )}>
                              {event.status} Impact
                            </Badge>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-border transition-all">
                              <MoreHorizontal size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="rounded-[2.5rem] border-border/40 shadow-sm p-10 flex flex-col items-center justify-center text-center space-y-6">
                   <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-primary">
                     <MousePointer2 size={32} />
                   </div>
                   <div className="space-y-2">
                     <h3 className="text-2xl font-black">Detailed Event Analysis</h3>
                     <p className="text-muted-foreground max-w-sm mx-auto">Select a specific event to view granular engagement metrics, heatmaps, and conversion funnels.</p>
                   </div>
                   <PremiumButton icon={<ArrowUpRight size={18} />}>Launch Drilldown</PremiumButton>
                </Card>
                
                <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden p-8">
                  <h3 className="text-lg font-black mb-6">Booking Volume Trends</h3>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.bookingsChart}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" hide />
                        <Tooltip contentStyle={{ borderRadius: '24px', border: 'none' }} />
                        <Bar dataKey="value" fill="#0B1221" radius={[8, 8, 0, 0]} barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-8">
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                 <Target className="w-16 h-16 text-muted-foreground/20" />
                 <h2 className="text-2xl font-bold">User Engagement Hub</h2>
                 <p className="text-muted-foreground">Tracking user retention, activity intensity, and lifetime value metrics.</p>
                 <Badge variant="secondary" className="rounded-full px-6 py-2 font-black uppercase tracking-widest mt-4">Feature in Beta</Badge>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
