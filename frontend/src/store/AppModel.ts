'use client';


import type { Asteroid, UserData, UIFilters, BackendFilters, CheckoutResult } from '../types';

export type { UIFilters, BackendFilters };

export type AppState = {
  userData: UserData | null;
  userLoading: boolean;
  viewedProfile: UserData | null;
  asteroids: Asteroid[];
  loading: boolean;
  error: string | null;
  selectedAsteroid: Asteroid | null;
  // Pagination state
  currentPage: number;
  totalPages: number;
  totalCount: number;
  filters: UIFilters;
  setFilters: (updater: UIFilters | ((prev: UIFilters) => UIFilters)) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAsteroids: (page?: number) => Promise<void>;
  setSelectedAsteroid: (id: string | null) => Promise<void>;
  setUserData: () => Promise<void>;
  updateProfileData: (newName: string) => void;
  updateFollow: (tUid: string) => void;
  updateUnfollow: (tUid: string) => void;
  checkoutLoading: boolean;
  checkout: () => Promise<CheckoutResult>;
  cart: Asteroid[];
  addToCart: (asteroid_id: string) => void;
  removeFromCart: (asteroid_id: string) => void;
  // clearCart: () => void;
  setViewedProfile: (uid: string) => Promise<void>;
  getAsteroidsSortedByClosestApproach: (limit?: number) => Asteroid[];
  onHandleProductClick: (id: string) => Promise<void>;
  onHandleStarred: (asteroid_id: string) => void;
};
