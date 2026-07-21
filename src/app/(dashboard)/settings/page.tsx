"use client";

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PremiumButton } from '@/components/ui/premium-button';
import { Save, Settings2, Globe, Shield, CreditCard, Users, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 600));
    toast({ title: 'Settings Saved', description: 'Your system preferences have been updated.' });
    setIsSaving(false);
  };

  return (
    <div className="space-y-7 animate-fade-in">
      <PageHeader title="System Settings" description="Manage platform configurations and global preferences.">
        <PremiumButton icon={<Save size={14} />} onClick={handleSave} loading={isSaving}>
          Save Changes
        </PremiumButton>
      </PageHeader>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left column - Settings Nav (Static for this demo) */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="premium-card p-2">
            <nav className="space-y-1">
              {[
                { name: 'General', icon: Settings2, active: true },
                { name: 'Regional & Display', icon: Globe, active: false },
                { name: 'Team Management', icon: Users, active: false },
                { name: 'Integrations', icon: LinkIcon, active: false },
              ].map(item => (
                <button
                  key={item.name}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    item.active ? 'bg-primary/10 text-primary font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon size={16} className={item.active ? 'text-primary' : 'text-slate-400'} />
                  {item.name}
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Right column - Settings Forms */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="premium-card">
            <CardHeader className="px-6 py-5 border-b border-slate-100">
              <CardTitle className="text-base font-semibold">General Organization</CardTitle>
              <CardDescription className="text-xs mt-0.5">Basic information about your organization on YEGLEEL.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600">Organization Name</Label>
                  <Input defaultValue="Acme Events Ltd." className="bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600">Support Email</Label>
                  <Input defaultValue="support@acmeevents.com" type="email" className="bg-slate-50 border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-slate-600">Organization Website</Label>
                  <Input defaultValue="https://acmeevents.com" type="url" className="bg-slate-50 border-slate-200" />
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="px-6 py-5 border-b border-slate-100">
              <CardTitle className="text-base font-semibold">Global Features</CardTitle>
              <CardDescription className="text-xs mt-0.5">Toggle platform features on or off.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Public Event Discovery</p>
                  <p className="text-xs text-slate-500 mt-0.5">Allow events to be indexed by search engines.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Automated Waitlists</p>
                  <p className="text-xs text-slate-500 mt-0.5">Enable waitlists automatically for sold-out events.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Guest Checkout</p>
                  <p className="text-xs text-slate-500 mt-0.5">Allow users to book tickets without creating an account.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
