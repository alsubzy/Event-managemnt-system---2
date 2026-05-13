
"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoriteState {
  favoriteIds: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (id: string) => {
        const currentFavorites = get().favoriteIds;
        const isFav = currentFavorites.includes(id);
        
        if (isFav) {
          set({ favoriteIds: currentFavorites.filter(favId => favId !== id) });
        } else {
          set({ favoriteIds: [...currentFavorites, id] });
        }
      },
      isFavorite: (id: string) => get().favoriteIds.includes(id),
      clearFavorites: () => set({ favoriteIds: [] }),
    }),
    {
      name: 'favorite-storage',
    }
  )
);
