'use client';

import {
  User,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  initializeAuth: () => void;
}

export async function createBackendSession(
  user: User,
  forceRefresh = false
): Promise<void> {
  console.log('Creating backend session...');
  try {
    if (forceRefresh) {
      try {
        await user.reload();
      } catch (reloadError) {
        console.warn(
          'Failed to reload user before creating session:',
          reloadError
        );
      }
    }

    const token = await user.getIdToken(forceRefresh);

    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('Failed to create backend session');
    } else {
      console.log('✅ Backend session created');
    }
  } catch (error) {
    console.error('Error creating backend session:', error);
  }
}

export async function destroyBackendSession(): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    console.log('✅ Backend session destroyed');
  } catch (error) {
    console.error('Error destroying backend session:', error);
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
  // Session will be created in onAuthStateChanged
}

export async function signInWithGoogle(): Promise<void> {
  await signInWithPopup(auth, googleProvider);
  // Session will be created in onAuthStateChanged
}

export async function signUpWithEmail(
  email: string,
  password: string,
  username: string
): Promise<void> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  // Set the display name for the user
  await updateProfile(userCredential.user, {
    displayName: username,
  });
  try {
    await userCredential.user.reload();
    await userCredential.user.getIdToken(true);
  } catch (tokenError) {
    console.warn(
      'Failed to force refresh user token after signup:',
      tokenError
    );
  }
  // Session will be created in onAuthStateChanged
}

export async function logout(): Promise<void> {
  await destroyBackendSession();
  await signOut(auth);
}

export async function getIdToken(user: User | null): Promise<string | null> {
  if (user) {
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }
  return null;
}

export function initializeAuthListener(
  onUserChange: (user: User | null) => void,
  onSessionCreate: (user: User) => Promise<void>,
  onNoUser?: () => void
): () => void {
  console.log('Setting up auth state listener...');
  const unsubscribe = onAuthStateChanged(auth, async user => {
    onUserChange(user);
    console.log('Auth state changed. User:', user);
    if (user) {
      await onSessionCreate(user);
    } else {
      // Handle the case when user is null (logged out or not authenticated)
      onNoUser?.();
    }
  });

  return unsubscribe;
}
