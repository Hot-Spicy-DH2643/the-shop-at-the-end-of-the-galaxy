'use client';

import { create } from 'zustand';
import type { AppState } from './AppModel';
import { fetchAsteroids, fetchUser } from './AppModel';
import type { shopAsteroid } from './AppModel';

//Antonio can change this to a fixed price calculation if needed
function generateRandomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateAverageDiameterM(asteroid: shopAsteroid): number {
  const { estimated_diameter } = asteroid;
  const min = estimated_diameter.kilometers.estimated_diameter_min;
  const max = estimated_diameter.kilometers.estimated_diameter_max;
  return ((min + max) / 2) * 1000; // convert to meters
}

export function onHandleProductClick(id: string) {
  // should open the product modal component with detailed info
}

export function onHandleStarred(id: string) {
  // should toggle the starred status of the asteroid
}

const useAppStore = create<AppState>(set => ({
  loading: false,
  error: null,
  userData: null,
  asteroids: [],
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setAsteroids: async () => {
    try {
      set({ loading: true, error: null });
      let asteroids = await fetchAsteroids();
      asteroids = asteroids.map(asteroid => ({
        ...asteroid,
        price: generateRandomPrice(100, 1000), // Assign a random price between 100 and 1000
        size: calculateAverageDiameterM(asteroid), // Calculate average diameter in meters
        ownership_id: null,
        is_starred: false,
      }));
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
