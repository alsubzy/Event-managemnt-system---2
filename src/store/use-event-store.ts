
"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type EventStatus = 'Draft' | 'Published' | 'Scheduled' | 'Live' | 'Completed' | 'Cancelled' | 'Archived';

export interface EventSpeaker {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  status: EventStatus;
  startDate: string;
  endDate: string;
  location: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  ticketsSold: number;
  price: number;
  revenue: number;
  image: string;
  gallery: string[];
  speakers: EventSpeaker[];
  createdAt: string;
}

interface EventState {
  events: Event[];
  isLoading: boolean;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'ticketsSold' | 'revenue'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  duplicateEvent: (id: string) => void;
  archiveEvent: (id: string) => void;
  publishEvent: (id: string) => void;
}

const MOCK_INITIAL_EVENTS: Event[] = [
  {
    id: 'evt-1',
    title: 'Summer Jazz Night',
    slug: 'summer-jazz-night',
    description: 'An evening of soulful jazz under the stars at Hyde Park.',
    category: 'Concert',
    status: 'Live',
    startDate: '2024-08-12T19:00:00',
    endDate: '2024-08-12T23:00:00',
    location: 'Hyde Park, London',
    address: 'Kensington Road',
    city: 'London',
    country: 'United Kingdom',
    capacity: 1000,
    ticketsSold: 850,
    price: 45,
    revenue: 38250,
    image: 'https://picsum.photos/seed/jazz-1/800/600',
    gallery: ['https://picsum.photos/seed/jazz-2/800/600'],
    speakers: [],
    createdAt: '2024-01-15T10:00:00',
  },
  {
    id: 'evt-2',
    title: 'Royal Pastry Workshop',
    slug: 'royal-pastry-workshop',
    description: 'Master the art of French patisserie with Chef Marco.',
    category: 'Workshop',
    status: 'Draft',
    startDate: '2024-09-05T10:00:00',
    endDate: '2024-09-05T15:00:00',
    location: 'Mayfair Studio',
    address: '15 Bond Street',
    city: 'London',
    country: 'United Kingdom',
    capacity: 25,
    ticketsSold: 0,
    price: 120,
    revenue: 0,
    image: 'https://picsum.photos/seed/pastry-1/800/600',
    gallery: [],
    speakers: [{ id: 's1', name: 'Chef Marco', role: 'Executive Pastry Chef' }],
    createdAt: '2024-02-10T14:30:00',
  }
];

export const useEventStore = create<EventState>()(
  persist(
    (set) => ({
      events: MOCK_INITIAL_EVENTS,
      isLoading: false,
      addEvent: (eventData) => set((state) => ({
        events: [
          {
            ...eventData,
            id: `evt-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            ticketsSold: 0,
            revenue: 0,
          },
          ...state.events
        ]
      })),
      updateEvent: (id, updates) => set((state) => ({
        events: state.events.map((e) => e.id === id ? { ...e, ...updates } : e)
      })),
      deleteEvent: (id) => set((state) => ({
        events: state.events.filter((e) => e.id !== id)
      })),
      duplicateEvent: (id) => set((state) => {
        const eventToDup = state.events.find((e) => e.id === id);
        if (!eventToDup) return state;
        const newEvent = {
          ...eventToDup,
          id: `evt-${Math.random().toString(36).substr(2, 9)}`,
          title: `${eventToDup.title} (Copy)`,
          status: 'Draft' as EventStatus,
          ticketsSold: 0,
          revenue: 0,
          createdAt: new Date().toISOString()
        };
        return { events: [newEvent, ...state.events] };
      }),
      archiveEvent: (id) => set((state) => ({
        events: state.events.map((e) => e.id === id ? { ...e, status: 'Archived' } : e)
      })),
      publishEvent: (id) => set((state) => ({
        events: state.events.map((e) => e.id === id ? { ...e, status: 'Published' } : e)
      })),
    }),
    {
      name: 'event-storage',
    }
  )
);
