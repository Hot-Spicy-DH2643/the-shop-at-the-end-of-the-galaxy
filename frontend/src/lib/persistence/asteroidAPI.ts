import client from '@/lib/apollo-client';
import { GET_ASTEROIDS, GET_ASTEROID_BY_ID, GET_USER_BY_ID } from '../graphql/queries';
import {
  UPDATE_USER_NAME,
  FOLLOW_USER,
  UNFOLLOW_USER,
  TOGGLE_STARRED_ASTEROID,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  CHECKOUT_CART
} from '../graphql/mutations';
import type { Asteroid, UserData, AsteroidsResult, BackendFilters, CheckoutResult } from '../../types';

interface AsteroidsResponse {
  asteroids: {
    asteroids: Asteroid[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export const DEFAULT_PAGE_SIZE = 24;

export async function fetchAsteroids(
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE,
  filters?: BackendFilters
): Promise<AsteroidsResult> {
  try {
    const { data } = await client.query<AsteroidsResponse>({
      query: GET_ASTEROIDS,
      variables: {
        page,
        pageSize,
        filters,
      },
      fetchPolicy: 'network-only', // Always fetch fresh data from server
    });

    if (!data) {
      return {
        asteroids: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
      };
    }

    return {
      asteroids: data.asteroids.asteroids,
      totalCount: data.asteroids.totalCount,
      totalPages: data.asteroids.totalPages,
      currentPage: data.asteroids.page,
    };
  } catch (error) {
    return {
      asteroids: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
    };
  }
}

export async function fetchAsteroidById(id: string): Promise<Asteroid | null> {
  try {
    const { data } = await client.query<{ asteroid: Asteroid }>({
      query: GET_ASTEROID_BY_ID,
      variables: { id },
      fetchPolicy: 'network-only',
    });

    if (!data || !data.asteroid) {
      return null;
    }

    return data.asteroid;
  } catch (error) {
    return null;
  }
}

export async function fetchUserData(uid: string): Promise<UserData | null> {
  try {
    const { data } = await client.query<{ user: UserData }>({
      query: GET_USER_BY_ID,
      variables: { uid },
      fetchPolicy: 'network-only',
    });

    if (!data) {
      return null;
    }
    return data.user;
  } catch (error) {
    return null;
  }
}

export async function updateProfile(uid: string, newName: string) {
  try {
    await client.mutate({
      mutation: UPDATE_USER_NAME,
      variables: {
        uid: uid,
        name: newName,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function follow(tUid: string) {
  try {
    await client.mutate({
      mutation: FOLLOW_USER,
      variables: {
        targetUid: tUid,
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function unfollow(tUid: string) {
  try {
    await client.mutate({
      mutation: UNFOLLOW_USER,
      variables: {
        targetUid: tUid,
      },
    });
  } catch (error) {
    throw error;
  }
}

export function toggleStarred(asteroid_id: string) {
  return client.mutate({
    mutation: TOGGLE_STARRED_ASTEROID,
    variables: { asteroidId: asteroid_id },
  });
}

export function addToCart(asteroid_id: string): Promise<boolean> {
  return client
    .mutate({
      mutation: ADD_TO_CART,
      variables: { asteroidId: asteroid_id },
    })
    .then(response => {
      return true;
    })
    .catch(error => {
      return false;
    });
}

export function removeFromCart(asteroid_id: string): Promise<boolean> {
  return client
    .mutate({
      mutation: REMOVE_FROM_CART,
      variables: { asteroidId: asteroid_id },
    })
    .then(response => {
      return true;
    })
    .catch(error => {
      return false;
    });
}

export function checkoutCart(): Promise<CheckoutResult> {
  return client
    .mutate<{ checkoutCart: CheckoutResult }>({
      mutation: CHECKOUT_CART,
    })
    .then(response => {
      const result = response.data?.checkoutCart;
      if (!result) {
        return {
          success: false,
          message: 'Unexpected checkout response',
        };
      }
      return {
        success: Boolean(result.success),
        message: result.message ?? null,
      };
    })
    .catch(error => {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to checkout cart',
      };
    });
}