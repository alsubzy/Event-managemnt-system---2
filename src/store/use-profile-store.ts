
"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserSession {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  category: 'security' | 'profile' | 'billing' | 'event';
}

export interface ProfileData {
  firstName: string;
  lastName: string;
  bio: string;
  phone: string;
  location: string;
  website: string;
  social: {
    twitter: string;
    linkedin: string;
    instagram: string;
  };
}

export interface NotificationPrefs {
  email: {
    marketing: boolean;
    bookings: boolean;
    updates: boolean;
    security: boolean;
  };
  push: {
    reminders: boolean;
    messages: boolean;
  };
  sms: {
    urgent: boolean;
  };
}

interface ProfileState {
  profile: ProfileData;
  notifications: NotificationPrefs;
  sessions: UserSession[];
  activity: ActivityLog[];
  isLoading: boolean;
  updateProfile: (data: Partial<ProfileData>) => void;
  updateNotifications: (category: keyof NotificationPrefs, data: any) => void;
  revokeSession: (id: string) => void;
  addActivity: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: {
        firstName: 'Jane',
        lastName: 'Doe',
        bio: 'Professional event organizer and culinary enthusiast. Passionate about creating unforgettable experiences through high-end catering and sophisticated gatherings.',
        phone: '+44 7700 900000',
        location: 'London, United Kingdom',
        website: 'https://janedoe.com',
        social: {
          twitter: 'janedoe_events',
          linkedin: 'jane-doe-pro',
          instagram: 'jane_culinary',
        }
      },
      notifications: {
        email: { marketing: false, bookings: true, updates: true, security: true },
        push: { reminders: true, messages: true },
        sms: { urgent: false }
      },
      sessions: [
        { id: '1', device: 'MacBook Pro - Chrome', location: 'London, UK', ip: '192.168.1.1', lastActive: new Date().toISOString(), isCurrent: true },
        { id: '2', device: 'iPhone 15 Pro', location: 'London, UK', ip: '192.168.1.42', lastActive: '2024-05-24T10:00:00', isCurrent: false },
      ],
      activity: [
        { id: 'a1', action: 'Profile Updated', details: 'Changed bio and location settings', timestamp: new Date().toISOString(), category: 'profile' },
        { id: 'a2', action: 'Login Detected', details: 'Successful login from Chrome on macOS', timestamp: '2024-05-25T09:00:00', category: 'security' },
      ],
      isLoading: false,
      updateProfile: (data) => set((state) => ({ 
        profile: { ...state.profile, ...data } 
      })),
      updateNotifications: (category, data) => set((state) => ({
        notifications: {
          ...state.notifications,
          [category]: { ...state.notifications[category], ...data }
        }
      })),
      revokeSession: (id) => set((state) => ({
        sessions: state.sessions.filter(s => s.id !== id || s.isCurrent)
      })),
      addActivity: (log) => set((state) => ({
        activity: [
          { ...log, id: Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString() },
          ...state.activity
        ].slice(0, 50)
      }))
    }),
    { name: 'profile-storage' }
  )
);
