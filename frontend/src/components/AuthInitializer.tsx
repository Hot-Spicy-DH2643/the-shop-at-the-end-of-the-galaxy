'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthViewModel';

/**
 * Component to initialize authentication state.
 * Should be used once at the root level of your app.
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore(state => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
