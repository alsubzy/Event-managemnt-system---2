
"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ticket, Search, Filter, Calendar, MapPin, Download, MoreHorizontal, 
  CheckCircle2, Clock, Plus, X, ChevronRight, User, CreditCard, ArrowUpRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useBookingStore, BookingStatus } from '@/store/use-booking-store';
import { PremiumButton } from '@/components/ui/premium-button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyChartData = [
  { name: 'Mon', bookings: 4 },
  { name: 'Tue', bookings: 7 },
  { name: 'Wed', bookings: 5 },
  { name: 'Thu', bookings: 9 },
  { name: 'Fri', bookings: 12 },
  { name: 'Sat', bookings: 15 },
  { name: 'Sun', bookings: 10 },
];

export default function BookingsDashboard() {
  const { bookings, cancelBooking, refundBooking, deleteBooking } = useBookingStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'All'>('All');

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch = b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           b.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const stats = [
    { label: 'Total Revenue', value: `£${bookings.reduce((acc, b) => acc + (b.paymentStatus === 'Paid' ? b.totalAmount : 0), 0).toLocaleString()}`, icon: CreditCard, color: 'text-primary' },
    { label: 'Active Bookings', value: bookings.filter(b => b.status === 'Confirmed').length, icon: CheckCircle2, color: 'text-emerald-500' },
    { label: 'Pending', value: bookings.filter(b => b.status === 'Pending').length, icon: Clock, color: 'text-amber-500' },
    { label: 'Canceled', value: bookings.filter(b => b.status === 'Cancelled').length, icon: X, color: 'text-rose-500' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
          <p className="text-muted-foreground">Monitor ticket sales, customers, and financial status.</p>
        </div>
        <div className="flex gap-3">
          <PremiumButton variant="outline" size="sm" icon={<Download size={16} />}>Export CSV</PremiumButton>
          <Link href="/bookings/create">
            <PremiumButton size="sm" icon={<Plus size={16} />}>New Booking</PremiumButton>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border/40 rounded-[1.5rem] p-6 shadow-sm flex items-center gap-5">
            <div className={cn("w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center", stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Chart */}
      <Card className="rounded-[2rem] border-border/40 overflow-hidden shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-8">
          <div>
            <CardTitle className="text-xl font-bold">Booking Trends</CardTitle>
            <CardDescription>Daily booking volume for the current week</CardDescription>
          </div>
          <Badge variant="secondary" className="rounded-full px-4 py-1 font-bold">Live Data</Badge>
        </CardHeader>
        <CardContent className="h-[300px] px-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dummyChartData}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
              <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="bookings" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center pb-4 border-b border-border/40">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full lg:w-auto">
          {(['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Refunded'] as const).map((status) => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all",
                statusFilter === status 
                  ? "bg-[#0B1221] text-white shadow-md shadow-black/10" 
                  : "text-muted-foreground hover:bg-secondary"
              )}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative flex-1 lg:w-80 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search bookings..." 
            className="pl-12 h-11 rounded-xl border-border/40 bg-secondary/30 focus:bg-background transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Bookings Table */}
      <Card className="rounded-[2rem] border-border/40 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-secondary/20">
            <TableRow className="border-b border-border/40">
              <TableHead className="py-5 font-bold uppercase tracking-widest text-[10px]">Booking ID</TableHead>
              <TableHead className="py-5 font-bold uppercase tracking-widest text-[10px]">Customer</TableHead>
              <TableHead className="py-5 font-bold uppercase tracking-widest text-[10px]">Event</TableHead>
              <TableHead className="py-5 font-bold uppercase tracking-widest text-[10px]">Payment</TableHead>
              <TableHead className="py-5 font-bold uppercase tracking-widest text-[10px] text-right">Amount</TableHead>
              <TableHead className="py-5 font-bold uppercase tracking-widest text-[10px] text-center">Status</TableHead>
              <TableHead className="py-5"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                        <Ticket size={24} className="text-muted-foreground/40" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-lg">No bookings found</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id} className="group hover:bg-secondary/10 transition-colors border-b border-border/40 last:border-0">
                    <TableCell className="py-6">
                      <span className="font-bold text-primary">{booking.id}</span>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-xs font-bold text-primary">
                          {booking.customerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{booking.customerName}</span>
                          <span className="text-[10px] text-muted-foreground">{booking.customerEmail}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-sm line-clamp-1">{booking.eventTitle}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar size={10} /> {new Date(booking.eventDate).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <Badge variant="outline" className={cn(
                        "rounded-full border-none px-3 py-1 font-bold text-[9px] uppercase tracking-widest",
                        booking.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                        booking.paymentStatus === 'Refunded' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                      )}>
                        {booking.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6 text-right font-black">£{booking.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="py-6 text-center">
                      <Badge className={cn(
                        "rounded-full px-4 py-1.5 font-bold text-[9px] uppercase tracking-widest border-none shadow-sm",
                        booking.status === 'Confirmed' ? 'bg-emerald-500 text-white' : 
                        booking.status === 'Pending' ? 'bg-amber-500 text-white' : 
                        booking.status === 'Cancelled' ? 'bg-rose-500 text-white' : 'bg-secondary text-muted-foreground'
                      )}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary"><MoreHorizontal size={18} /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[180px] shadow-xl border-border/50">
                          <DropdownMenuItem asChild>
                            <Link href={`/bookings/${booking.id}`} className="flex items-center gap-2 cursor-pointer py-2.5 rounded-xl font-medium">
                              <Search size={14} /> View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2.5 rounded-xl font-medium">
                            <Download size={14} /> Get Ticket
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-2 bg-border/40" />
                          <DropdownMenuItem onClick={() => refundBooking(booking.id)} className="flex items-center gap-2 cursor-pointer py-2.5 rounded-xl font-medium text-amber-600">
                            <CreditCard size={14} /> Refund Booking
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => cancelBooking(booking.id)} className="flex items-center gap-2 cursor-pointer py-2.5 rounded-xl font-medium text-rose-600">
                            <X size={14} /> Cancel Booking
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteBooking(booking.id)} className="flex items-center gap-2 cursor-pointer py-2.5 rounded-xl font-medium text-rose-600">
                            <X size={14} /> Delete Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
