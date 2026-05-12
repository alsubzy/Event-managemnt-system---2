
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Search, Filter, Calendar, MapPin, Download, MoreHorizontal, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const BOOKINGS = [
  { id: 'TKT-1024', event: 'Summer Jazz Night', date: 'Aug 12, 2024', amount: '£45.00', status: 'Confirmed', buyer: 'Marcus Aurelius' },
  { id: 'TKT-1025', event: 'Royal Pastry Workshop', date: 'Sep 05, 2024', amount: '£120.00', status: 'Pending', buyer: 'Diana Prince' },
  { id: 'TKT-1026', event: 'Tech Innovators Summit', date: 'Oct 22, 2024', amount: '£299.00', status: 'Confirmed', buyer: 'Arthur Curry' },
  { id: 'TKT-1027', event: 'Midnight Wine Tasting', date: 'Jul 28, 2024', amount: '£75.00', status: 'Cancelled', buyer: 'Selina Kyle' },
  { id: 'TKT-1028', event: 'Garden Wedding Expo', date: 'May 10, 2024', amount: '£15.00', status: 'Confirmed', buyer: 'Bruce Wayne' },
];

export default function BookingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Bookings</h1>
          <p className="text-muted-foreground">Manage ticket sales and attendee list for your events.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-2 font-bold h-12 gap-2">
            <Download size={18} /> Export List
          </Button>
          <Button className="rounded-xl h-12 font-bold px-6 shadow-lg shadow-primary/20">
            Bulk Actions
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Sales', value: '£8,450', icon: Ticket, color: 'text-primary' },
          { title: 'Tickets Sold', value: '142', icon: CheckCircle2, color: 'text-emerald-500' },
          { title: 'Pending Approval', value: '8', icon: Clock, color: 'text-amber-500' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-3xl border-border/50 p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shadow-inner", stat.color)}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.title}</p>
                <p className="text-3xl font-black">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="rounded-[2rem] border-border/50 overflow-hidden shadow-sm">
        <div className="p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by Order ID, Event, or Buyer..." 
              className="pl-12 rounded-xl h-12 bg-secondary/30 border-none focus-visible:bg-white"
            />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl h-12 gap-2 border-2 font-bold">
              <Filter size={18} /> Filters
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="border-b">
                <TableHead className="py-5 font-bold uppercase tracking-wider text-xs">Order ID</TableHead>
                <TableHead className="py-5 font-bold uppercase tracking-wider text-xs">Event Details</TableHead>
                <TableHead className="py-5 font-bold uppercase tracking-wider text-xs">Buyer</TableHead>
                <TableHead className="py-5 font-bold uppercase tracking-wider text-xs text-right">Amount</TableHead>
                <TableHead className="py-5 font-bold uppercase tracking-wider text-xs text-center">Status</TableHead>
                <TableHead className="py-5 text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BOOKINGS.map((order, i) => (
                <TableRow key={i} className="group hover:bg-secondary/10 transition-colors border-b last:border-0">
                  <TableCell className="py-6 font-bold text-sm text-primary">{order.id}</TableCell>
                  <TableCell className="py-6">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm">{order.event}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar size={12} /> {order.date}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {order.buyer.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium">{order.buyer}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6 text-right font-black">{order.amount}</TableCell>
                  <TableCell className="py-6 text-center">
                    <Badge variant="secondary" className={cn(
                      "rounded-full px-3 py-1 font-bold border-0",
                      order.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                      order.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    )}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary"><MoreHorizontal size={18} /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl p-2 min-w-[160px]">
                        <DropdownMenuItem className="rounded-lg font-medium py-2">View Details</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg font-medium py-2">Resend Email</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg font-medium py-2 text-rose-500">Cancel Booking</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
