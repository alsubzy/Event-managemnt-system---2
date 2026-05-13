"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight, ArrowLeft, Check, Upload, Calendar as CalendarIcon, MapPin, Ticket, Info } from 'lucide-react';
import { PremiumButton } from '@/components/ui/premium-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEventStore } from '@/store/use-event-store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Basics', icon: Info },
  { id: 2, title: 'Location', icon: MapPin },
  { id: 3, title: 'Pricing', icon: Ticket },
];

export default function CreateEventPage() {
  const router = useRouter();
  const { addEvent } = useEventStore();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    location: '',
    city: '',
    country: '',
    capacity: 0,
    price: 0,
    image: 'https://picsum.photos/seed/new-event/1200/800',
    gallery: [],
    speakers: [],
    status: 'Draft' as const,
    slug: ''
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleCreate = async () => {
    if (!formData.title) {
      toast({ title: "Validation Error", description: "Please enter a title for your event.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    
    addEvent({
      ...formData,
      slug: formData.title.toLowerCase().replace(/ /g, '-'),
      startDate: formData.startDate || new Date().toISOString(),
      endDate: formData.endDate || new Date().toISOString(),
    } as any);

    toast({ title: "Event Created", description: "Your event draft has been saved successfully." });
    router.push('/events');
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">New Event</h1>
          <p className="text-muted-foreground">Fill in the details to create your next experience.</p>
        </div>
        <PremiumButton variant="outline" size="sm" onClick={() => router.back()} icon={<ArrowLeft size={16} />}>
          Cancel
        </PremiumButton>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center gap-10 border-b border-border/50 pb-8">
        {STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <div key={step.id} className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                isActive ? "border-primary bg-primary text-white" : isCompleted ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
              )}>
                {isCompleted ? <Check size={18} /> : step.id}
              </div>
              <span className={cn("text-sm font-bold", isActive ? "text-foreground" : "text-muted-foreground")}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
              <div className="space-y-4">
                <Label className="text-sm font-bold">Event Title</Label>
                <Input 
                  placeholder="e.g. Masterclass Series 2024" 
                  className="h-12 rounded-xl border-border/60 bg-secondary/20 focus:bg-background transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-bold">Description</Label>
                <Textarea 
                  placeholder="Tell us about the event..." 
                  className="min-h-[140px] rounded-xl border-border/60 bg-secondary/20 focus:bg-background transition-all"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-sm font-bold">Start Date</Label>
                  <Input type="datetime-local" className="h-12 rounded-xl border-border/60" onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <Label className="text-sm font-bold">End Date</Label>
                  <Input type="datetime-local" className="h-12 rounded-xl border-border/60" onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-bold">Venue Name</Label>
                <Input placeholder="Search venue..." className="h-12 rounded-xl border-border/60" onChange={(e) => setFormData({...formData, location: e.target.value})} />
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-sm font-bold">Price (£)</Label>
                  <Input type="number" placeholder="0" className="h-12 rounded-xl border-border/60" onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div className="space-y-4">
                  <Label className="text-sm font-bold">Capacity</Label>
                  <Input type="number" placeholder="100" className="h-12 rounded-xl border-border/60" onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})} />
                </div>
              </div>
              <div className="p-10 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-4 bg-secondary/10">
                <Upload size={32} className="text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground font-medium text-center">Drag and drop your cover image here</p>
                <PremiumButton variant="outline" size="sm">Choose Image</PremiumButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between pt-10 border-t border-border/50">
        <PremiumButton variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          Back
        </PremiumButton>
        {currentStep === STEPS.length ? (
          <PremiumButton onClick={handleCreate} loading={isSubmitting}>
            Finish & Create
          </PremiumButton>
        ) : (
          <PremiumButton onClick={nextStep} icon={<ArrowRight size={16} />}>
            Next Step
          </PremiumButton>
        )}
      </div>
    </div>
  );
}