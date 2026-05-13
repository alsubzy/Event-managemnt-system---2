
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Bell, 
  CreditCard, 
  ChevronRight, 
  Camera, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Globe, 
  Lock, 
  LogOut,
  Twitter,
  Linkedin,
  Instagram,
  ExternalLink,
  Trash2,
  AlertTriangle,
  Zap,
  History,
  Eye,
  Save,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PremiumButton } from '@/components/ui/premium-button';
import { useProfileStore } from '@/store/use-profile-store';
import { useAuthStore } from '@/store/use-auth-store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

export default function ProfileHub() {
  const { user } = useAuthStore();
  const { profile, notifications, sessions, activity, updateProfile, updateNotifications, revokeSession, addActivity } = useProfileStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSubmitting] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    addActivity({ action: 'Information Updated', details: 'User modified personal profile details', category: 'profile' });
    toast({ title: "Profile Updated", description: "Your changes have been successfully saved." });
    setIsSubmitting(false);
  };

  const menuItems = [
    { id: 'overview', name: 'Profile Overview', icon: User },
    { id: 'edit', name: 'Edit Information', icon: Eye },
    { id: 'security', name: 'Security & Access', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'billing', name: 'Billing & Plans', icon: CreditCard },
    { id: 'history', name: 'Account History', icon: History },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Account Management</h1>
          <p className="text-muted-foreground font-medium">Control your public profile, security credentials, and global preferences.</p>
        </div>
        <div className="flex items-center gap-3">
          <PremiumButton variant="outline" size="sm" icon={<Eye size={16} />}>View Public Profile</PremiumButton>
          <PremiumButton size="sm" icon={<Zap size={16} />}>Upgrade Plan</PremiumButton>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="bg-secondary/20 p-2 rounded-[2rem] border border-border/40">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all",
                  activeTab === item.id 
                    ? "bg-[#0B1221] text-white shadow-xl shadow-black/10" 
                    : "text-muted-foreground hover:bg-white hover:text-foreground"
                )}
              >
                <item.icon size={18} className={cn(activeTab === item.id ? "text-white" : "text-primary/60")} />
                {item.name}
              </button>
            ))}
          </div>

          <Card className="rounded-[2.5rem] border-border/40 bg-primary/5 p-8 mt-8 space-y-4">
             <div className="flex items-center gap-3 text-primary">
                <Shield size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Security Score</span>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                   <span>Advanced</span>
                   <span className="text-primary">85%</span>
                </div>
                <Progress value={85} className="h-2 bg-white" />
             </div>
             <p className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">
               Enhance your security by enabling two-factor authentication and clearing old sessions.
             </p>
          </Card>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Hero Card */}
                  <Card className="rounded-[3rem] border-border/40 shadow-sm overflow-hidden bg-[#0B1221] text-white relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                    <CardContent className="p-10 flex flex-col md:flex-row items-center gap-10 relative z-10">
                      <div className="relative group">
                        <Avatar className="h-32 w-32 rounded-[2.5rem] border-4 border-white/10 shadow-2xl ring-4 ring-primary/10">
                          <AvatarImage src={user?.avatar || "https://picsum.photos/seed/jane/200/200"} />
                          <AvatarFallback className="bg-slate-800 text-2xl font-black">{user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-slate-900 rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                          <Camera size={16} />
                        </button>
                      </div>
                      <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-center md:justify-start gap-3">
                             <h2 className="text-4xl font-black">{profile.firstName} {profile.lastName}</h2>
                             <Badge className="bg-primary text-white border-none rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                               {user?.role || 'ORGANIZER'}
                             </Badge>
                          </div>
                          <p className="text-white/60 font-medium flex items-center justify-center md:justify-start gap-2">
                             <MapPin size={14} className="text-primary" /> {profile.location}
                          </p>
                        </div>
                        <p className="text-white/80 max-w-xl text-lg leading-relaxed font-medium line-clamp-2">
                          {profile.bio}
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-4">
                           <div className="flex -space-x-2">
                              {[1,2,3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                   <img src={`https://picsum.photos/seed/follower-${i}/50/50`} alt="" />
                                </div>
                              ))}
                           </div>
                           <span className="text-xs font-bold text-white/60">Followed by 1.2k people</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { label: 'Total Events', value: '24', icon: History, color: 'text-blue-500' },
                      { label: 'Attendees', value: '3,842', icon: User, color: 'text-emerald-500' },
                      { label: 'Avg Rating', value: '4.9/5', icon: Zap, color: 'text-amber-500' },
                    ].map((stat, i) => (
                      <Card key={i} className="rounded-[2rem] border-border/40 p-6 flex items-center gap-5">
                        <div className={cn("w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center", stat.color)}>
                          <stat.icon size={24} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                          <p className="text-2xl font-black">{stat.value}</p>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Bio & Contact Section */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden">
                       <CardHeader className="bg-secondary/20 pb-6">
                          <CardTitle className="text-lg font-bold">About Me</CardTitle>
                       </CardHeader>
                       <CardContent className="p-8">
                          <p className="text-muted-foreground leading-relaxed font-medium italic">
                            "{profile.bio}"
                          </p>
                          <div className="mt-8 flex gap-3">
                             <a href="#" className="p-3 bg-secondary rounded-xl hover:bg-primary hover:text-white transition-all"><Twitter size={18} /></a>
                             <a href="#" className="p-3 bg-secondary rounded-xl hover:bg-primary hover:text-white transition-all"><Linkedin size={18} /></a>
                             <a href="#" className="p-3 bg-secondary rounded-xl hover:bg-primary hover:text-white transition-all"><Instagram size={18} /></a>
                          </div>
                       </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden">
                       <CardHeader className="bg-secondary/20 pb-6">
                          <CardTitle className="text-lg font-bold">Quick Contact</CardTitle>
                       </CardHeader>
                       <CardContent className="p-8 space-y-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><Mail size={18} /></div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Work Email</p>
                                <p className="font-bold">{user?.email}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><Phone size={18} /></div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Direct Line</p>
                                <p className="font-bold">{profile.phone}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><Globe size={18} /></div>
                             <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Digital Portfolio</p>
                                <p className="font-bold underline text-primary cursor-pointer">{profile.website.replace('https://', '')}</p>
                             </div>
                          </div>
                       </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {activeTab === 'edit' && (
                <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden">
                  <CardHeader className="bg-secondary/20 p-10">
                    <CardTitle className="text-2xl font-black">Edit Information</CardTitle>
                    <CardDescription>Update your personal brand and social presence.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-10">
                    <form onSubmit={handleSaveProfile} className="space-y-10">
                      <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">First Name</Label>
                          <Input 
                            defaultValue={profile.firstName} 
                            onChange={(e) => updateProfile({ firstName: e.target.value })}
                            className="h-14 rounded-2xl bg-secondary/20 border-none text-lg font-medium" 
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Name</Label>
                          <Input 
                            defaultValue={profile.lastName} 
                            onChange={(e) => updateProfile({ lastName: e.target.value })}
                            className="h-14 rounded-2xl bg-secondary/20 border-none text-lg font-medium" 
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bio / Elevator Pitch</Label>
                          <textarea 
                            rows={4}
                            defaultValue={profile.bio}
                            onChange={(e) => updateProfile({ bio: e.target.value })}
                            className="w-full p-6 rounded-3xl bg-secondary/20 border-none focus:outline-none focus:ring-2 focus:ring-primary/10 text-lg font-medium resize-none"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Professional Phone</Label>
                          <Input 
                            defaultValue={profile.phone}
                            onChange={(e) => updateProfile({ phone: e.target.value })}
                            className="h-14 rounded-2xl bg-secondary/20 border-none font-medium" 
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current City</Label>
                          <Input 
                            defaultValue={profile.location}
                            onChange={(e) => updateProfile({ location: e.target.value })}
                            className="h-14 rounded-2xl bg-secondary/20 border-none font-medium" 
                          />
                        </div>
                      </div>

                      <Separator className="bg-border/40" />

                      <div className="space-y-8">
                         <h4 className="text-sm font-black uppercase tracking-widest">Connect Socials</h4>
                         <div className="grid sm:grid-cols-2 gap-6">
                            {[
                              { id: 'twitter', icon: Twitter, label: 'Twitter Handle' },
                              { id: 'linkedin', icon: Linkedin, label: 'LinkedIn Profile' },
                              { id: 'instagram', icon: Instagram, label: 'Instagram Handle' },
                              { id: 'website', icon: Globe, label: 'Personal Site' },
                            ].map(social => (
                              <div key={social.id} className="relative group">
                                <social.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
                                <Input 
                                  placeholder={social.label}
                                  defaultValue={(profile as any)[social.id]}
                                  className="pl-12 h-14 rounded-2xl bg-secondary/20 border-none font-medium" 
                                />
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="flex justify-end pt-4 gap-4">
                        <PremiumButton variant="outline" type="button" onClick={() => setActiveTab('overview')}>Discard</PremiumButton>
                        <PremiumButton loading={isSaving} icon={<Save size={18} />}>Commit Changes</PremiumButton>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden">
                      <CardHeader className="bg-secondary/20">
                         <CardTitle className="text-lg font-bold">Credentials</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <div>
                                 <p className="font-bold">Password</p>
                                 <p className="text-xs text-muted-foreground">Last updated 3 months ago</p>
                              </div>
                              <PremiumButton variant="outline" size="sm">Update</PremiumButton>
                           </div>
                           <Separator />
                           <div className="flex justify-between items-center">
                              <div>
                                 <p className="font-bold">2FA (TOTP)</p>
                                 <p className="text-xs text-muted-foreground">Secure your login with apps</p>
                              </div>
                              <Switch defaultChecked />
                           </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden bg-rose-50/20 border-rose-100">
                      <CardHeader className="bg-rose-50/50">
                         <CardTitle className="text-lg font-bold text-rose-700">Account Access</CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 space-y-4">
                         <p className="text-sm font-medium text-rose-600/80 leading-relaxed">
                           Permanently deleting your account will remove all your events, bookings, and financial history. This action is irreversible.
                         </p>
                         <button className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-rose-600 hover:text-rose-700 transition-colors">
                            <Trash2 size={16} /> Delete Account Permanently
                         </button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden">
                     <CardHeader className="p-10 border-b border-border/40">
                        <div className="flex justify-between items-center">
                           <div>
                              <CardTitle className="text-xl font-black">Active Sessions</CardTitle>
                              <CardDescription>Review and manage all devices currently logged into your account.</CardDescription>
                           </div>
                           <PremiumButton variant="outline" size="sm" icon={<LogOut size={16} />}>Revoke All Other Sessions</PremiumButton>
                        </div>
                     </CardHeader>
                     <CardContent className="p-0">
                        <div className="divide-y divide-border/40">
                           {sessions.map((session) => (
                             <div key={session.id} className="p-8 flex items-center justify-between group hover:bg-secondary/10 transition-colors">
                                <div className="flex items-center gap-6">
                                   <div className={cn(
                                     "w-14 h-14 rounded-2xl flex items-center justify-center border-2",
                                     session.isCurrent ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-secondary border-border/50 text-muted-foreground"
                                   )}>
                                      <Smartphone size={24} />
                                   </div>
                                   <div>
                                      <div className="flex items-center gap-2">
                                         <p className="font-bold text-lg">{session.device}</p>
                                         {session.isCurrent && (
                                           <Badge className="bg-emerald-500 text-white border-none rounded-full px-2 py-0 text-[8px] font-black uppercase tracking-widest">Active Now</Badge>
                                         )}
                                      </div>
                                      <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground mt-1">
                                         <span><Globe size={10} className="inline mr-1" /> {session.location}</span>
                                         <span>•</span>
                                         <span>{session.ip}</span>
                                      </div>
                                   </div>
                                </div>
                                {!session.isCurrent && (
                                   <button 
                                     onClick={() => revokeSession(session.id)}
                                     className="p-3 opacity-0 group-hover:opacity-100 hover:bg-rose-50 text-rose-500 rounded-xl transition-all"
                                   >
                                      <LogOut size={18} />
                                   </button>
                                )}
                             </div>
                           ))}
                        </div>
                     </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8">
                   <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden">
                      <CardHeader className="bg-secondary/20 p-10">
                         <CardTitle className="text-xl font-black">Global Notifications</CardTitle>
                         <CardDescription>Fine-tune how you receive alerts and transactional messages.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-10 space-y-12">
                         {/* Email Section */}
                         <div className="space-y-6">
                            <div className="flex items-center gap-3 text-primary mb-4">
                               <Mail size={18} />
                               <span className="text-sm font-black uppercase tracking-widest">Email Preferences</span>
                            </div>
                            <div className="grid gap-6">
                               {[
                                 { id: 'marketing', label: 'Promotional & Educational', desc: 'New feature announcements and platform tips.' },
                                 { id: 'bookings', label: 'Booking Activity', desc: 'Real-time alerts for new ticket sales and attendee updates.' },
                                 { id: 'updates', label: 'Product Updates', desc: 'Important information about your account and platform changes.' },
                                 { id: 'security', label: 'Security Alerts', desc: 'Login notifications and credential changes.' },
                               ].map(item => (
                                 <div key={item.id} className="flex items-center justify-between group">
                                    <div className="space-y-1">
                                       <p className="font-bold">{item.label}</p>
                                       <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <Switch 
                                      defaultChecked={(notifications.email as any)[item.id]} 
                                      onCheckedChange={(val) => updateNotifications('email', { [item.id]: val })}
                                    />
                                 </div>
                               ))}
                            </div>
                         </div>

                         <Separator />

                         {/* Mobile Section */}
                         <div className="space-y-6">
                            <div className="flex items-center gap-3 text-primary mb-4">
                               <Smartphone size={18} />
                               <span className="text-sm font-black uppercase tracking-widest">Mobile & Push</span>
                            </div>
                            <div className="grid gap-6">
                               {[
                                 { id: 'reminders', label: 'Event Reminders', desc: '30-minute pre-event countdown notifications.' },
                                 { id: 'urgent', label: 'SMS Security Verification', desc: 'Verification codes via SMS for critical actions.' },
                               ].map(item => (
                                 <div key={item.id} className="flex items-center justify-between group">
                                    <div className="space-y-1">
                                       <p className="font-bold">{item.label}</p>
                                       <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                    <Switch defaultChecked />
                                 </div>
                               ))}
                            </div>
                         </div>
                      </CardContent>
                   </Card>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-8">
                   <div className="grid md:grid-cols-2 gap-8">
                      <Card className="rounded-[3rem] border-border/40 shadow-sm p-10 bg-[#0B1221] text-white overflow-hidden relative">
                         <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px] -mb-20 -mr-20" />
                         <div className="relative z-10 space-y-8">
                            <div className="flex justify-between items-start">
                               <div className="space-y-1">
                                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Current Plan</p>
                                  <h3 className="text-3xl font-black">Pro Organizer</h3>
                               </div>
                               <Badge className="bg-white text-slate-900 border-none font-black text-[10px] px-3 py-1 uppercase rounded-full">Monthly</Badge>
                            </div>
                            <div className="space-y-2">
                               <p className="text-sm font-medium text-white/70">Next billing date: June 15, 2024</p>
                               <h4 className="text-2xl font-bold">£49.00 <span className="text-sm font-normal opacity-50">/month</span></h4>
                            </div>
                            <div className="flex gap-4">
                               <PremiumButton className="bg-white text-slate-900 hover:bg-white/90">Upgrade to Annual</PremiumButton>
                               <button className="text-xs font-bold text-white/60 hover:text-white underline underline-offset-4">Change Plan</button>
                            </div>
                         </div>
                      </Card>

                      <Card className="rounded-[3rem] border-border/40 shadow-sm p-10 flex flex-col justify-center gap-6">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-secondary flex items-center justify-center text-primary shadow-inner">
                               <CreditCard size={28} />
                            </div>
                            <div className="flex-1">
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Default Payment</p>
                               <p className="text-xl font-bold">Visa ending in 4429</p>
                               <p className="text-sm text-muted-foreground font-medium">Expires 09/27</p>
                            </div>
                            <button className="p-3 hover:bg-secondary rounded-xl transition-all"><Edit size={18} /></button>
                         </div>
                         <div className="pt-4 border-t border-dashed">
                            <button className="w-full flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest text-primary py-2 hover:underline transition-all">
                               <Plus size={16} /> Add Backup Method
                            </button>
                         </div>
                      </Card>
                   </div>

                   <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden">
                      <CardHeader className="p-10 border-b">
                         <CardTitle className="text-xl font-black">Invoice History</CardTitle>
                      </CardHeader>
                      <div className="overflow-x-auto">
                         <table className="w-full text-left">
                            <thead className="bg-secondary/20">
                               <tr className="border-b">
                                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID</th>
                                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                                  <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                  <th className="px-10 py-5"></th>
                               </tr>
                            </thead>
                            <tbody className="divide-y">
                               {[
                                 { id: 'INV-2024-001', date: 'May 15, 2024', amount: '£49.00', status: 'Paid' },
                                 { id: 'INV-2024-002', date: 'Apr 15, 2024', amount: '£49.00', status: 'Paid' },
                                 { id: 'INV-2024-003', date: 'Mar 15, 2024', amount: '£49.00', status: 'Paid' },
                               ].map(row => (
                                 <tr key={row.id} className="hover:bg-secondary/10 transition-colors">
                                    <td className="px-10 py-6 font-bold">{row.id}</td>
                                    <td className="px-10 py-6 text-sm text-muted-foreground font-medium">{row.date}</td>
                                    <td className="px-10 py-6 font-black">{row.amount}</td>
                                    <td className="px-10 py-6">
                                       <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest">{row.status}</Badge>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                       <button className="text-primary hover:underline text-xs font-bold uppercase tracking-widest">Download</button>
                                    </td>
                                 </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                   </Card>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-8">
                   <Card className="rounded-[2.5rem] border-border/40 shadow-sm overflow-hidden">
                      <CardHeader className="bg-secondary/20 p-10 border-b">
                         <div className="flex justify-between items-center">
                            <div>
                               <CardTitle className="text-xl font-black">Audit Log</CardTitle>
                               <CardDescription>A chronological feed of all account security and preference changes.</CardDescription>
                            </div>
                            <div className="flex bg-secondary/50 p-1 rounded-xl">
                               <button className="px-4 py-1.5 text-xs font-bold bg-white shadow-sm rounded-lg">All</button>
                               <button className="px-4 py-1.5 text-xs font-bold text-muted-foreground">Security</button>
                            </div>
                         </div>
                      </CardHeader>
                      <CardContent className="p-0">
                         <div className="relative pl-12 py-10 space-y-12 before:absolute before:left-12 before:top-10 before:bottom-10 before:w-[2px] before:bg-border/40">
                            {activity.map((log) => (
                              <div key={log.id} className="relative pl-10 pr-10">
                                 <div className={cn(
                                   "absolute -left-[14px] w-7 h-7 rounded-full border-4 border-white shadow-sm flex items-center justify-center",
                                   log.category === 'security' ? 'bg-rose-500' : 'bg-primary'
                                 )}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                 </div>
                                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                       <p className="font-bold text-lg leading-tight">{log.action}</p>
                                       <p className="text-sm text-muted-foreground font-medium">{log.details}</p>
                                    </div>
                                    <div className="text-left md:text-right">
                                       <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1">
                                          <Clock size={12} /> {new Date(log.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                       </p>
                                       <Badge variant="outline" className="mt-1 border-none bg-secondary/40 text-[8px] font-black uppercase tracking-widest rounded-full">{log.category}</Badge>
                                    </div>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </CardContent>
                   </Card>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function Plus(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14"/><path d="M12 5v14"/>
    </svg>
  );
}

function Edit(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
      <path d="m15 5 4 4"/>
    </svg>
  );
}
