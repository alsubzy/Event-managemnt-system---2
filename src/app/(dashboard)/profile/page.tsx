"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Shield, Bell, CreditCard,
  Camera, History, Eye, Save, Twitter, Linkedin, Instagram,
  Globe, LogOut, Smartphone, Trash2, Zap, LayoutDashboard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PremiumButton } from '@/components/ui/premium-button';
import { PageHeader } from '@/components/ui/page-header';
import { useProfileStore } from '@/store/use-profile-store';
import { useAuthStore } from '@/store/use-auth-store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

const menuItems = [
  { id: 'overview',      name: 'Profile Overview',  icon: User },
  { id: 'edit',          name: 'Edit Information',  icon: Eye },
  { id: 'security',      name: 'Security & Access', icon: Shield },
  { id: 'notifications', name: 'Notifications',     icon: Bell },
  { id: 'billing',       name: 'Billing & Plans',   icon: CreditCard },
  { id: 'history',       name: 'Account History',   icon: History },
];

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { profile, notifications, sessions, activity, updateProfile, updateNotifications, revokeSession, addActivity } = useProfileStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    addActivity({ action: 'Profile Updated', details: 'User modified personal information', category: 'profile' });
    toast({ title: 'Profile Updated', description: 'Your changes have been saved.' });
    setIsSaving(false);
  };

  return (
    <div className="space-y-7 animate-fade-in">

      <PageHeader title="Account Management" description="Control your profile, security, and global preferences.">
        <PremiumButton variant="outline" size="sm" icon={<Eye size={14} />}>View Public Profile</PremiumButton>
        <PremiumButton size="sm" icon={<Zap size={15} />}>Upgrade Plan</PremiumButton>
      </PageHeader>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <aside className="lg:col-span-3 flex flex-col gap-5">
          <Card className="premium-card p-2">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                    activeTab === item.id
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  <item.icon size={16} className={cn('shrink-0', activeTab === item.id ? 'text-primary' : 'text-slate-400')} />
                  {item.name}
                </button>
              ))}
            </nav>
          </Card>

          <Card className="premium-card p-5 bg-gradient-to-br from-slate-50 to-white">
            <div className="flex items-center gap-2 text-primary mb-3">
              <Shield size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Security Score</span>
            </div>
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700">Advanced</span>
                <span className="text-primary">85%</span>
              </div>
              <Progress value={85} className="h-1.5 bg-slate-200 [&>div]:bg-primary" />
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Enable two-factor authentication to secure your account.
            </p>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              
              {/* ── Overview Tab ──────────────────────────────────── */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Hero Card */}
                  <Card className="premium-card overflow-hidden bg-slate-900 text-white relative">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" />
                    <CardContent className="p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8 relative z-10">
                      <div className="relative group shrink-0">
                        <Avatar className="h-28 w-28 rounded-2xl border-4 border-white/10 shadow-2xl">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="bg-slate-800 text-xl font-bold">{user?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <button className="absolute -bottom-3 -right-3 w-9 h-9 bg-white text-slate-900 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                          <Camera size={14} />
                        </button>
                      </div>
                      
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 mb-2">
                          <h2 className="text-3xl font-bold">{profile.firstName} {profile.lastName}</h2>
                          <Badge className="bg-primary/20 text-white border-primary/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {user?.role || 'Organizer'}
                          </Badge>
                        </div>
                        <p className="text-white/70 text-sm font-medium flex items-center justify-center md:justify-start gap-1.5 mb-4">
                          <MapPin size={13} className="text-primary/80" /> {profile.location}
                        </p>
                        <p className="text-white/80 text-sm leading-relaxed max-w-xl line-clamp-2">
                          {profile.bio}
                        </p>
                        
                        <div className="flex items-center justify-center md:justify-start gap-3 mt-6">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-7 h-7 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center overflow-hidden">
                                <img src={`https://picsum.photos/seed/fol-${i}/50/50`} alt="Follower" />
                              </div>
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-white/60">1.2k followers</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bio & Contact */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="premium-card">
                      <CardHeader className="px-6 pt-6 pb-2">
                        <CardTitle className="text-base font-semibold">About Me</CardTitle>
                      </CardHeader>
                      <CardContent className="px-6 pb-6 pt-2">
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                          "{profile.bio}"
                        </p>
                        <div className="flex items-center gap-2.5 mt-6">
                          {[Twitter, Linkedin, Instagram].map((Icon, idx) => (
                            <button key={idx} className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                              <Icon size={14} />
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="premium-card">
                      <CardHeader className="px-6 pt-6 pb-2">
                        <CardTitle className="text-base font-semibold">Contact Info</CardTitle>
                      </CardHeader>
                      <CardContent className="px-6 pb-6 pt-2 space-y-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><Mail size={14} /></div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Email</p>
                            <p className="text-sm font-semibold text-slate-800">{user?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3.5">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><Phone size={14} /></div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Phone</p>
                            <p className="text-sm font-semibold text-slate-800">{profile.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3.5">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"><Globe size={14} /></div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Website</p>
                            <p className="text-sm font-semibold text-primary hover:underline cursor-pointer">{profile.website.replace('https://', '')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* ── Edit Tab ──────────────────────────────────────── */}
              {activeTab === 'edit' && (
                <Card className="premium-card">
                  <CardHeader className="px-8 pt-8 pb-4">
                    <CardTitle className="text-lg font-semibold">Edit Information</CardTitle>
                    <CardDescription>Update your personal details and public profile.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <form onSubmit={handleSaveProfile} className="space-y-8">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-600">First Name</Label>
                          <Input 
                            defaultValue={profile.firstName} 
                            onChange={(e) => updateProfile({ firstName: e.target.value })}
                            className="bg-slate-50 border-slate-200" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-600">Last Name</Label>
                          <Input 
                            defaultValue={profile.lastName} 
                            onChange={(e) => updateProfile({ lastName: e.target.value })}
                            className="bg-slate-50 border-slate-200" 
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-2">
                          <Label className="text-xs font-semibold text-slate-600">Bio</Label>
                          <textarea 
                            rows={3}
                            defaultValue={profile.bio}
                            onChange={(e) => updateProfile({ bio: e.target.value })}
                            className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 text-sm resize-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-600">Phone</Label>
                          <Input 
                            defaultValue={profile.phone}
                            onChange={(e) => updateProfile({ phone: e.target.value })}
                            className="bg-slate-50 border-slate-200" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-semibold text-slate-600">Location</Label>
                          <Input 
                            defaultValue={profile.location}
                            onChange={(e) => updateProfile({ location: e.target.value })}
                            className="bg-slate-50 border-slate-200" 
                          />
                        </div>
                      </div>

                      <Separator className="bg-slate-100" />

                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-800">Social Links</h4>
                        <div className="grid sm:grid-cols-2 gap-5">
                          {[
                            { id: 'twitter', icon: Twitter, label: 'Twitter' },
                            { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
                            { id: 'instagram', icon: Instagram, label: 'Instagram' },
                            { id: 'website', icon: Globe, label: 'Website' },
                          ].map(social => (
                            <div key={social.id} className="relative group">
                              <social.icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                              <Input 
                                placeholder={social.label}
                                defaultValue={(profile as any)[social.id]}
                                className="pl-9 bg-slate-50 border-slate-200" 
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 gap-3">
                        <PremiumButton variant="ghost" type="button" onClick={() => setActiveTab('overview')}>Cancel</PremiumButton>
                        <PremiumButton loading={isSaving} icon={<Save size={14} />}>Save Changes</PremiumButton>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* ── Security Tab ──────────────────────────────────── */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="premium-card">
                      <CardHeader className="px-6 pt-6 pb-3">
                        <CardTitle className="text-base font-semibold">Credentials</CardTitle>
                      </CardHeader>
                      <CardContent className="px-6 pb-6 space-y-5">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">Password</p>
                            <p className="text-xs text-slate-500 mt-0.5">Last updated 3 months ago</p>
                          </div>
                          <PremiumButton variant="outline" size="sm">Update</PremiumButton>
                        </div>
                        <Separator className="bg-slate-100" />
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">Two-Factor Authentication</p>
                            <p className="text-xs text-slate-500 mt-0.5">Protect your account with TOTP</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="premium-card border-red-200 bg-red-50/30">
                      <CardHeader className="px-6 pt-6 pb-3">
                        <CardTitle className="text-base font-semibold text-red-600">Danger Zone</CardTitle>
                      </CardHeader>
                      <CardContent className="px-6 pb-6 space-y-4">
                        <p className="text-sm text-red-600/80 leading-relaxed">
                          Permanently deleting your account will remove all events, bookings, and data. This cannot be undone.
                        </p>
                        <button className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
                          <Trash2 size={15} /> Delete Account
                        </button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="premium-card">
                    <CardHeader className="px-6 py-5 border-b border-slate-100">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <CardTitle className="text-base font-semibold">Active Sessions</CardTitle>
                          <CardDescription className="text-xs mt-0.5">Devices currently logged in.</CardDescription>
                        </div>
                        <PremiumButton variant="outline" size="sm" icon={<LogOut size={13} />}>Revoke All Others</PremiumButton>
                      </div>
                    </CardHeader>
                    <div className="divide-y divide-slate-100">
                      {sessions.map((session) => (
                        <div key={session.id} className="p-5 flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border',
                              session.isCurrent ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'
                            )}>
                              <Smartphone size={18} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-slate-800">{session.device}</p>
                                {session.isCurrent && (
                                  <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">Active</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                <span><Globe size={11} className="inline mr-0.5" /> {session.location}</span>
                                <span>•</span>
                                <span>{session.ip}</span>
                              </p>
                            </div>
                          </div>
                          {!session.isCurrent && (
                            <button 
                              onClick={() => revokeSession(session.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                              title="Revoke session"
                            >
                              <LogOut size={15} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {/* ── Notifications Tab ─────────────────────────────── */}
              {activeTab === 'notifications' && (
                <Card className="premium-card">
                  <CardHeader className="px-8 pt-8 pb-4">
                    <CardTitle className="text-lg font-semibold">Notification Preferences</CardTitle>
                    <CardDescription>Manage how we contact you.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-8 pb-8 space-y-8">
                    
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 text-primary">
                        <Mail size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Email Alerts</span>
                      </div>
                      <div className="space-y-4">
                        {[
                          { id: 'marketing', label: 'Marketing & Promos', desc: 'New features and tips.' },
                          { id: 'bookings',  label: 'Booking Activity',   desc: 'Ticket sales and attendee updates.' },
                          { id: 'updates',   label: 'Product Updates',    desc: 'Important platform changes.' },
                          { id: 'security',  label: 'Security Alerts',    desc: 'Login notifications.' },
                        ].map(item => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                            </div>
                            <Switch 
                              defaultChecked={(notifications.email as any)[item.id]} 
                              onCheckedChange={(val) => updateNotifications('email', { [item.id]: val })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-slate-100" />

                    <div className="space-y-5">
                      <div className="flex items-center gap-2 text-primary">
                        <Smartphone size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Push & SMS</span>
                      </div>
                      <div className="space-y-4">
                        {[
                          { id: 'reminders', label: 'Event Reminders', desc: 'Countdown notifications.' },
                          { id: 'urgent',    label: 'SMS Verification',desc: 'Codes for critical actions.' },
                        ].map(item => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        ))}
                      </div>
                    </div>

                  </CardContent>
                </Card>
              )}

              {/* ── Billing Tab ───────────────────────────────────── */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="rounded-2xl bg-slate-900 text-white p-8 relative overflow-hidden">
                      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/30 rounded-full blur-[60px]" />
                      <div className="relative z-10 space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Current Plan</p>
                            <h3 className="text-2xl font-bold mt-1">Pro Organizer</h3>
                          </div>
                          <Badge className="bg-white text-slate-900 px-2 py-0.5 text-[9px] font-bold uppercase rounded-full">Monthly</Badge>
                        </div>
                        <div>
                          <p className="text-xs text-white/70">Next billing date: June 15, 2024</p>
                          <h4 className="text-3xl font-bold mt-1">£49<span className="text-base font-normal text-white/50">/mo</span></h4>
                        </div>
                        <div className="flex gap-3">
                          <PremiumButton className="bg-white text-slate-900 hover:bg-white/90" size="sm">Upgrade to Annual</PremiumButton>
                          <button className="text-xs font-semibold text-white/70 hover:text-white underline underline-offset-4">Change Plan</button>
                        </div>
                      </div>
                    </div>

                    <Card className="premium-card p-8 flex flex-col justify-center gap-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                          <CreditCard size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment Method</p>
                          <p className="text-sm font-semibold text-slate-800 mt-0.5">Visa ending in 4429</p>
                          <p className="text-xs text-slate-500 mt-0.5">Expires 09/27</p>
                        </div>
                        <button className="text-xs font-semibold text-primary hover:underline">Edit</button>
                      </div>
                      <div className="pt-5 border-t border-slate-100">
                        <button className="text-xs font-semibold text-primary flex items-center gap-1.5 hover:underline">
                          <CreditCard size={14} /> Add Backup Method
                        </button>
                      </div>
                    </Card>
                  </div>
                  
                  <Card className="premium-card overflow-hidden">
                    <CardHeader className="px-6 py-5 border-b border-slate-100">
                      <CardTitle className="text-base font-semibold">Invoice History</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50/60 border-b border-slate-100">
                            {['Invoice ID', 'Date', 'Amount', 'Status', ''].map(h => (
                              <th key={h} className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[
                            { id: 'INV-2024-001', date: 'May 15, 2024', amount: '£49.00' },
                            { id: 'INV-2024-002', date: 'Apr 15, 2024', amount: '£49.00' },
                            { id: 'INV-2024-003', date: 'Mar 15, 2024', amount: '£49.00' },
                          ].map(row => (
                            <tr key={row.id} className="saas-table-row">
                              <td className="px-6 py-4 text-xs font-semibold text-slate-800">{row.id}</td>
                              <td className="px-6 py-4 text-xs text-slate-500">{row.date}</td>
                              <td className="px-6 py-4 text-sm font-bold text-slate-900">{row.amount}</td>
                              <td className="px-6 py-4">
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Paid</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button className="text-xs font-semibold text-primary hover:underline">Download</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* ── History Tab ───────────────────────────────────── */}
              {activeTab === 'history' && (
                <Card className="premium-card">
                  <CardHeader className="px-6 py-5 border-b border-slate-100">
                    <CardTitle className="text-base font-semibold">Audit Log</CardTitle>
                    <CardDescription className="text-xs mt-0.5">Chronological feed of account changes.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative pl-10 py-6 space-y-8 before:absolute before:left-10 before:top-6 before:bottom-6 before:w-px before:bg-slate-200">
                      {activity.map((log) => (
                        <div key={log.id} className="relative pl-8 pr-6">
                          <div className={cn(
                            "absolute -left-[5px] w-[11px] h-[11px] rounded-full border-2 border-white shadow-sm ring-1 ring-slate-200",
                            log.category === 'security' ? 'bg-red-500' : 'bg-primary'
                          )} />
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{log.action}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{log.details}</p>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-[10px] text-slate-400 font-medium">
                                {new Date(log.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                              </p>
                              <span className="inline-block mt-1 bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border border-slate-200">
                                {log.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
