'use client';

import { create } from 'zustand';
import type { AppState } from './AppModel';
import {
  fetchAsteroids,
  fetchUserData,
  DEFAULT_PAGE_SIZE,
  sortAsteroids,
  type SortOption,
} from './AppModel';
import { useAuthStore } from './useAuthViewModel';

export function onHandleProductClick(id: string) {
  // open the product modal component with detailed info
  useAppStore.getState().setSelectedAsteroidId(id);

  // also get the orbital data using the fetch
  /*fetchOrbitalData(id).then(orbitalData => {
    useAppStore.setState(state => ({
      asteroids: state.asteroids.map(asteroid =>
        asteroid.id === id ?
          { ...asteroid, orbital_data: orbitalData } : asteroid
      ),
    }));
  });*/
}

export function onHandleStarred(id: string) {
  // toggle the starred status of the asteroid - and add to/remove from favorites??
  useAppStore.setState(state => {
    const updatedAsteroids = state.asteroids.map(asteroid =>
      asteroid.id === id
        ? { ...asteroid, is_starred: !asteroid.is_starred }
        : asteroid
    );

    const starredAsteroids = updatedAsteroids.filter(a => a.is_starred);
    console.log(starredAsteroids);

    const updatedUserData = state.userData
      ? { ...state.userData, starred_asteroids: starredAsteroids }
      : state.userData;
    console.log(updatedUserData);

    return { asteroids: updatedAsteroids, userData: updatedUserData };
  });
}

const useAppStore = create<AppState>(set => ({
  loading: false,
  error: null,
  userData: null,
  asteroids: [],
  selectedAsteroidId: null,
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
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
      console.log('setUserData called, userId:', userId);

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

// ============================================
// SORTING HOOKS
// ============================================

/**
 * Custom hook to get sorted asteroids based on sort option
 * This is the main hook for all sorting operations in the shop
 *
 * @param sortBy - The sorting criteria (e.g., 'price-asc', 'size-desc', etc.)
 * @param limit - Optional limit to return only the first N asteroids
 * @returns Sorted array of asteroids
 *
 * @example
 * In shop page:
 * const sortedAsteroids = useSortedAsteroids(filter.sort);
 */
export function useSortedAsteroids(
  sortBy: SortOption = 'None',
  limit?: number
) {
  const asteroids = useAppStore(state => state.asteroids);
  return sortAsteroids(asteroids, sortBy, limit);
}

/**
 * Custom hook to get asteroids sorted by closest approach date to now
 * This performs the sorting on the frontend in real-time
 * Used specifically for the homepage
 *
 * Internally uses sortAsteroids() with 'distance-asc' for consistency
 *
 * @param limit - Optional limit to return only the first N asteroids
 * @returns Sorted array of asteroids (closest approach dates first)
 */
export function useAsteroidsSortedByClosestApproach(limit?: number) {
  const asteroids = useAppStore(state => state.asteroids);
  return sortAsteroids(asteroids, 'distance-asc', limit);
}

export { useAppStore };
export type { SortOption };
