"use client";

import React, { useState } from 'react';
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
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col lg:flex-row overflow-hidden text-slate-900">
      {/* Sidebar - Desktop */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="hidden lg:flex flex-col border-r bg-white relative z-30 transition-all duration-300 shadow-[1px_0_10px_-5px_rgba(0,0,0,0.05)]"
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/dashboard" className={cn("flex items-center gap-3 transition-opacity", !sidebarOpen && "justify-center w-full")}>
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <Calendar className="text-white w-5 h-5" />
            </div>
            {sidebarOpen && (
              <span className="text-base font-bold tracking-tight">Arwa Pro</span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                  isActive 
                    ? "bg-slate-100 text-slate-900 font-semibold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  !sidebarOpen && "justify-center px-0"
                )}>
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {sidebarOpen && <span className="text-sm">{item.name}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 mt-auto border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all", !sidebarOpen && "justify-center px-0")}
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="text-sm font-medium">Log out</span>}
          </button>
        </div>

        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 bg-white border border-slate-200 shadow-sm rounded-full p-1 hover:bg-slate-50 transition-colors z-40"
        >
          {sidebarOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
        </button>
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden flex flex-col p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm">
                    <Calendar className="text-white w-4 h-4" />
                  </div>
                  <span className="text-lg font-bold">Arwa Pro</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-1.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                      <div className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                        isActive ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10" : "text-slate-500 hover:bg-slate-50"
                      )}>
                        <item.icon size={20} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-slate-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <LogOut size={20} />
                  <span className="text-sm font-semibold">Log out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <header className="h-16 border-b bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 hover:bg-slate-50 rounded-lg lg:hidden transition-colors"><Menu size={20} /></button>
            <div className="hidden lg:flex items-center max-w-sm w-80">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search..." 
                  className="pl-9 h-9 rounded-lg border-none bg-slate-100/60 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-slate-200 text-sm transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white" />
            </button>
            
            <div className="h-4 w-px bg-slate-200 mx-1" />
            
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/profile')}>
              <Avatar className="h-8 w-8 rounded-lg border border-slate-200 shadow-sm transition-transform group-hover:scale-105">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-slate-900 text-white text-[10px] font-bold">{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-none">{user?.name}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{user?.role}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}