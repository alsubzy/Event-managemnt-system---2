
"use client";

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Download, Mail, Calendar, MapPin, Ticket, User, 
  CreditCard, CheckCircle2, Clock, X, Trash2, Printer, Share2 
} from 'lucide-react';
import { useBookingStore } from '@/store/use-booking-store';
import { PremiumButton } from '@/components/ui/premium-button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { bookings, cancelBooking, refundBooking, deleteBooking } = useBookingStore();
  
  const booking = useMemo(() => bookings.find(b => b.id === id), [bookings, id]);

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-muted-foreground/30">
          <Ticket size={40} />
        </div>
        <h2 className="text-2xl font-bold">Booking Not Found</h2>
        <PremiumButton onClick={() => router.push('/bookings')}>Back to Bookings</PremiumButton>
      </div>
    );
  }

  const timeline = [
    { label: 'Booking Initiated', time: booking.bookingDate, status: 'Completed', icon: Clock },
    { label: 'Payment Successful', time: booking.bookingDate, status: booking.paymentStatus === 'Paid' ? 'Completed' : 'Pending', icon: CreditCard },
    { label: 'Ticket Generated', time: booking.bookingDate, status: booking.status === 'Confirmed' ? 'Completed' : 'Pending', icon: Ticket },
    { label: 'Event Check-in', time: booking.eventDate, status: booking.status === 'Completed' ? 'Completed' : 'Future', icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-12">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/bookings')} className="w-12 h-12 rounded-full border border-border/40 flex items-center justify-center hover:bg-secondary transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black">{booking.id}</h1>
              <Badge className={cn(
                "rounded-full px-3 py-1 font-bold text-[9px] uppercase tracking-widest",
                booking.status === 'Confirmed' ? 'bg-emerald-500 text-white' : 'bg-secondary text-muted-foreground'
              )}>
                {booking.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Booked on {new Date(booking.bookingDate).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <PremiumButton variant="outline" size="sm" icon={<Mail size={16} />}>Resend</PremiumButton>
          <PremiumButton variant="outline" size="sm" icon={<Printer size={16} />}>Print</PremiumButton>
          <PremiumButton size="sm" icon={<Share2 size={16} />}>Share</PremiumButton>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-card">
            <CardHeader className="bg-secondary/20 pb-8">
              <CardTitle className="text-lg font-bold">Booking Details</CardTitle>
              <CardDescription>Comprehensive overview of this transaction</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              {/* Event Section */}
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Event</p>
                    <p className="text-lg font-bold leading-tight">{booking.eventTitle}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</p>
                      <p className="text-sm font-bold flex items-center gap-2"><Calendar size={14} className="text-primary" /> {new Date(booking.eventDate).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</p>
                      <p className="text-sm font-bold uppercase tracking-wide">{booking.ticketType}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</p>
                    <p className="text-lg font-bold leading-tight">{booking.customerName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</p>
                    <p className="text-sm font-bold flex items-center gap-2 underline text-primary cursor-pointer"><Mail size={14} /> {booking.customerEmail}</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/40" />

              {/* Payment Section */}
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Method</p>
                    <p className="text-sm font-bold flex items-center gap-2 uppercase"><CreditCard size={14} className="text-primary" /> {booking.paymentMethod}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payment Status</p>
                    <Badge variant="outline" className={cn(
                      "rounded-full border-none px-4 py-1.5 font-bold text-[10px] uppercase tracking-widest",
                      booking.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    )}>
                      {booking.paymentStatus}
                    </Badge>
                  </div>
                </div>
                <div className="bg-secondary/20 p-6 rounded-3xl space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                    <span>Base Fare ({booking.quantity}x)</span>
                    <span>£{(booking.unitPrice * booking.quantity).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                    <span>Processing Fee</span>
                    <span>£0.00</span>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-sm font-black uppercase tracking-widest">Total</span>
                    <span className="text-xl font-black">£{booking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Activity History</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-8 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-border/40">
                {timeline.map((item, i) => (
                  <div key={i} className="flex gap-6 relative">
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center border-2 z-10 bg-background",
                      item.status === 'Completed' ? "border-emerald-500 text-emerald-500 bg-emerald-50" : 
                      item.status === 'Future' ? "border-border text-muted-foreground/30" : "border-amber-500 text-amber-500 bg-amber-50"
                    )}>
                      <item.icon size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{item.label}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{new Date(item.time).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Ticket Preview & Actions */}
        <div className="space-y-8">
          {/* Ticket Card */}
          <div className="bg-[#0B1221] text-white rounded-[2.5rem] p-8 space-y-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-10 -mt-10 blur-3xl" />
            
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">YEGLEEL EMS</p>
                <h3 className="text-xl font-bold tracking-tight">Official Ticket</h3>
              </div>
              <Ticket className="text-primary" size={24} />
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Attendee</p>
                <p className="text-sm font-bold">{booking.customerName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Event Details</p>
                <p className="text-sm font-bold line-clamp-1">{booking.eventTitle}</p>
                <p className="text-[10px] text-white/60">{new Date(booking.eventDate).toDateString()}</p>
              </div>
            </div>

            <div className="flex justify-center py-4 bg-white/5 rounded-3xl border border-white/10 relative z-10">
              <div className="w-40 h-40 bg-white p-4 rounded-2xl">
                {/* QR Code Placeholder */}
                <div className="w-full h-full bg-slate-900 flex items-center justify-center rounded-lg">
                  <span className="text-[8px] text-white/40 uppercase tracking-widest font-black">QR AUTH</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between items-end relative z-10">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Booking ID</p>
                <p className="text-sm font-black text-primary">{booking.id}</p>
              </div>
              <Badge className="bg-white text-slate-900 border-none font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full">
                {booking.ticketType}
              </Badge>
            </div>
          </div>

          {/* Action List */}
          <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <PremiumButton 
                variant="outline" 
                className="w-full justify-start rounded-2xl h-14" 
                icon={<Download size={18} />}
              >
                Download PDF
              </PremiumButton>
              <PremiumButton 
                variant="outline" 
                className="w-full justify-start rounded-2xl h-14" 
                icon={<Mail size={18} />}
              >
                Email Customer
              </PremiumButton>
              <Separator className="my-2 bg-border/40" />
              <button 
                onClick={() => refundBooking(booking.id)}
                className="w-full flex items-center gap-3 px-4 h-14 rounded-2xl text-amber-600 font-bold hover:bg-amber-50 transition-all"
              >
                <CreditCard size={18} /> Refund Booking
              </button>
              <button 
                onClick={() => cancelBooking(booking.id)}
                className="w-full flex items-center gap-3 px-4 h-14 rounded-2xl text-rose-600 font-bold hover:bg-rose-50 transition-all"
              >
                <X size={18} /> Cancel Booking
              </button>
              <button 
                onClick={() => {
                  deleteBooking(booking.id);
                  router.push('/bookings');
                }}
                className="w-full flex items-center gap-3 px-4 h-14 rounded-2xl text-rose-600 font-bold hover:bg-rose-50 transition-all"
              >
                <Trash2 size={18} /> Delete Permanently
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
