
"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TransactionStatus = 'Completed' | 'Pending' | 'Refunded' | 'Failed';
export type PayoutStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed';

export interface Transaction {
  id: string;
  eventId: string;
  eventTitle: string;
  customerName: string;
  amount: number;
  fees: number;
  net: number;
  status: TransactionStatus;
  date: string;
  paymentMethod: string;
}

export interface Payout {
  id: string;
  amount: number;
  status: PayoutStatus;
  date: string;
  bankName: string;
  accountNumber: string;
}

interface EarningsState {
  transactions: Transaction[];
  payouts: Payout[];
  totalRevenue: number;
  pendingPayout: number;
  isLoading: boolean;
  addPayout: (amount: number, bankName: string, accountNumber: string) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX-9021', eventId: 'evt-1', eventTitle: 'Summer Jazz Night', customerName: 'Marcus Aurelius', amount: 150, fees: 4.5, net: 145.5, status: 'Completed', date: '2024-05-20T10:00:00', paymentMethod: 'Card' },
  { id: 'TX-9022', eventId: 'evt-1', eventTitle: 'Summer Jazz Night', customerName: 'Diana Prince', amount: 75, fees: 2.25, net: 72.75, status: 'Completed', date: '2024-05-21T14:30:00', paymentMethod: 'Card' },
  { id: 'TX-9023', eventId: 'evt-2', eventTitle: 'Royal Pastry Workshop', customerName: 'Arthur Curry', amount: 120, fees: 3.6, net: 116.4, status: 'Pending', date: '2024-06-01T11:20:00', paymentMethod: 'Transfer' },
  { id: 'TX-9024', eventId: 'evt-1', eventTitle: 'Summer Jazz Night', customerName: 'Selina Kyle', amount: 150, fees: 4.5, net: 145.5, status: 'Completed', date: '2024-06-02T09:15:00', paymentMethod: 'Card' },
];

const MOCK_PAYOUTS: Payout[] = [
  { id: 'PO-5501', amount: 1250, status: 'Completed', date: '2024-04-15T09:00:00', bankName: 'Standard Chartered', accountNumber: '**** 8829' },
  { id: 'PO-5502', amount: 800, status: 'Pending', date: '2024-05-10T11:45:00', bankName: 'HSBC Premium', accountNumber: '**** 1102' },
];

export const useEarningsStore = create<EarningsState>()(
  persist(
    (set, get) => ({
      transactions: MOCK_TRANSACTIONS,
      payouts: MOCK_PAYOUTS,
      totalRevenue: MOCK_TRANSACTIONS.reduce((acc, t) => acc + (t.status === 'Completed' ? t.net : 0), 0),
      pendingPayout: MOCK_PAYOUTS.reduce((acc, p) => acc + (p.status === 'Pending' ? p.amount : 0), 0),
      isLoading: false,
      addPayout: (amount, bankName, accountNumber) => {
        const id = `PO-${Math.floor(5000 + Math.random() * 5000)}`;
        const newPayout: Payout = {
          id,
          amount,
          status: 'Pending',
          date: new Date().toISOString(),
          bankName,
          accountNumber: `**** ${accountNumber.slice(-4)}`,
        };
        set((state) => ({
          payouts: [newPayout, ...state.payouts],
          pendingPayout: state.pendingPayout + amount
        }));
      },
      updateTransaction: (id, updates) => set((state) => {
        const updatedTransactions = state.transactions.map((t) => t.id === id ? { ...t, ...updates } : t);
        return {
          transactions: updatedTransactions,
          totalRevenue: updatedTransactions.reduce((acc, t) => acc + (t.status === 'Completed' ? t.net : 0), 0)
        };
      }),
    }),
    {
      name: 'earnings-storage',
    }
  )
);
