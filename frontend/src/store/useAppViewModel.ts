'use client';

import { create } from 'zustand';
import type { AppState } from './AppModel';
import {
  fetchAsteroids,
  fetchUserData,
  fetchAsteroidById,
  DEFAULT_PAGE_SIZE,
  type SortOption,
  type UIFilters,
  convertUIFiltersToBackend,
  sortAsteroids,
  toggleStarred,
  updateProfile,
  follow,
  unfollow,
  addToCart,
  removeFromCart,
  checkoutCart,
  type CheckoutResult,
} from './AppModel';
import { useAuthStore } from './useAuthViewModel';

const createDefaultFilters = (): UIFilters => ({
  hazardous: 'all',
  sizeMin: 0,
  sizeMax: 3000,
  distanceMin: 0,
  distanceMax: 100,
  priceMin: 100,
  priceMax: 900,
  orbitTypes: [],
  sortBy: 'None',
});

const useAppStore = create<AppState>((set, get) => ({
  loading: false,
  error: null,
  userData: null,
  userLoading: false,
  asteroids: [],
  selectedAsteroid: null,
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  filters: createDefaultFilters(),
  setFilters: updater => {
    const prevFilters = get().filters;
    const resolved =
      typeof updater === 'function'
        ? (updater as (prev: UIFilters) => UIFilters)(prevFilters)
        : updater;
    const nextFilters: UIFilters = {
      ...resolved,
      orbitTypes:
        resolved.orbitTypes !== undefined
          ? [...resolved.orbitTypes]
          : resolved.orbitTypes,
    };

    set({ filters: nextFilters, currentPage: 1 });
    void get().setAsteroids(1);
  },
  resetFilters: () => get().setFilters(createDefaultFilters()),
  cart: [],
  addToCart: async asteroid_id => {
    addToCart(asteroid_id).then(success => {
      if (success) {
        console.log('Successfully added to cart:', asteroid_id);
      } else {
        console.log('Failed to add to cart:', asteroid_id);
      }
      useAppStore.getState().setUserData();
    });
  },
  removeFromCart: async asteroid_id => {
    removeFromCart(asteroid_id).then(success => {
      if (success) {
        console.log('Successfully removed from cart:', asteroid_id);
      } else {
        console.log('Failed to remove from cart:', asteroid_id);
      }
      useAppStore.getState().setUserData();
    });
  },
  checkoutLoading: false,
  checkout: async (): Promise<CheckoutResult> => {
    set({ checkoutLoading: true });
    try {
      const result = await checkoutCart();

      if (result.success) {
        console.log('Checkout successful');
      } else {
        console.warn('Checkout failed:', result.message);
      }

      set({ checkoutLoading: false });
      await useAppStore.getState().setUserData();

      return result;
    } catch (error) {
      console.error('Checkout error:', error);
      set({ checkoutLoading: false });
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to checkout cart',
      };
    }
  },
  // clearCart: () => set({ cart: [] }),
  viewedProfile: null,
  setSelectedAsteroid: async (id: string | null) => {
    if (id) {
      try {
        // Fetch full asteroid data when an ID is selected
        const asteroidData = await fetchAsteroidById(id);
        set({
          selectedAsteroid: asteroidData,
        });
      } catch (error) {
        console.error('Error fetching selected asteroid:', error);
        set({
          selectedAsteroid: null,
        });
      }
    } else {
      // Clear selected asteroid when no ID is provided
      set({
        selectedAsteroid: null,
      });
    }
  },
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setAsteroids: async (page: number = 1) => {
    try {
      set({ loading: true, error: null });
      // Fetch asteroids from GraphQL backend with pagination
      // Price and size are now calculated server-side
      const currentFilters = convertUIFiltersToBackend(get().filters);
      const result = await fetchAsteroids(
        page,
        DEFAULT_PAGE_SIZE,
        currentFilters
      );
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
      set({ userLoading: true, error: null });
      const currentUser = useAuthStore.getState().user;
      const userId = currentUser?.uid;

      if (!userId) {
        set({ error: 'No authenticated user', userLoading: false });
        return;
      }

      const userData = await fetchUserData(userId);
      if (userData) {
        set({ userData, userLoading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        userLoading: false,
      });
    }
  },

  updateProfileData: async (newName: string) => {
    const user = useAuthStore.getState().user;
    if (!user?.uid) return;
    updateProfile(user.uid, newName).then(() => {
      useAppStore.getState().setUserData();
    });
  },

  updateFollow: async (tUid: string) => {
    const { setUserData, setViewedProfile } = useAppStore.getState();
    if (!tUid) return;
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.uid) return;
    await follow(tUid);
    await Promise.all([setUserData(), setViewedProfile(tUid)]);
  },

  updateUnfollow: async (tUid: string) => {
    const { setUserData, setViewedProfile } = useAppStore.getState();
    if (!tUid) return;
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.uid) return;
    await unfollow(tUid);
    await Promise.all([setUserData(), setViewedProfile(tUid)]);
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
  getAsteroidsSortedByClosestApproach: (limit?: number) =>
    sortAsteroids(get().asteroids, 'distance-asc', limit),
  onHandleProductClick: async (id: string) => {
    await get().setSelectedAsteroid(id);
  },
  onHandleStarred: (asteroid_id: string) => {
    const { setUserData } = get();
    const currentUser = useAuthStore.getState().user;
    const userId = currentUser?.uid;

    if (!userId) {
      alert('Please log in to star asteroids.');
      return;
    }

    toggleStarred(asteroid_id).then(success => {
      if (success) {
        // Refresh user data to reflect the change
        setUserData();
      } else {
        alert('Failed to update starred asteroids. Please try again.');
      }
    });
  },
}));

export { useAppStore, convertUIFiltersToBackend };
export type { SortOption, UIFilters };
