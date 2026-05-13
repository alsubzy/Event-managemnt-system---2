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
            <div className="w-10 h-10 bg-[#0B1221] rounded-2xl flex items-center justify-center shadow-lg shrink-0">
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
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group",
                  isActive 
                    ? "bg-secondary/80 text-primary font-bold shadow-sm" 
                    : "text-muted-foreground hover:bg-secondary/40 hover:text-primary",
                  !sidebarOpen && "justify-center px-0"
                )}>
                  <item.icon size={20} className={cn(!isActive && "group-hover:scale-110 transition-transform")} />
                  {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t">
          <button 
            onClick={handleLogout}
            className={cn("w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-all", !sidebarOpen && "justify-center px-0")}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-bold">Log out</span>}
          </button>
        </div>

        <button 
          onClick={toggleSidebar}
          className="absolute -right-3.5 top-24 bg-white border border-border shadow-md rounded-full p-1.5 hover:bg-secondary transition-colors z-40"
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </motion.aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 lg:hidden flex flex-col p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0B1221] rounded-2xl flex items-center justify-center shadow-lg">
                    <Calendar className="text-white w-5 h-5" />
                  </div>
                  <span className="text-lg font-black">Arwa <span className="opacity-40">Pro</span></span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-secondary rounded-xl">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <div className={cn(
                        "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all",
                        isActive ? "bg-secondary text-primary font-bold" : "text-muted-foreground hover:bg-secondary/40"
                      )}>
                        <item.icon size={22} />
                        <span className="text-base font-medium">{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-6 border-t">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <LogOut size={22} />
                  <span className="text-base font-bold">Log out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#FDFDFD]">
        {/* Topbar */}
        <header className="h-20 border-b bg-white/50 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-secondary rounded-xl"><Menu size={24} /></button>
          </div>

          <div className="hidden lg:flex items-center flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search resources, bookings, events..." 
                className="pl-12 h-12 rounded-2xl border-none bg-secondary/40 focus-visible:bg-white focus-visible:ring-primary/5 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 text-muted-foreground hover:text-primary hover:bg-secondary/60 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="h-8 w-[1px] bg-border/60" />
            
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/profile')}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black leading-none group-hover:text-primary transition-colors">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1.5 opacity-60">{user?.role}</p>
              </div>
              <Avatar className="h-10 w-10 rounded-2xl border border-border/40 shadow-sm group-hover:scale-105 transition-all">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-[#0B1221] text-white font-bold">{user?.name?.[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 lg:p-12 w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}