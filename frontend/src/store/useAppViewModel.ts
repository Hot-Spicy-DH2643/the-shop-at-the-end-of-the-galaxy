'use client';

import { create } from 'zustand';
import type { AppState } from './AppModel';
import { fetchAsteroids, fetchUser } from './AppModel';

const useAppStore = create<AppState>(set => ({
  loading: false,
  error: null,
  user: null,
  asteroids: [],
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setAsteroids: async () => {
    try {
      set({ loading: true, error: null });
      const asteroids = await fetchAsteroids();
      set({ asteroids, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch asteroids',
        loading: false,
      });
    }
  },
  setUser: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const user = await fetchUser(userId);
      if (user) {
        set({ user, loading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        loading: false,
      });
    }
  },
}));

export { useAppStore };
