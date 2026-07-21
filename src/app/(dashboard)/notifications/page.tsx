"use client";

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Info, Ticket, CreditCard, Calendar, Activity, Check } from 'lucide-react';
import { PremiumButton } from '@/components/ui/premium-button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const mockNotifications = [
  { id: '1', title: 'New Booking',      desc: 'Marcus Chen booked "Summer Jazz Night"',   time: '2m ago',    type: 'booking', read: false },
  { id: '2', title: 'Payout Processed', desc: '£1,200 transferred to bank account ending in 4429.', time: '1h ago',    type: 'payment', read: false },
  { id: '3', title: 'Event Sold Out',   desc: '"Pastry Masterclass" is fully booked.',    time: '3h ago',    type: 'event',   read: true  },
  { id: '4', title: 'System Update',    desc: 'Platform v2.4.0 deployed successfully.',   time: 'Yesterday', type: 'info',    read: true  },
  { id: '5', title: 'New Registration', desc: 'Sarah P. registered for Workshop.',        time: 'Yesterday', type: 'booking', read: true  },
];

const typeStyles: Record<string, { icon: React.ElementType, color: string }> = {
  booking: { icon: Ticket,     color: 'bg-emerald-50 text-emerald-500 border-emerald-100' },
  payment: { icon: CreditCard, color: 'bg-blue-50 text-blue-500 border-blue-100' },
  event:   { icon: Calendar,   color: 'bg-violet-50 text-violet-500 border-violet-100' },
  info:    { icon: Activity,   color: 'bg-slate-50 text-slate-500 border-slate-200' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const { toast } = useToast();

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({ title: 'Notifications updated', description: 'All notifications marked as read.' });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-7 animate-fade-in max-w-3xl mx-auto">
      <PageHeader title="Notification Center" description="View all recent alerts and account activity.">
        <PremiumButton 
          variant="outline" size="sm" icon={<Check size={14} />} 
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
        >
          Mark all as read
        </PremiumButton>
      </PageHeader>

      <Card className="premium-card overflow-hidden">
        <div className="divide-y divide-slate-100">
          {notifications.map((n) => {
            const style = typeStyles[n.type] ?? typeStyles.info;
            const Icon = style.icon;
            
            return (
              <div 
                key={n.id} 
                className={cn(
                  'p-5 flex gap-4 transition-colors hover:bg-slate-50',
                  !n.read && 'bg-blue-50/30'
                )}
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border', style.color)}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{n.desc}</p>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap shrink-0">{n.time}</span>
                  </div>
                  
                  {!n.read && (
                    <div className="mt-3 flex gap-2">
                      <button className="text-xs font-semibold text-primary hover:underline">View Details</button>
                      <button 
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                        onClick={() => setNotifications(notifications.map(x => x.id === n.id ? { ...x, read: true } : x))}
                      >
                        Mark read
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {notifications.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            You're all caught up! No notifications to show.
          </div>
        )}
      </Card>
    </div>
  );
}
