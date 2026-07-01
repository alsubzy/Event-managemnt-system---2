"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const isAuthRoute = pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/register');
    const isDashboardRoute = pathname.startsWith('/dashboard') || 
                             pathname.startsWith('/events') || 
                             pathname.startsWith('/bookings') || 
                             pathname.startsWith('/analytics') ||
                             pathname.startsWith('/profile') ||
                             pathname.startsWith('/earnings') ||
                             pathname.startsWith('/favorites') ||
                             pathname.startsWith('/settings');

    if (!isAuthenticated && isDashboardRoute) {
      router.replace('/login');
    }

    if (isAuthenticated && isAuthRoute) {
      // Redirect based on role
      if (user?.role === 'ADMIN') router.replace('/dashboard');
      else if (user?.role === 'ORGANIZER') router.replace('/dashboard');
      else router.replace('/dashboard');
    }
  }, [isAuthenticated, user, pathname, router, mounted]);

  // Prevent hydration flicker
  if (!mounted) return null;

  return <>{children}</>;
}
