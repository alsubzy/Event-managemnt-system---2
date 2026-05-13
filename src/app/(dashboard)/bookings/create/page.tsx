
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, ArrowRight, ArrowLeft, Check, Ticket, User, CreditCard, 
  Search, ShoppingCart, Calendar, MapPin, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { PremiumButton } from '@/components/ui/premium-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBookingStore } from '@/store/use-booking-store';
import { useEventStore } from '@/store/use-event-store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const STEPS = [
  { id: 1, title: 'Event', icon: Calendar },
  { id: 2, title: 'Details', icon: User },
  { id: 3, title: 'Payment', icon: CreditCard },
  { id: 4, title: 'Confirm', icon: CheckCircle2 },
];

export default function CreateBookingPage() {
  const router = useRouter();
  const { addBooking } = useBookingStore();
  const { events } = useEventStore();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchEvent, setSearchEvent] = useState('');

  const [formData, setFormData] = useState({
    eventId: '',
    eventTitle: '',
    eventDate: '',
    customerName: '',
    customerEmail: '',
    ticketType: 'Standard' as 'VIP' | 'Standard' | 'Early Bird',
    quantity: 1,
    unitPrice: 0,
    paymentMethod: 'Card' as const,
  });

  const selectedEvent = events.find(e => e.id === formData.eventId);
  const filteredEvents = events.filter(e => e.title.toLowerCase().includes(searchEvent.toLowerCase()));

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleCreate = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    
    addBooking({
      ...formData,
      customerId: 'temp_user',
      totalAmount: formData.quantity * formData.unitPrice,
      status: 'Confirmed',
      paymentStatus: 'Paid',
    } as any);

    toast({ title: "Booking Created", description: "The ticket has been successfully booked." });
    router.push('/bookings');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Manual Booking</h1>
          <p className="text-muted-foreground">Process a new ticket booking for a customer.</p>
        </div>
        <PremiumButton variant="outline" size="sm" onClick={() => router.back()} icon={<ArrowLeft size={16} />}>
          Discard
        </PremiumButton>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between border-b border-border/40 pb-10">
        {STEPS.map((step, i) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-3 relative">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 z-10 bg-background",
                  isActive ? "border-primary text-primary shadow-lg shadow-primary/10" : 
                  isCompleted ? "border-emerald-500 bg-emerald-50 text-emerald-500" : "border-border text-muted-foreground"
                )}>
                  {isCompleted ? <Check size={20} strokeWidth={3} /> : <step.icon size={20} />}
                </div>
                <span className={cn("text-[10px] font-bold uppercase tracking-widest", isActive ? "text-primary" : "text-muted-foreground")}>
                  {step.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-[2px] mb-6 mx-4 rounded-full bg-border/40", currentStep > step.id && "bg-emerald-200")} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Search for an event..." 
                  className="pl-12 h-14 rounded-2xl border-border/40 bg-secondary/20 focus:bg-background text-lg"
                  value={searchEvent}
                  onChange={(e) => setSearchEvent(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => {
                      setFormData({ 
                        ...formData, 
                        eventId: event.id, 
                        eventTitle: event.title, 
                        eventDate: event.startDate,
                        unitPrice: event.price 
                      });
                      nextStep();
                    }}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-[1.5rem] border-2 text-left transition-all hover:border-primary/50 group",
                      formData.eventId === event.id ? "border-primary bg-primary/5 shadow-md" : "border-border/40 bg-card"
                    )}
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0">
                      <img src={event.image} alt="" className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-bold text-sm line-clamp-1">{event.title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1 uppercase tracking-widest">
                        <Calendar size={10} /> {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer Name</Label>
                  <Input 
                    placeholder="Jane Doe" 
                    className="h-12 rounded-xl bg-secondary/20"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</Label>
                  <Input 
                    type="email" 
                    placeholder="jane@example.com" 
                    className="h-12 rounded-xl bg-secondary/20"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ticket Type</Label>
                  <select 
                    className="w-full h-12 rounded-xl border border-border/40 bg-secondary/20 px-4 text-sm font-medium focus:outline-none focus:border-primary"
                    value={formData.ticketType}
                    onChange={(e) => setFormData({...formData, ticketType: e.target.value as any})}
                  >
                    <option value="Standard">Standard Admission</option>
                    <option value="VIP">VIP Premium</option>
                    <option value="Early Bird">Early Bird</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quantity</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    className="h-12 rounded-xl bg-secondary/20"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
              <div className="p-8 bg-secondary/10 rounded-[2rem] border border-border/40">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Payment Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground font-medium">Ticket ({formData.ticketType}) x {formData.quantity}</span>
                    <span className="font-bold">£{(formData.unitPrice * formData.quantity).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-t border-border/40 pt-4">
                    <span className="text-lg font-bold">Total Amount</span>
                    <span className="text-2xl font-black text-primary">£{(formData.unitPrice * formData.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Payment Method</Label>
                <div className="grid grid-cols-3 gap-4">
                  {['Card', 'PayPal', 'Transfer'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setFormData({...formData, paymentMethod: method as any})}
                      className={cn(
                        "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                        formData.paymentMethod === method ? "border-primary bg-primary/5" : "border-border/40"
                      )}
                    >
                      <CreditCard size={24} className={formData.paymentMethod === method ? "text-primary" : "text-muted-foreground"} />
                      <span className="text-xs font-bold">{method}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-10 space-y-8">
              <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner border-2 border-emerald-100">
                <Check size={48} strokeWidth={3} />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black tracking-tight">Ready to Confirm?</h2>
                <p className="text-muted-foreground max-w-sm font-medium">Review the booking details and confirm to generate the customer's digital ticket.</p>
              </div>
              
              <div className="w-full max-w-md bg-card border border-border/40 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Customer</p>
                  <p className="font-bold">{formData.customerName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Event</p>
                  <p className="font-bold">{formData.eventTitle}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tickets</p>
                    <p className="font-bold">{formData.quantity}x {formData.ticketType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total</p>
                    <p className="font-black text-xl">£{(formData.unitPrice * formData.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-10 border-t border-border/40">
        <PremiumButton 
          variant="outline" 
          onClick={prevStep} 
          disabled={currentStep === 1 || isSubmitting}
          className="rounded-full"
        >
          Back
        </PremiumButton>
        {currentStep === STEPS.length ? (
          <PremiumButton 
            onClick={handleCreate} 
            loading={isSubmitting}
            className="rounded-full bg-emerald-600 hover:bg-emerald-700"
            icon={<CheckCircle2 size={18} />}
          >
            Confirm & Complete
          </PremiumButton>
        ) : (
          <PremiumButton 
            onClick={nextStep} 
            disabled={currentStep === 1 && !formData.eventId}
            icon={<ArrowRight size={18} />}
            className="rounded-full"
          >
            Continue
          </PremiumButton>
        )}
      </div>
    </div>
  );
}
