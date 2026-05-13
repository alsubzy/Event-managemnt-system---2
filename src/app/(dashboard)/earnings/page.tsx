
"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  DollarSign, 
  Calendar, 
  Filter, 
  Search, 
  MoreHorizontal,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PremiumButton } from '@/components/ui/premium-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useEarningsStore } from '@/store/use-earnings-store';
import { cn } from '@/lib/utils';

const chartData = [
  { name: 'May 20', revenue: 450 },
  { name: 'May 21', revenue: 520 },
  { name: 'May 22', revenue: 480 },
  { name: 'May 23', revenue: 610 },
  { name: 'May 24', revenue: 590 },
  { name: 'May 25', revenue: 820 },
  { name: 'May 26', revenue: 740 },
];

export default function EarningsDashboard() {
  const { transactions, payouts, totalRevenue, pendingPayout, addPayout } = useEarningsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  const stats = [
    { label: 'Total Revenue', value: `£${totalRevenue.toLocaleString()}`, change: '+12.5%', trend: 'up', icon: DollarSign, color: 'bg-primary' },
    { label: 'Pending Payout', value: `£${pendingPayout.toLocaleString()}`, change: 'Scheduled', trend: 'neutral', icon: Clock, color: 'bg-amber-500' },
    { label: 'Net Earnings', value: `£${(totalRevenue * 0.95).toLocaleString()}`, change: '+10.2%', trend: 'up', icon: TrendingUp, color: 'bg-emerald-500' },
    { label: 'Platform Fees', value: `£${(totalRevenue * 0.05).toLocaleString()}`, change: '5% flat', trend: 'neutral', icon: CreditCard, color: 'bg-slate-500' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Financial Overview</h1>
          <p className="text-muted-foreground font-medium">Track your revenue, manage payouts, and analyze sales performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <PremiumButton variant="outline" size="sm" icon={<Download size={16} />}>Export Reports</PremiumButton>
          <PremiumButton size="sm" icon={<Plus size={16} />}>Request Payout</PremiumButton>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="rounded-[2rem] border-border/40 shadow-sm overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-3 rounded-2xl text-white shadow-lg", stat.color)}>
                    <stat.icon size={20} />
                  </div>
                  <Badge variant="secondary" className={cn(
                    "rounded-full px-2 py-0.5 font-bold text-[10px]",
                    stat.trend === 'up' ? "text-emerald-600 bg-emerald-50" : stat.trend === 'down' ? "text-rose-600 bg-rose-50" : "text-slate-600 bg-slate-50"
                  )}>
                    {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                    {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveTab}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/40 pb-4">
          <TabsList className="bg-transparent h-auto p-0 gap-8 justify-start">
            {['Overview', 'Transactions', 'Payouts', 'Reports'].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab.toLowerCase()} 
                className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none px-0 py-2 text-sm font-bold uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground transition-all"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {activeTab === 'transactions' && (
            <div className="relative w-full lg:w-72 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search transactions..." 
                className="pl-12 h-10 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </div>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid lg:grid-cols-7 gap-6">
            <Card className="lg:col-span-4 rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-8">
                <div>
                  <CardTitle className="text-xl font-bold">Revenue Trends</CardTitle>
                  <CardDescription>Visualizing your performance over the last 7 days</CardDescription>
                </div>
                <div className="flex bg-secondary/40 p-1 rounded-xl">
                  <button className="px-4 py-1.5 text-xs font-bold bg-white shadow-sm rounded-lg">Revenue</button>
                  <button className="px-4 py-1.5 text-xs font-bold text-muted-foreground">Orders</button>
                </div>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#888' }} tickFormatter={(val) => `£${val}`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      formatter={(val) => [`£${val}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Event Performance</CardTitle>
                <CardDescription>Top revenue generators this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { title: 'Summer Jazz Night', revenue: 38250, percent: 65, color: 'bg-primary' },
                  { title: 'Pastry Workshop', revenue: 12400, percent: 25, color: 'bg-emerald-500' },
                  { title: 'Other Events', revenue: 4500, percent: 10, color: 'bg-slate-300' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold">{item.title}</span>
                      <span className="font-black">£{item.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        className={cn("h-full", item.color)} 
                      />
                    </div>
                  </div>
                ))}
                
                <div className="pt-6 border-t border-border/40">
                  <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <FileText className="text-primary" size={18} />
                      <div className="text-xs font-bold">Monthly Statement</div>
                    </div>
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Download</button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="rounded-[2rem] border-border/40 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow className="border-b border-border/40">
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Transaction ID</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Customer</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Event</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Amount</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Net</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-center">Status</TableHead>
                  <TableHead className="py-5"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id} className="group hover:bg-secondary/10 transition-colors border-b border-border/40 last:border-0">
                    <TableCell className="py-6 font-bold text-primary">{tx.id}</TableCell>
                    <TableCell className="py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{tx.customerName}</span>
                        <span className="text-[10px] text-muted-foreground">{tx.paymentMethod}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 font-bold text-sm line-clamp-1">{tx.eventTitle}</TableCell>
                    <TableCell className="py-6 text-sm text-muted-foreground">£{tx.amount.toLocaleString()}</TableCell>
                    <TableCell className="py-6 font-black text-sm">£{tx.net.toLocaleString()}</TableCell>
                    <TableCell className="py-6 text-center">
                      <Badge className={cn(
                        "rounded-full px-4 py-1 font-bold text-[9px] uppercase tracking-widest border-none",
                        tx.status === 'Completed' ? 'bg-emerald-500 text-white' : 
                        tx.status === 'Pending' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                      )}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-2 hover:bg-secondary rounded-full transition-colors"><MoreHorizontal size={18} /></button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px]">
                          <DropdownMenuItem className="rounded-xl font-medium py-2.5">View Details</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl font-medium py-2.5">Download Invoice</DropdownMenuItem>
                          <DropdownMenuItem className="rounded-xl font-medium py-2.5 text-rose-500">Refund</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-[2rem] border-border/40 shadow-sm p-8 bg-[#0B1221] text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10" />
              <div className="relative z-10 space-y-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Available for Payout</p>
                  <h3 className="text-4xl font-black">£{pendingPayout.toLocaleString()}</h3>
                </div>
                <div className="flex gap-4">
                  <PremiumButton className="bg-white text-slate-900 hover:bg-white/90">Transfer Now</PremiumButton>
                  <button className="text-sm font-bold text-white/70 hover:text-white transition-colors underline underline-offset-4">Auto-payout settings</button>
                </div>
              </div>
            </Card>

            <Card className="rounded-[2rem] border-border/40 shadow-sm p-8 flex flex-col justify-center">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Settlement Bank</p>
                  <p className="text-lg font-bold">Standard Chartered Bank</p>
                  <p className="text-sm text-muted-foreground">**** 8829</p>
                </div>
                <button className="ml-auto text-xs font-bold text-primary hover:underline">Change</button>
              </div>
            </Card>
          </div>

          <Card className="rounded-[2rem] border-border/40 shadow-sm overflow-hidden">
            <CardHeader className="bg-secondary/10">
              <CardTitle className="text-lg font-bold">Payout History</CardTitle>
            </CardHeader>
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/40">
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Payout ID</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Date</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Account</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest">Amount</TableHead>
                  <TableHead className="py-5 text-[10px] font-black uppercase tracking-widest text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((p) => (
                  <TableRow key={p.id} className="border-b border-border/40 last:border-0">
                    <TableCell className="py-6 font-bold">{p.id}</TableCell>
                    <TableCell className="py-6 text-sm text-muted-foreground">{new Date(p.date).toLocaleDateString()}</TableCell>
                    <TableCell className="py-6 text-sm font-medium">{p.bankName} ({p.accountNumber})</TableCell>
                    <TableCell className="py-6 font-black">£{p.amount.toLocaleString()}</TableCell>
                    <TableCell className="py-6 text-center">
                      <Badge className={cn(
                        "rounded-full px-4 py-1 font-bold text-[9px] uppercase tracking-widest",
                        p.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      )}>
                        {p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
