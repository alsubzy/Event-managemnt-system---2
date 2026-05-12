
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Shield, Bell, CreditCard, ChevronRight, Camera, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your personal information, security, and preferences.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { name: 'Profile Information', icon: User, active: true },
            { name: 'Security', icon: Shield },
            { name: 'Notifications', icon: Bell },
            { name: 'Billing & Payouts', icon: CreditCard },
          ].map((item, i) => (
            <Button
              key={i}
              variant={item.active ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3 h-12 rounded-xl font-bold"
            >
              <item.icon className={item.active ? 'text-primary' : 'text-muted-foreground'} size={18} />
              {item.name}
              {item.active && <ChevronRight className="ml-auto w-4 h-4" />}
            </Button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-[2rem] border-border/50 overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold">Personal Profile</CardTitle>
              <CardDescription>Update your photo and personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 rounded-[2rem] border-4 border-background shadow-xl ring-2 ring-primary/10">
                    <AvatarImage src="https://picsum.photos/seed/jane/200/200" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button size="icon" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 shadow-lg">
                    <Camera size={14} />
                  </Button>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Jane Doe</h4>
                  <p className="text-sm text-muted-foreground mb-3">jane.doe@example.com</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-xl h-9 border-2 font-bold">Remove</Button>
                    <Button size="sm" className="rounded-xl h-9 font-bold">Change Photo</Button>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-bold">First Name</Label>
                  <Input defaultValue="Jane" className="rounded-xl h-12 bg-secondary/30" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold">Last Name</Label>
                  <Input defaultValue="Doe" className="rounded-xl h-12 bg-secondary/30" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="font-bold">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input defaultValue="jane.doe@example.com" className="pl-12 rounded-xl h-12 bg-secondary/30" />
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="font-bold">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input defaultValue="+44 7700 900000" className="pl-12 rounded-xl h-12 bg-secondary/30" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button className="rounded-xl h-12 px-8 font-bold shadow-lg shadow-primary/20">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-border/50 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Security Preferences</CardTitle>
              <CardDescription>Control how you secure your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { title: 'Two-factor Authentication', desc: 'Secure your account with 2FA.', enabled: true },
                { title: 'Session Tracking', desc: 'Notify me of new login attempts.', enabled: true },
                { title: 'Data Privacy', desc: 'Allow us to use cookies for personalization.', enabled: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="space-y-0.5">
                    <h5 className="font-bold group-hover:text-primary transition-colors">{item.title}</h5>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.enabled} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
