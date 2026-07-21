"use client";

import React, { useState, useRef, useEffect } from 'react';
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
  ChevronRight,
  Settings,
  Command,
  Zap,
  Plus,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronDown,
  User,
} from 'lucide-react';
import { useUIStore } from '@/store/use-ui-store';
import { useAuthStore } from '@/store/use-auth-store';
import { Logo } from '@/components/brand/logo';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

/* ── Navigation Config ──────────────────────────────────── */
const navGroups = [
  {
    label: 'Main',
    items: [
      { name: 'Dashboard',   icon: LayoutDashboard, href: '/dashboard' },
      { name: 'Events',      icon: Calendar,         href: '/events' },
      { name: 'Bookings',    icon: Ticket,           href: '/bookings' },
      { name: 'Collection',  icon: Heart,            href: '/favorites' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { name: 'Finance',     icon: CreditCard,  href: '/earnings' },
      { name: 'Intelligence',icon: BarChart3,   href: '/analytics' },
    ],
  },
  {
    label: 'Account',
    items: [
      { name: 'Profile',     icon: Users,    href: '/profile' },
      { name: 'Settings',    icon: Settings, href: '/settings' },
    ],
  },
];

const mockNotifications = [
  { id: '1', title: 'New Booking',      desc: 'Marcus booked "Jazz Night"',   time: '2m ago',  type: 'success', read: false },
  { id: '2', title: 'Payout Sent',      desc: '£1,200 transferred to bank',   time: '1h ago',  type: 'info',    read: false },
  { id: '3', title: 'Event Sold Out',   desc: 'Masterclass is fully booked',  time: '3h ago',  type: 'warning', read: true  },
  { id: '4', title: 'System Update',    desc: 'Platform v2.4.0 deployed',     time: 'Yesterday',type: 'info',   read: true  },
];

/* ── NavItem ────────────────────────────────────────────── */
function NavItem({
  item,
  isActive,
  isCollapsed,
  onClick,
}: {
  item: { name: string; icon: React.ElementType; href: string };
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <Link href={item.href} onClick={onClick} title={isCollapsed ? item.name : undefined}>
      <div
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative',
          isActive
            ? 'bg-primary/10 text-primary font-semibold'
            : 'text-muted-foreground hover:bg-slate-50 hover:text-slate-800',
          isCollapsed && 'justify-center px-0'
        )}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />
        )}
        <item.icon
          size={18}
          strokeWidth={isActive ? 2.5 : 1.75}
          className={cn('shrink-0', isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600')}
        />
        {!isCollapsed && (
          <span className="text-sm truncate">{item.name}</span>
        )}
      </div>
    </Link>
  );
}

/* ── Main Layout ────────────────────────────────────────── */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, logout, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    toast({ title: 'Signed out', description: 'See you next time!' });
    router.replace('/login');
  };

  const notifIcon = { success: CheckCircle2, warning: AlertCircle, info: Info };
  const notifColor = { success: 'text-emerald-500', warning: 'text-amber-500', info: 'text-blue-500' };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex overflow-hidden text-slate-900">

      {/* ── Desktop Sidebar ───────────────────────────────── */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 248 : 68 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex flex-col border-r border-slate-200/80 bg-white relative z-30 shrink-0 overflow-hidden"
      >
        {/* Logo */}
        <div className={cn('h-16 flex items-center border-b border-slate-100 px-4', !sidebarOpen && 'justify-center')}>
          <Link
            href="/dashboard"
            className={cn('flex items-center gap-2.5 min-w-0', !sidebarOpen && 'justify-center')}
          >
            {sidebarOpen ? <Logo variant="compact" size="md" /> : <Logo variant="icon" size="md" />}
          </Link>
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-5 no-scrollbar">
          {navGroups.map((group) => (
            <div key={group.label}>
              {sidebarOpen && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-1.5">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    isCollapsed={!sidebarOpen}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Area */}
        <div className={cn('p-3 border-t border-slate-100', !sidebarOpen && 'flex justify-center')}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
              onClick={() => router.push('/profile')}>
              <Avatar className="h-8 w-8 rounded-lg border border-slate-200 shrink-0">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-white text-xs font-bold rounded-lg">
                  {user?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-md transition-all"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Sign out"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-[72px] z-50 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 shadow-sm transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={11} strokeWidth={2.5} /> : <ChevronRight size={11} strokeWidth={2.5} />}
        </button>
      </motion.aside>

      {/* ── Mobile Drawer ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              {/* Mobile Logo */}
              <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
                <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setMobileMenuOpen(false)}>
                  <Logo variant="compact" size="md" />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Nav */}
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
                {navGroups.map((group) => (
                  <div key={group.label}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
                      {group.label}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map((item) => (
                        <NavItem
                          key={item.href}
                          item={item}
                          isActive={pathname === item.href}
                          isCollapsed={false}
                          onClick={() => setMobileMenuOpen(false)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Mobile User */}
              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Avatar className="h-9 w-9 rounded-lg border border-slate-200">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary text-white text-xs font-bold rounded-lg">
                      {user?.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-3 w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ──────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">

        {/* Top Header */}
        <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 lg:px-6 shrink-0 gap-4">
          {/* Left: Mobile menu + Search */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
            >
              <Menu size={20} />
            </button>

            {/* Search */}
            <div className={cn(
              'hidden md:flex items-center max-w-xs w-full transition-all duration-200',
              searchFocused ? 'max-w-sm' : ''
            )}>
              <div className="relative w-full group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search…"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-9 pr-10 h-9 rounded-lg bg-slate-100 border border-transparent
                             text-sm text-slate-800 placeholder:text-slate-400
                             focus:bg-white focus:border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/15
                             transition-all duration-200"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded font-mono hidden group-focus-within:hidden lg:flex">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right: Notifications + Quick Add + User */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Add */}
            <Link href="/events/create">
              <button className="hidden sm:flex items-center gap-1.5 h-8 px-3 text-xs font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm shadow-primary/20">
                <Plus size={14} />
                <span>New Event</span>
              </button>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-40 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <button className="text-xs text-primary font-medium hover:underline">Mark all read</button>
                      </div>
                      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                        {mockNotifications.map((n) => {
                          const Icon = notifIcon[n.type as keyof typeof notifIcon] || Info;
                          return (
                            <div key={n.id} className={cn(
                              'flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer',
                              !n.read && 'bg-blue-50/40'
                            )}>
                              <div className={cn('mt-0.5 shrink-0', notifColor[n.type as keyof typeof notifColor])}>
                                <Icon size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-semibold text-slate-800 truncate">{n.title}</p>
                                  {!n.read && <div className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />}
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.desc}</p>
                                <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="px-4 py-3 border-t border-slate-100">
                        <Link
                          href="/notifications"
                          onClick={() => setNotifOpen(false)}
                          className="text-xs text-primary font-medium hover:underline"
                        >
                          View all notifications →
                        </Link>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-slate-200 mx-1" />

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2.5 p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                  <Avatar className="h-7 w-7 rounded-lg border border-slate-200">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary text-white text-[10px] font-bold rounded-lg">
                      {user?.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{user?.role}</p>
                  </div>
                  <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5 shadow-xl border-slate-200">
                <DropdownMenuLabel className="text-[10px] text-slate-400 uppercase tracking-widest font-bold px-2 py-1">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer">
                    <User size={14} className="text-slate-500" />
                    <span className="text-sm">Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer">
                    <Settings size={14} className="text-slate-500" />
                    <span className="text-sm">Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50"
                >
                  <LogOut size={14} />
                  <span className="text-sm">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1440px] mx-auto w-full px-4 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}