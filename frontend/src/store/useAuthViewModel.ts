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
    set({ loading: true });
    try {
      await signInWithEmail(email, password);
    } finally {
      // Loading will be set to false by onAuthStateChanged
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true });
    try {
      await signInWithGoogle();
    } finally {
      // Loading will be set to false by onAuthStateChanged
    }
  },

  signUpWithEmail: async (email, password, username) => {
    set({ loading: true });
    try {
      await signUpWithEmail(email, password, username);
    } finally {
      // Loading will be set to false by onAuthStateChanged
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await logout();
      // Redirect to home page after logout
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
