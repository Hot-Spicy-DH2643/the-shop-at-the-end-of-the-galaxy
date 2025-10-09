'use client';

import { create } from 'zustand';
import type { AppState } from './AppModel';
import { fetchAsteroids } from './AppModel';

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
}));

export { useAppStore };
