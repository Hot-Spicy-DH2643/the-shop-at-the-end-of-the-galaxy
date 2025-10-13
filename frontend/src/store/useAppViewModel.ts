'use client';

import { create } from 'zustand';
import type { AppState } from './AppModel';
import { fetchAsteroids, fetchUserData, DEFAULT_PAGE_SIZE } from './AppModel';

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
    return { asteroids: updatedAsteroids };
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
      const userData = await fetchUserData();
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
}));

export { useAppStore };
