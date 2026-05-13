
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Upload, 
  Calendar as CalendarIcon, 
  MapPin, 
  Ticket, 
  Image as ImageIcon,
  Users,
  Info,
  Globe
} from 'lucide-react';
import { PremiumButton } from '@/components/ui/premium-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useEventStore } from '@/store/use-event-store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: Info },
  { id: 2, title: 'Venue & Time', icon: MapPin },
  { id: 3, title: 'Tickets', icon: Ticket },
  { id: 4, title: 'Media', icon: ImageIcon },
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
    address: '',
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
      toast({ title: "Error", description: "Please enter at least a title.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Simulation delay
      await new Promise(r => setTimeout(r, 1500));
      
      addEvent({
        ...formData,
        slug: formData.title.toLowerCase().replace(/ /g, '-'),
        startDate: formData.startDate || new Date().toISOString(),
        endDate: formData.endDate || new Date().toISOString(),
      });

      toast({
        title: "Event Created!",
        description: `${formData.title} has been added to your drafts.`,
      });
      router.push('/events');
    } catch (e) {
      toast({ title: "Error", description: "Failed to create event.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-12">
        <PremiumButton 
          variant="outline" 
          onClick={() => router.back()} 
          icon={<ArrowLeft size={18} />}
          className="mb-8 rounded-xl h-10 px-4"
        >
          Back
        </PremiumButton>
        <h1 className="text-5xl font-black tracking-tight mb-2">Create <span className="text-primary italic">Event</span></h1>
        <p className="text-xl text-muted-foreground font-medium">Bring your vision to life in a few simple steps.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-16 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -z-10 -translate-y-1/2" />
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          
          return (
            <div key={step.id} className="flex flex-col items-center gap-3 bg-background px-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border-2",
                isCompleted ? "bg-primary border-primary text-white" : 
                isActive ? "bg-white border-primary text-primary shadow-lg shadow-primary/20" : 
                "bg-secondary border-border text-muted-foreground"
              )}>
                {isCompleted ? <Check size={20} /> : <Icon size={20} />}
              </div>
              <span className={cn(
                "text-xs font-black uppercase tracking-widest",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>{step.title}</span>
            </div>
          );
        })}
      </div>

      <Card className="rounded-[3rem] border-border/50 shadow-xl overflow-hidden bg-white dark:bg-zinc-900">
        <CardContent className="p-10 lg:p-14">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-lg font-bold">Event Title</Label>
                    <Input 
                      placeholder="e.g. Annual Design Conference 2024" 
                      className="h-14 rounded-2xl border-2 bg-secondary/30 focus:bg-background text-lg font-medium px-6"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-lg font-bold">Category</Label>
                      <Select onValueChange={(v) => setFormData({...formData, category: v})}>
                        <SelectTrigger className="h-14 rounded-2xl border-2 bg-secondary/30 px-6 font-medium">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="Concert">Concert</SelectItem>
                          <SelectItem value="Workshop">Workshop</SelectItem>
                          <SelectItem value="Conference">Conference</SelectItem>
                          <SelectItem value="Social">Social</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-lg font-bold">Visibility</Label>
                      <Select defaultValue="public">
                        <SelectTrigger className="h-14 rounded-2xl border-2 bg-secondary/30 px-6 font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="public">Public - Searchable</SelectItem>
                          <SelectItem value="private">Private - Invite only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg font-bold">Description</Label>
                    <Textarea 
                      placeholder="Tell the world about your event..." 
                      className="min-h-[160px] rounded-2xl border-2 bg-secondary/30 focus:bg-background p-6 text-lg font-medium leading-relaxed"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-lg font-bold">Start Date & Time</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        type="datetime-local" 
                        className="h-14 pl-14 rounded-2xl border-2 bg-secondary/30 focus:bg-background font-medium" 
                        value={formData.startDate}
                        onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg font-bold">End Date & Time</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        type="datetime-local" 
                        className="h-14 pl-14 rounded-2xl border-2 bg-secondary/30 focus:bg-background font-medium" 
                        value={formData.endDate}
                        onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-lg font-bold">Venue Name</Label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        placeholder="e.g. The Grand Ballroom" 
                        className="h-14 pl-14 rounded-2xl border-2 bg-secondary/30 focus:bg-background font-medium"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <Label className="text-lg font-bold">City</Label>
                      <Input 
                        className="h-14 rounded-2xl border-2 bg-secondary/30 focus:bg-background font-medium px-6"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-lg font-bold">Country</Label>
                      <Input 
                        className="h-14 rounded-2xl border-2 bg-secondary/30 focus:bg-background font-medium px-6"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-lg font-bold">Ticket Price (£)</Label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold">£</span>
                      <Input 
                        type="number" 
                        className="h-14 pl-12 rounded-2xl border-2 bg-secondary/30 focus:bg-background font-bold text-xl"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg font-bold">Maximum Capacity</Label>
                    <div className="relative">
                      <Users className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        type="number" 
                        className="h-14 pl-14 rounded-2xl border-2 bg-secondary/30 focus:bg-background font-bold text-xl"
                        value={formData.capacity}
                        onChange={(e) => setFormData({...formData, capacity: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-8 rounded-[2rem] bg-secondary/30 border-2 border-dashed border-border/50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Ticket size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold">Advanced Ticketing</h4>
                      <p className="text-sm text-muted-foreground">Add VIP tiers, early birds, or promo codes.</p>
                    </div>
                  </div>
                  <PremiumButton variant="outline" className="h-12 text-sm border-dashed">
                    Add Ticket Tier
                  </PremiumButton>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <Label className="text-lg font-bold">Cover Image</Label>
                  <div className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden border-2 border-dashed border-border/50 bg-secondary/30 group cursor-pointer hover:bg-secondary/50 transition-all flex flex-col items-center justify-center gap-4">
                    <Upload className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                    <p className="text-muted-foreground font-bold">Drag and drop or click to upload</p>
                    <p className="text-xs text-muted-foreground/60 tracking-wider">Recommended: 1920x1080px</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <Label className="text-lg font-bold">Event Gallery</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="aspect-square rounded-[2rem] bg-secondary/30 border-2 border-dashed border-border/50 flex items-center justify-center">
                        <Plus className="text-muted-foreground" />
                      </div>
                    ))}
                    <div className="aspect-square rounded-[2rem] bg-primary/5 border-2 border-dashed border-primary/30 flex items-center justify-center">
                      <Plus className="text-primary" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-16 pt-10 border-t flex items-center justify-between">
            <PremiumButton 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 1 || isSubmitting}
              className="px-10 h-14"
            >
              Previous
            </PremiumButton>
            
            {currentStep === STEPS.length ? (
              <PremiumButton 
                onClick={handleCreate} 
                loading={isSubmitting}
                className="px-12 h-14 bg-emerald-600 hover:bg-emerald-700"
                icon={<Check size={20} />}
              >
                Publish Event
              </PremiumButton>
            ) : (
              <PremiumButton 
                onClick={nextStep} 
                className="px-12 h-14"
                icon={<ArrowRight size={20} />}
              >
                Continue
              </PremiumButton>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
