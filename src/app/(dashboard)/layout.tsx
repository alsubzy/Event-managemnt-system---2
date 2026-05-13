"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Ticket, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Menu, 
  X,
  CreditCard,
  BarChart3,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useUIStore } from '@/store/use-ui-store';
import { useAuthStore } from '@/store/use-auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { name: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'My Events', icon: Calendar, href: '/events' },
  { name: 'Bookings', icon: Ticket, href: '/bookings' },
  { name: 'Collection', icon: Heart, href: '/favorites' },
  { name: 'Finance', icon: CreditCard, href: '/earnings' },
  { name: 'Intelligence', icon: BarChart3, href: '/analytics' },
  { name: 'Profile', icon: Users, href: '/profile' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, logout, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({ title: "Signed out", description: "Successfully logged out." });
    router.replace('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col lg:flex-row overflow-hidden text-[#0B1221]">
      {/* Sidebar - Desktop */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="hidden lg:flex flex-col border-r bg-white relative z-30 transition-all duration-300"
      >
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className={cn("flex items-center gap-3", !sidebarOpen && "justify-center w-full")}>
            <div className="w-9 h-9 bg-[#0B1221] rounded-xl flex items-center justify-center shadow-lg shrink-0">
              <Calendar className="text-white w-5 h-5" />
            </div>
            {sidebarOpen && (
              <span className="text-lg font-black tracking-tighter">Arwa <span className="opacity-40">Pro</span></span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all group",
                  isActive 
                    ? "bg-secondary text-primary font-bold" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-primary",
                  !sidebarOpen && "justify-center px-0"
                )}>
                  <item.icon size={20} className={cn(!isActive && "group-hover:scale-110 transition-transform")} />
                  {sidebarOpen && <span className="text-sm">{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t">
          <button 
            onClick={handleLogout}
            className={cn("w-full flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-all", !sidebarOpen && "justify-center px-0")}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-bold">Log out</span>}
          </button>
        </div>

        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-24 bg-white border border-border shadow-sm rounded-full p-1 hover:bg-secondary transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-background">
        {/* Topbar */}
        <header className="h-20 border-b bg-white/50 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setMobileMenuOpen(true)}><Menu size={24} /></button>
          </div>

          <div className="hidden lg:flex items-center flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search everything..." 
                className="pl-12 rounded-xl h-11 border-border/40 bg-secondary/30 focus-visible:bg-white focus-visible:ring-primary/5 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="h-6 w-[1px] bg-border/60" />
            
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/profile')}>
              <div className="text-right hidden md:block">
                <p className="text-sm font-black leading-none">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">{user?.role}</p>
              </div>
              <Avatar className="h-9 w-9 rounded-xl border border-border shadow-sm">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 lg:p-12 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}