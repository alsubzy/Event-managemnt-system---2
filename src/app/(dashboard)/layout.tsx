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
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'My Events', icon: Calendar, href: '/events' },
  { name: 'Bookings', icon: Ticket, href: '/bookings' },
  { name: 'Favorites', icon: Heart, href: '/favorites' },
  { name: 'Earnings', icon: CreditCard, href: '/earnings' },
  { name: 'Analytics', icon: BarChart3, href: '/analytics' },
  { name: 'Profile', icon: Users, href: '/profile' },
  { name: 'Settings', icon: Settings, href: '/settings' },
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
    toast({
      title: "Signed out",
      description: "You have been successfully logged out.",
    });
    router.replace('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar - Desktop */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className={cn(
          "hidden lg:flex flex-col border-r bg-card relative z-30 transition-all duration-300 ease-in-out",
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className={cn("flex items-center gap-2", !sidebarOpen && "justify-center w-full")}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <Calendar className="text-primary-foreground w-6 h-6" />
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold tracking-tight text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                Arwa <span className="text-primary">Cakes</span>
              </span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  !sidebarOpen && "justify-center px-0"
                )}>
                  <item.icon className={cn("w-5 h-5", !isActive && "group-hover:scale-110 transition-transform")} />
                  {sidebarOpen && <span className="font-medium">{item.name}</span>}
                  {sidebarOpen && isActive && (
                    <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className={cn("w-full flex items-center gap-4 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10", !sidebarOpen && "justify-center px-0")}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium">Sign Out</span>}
          </Button>
          
          <button 
            onClick={toggleSidebar}
            className="absolute -right-3 top-20 bg-card border rounded-full p-1 hover:bg-secondary transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-background">
        {/* Topbar */}
        <header className="h-20 border-b bg-background/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2">
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <Calendar className="text-primary w-6 h-6" />
              <span className="text-lg font-bold">Arwa Cakes</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search events, bookings, people..." 
                className="pl-12 rounded-2xl h-11 border-border/50 bg-secondary/30 focus-visible:bg-background focus-visible:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-secondary">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
            </Button>
            
            <div className="h-8 w-[1px] bg-border mx-2 hidden md:block" />
            
            <div className="flex items-center gap-3 pl-2 group cursor-pointer" onClick={() => router.push('/profile')}>
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">{user?.name || 'Jane Doe'}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase() || 'User'}</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-primary transition-all rounded-xl shadow-sm">
                <AvatarImage src={user?.avatar || "https://picsum.photos/seed/user-avatar/100/100"} />
                <AvatarFallback>{user?.name?.[0] || 'JD'}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-card z-50 p-6 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between mb-10">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Calendar className="text-primary-foreground w-6 h-6" />
                  </div>
                  <span className="text-xl font-bold tracking-tight">Arwa Cakes</span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                    <div className={cn(
                      "flex items-center gap-4 px-4 py-4 rounded-2xl",
                      pathname === item.href ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground"
                    )}>
                      <item.icon className="w-6 h-6" />
                      <span className="font-medium text-lg">{item.name}</span>
                    </div>
                  </Link>
                ))}
              </nav>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="mt-auto justify-start gap-4 px-4 py-6 text-destructive"
              >
                <LogOut className="w-6 h-6" />
                <span className="font-medium text-lg">Sign Out</span>
              </Button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
