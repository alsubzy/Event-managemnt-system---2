
"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DateRange = 'today' | '7d' | '30d' | '90d' | '1y' | 'custom';

export interface AnalyticsData {
  revenue: number;
  bookings: number;
  attendees: number;
  conversionRate: number;
  growth: number;
  revenueChart: { name: string; value: number }[];
  bookingsChart: { name: string; value: number }[];
  categoryDistribution: { name: string; value: number }[];
  eventPerformance: {
    id: string;
    title: string;
    revenue: number;
    ticketsSold: number;
    conversion: number;
    status: 'High' | 'Medium' | 'Low';
  }[];
}

interface AnalyticsState {
  range: DateRange;
  data: AnalyticsData;
  isLoading: boolean;
  setRange: (range: DateRange) => void;
  fetchData: () => Promise<void>;
}

// Helper to generate mock data based on range
const generateMockData = (range: DateRange): AnalyticsData => {
  const multipliers = {
    today: 0.1,
    '7d': 0.7,
    '30d': 3.0,
    '90d': 8.5,
    '1y': 35.0,
    custom: 1.0,
  };

  const mult = multipliers[range];
  const points = range === 'today' ? 12 : range === '7d' ? 7 : range === '30d' ? 30 : 12;
  const labels = range === '7d' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : 
                 range === '1y' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] :
                 Array.from({ length: points }, (_, i) => `Point ${i + 1}`);

  return {
    revenue: Math.floor(45000 * mult),
    bookings: Math.floor(1240 * mult),
    attendees: Math.floor(3500 * mult),
    conversionRate: 12.5,
    growth: 18.4,
    revenueChart: labels.map(l => ({ name: l, value: Math.floor(Math.random() * 5000 * mult) })),
    bookingsChart: labels.map(l => ({ name: l, value: Math.floor(Math.random() * 200 * mult) })),
    categoryDistribution: [
      { name: 'Workshops', value: 45 },
      { name: 'Galas', value: 25 },
      { name: 'Concerts', value: 20 },
      { name: 'Others', value: 10 },
    ],
    eventPerformance: [
      { id: '1', title: 'Royal Pastry Masterclass', revenue: 12500, ticketsSold: 450, conversion: 15.2, status: 'High' },
      { id: '2', title: 'Summer Jazz Soiree', revenue: 8400, ticketsSold: 210, conversion: 11.8, status: 'Medium' },
      { id: '3', title: 'Tech Founders Dinner', revenue: 15200, ticketsSold: 120, conversion: 18.5, status: 'High' },
      { id: '4', title: 'Garden Tea Party', revenue: 3200, ticketsSold: 85, conversion: 8.2, status: 'Low' },
    ]
  };
};

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      range: '30d',
      data: generateMockData('30d'),
      isLoading: false,
      setRange: (range) => {
        set({ range, isLoading: true });
        // Simulate API delay
        setTimeout(() => {
          set({ data: generateMockData(range), isLoading: false });
        }, 600);
      },
      fetchData: async () => {
        set({ isLoading: true });
        await new Promise(r => setTimeout(r, 800));
        set({ data: generateMockData(get().range), isLoading: false });
      },
    }),
    {
      name: 'analytics-storage',
    }
  )
);
