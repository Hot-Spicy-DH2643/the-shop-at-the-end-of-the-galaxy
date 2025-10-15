'use client';

import { create } from 'zustand';
import type { AppState } from './AppModel';
import {
  fetchAsteroids,
  fetchUserData,
  DEFAULT_PAGE_SIZE,
  sortAsteroids,
  type SortOption,
  filterAndSortAsteroids,
  type FilterState,
} from './AppModel';
import { useAuthStore } from './useAuthViewModel';

const useAppStore = create<AppState>(set => ({
  loading: false,
  error: null,
  userData: null,
  asteroids: [],
  selectedAsteroidId: null,
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  cart: [],
  addToCart: asteroid => set(state => ({ cart: [...state.cart, asteroid] })),
  removeFromCart: id =>
    set(state => ({ cart: state.cart.filter(a => a.id !== id) })),
  clearCart: () => set({ cart: [] }),

  viewedProfile: null,
  setSelectedAsteroidId: (id: string | null) => set({ selectedAsteroidId: id }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setAsteroids: async (page: number = 1) => {
    try {
      set({ loading: true, error: null });
      // Fetch asteroids from GraphQL backend with pagination
      // Price and size are now calculated server-side
      const result = await fetchAsteroids(page, DEFAULT_PAGE_SIZE);
      set({
        asteroids: result.asteroids,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch asteroids',
        loading: false,
      });
    }
  },
  setUserData: async () => {
    try {
      set({ loading: true, error: null });
      const currentUser = useAuthStore.getState().user;
      const userId = currentUser?.uid;

      if (!userId) {
        set({ error: 'No authenticated user', loading: false });
        return;
      }

      const userData = await fetchUserData(userId);
      if (userData) {
        set({ userData, loading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        loading: false,
      });
    }
  },
  setViewedProfile: async (uid: string) => {
    try {
      set({ loading: true, error: null });
      const viewedProfile = await fetchUserData(uid);
      if (viewedProfile) {
        set({ viewedProfile, loading: false });
      } else {
        set({ error: 'User not found', loading: false });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch profile',
        loading: false,
      });
    }
  },
}));

// =========================
//  CUSTOM HOOKS

{
  /* Sorting */
}
export function useSortedAsteroids(
  sortBy: SortOption = 'None', // sorting criteria (e.g., 'price-asc', 'size-desc', etc.)
  limit?: number // limit to return only the first N asteroids
) {
  const asteroids = useAppStore(state => state.asteroids);
  return sortAsteroids(asteroids, sortBy, limit);
}

// custom hook specifically for the landing/home page
export function useAsteroidsSortedByClosestApproach(limit?: number) {
  const asteroids = useAppStore(state => state.asteroids);
  return sortAsteroids(asteroids, 'distance-asc', limit);
}

{
  /* Filtering */
}
export function useFilteredAsteroids(filters: FilterState) {
  const asteroids = useAppStore(state => state.asteroids);
  return filterAndSortAsteroids(asteroids, filters);
}

// =========================
//  EVENT HANDLERS

export function onHandleProductClick(id: string) {
  // open the product modal component with detailed info
  useAppStore.getState().setSelectedAsteroidId(id);
}

export function onHandleStarred(id: string) {
  // toggle the starred status of the asteroid - and add to/remove from favorites??
  useAppStore.setState(state => {
    const updatedAsteroids = state.asteroids.map(asteroid =>
      asteroid.id === id
        ? { ...asteroid, is_starred: !asteroid.is_starred }
        : asteroid
    );
    return { asteroids: updatedAsteroids };
  });
}

export { useAppStore };
export type { SortOption, FilterState };
