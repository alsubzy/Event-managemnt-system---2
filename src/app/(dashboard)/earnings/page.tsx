"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, CreditCard, ArrowUpRight, ArrowDownRight,
  Download, Clock, CheckCircle2, XCircle, Search, MoreHorizontal,
  FileText, Landmark, Banknote, RefreshCw,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEarningsStore } from '@/store/use-earnings-store';
import { PremiumButton } from '@/components/ui/premium-button';
import { PageHeader } from '@/components/ui/page-header';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const chartData = [
  { name: 'Mon', revenue: 4500 },
  { name: 'Tue', revenue: 5200 },
  { name: 'Wed', revenue: 4800 },
  { name: 'Thu', revenue: 6100 },
  { name: 'Fri', revenue: 5900 },
  { name: 'Sat', revenue: 8200 },
  { name: 'Sun', revenue: 7400 },
];

const txStatusConfig: Record<string, string> = {
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending:   'bg-amber-50  text-amber-700  border-amber-200',
  Failed:    'bg-red-50    text-red-600    border-red-200',
};

const payoutStatusConfig: Record<string, string> = {
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending:   'bg-amber-50  text-amber-700  border-amber-200',
};

export default function EarningsDashboard() {
  const { transactions, payouts, totalRevenue, pendingPayout } = useEarningsStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const filteredTx = useMemo(() => transactions.filter(t =>
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())
  ), [transactions, searchQuery]);

  const netEarnings = totalRevenue * 0.95;
  const platformFee = totalRevenue * 0.05;

  const handleExport = () => {
    toast({ title: 'Exporting report…', description: 'Your CSV report will download shortly.' });
  };

  const handlePayout = () => {
    toast({ title: 'Payout requested', description: `£${pendingPayout.toLocaleString()} will be transferred within 2 business days.` });
  };

  return (
    <div className="space-y-7 animate-fade-in">

      <PageHeader title="Finance" description="Track revenue, manage payouts, and analyse sales performance.">
        <PremiumButton variant="outline" size="sm" icon={<Download size={14} />} onClick={handleExport}>
          Export Report
        </PremiumButton>
        <PremiumButton size="sm" icon={<Landmark size={15} />} onClick={handlePayout}>
          Request Payout
        </PremiumButton>
      </PageHeader>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',  value: `£${totalRevenue.toLocaleString()}`,             change: '+12.5%', trend: 'up',  icon: TrendingUp,  color: 'bg-primary/10 text-primary' },
          { label: 'Pending Payout', value: `£${pendingPayout.toLocaleString()}`,            change: 'Due soon', trend: 'neutral', icon: Clock, color: 'bg-amber-50 text-amber-600' },
          { label: 'Net Earnings',   value: `£${netEarnings.toLocaleString(undefined, {maximumFractionDigits: 0})}`, change: '+10.2%', trend: 'up', icon: Banknote, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Platform Fee',   value: `£${platformFee.toLocaleString(undefined, {maximumFractionDigits: 0})}`, change: '5% flat', trend: 'neutral', icon: CreditCard, color: 'bg-slate-100 text-slate-600' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <div className="stat-card">
              <div className="flex items-start justify-between mb-4">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', s.color)}>
                  <s.icon size={16} />
                </div>
                <span className={cn(
                  'text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1',
                  s.trend === 'up' ? 'bg-emerald-50 text-emerald-600' :
                  s.trend === 'down' ? 'bg-red-50 text-red-500' :
                  'bg-slate-100 text-slate-500'
                )}>
                  {s.trend === 'up' && <ArrowUpRight size={10} />}
                  {s.trend === 'down' && <ArrowDownRight size={10} />}
                  {s.change}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{s.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-0">
          <TabsList className="bg-transparent h-auto p-0 gap-6 justify-start rounded-none">
            {['Overview', 'Transactions', 'Payouts'].map(tab => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent shadow-none px-0 pb-3 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground data-[state=active]:text-primary transition-all"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {activeTab === 'transactions' && (
            <div className="relative pb-3 sm:pb-0">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 h-8 w-64 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
              />
            </div>
          )}
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-5 pt-6">
          <div className="grid lg:grid-cols-7 gap-5">

            {/* Revenue Chart */}
            <Card className="premium-card lg:col-span-4">
              <CardHeader className="px-6 pt-5 pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold">Revenue Trends</CardTitle>
                    <CardDescription className="text-xs mt-0.5">Daily revenue for the last 7 days</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-5 pt-3 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="revGradFin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="hsl(221, 83%, 53%)" stopOpacity={0.12} />
                        <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={6} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `£${v / 1000}k`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '12px' }} formatter={(v: any) => [`£${v.toLocaleString()}`, 'Revenue']} />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(221, 83%, 53%)" strokeWidth={2.5} fill="url(#revGradFin)" animationDuration={1200} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Events */}
            <Card className="premium-card lg:col-span-3">
              <CardHeader className="px-5 pt-5 pb-3">
                <CardTitle className="text-base font-semibold">Event Performance</CardTitle>
                <CardDescription className="text-xs mt-0.5">Top revenue generators this period</CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-4">
                {[
                  { title: 'Summer Jazz Night',    revenue: 38250, pct: 65, color: 'bg-primary' },
                  { title: 'Royal Pastry Workshop', revenue: 12400, pct: 25, color: 'bg-emerald-500' },
                  { title: 'Other Events',          revenue: 4500,  pct: 10, color: 'bg-slate-200' },
                ].map((item, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-700 truncate max-w-[160px]">{item.title}</span>
                      <span className="text-xs font-bold text-slate-900">£{item.revenue.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.pct}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                        className={cn('h-full rounded-full', item.color)}
                      />
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-dashed border-slate-200">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <FileText size={15} />
                      <span className="text-xs font-medium">Monthly Statement</span>
                    </div>
                    <button className="text-[10px] font-bold text-primary uppercase tracking-wide hover:underline">
                      Download
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="pt-6">
          <Card className="premium-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {['Transaction ID', 'Customer', 'Event', 'Gross', 'Net', 'Status', ''].map(h => (
                      <th key={h} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTx.length === 0 ? (
                    <tr><td colSpan={7} className="py-16 text-center text-sm text-slate-400">No transactions found</td></tr>
                  ) : filteredTx.map((tx) => (
                    <tr key={tx.id} className="saas-table-row group">
                      <td className="px-5 py-4"><span className="text-xs font-bold text-primary">{tx.id}</span></td>
                      <td className="px-5 py-4">
                        <p className="text-xs font-semibold text-slate-800">{tx.customerName}</p>
                        <p className="text-[10px] text-slate-400">{tx.paymentMethod}</p>
                      </td>
                      <td className="px-5 py-4 text-xs font-medium text-slate-700 max-w-[160px] truncate">{tx.eventTitle}</td>
                      <td className="px-5 py-4 text-xs text-slate-500">£{tx.amount.toLocaleString()}</td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-900">£{tx.net.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide', txStatusConfig[tx.status] ?? txStatusConfig.Pending)}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><MoreHorizontal size={14} /></button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl p-1.5 shadow-xl border-slate-200">
                            <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-xs">View Details</DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-xs">Download Invoice</DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-xs text-red-500 focus:text-red-500 focus:bg-red-50">Refund</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-5 pt-6">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Available Balance */}
            <div className="rounded-2xl bg-slate-900 text-white p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent pointer-events-none" />
              <div className="relative z-10 space-y-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Available for Payout</p>
                  <h2 className="text-4xl font-bold mt-1">£{pendingPayout.toLocaleString()}</h2>
                  <p className="text-sm text-white/60 mt-1">Funds clear within 2–3 business days</p>
                </div>
                <div className="flex gap-3">
                  <PremiumButton
                    className="bg-white text-slate-900 hover:bg-white/90"
                    onClick={handlePayout}
                    icon={<Banknote size={15} />}
                  >
                    Transfer Now
                  </PremiumButton>
                  <button className="text-xs font-medium text-white/60 hover:text-white underline underline-offset-4 transition-colors">
                    Auto-payout settings
                  </button>
                </div>
              </div>
            </div>

            {/* Bank Account */}
            <Card className="premium-card p-6 flex flex-col justify-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <Landmark size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Settlement Account</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">Standard Chartered Bank</p>
                  <p className="text-xs text-slate-500">**** **** **** 8829</p>
                </div>
                <button className="ml-auto text-xs font-semibold text-primary hover:underline">Change</button>
              </div>
            </Card>
          </div>

          {/* Payout History */}
          <Card className="premium-card overflow-hidden">
            <CardHeader className="px-5 py-4 border-b border-slate-100">
              <CardTitle className="text-base font-semibold">Payout History</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    {['Payout ID', 'Date', 'Account', 'Amount', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payouts.map((p) => (
                    <tr key={p.id} className="saas-table-row">
                      <td className="px-5 py-4 text-xs font-bold text-slate-700">{p.id}</td>
                      <td className="px-5 py-4 text-xs text-slate-500">{new Date(p.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-5 py-4 text-xs text-slate-600">{p.bankName} ({p.accountNumber})</td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-900">£{p.amount.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={cn('text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide', payoutStatusConfig[p.status] ?? payoutStatusConfig.Pending)}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
