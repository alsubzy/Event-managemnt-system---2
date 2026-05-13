
"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Refunded' | 'Failed';
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Refunded';

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  ticketType: 'VIP' | 'Standard' | 'Early Bird';
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'Card' | 'PayPal' | 'Bank Transfer';
  bookingDate: string;
  notes?: string;
  qrCode: string;
}

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  addBooking: (booking: Omit<Booking, 'id' | 'bookingDate' | 'qrCode'>) => string;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  cancelBooking: (id: string) => void;
  refundBooking: (id: string) => void;
}

const MOCK_INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-1024',
    customerId: 'u1',
    customerName: 'Marcus Aurelius',
    customerEmail: 'marcus@rome.com',
    eventId: 'evt-1',
    eventTitle: 'Summer Jazz Night',
    eventDate: '2024-08-12T19:00:00',
    ticketType: 'VIP',
    quantity: 2,
    unitPrice: 75,
    totalAmount: 150,
    status: 'Confirmed',
    paymentStatus: 'Paid',
    paymentMethod: 'Card',
    bookingDate: '2024-05-20T10:00:00',
    qrCode: 'qr_1024_xyz',
  },
  {
    id: 'BK-1025',
    customerId: 'u2',
    customerName: 'Diana Prince',
    customerEmail: 'diana@themyscira.com',
    eventId: 'evt-2',
    eventTitle: 'Royal Pastry Workshop',
    eventDate: '2024-09-05T10:00:00',
    ticketType: 'Standard',
    quantity: 1,
    unitPrice: 120,
    totalAmount: 120,
    status: 'Pending',
    paymentStatus: 'Unpaid',
    paymentMethod: 'Card',
    bookingDate: '2024-06-01T14:30:00',
    qrCode: 'qr_1025_abc',
  }
];

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookings: MOCK_INITIAL_BOOKINGS,
      isLoading: false,
      addBooking: (data) => {
        const id = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
        const newBooking: Booking = {
          ...data,
          id,
          bookingDate: new Date().toISOString(),
          qrCode: `qr_${id}_${Math.random().toString(36).substr(2, 5)}`,
        };
        set((state) => ({ bookings: [newBooking, ...state.bookings] }));
        return id;
      },
      updateBooking: (id, updates) => set((state) => ({
        bookings: state.bookings.map((b) => b.id === id ? { ...b, ...updates } : b)
      })),
      deleteBooking: (id) => set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== id)
      })),
      cancelBooking: (id) => set((state) => ({
        bookings: state.bookings.map((b) => b.id === id ? { ...b, status: 'Cancelled' } : b)
      })),
      refundBooking: (id) => set((state) => ({
        bookings: state.bookings.map((b) => b.id === id ? { ...b, status: 'Refunded', paymentStatus: 'Refunded' } : b)
      })),
    }),
    {
      name: 'booking-storage',
    }
  )
);
