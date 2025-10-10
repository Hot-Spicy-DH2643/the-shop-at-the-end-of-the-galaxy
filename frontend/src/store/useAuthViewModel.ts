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

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  setUser: user => set({ user }),

  setLoading: loading => set({ loading }),

  initializeAuth: () => {
    const { initialized } = get();
    if (initialized) return;
    console.log('Initializing auth...');
    set({ initialized: true });

    const unsubscribe = initializeAuthListener(
      user => {
        set({ user, loading: true });
      },
      async user => {
        await createBackendSession(user);
        set({ loading: false });
      },
      () => {
        // Handle null user case (logged out or not authenticated)
        set({ loading: false });
      }
    );

    // Store unsubscribe function (optional: for cleanup if needed)
    return unsubscribe;
  },

  signInWithEmail: async (email, password) => {
    await signInWithEmail(email, password);
  },

  signInWithGoogle: async () => {
    await signInWithGoogle();
  },

  signUpWithEmail: async (email, password) => {
    await signUpWithEmail(email, password);
  },

  logout: async () => {
    await logout();
  },

  getIdToken: async () => {
    const { user } = get();
    return await getIdToken(user);
  },
}));
