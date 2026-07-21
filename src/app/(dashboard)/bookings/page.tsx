"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket, Search, Calendar, Download, MoreHorizontal,
  CheckCircle2, Clock, X, CreditCard, ArrowUpRight,
  Eye, RefreshCw, ChevronLeft, ChevronRight, Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useBookingStore, BookingStatus } from '@/store/use-booking-store';
import { PremiumButton } from '@/components/ui/premium-button';
import { PageHeader } from '@/components/ui/page-header';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const chartData = [
  { name: 'Mon', bookings: 4 },
  { name: 'Tue', bookings: 7 },
  { name: 'Wed', bookings: 5 },
  { name: 'Thu', bookings: 9 },
  { name: 'Fri', bookings: 12 },
  { name: 'Sat', bookings: 15 },
  { name: 'Sun', bookings: 10 },
];

const STATUS_FILTERS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Refunded'] as const;

const statusConfig: Record<string, { className: string }> = {
  Confirmed: { className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Pending:   { className: 'bg-amber-50  text-amber-700  border-amber-200'  },
  Cancelled: { className: 'bg-red-50    text-red-600    border-red-200'    },
  Completed: { className: 'bg-slate-100 text-slate-600  border-slate-200'  },
  Refunded:  { className: 'bg-violet-50 text-violet-700 border-violet-200' },
};

const paymentConfig: Record<string, string> = {
  Paid:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending:  'bg-amber-50  text-amber-700  border-amber-200',
  Refunded: 'bg-violet-50 text-violet-700 border-violet-200',
  Failed:   'bg-red-50    text-red-600    border-red-200',
};

const ITEMS_PER_PAGE = 8;

export default function BookingsDashboard() {
  const { bookings, cancelBooking, refundBooking, deleteBooking } = useBookingStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'All'>('All');
  const [page, setPage] = useState(1);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch =
        b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginated  = filteredBookings.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const totalRevenue    = bookings.reduce((acc, b) => acc + (b.paymentStatus === 'Paid' ? b.totalAmount : 0), 0);
  const confirmedCount  = bookings.filter(b => b.status === 'Confirmed').length;
  const pendingCount    = bookings.filter(b => b.status === 'Pending').length;
  const cancelledCount  = bookings.filter(b => b.status === 'Cancelled').length;

  const handleCancel = (id: string) => {
    cancelBooking(id);
    toast({ title: 'Booking cancelled', description: 'The booking has been cancelled.' });
  };
  const handleRefund = (id: string) => {
    refundBooking(id);
    toast({ title: 'Refund initiated', description: 'The refund is being processed.' });
  };

  return (
    <div className="space-y-7 animate-fade-in">

      <PageHeader title="Bookings" description="Monitor ticket sales, customers, and payment status.">
        <PremiumButton variant="outline" size="sm" icon={<Download size={14} />}>Export CSV</PremiumButton>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue',    value: `£${totalRevenue.toLocaleString()}`, icon: CreditCard,   color: 'bg-primary/10 text-primary' },
          { label: 'Confirmed',        value: confirmedCount,                       icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Pending Review',   value: pendingCount,                         icon: Clock,        color: 'bg-amber-50 text-amber-600' },
          { label: 'Cancelled',        value: cancelledCount,                       icon: X,            color: 'bg-red-50 text-red-500' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <div className="stat-card flex items-center gap-3.5">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', s.color)}>
                <s.icon size={17} />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{s.label}</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{s.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Trend Chart */}
      <Card className="premium-card">
        <CardHeader className="px-6 pt-5 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Booking Trends</CardTitle>
              <CardDescription className="text-xs mt-0.5">Daily booking volume this week</CardDescription>
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wide">
              Live
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-5 pt-3 h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="hsl(221, 83%, 53%)" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={6} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: '12px' }} />
              <Area type="monotone" dataKey="bookings" stroke="hsl(221, 83%, 53%)" strokeWidth={2} fill="url(#bookGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s as any); setPage(1); }}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                statusFilter === s
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 h-9 bg-white border border-slate-200 rounded-lg text-sm
                       placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20
                       focus:border-primary/40 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="premium-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {['Booking ID', 'Customer', 'Event', 'Payment', 'Amount', 'Status', ''].map(h => (
                  <th key={h} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center">
                          <Ticket size={24} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-semibold text-slate-600">No bookings found</p>
                        <p className="text-xs text-slate-400">Try adjusting your filters or search terms.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((booking) => (
                    <tr key={booking.id} className="saas-table-row group">
                      <td className="px-5 py-4">
                        <span className="text-xs font-bold text-primary">{booking.id}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">
                            {booking.customerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{booking.customerName}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{booking.customerEmail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs font-semibold text-slate-800 max-w-[160px] truncate">{booking.eventTitle}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Calendar size={9} />{new Date(booking.eventDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          'text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide',
                          paymentConfig[booking.paymentStatus] ?? paymentConfig.Pending
                        )}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-900">
                        £{booking.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          'text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wide',
                          statusConfig[booking.status]?.className ?? 'bg-slate-100 text-slate-500 border-slate-200'
                        )}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                              <MoreHorizontal size={14} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl p-1.5 w-48 shadow-xl border-slate-200">
                            <DropdownMenuItem asChild>
                              <Link href={`/bookings/${booking.id}`} className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer">
                                <Eye size={13} /> View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer">
                              <Download size={13} /> Download Ticket
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleRefund(booking.id)}
                              className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                            >
                              <CreditCard size={13} /> Refund
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCancel(booking.id)}
                              className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                            >
                              <X size={13} /> Cancel Booking
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filteredBookings.length)} of {filteredBookings.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'w-7 h-7 rounded-lg text-xs font-semibold transition-all',
                    page === p ? 'bg-primary text-white shadow-sm' : 'hover:bg-slate-100 text-slate-600'
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 hover:bg-slate-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
