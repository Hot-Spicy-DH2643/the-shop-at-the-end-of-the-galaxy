'use client';

import { create } from 'zustand';
import type { AuthState } from './AuthModel';
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  logout,
  getIdToken,
  createBackendSession,
  initializeAuthListener,
} from './AuthModel';
import { useAppStore } from './useAppViewModel';
import { useDailyClaimStore } from './useDailyClaimViewModel';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: user => set({ user }),

  setLoading: loading => set({ loading }),

  initializeAuth: () => {
    const { initialized } = get();
    if (initialized) return;
    // console.log('Initializing auth...');
    set({ initialized: true });

    const unsubscribe = initializeAuthListener(
      user => {
        set({ user, loading: true });
        if (!user) {
          useDailyClaimStore.getState().resetSession();
        }
      },
      async user => {
        const metadata = user.metadata;
        const isFirstLogin =
          metadata?.creationTime && metadata?.lastSignInTime
            ? metadata.creationTime === metadata.lastSignInTime
            : false;
        const dailyClaimActions = useDailyClaimStore.getState();
        dailyClaimActions.resetSession();
        const shouldForceRefresh = isFirstLogin || !user.displayName;
        await createBackendSession(user, shouldForceRefresh);
        // get user data from backend
        await useAppStore.getState().setUserData();
        set({ loading: false });
        void dailyClaimActions.checkClaimAvailability(true);
      },
      () => {
        // Handle null user case (logged out or not authenticated)
        set({ loading: false });
        useDailyClaimStore.getState().resetSession();
      }
    );

    // Store unsubscribe function (optional: for cleanup if needed)
    return unsubscribe;
  },

  signInWithEmail: async (email, password) => {
    set({ loading: true });
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true });
    try {
      await signInWithGoogle();
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signUpWithEmail: async (email, password, username) => {
    set({ loading: true });
    try {
      await signUpWithEmail(email, password, username);
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await logout();
      // Redirect to home page after logout
      useDailyClaimStore.getState().resetSession();
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } finally {
      set({ loading: false });
    }
  },

  getIdToken: async () => {
    const { user } = get();
    return await getIdToken(user);
  },
}));
