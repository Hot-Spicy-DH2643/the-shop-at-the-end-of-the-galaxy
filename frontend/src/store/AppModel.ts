'use client';

import { gql } from '@apollo/client';
import client from '@/lib/apollo-client';

export interface Asteroid {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    miles: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    feet: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  }>;
  is_sentry_object: boolean;
  price: number;
  owner: Owner | null;
  size: number;
  orbital_data?: {
    orbit_id: string;
    orbit_determination_date: string;
    first_observation_date: string;
    last_observation_date: string;
    data_arc_in_days: number;
    observations_used: number;
    orbit_uncertainty: string;
    minimum_orbit_intersection: string;
    jupiter_tisserand_invariant: string;
    epoch_osculation: string;
    eccentricity: string;
    semi_major_axis: string;
    inclination: string;
    ascending_node_longitude: string;
    orbital_period: string;
    perihelion_distance: string;
    perihelion_argument: string;
    aphelion_distance: string;
    perihelion_time: string;
    mean_anomaly: string;
    mean_motion: string;
    equinox: string;
    orbit_class: {
      orbit_class_type: string;
      orbit_class_description: string;
      orbit_class_range: string;
    };
  };
}

type Owner = {
  uid: string;
  name: string;
};

type Friend = {
  uid: string;
  name: string;
};

export type UserData = {
  uid: string;
  name: string;
  coins: number;
  owned_asteroids: Asteroid[];
  starred_asteroids: Asteroid[];
  followers: Friend[];
  following: Friend[];
  cart_asteroids: Asteroid[];
};

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

// GraphQL query to fetch asteroids with pagination
// TODO: For all the graphql query definition in this file, consider moving it to a separate file for better organization, and is it possible to use the type definitions for the graphql query types?
const GET_ASTEROIDS = gql`
  query GetAsteroids($page: Int, $pageSize: Int, $filters: AsteroidFilters) {
    asteroids(page: $page, pageSize: $pageSize, filters: $filters) {
      asteroids {
        id
        neo_reference_id
        name
        owner {
          uid
          name
        }
        nasa_jpl_url
        absolute_magnitude_h
        estimated_diameter {
          kilometers {
            estimated_diameter_min
            estimated_diameter_max
          }
          meters {
            estimated_diameter_min
            estimated_diameter_max
          }
          miles {
            estimated_diameter_min
            estimated_diameter_max
          }
          feet {
            estimated_diameter_min
            estimated_diameter_max
          }
        }
        is_potentially_hazardous_asteroid
        close_approach_data {
          close_approach_date
          close_approach_date_full
          epoch_date_close_approach
          relative_velocity {
            kilometers_per_second
            kilometers_per_hour
            miles_per_hour
          }
          miss_distance {
            astronomical
            lunar
            kilometers
            miles
          }
          orbiting_body
        }
        is_sentry_object
        orbital_data {
          orbit_id
          orbit_determination_date
          first_observation_date
          last_observation_date
          data_arc_in_days
          observations_used
          orbit_uncertainty
          minimum_orbit_intersection
          jupiter_tisserand_invariant
          epoch_osculation
          eccentricity
          semi_major_axis
          inclination
          ascending_node_longitude
          orbital_period
          perihelion_distance
          perihelion_argument
          aphelion_distance
          perihelion_time
          mean_anomaly
          mean_motion
          equinox
          orbit_class {
            orbit_class_type
            orbit_class_description
            orbit_class_range
          }
        }
        price
        size
      }
      totalCount
      page
      pageSize
      totalPages
    }
  }
`;

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

export interface AsteroidsResult {
  asteroids: Asteroid[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// UI filter type - stores values in user-friendly ranges
export interface UIFilters {
  hazardous?: string;
  sizeMin?: number;
  sizeMax?: number;
  distanceMin?: number; // 0-100 range
  distanceMax?: number; // 0-100 range
  priceMin?: number;
  priceMax?: number;
  orbitTypes?: string[];
  sortBy?: string;
  ownership?: string; // 'all', 'owned', 'not-owned'
}

// Backend filter input type
export interface BackendFilters {
  hazardous?: string;
  sizeMin?: number;
  sizeMax?: number;
  distanceMin?: number;
  distanceMax?: number;
  priceMin?: number;
  priceMax?: number;
  orbitTypes?: string[];
  sortBy?: string;
  ownership?: string; // 'all', 'owned', 'not-owned'
}

// Converter function: UI filters -> Backend filters
export function convertUIFiltersToBackend(
  uiFilters: UIFilters
): BackendFilters {
  const DISTANCE_MAX = 100000000; // 100 million km

  return {
    ...uiFilters,
    // Convert distance from 0-100 range to actual kilometers
    distanceMin:
      uiFilters.distanceMin !== undefined
        ? (uiFilters.distanceMin / 100) * DISTANCE_MAX
        : undefined,
    distanceMax:
      uiFilters.distanceMax !== undefined
        ? (uiFilters.distanceMax / 100) * DISTANCE_MAX
        : undefined,
  };
}

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
      console.error('No data returned from GraphQL query');
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
    console.error('Error fetching asteroids from GraphQL:', error);
    return {
      asteroids: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
    };
  }
}

// GraphQL query to fetch a single asteroid by ID
const GET_ASTEROID_BY_ID = gql`
  query GetAsteroid($id: String!) {
    asteroid(id: $id) {
      id
      neo_reference_id
      name
      nasa_jpl_url
      absolute_magnitude_h
      estimated_diameter {
        kilometers {
          estimated_diameter_min
          estimated_diameter_max
        }
        meters {
          estimated_diameter_min
          estimated_diameter_max
        }
      }
      is_potentially_hazardous_asteroid
      close_approach_data {
        close_approach_date
        close_approach_date_full
        epoch_date_close_approach
        relative_velocity {
          kilometers_per_second
          kilometers_per_hour
        }
        miss_distance {
          astronomical
          kilometers
        }
        orbiting_body
      }
      is_sentry_object
      orbital_data {
        orbit_id
        eccentricity
        semi_major_axis
        inclination
        orbital_period
        orbit_class {
          orbit_class_type
          orbit_class_description
          orbit_class_range
        }
      }
      price
      size
      owner {
        uid
        name
      }
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($uid: String!) {
    user(uid: $uid) {
      uid
      name
      coins
      owned_asteroids {
        id
        name
        is_potentially_hazardous_asteroid
        price
        size
        close_approach_data {
          close_approach_date
          close_approach_date_full
          epoch_date_close_approach
          relative_velocity {
            kilometers_per_second
            kilometers_per_hour
          }
          miss_distance {
            astronomical
            kilometers
          }
          orbiting_body
        }
        orbital_data {
          orbit_id
          eccentricity
          semi_major_axis
          inclination
          orbital_period
          orbit_class {
            orbit_class_type
            orbit_class_description
            orbit_class_range
          }
        }
      }
      starred_asteroids {
        id
        name
        is_potentially_hazardous_asteroid
        price
        size
      }
      followers {
        uid
        name
      }
      following {
        uid
        name
      }
      cart_asteroids {
        id
        name
        price
        size
        owner {
          uid
          name
        }
      }
    }
  }
`;

export async function fetchAsteroidById(id: string): Promise<Asteroid | null> {
  try {
    const { data } = await client.query<{ asteroid: Asteroid }>({
      query: GET_ASTEROID_BY_ID,
      variables: { id },
      fetchPolicy: 'network-only',
    });

    if (!data || !data.asteroid) {
      console.error('No asteroid data returned from GraphQL query');
      return null;
    }

    // Transform to include frontend-specific fields
    return data.asteroid;
  } catch (error) {
    console.error('Error fetching asteroid by ID from GraphQL:', error);
    return null;
  }
}

export const UPDATE_USER_NAME = gql`
  mutation UpdateUserName($uid: String!, $name: String!) {
    updateUserName(uid: $uid, name: $name) {
      uid
      name
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($targetUid: String!) {
    followUser(targetUid: $targetUid)
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($targetUid: String!) {
    unfollowUser(targetUid: $targetUid)
  }
`;

export async function fetchUserData(uid: string): Promise<UserData | null> {
  try {
    const { data } = await client.query<{ user: UserData }>({
      query: GET_USER_BY_ID,
      variables: { uid },
      fetchPolicy: 'network-only',
    });

    if (!data) {
      console.error('No data returned from GraphQL query');
      return null;
    }
    return data.user;
  } catch (error) {
    console.error('Error fetching user from GraphQL:', error);
    return null;
  }
}

export async function updateProfile(uid: string, newName: string) {
  try {
    // Update backend via GraphQL
    await client.mutate({
      mutation: UPDATE_USER_NAME,
      variables: {
        uid: uid,
        name: newName,
      },
    });
  } catch (error) {
    console.error('Error updating user name in backend:', error);
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
    console.error('Error updating new followers in backend:', error);
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
    console.error('Error removing followers in backend:', error);
    throw error;
  }
}

// ============================================
// SORTING FUNCTIONS - Pure Business Logic
// ============================================

/**
 * Helper function to get the first approach date timestamp for sorting
 * @param asteroid - The asteroid to analyze
 * @returns Timestamp of the first approach date in milliseconds, or Infinity if no data
 */
function getClosestApproachTimestamp(asteroid: Asteroid): number {
  if (
    !asteroid.close_approach_data ||
    asteroid.close_approach_data.length === 0
  ) {
    return Infinity;
  }

  // Use the first approach date (same as what's displayed in the modal)
  // This ensures sorting matches what the user sees
  return new Date(
    asteroid.close_approach_data[0].close_approach_date_full
  ).getTime();
}

/**
 * Sort type definition matching the shop's SORT_OPTIONS
 */
export type SortOption =
  | 'None'
  | 'size-asc'
  | 'size-desc'
  | 'price-asc'
  | 'price-desc'
  | 'distance-asc'
  | 'distance-desc';

/**
 * Universal sorting function for asteroids
 * All sorting logic is centralized here for reusability and maintainability
 *
 * @param asteroids - Array of asteroids to sort
 * @param sortBy - The sorting criteria
 * @param limit - Optional limit to return only the first N asteroids
 * @returns Sorted array of asteroids
 */
export function sortAsteroids(
  asteroids: Asteroid[],
  sortBy: SortOption = 'None',
  limit?: number
): Asteroid[] {
  if (sortBy === 'None') {
    return limit ? asteroids.slice(0, limit) : [...asteroids];
  }

  const sorted = [...asteroids].sort((a, b) => {
    switch (sortBy) {
      case 'size-asc':
        return a.size - b.size;

      case 'size-desc':
        return b.size - a.size;

      case 'price-asc':
        return a.price - b.price;

      case 'price-desc':
        return b.price - a.price;

      case 'distance-asc': {
        // Soon to Later (chronological order: earliest approach date first)
        const timeA = getClosestApproachTimestamp(a);
        const timeB = getClosestApproachTimestamp(b);
        return timeA - timeB;
      }

      case 'distance-desc': {
        // Later to Soon (reverse chronological order: latest approach date first)
        const timeA = getClosestApproachTimestamp(a);
        const timeB = getClosestApproachTimestamp(b);
        return timeB - timeA;
      }

      default:
        return 0;
    }
  });

  return limit ? sorted.slice(0, limit) : sorted;
}

{
  /* Filter */
}

export type FilterState = {
  hazardous: 'all' | 'hazardous' | 'non-hazardous';
  sizeRange: [number, number]; // in whatever scale your Slider uses
  distanceRange: [number, number]; // same idea
  orbitType: string[]; // e.g. ['APO', 'AMO']
  sort: SortOption;
};

export function filterAsteroids(
  asteroids: Asteroid[],
  filters: FilterState
): Asteroid[] {
  return asteroids.filter(a => {
    // ---------------------------
    // Hazard filter
    if (
      filters.hazardous &&
      filters.hazardous.length > 0 &&
      !filters.hazardous.includes('all')
    ) {
      const hazardType = a.is_potentially_hazardous_asteroid
        ? 'hazardous'
        : 'non-hazardous';
      if (!filters.hazardous.includes(hazardType)) return false;
    }

    // ---------------------------
    // Orbit type filter
    /*if (filters.orbitType && filters.orbitType.length > 0 && !filters.orbitType.includes('all')) {
      const orbitClassType = a.orbital_data?.orbit_class?.orbit_class_type ?? '';
      if (!filters.orbitType.includes(orbitClassType)) return false;
    }*/

    // ---------------------------
    // Size filter
    /*if (filters.sizeRange) {
      const [minSize, maxSize] = filters.sizeRange;
      if (a.size < minSize || a.size > maxSize) return false;
    }*/

    // ---------------------------
    // Distance filter (by closest approach distance)
    /*if (filters.distanceRange) {
      const [minDist, maxDist] = filters.distanceRange;
      const closestDist = getClosestApproachDistance(a);
      if (closestDist < minDist || closestDist > maxDist) return false;
    }*/

    return true; // passes all filters
  });
}

export function filterAndSortAsteroids(
  asteroids: Asteroid[],
  filters: FilterState
): Asteroid[] {
  const filtered = filterAsteroids(asteroids, filters);
  return sortAsteroids(filtered, filters.sort ?? 'None');
}

// ============================================
// FORMATTING FUNCTIONS - Pure Presentation Logic
// ============================================

/**
 * Format a numeric string value with specified decimal places
 * @param value - Raw string value from API
 * @param decimals - Number of decimal places
 * @returns Formatted number string or 'N/A'
 */
export function formatNumber(
  value: string | number | undefined,
  decimals: number = 2
): string {
  if (value === undefined || value === null) return 'N/A';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return 'N/A';
  return numValue.toFixed(decimals);
}

/**
 * Format orbital parameter for display with unit
 * @param value - Raw string value from API
 * @param decimals - Number of decimal places
 * @param unit - Unit to append (e.g., 'AU', '°')
 * @returns Formatted string with unit
 */
export function formatOrbitalParameter(
  value: string | undefined,
  decimals: number = 3,
  unit: string = ''
): string {
  const formatted = formatNumber(value, decimals);
  if (formatted === 'N/A') return formatted;
  // No space for degree symbol, space for other units like 'AU'
  const separator = unit === '°' ? '' : ' ';
  return `${formatted}${unit ? `${separator}${unit}` : ''}`;
}

/**
 * Format distance in kilometers to millions of kilometers
 * @param kilometers - Distance in kilometers (string)
 * @param decimals - Number of decimal places
 * @returns Formatted string with 'M km' unit
 */
export function formatMillionKilometers(
  kilometers: string | undefined,
  decimals: number = 2
): string {
  if (!kilometers) return 'N/A';
  const km = parseFloat(kilometers);
  if (isNaN(km)) return 'N/A';
  return `${(km / 1000000).toFixed(decimals)} M km`;
}

/**
 * Get formatted orbital data for an asteroid
 * @param asteroid - The asteroid to format
 * @returns Object with formatted orbital parameters
 */
export function getFormattedOrbitalData(asteroid: Asteroid) {
  return {
    semiMajorAxis: formatOrbitalParameter(
      asteroid.orbital_data?.semi_major_axis,
      3,
      'AU'
    ),
    eccentricity: formatOrbitalParameter(
      asteroid.orbital_data?.eccentricity,
      3
    ),
    inclination: formatOrbitalParameter(
      asteroid.orbital_data?.inclination,
      2,
      '°'
    ),
    orbitClass: asteroid.orbital_data?.orbit_class.orbit_class_type || 'N/A',
    orbitDescription:
      asteroid.orbital_data?.orbit_class.orbit_class_description || 'N/A',
  };
}

/**
 * Get formatted close approach data for an asteroid
 * @param asteroid - The asteroid to format
 * @returns Object with formatted approach data
 */
export function getFormattedApproachData(asteroid: Asteroid) {
  const approach = asteroid.close_approach_data?.[0];

  if (!approach) {
    return {
      date: 'N/A',
      distanceAU: 'N/A',
      distanceKm: 'N/A',
      velocityKmPerSec: 'N/A',
    };
  }

  return {
    date: approach.close_approach_date_full,
    distanceAU: formatOrbitalParameter(
      approach.miss_distance.astronomical,
      5,
      'AU'
    ),
    distanceKm: formatMillionKilometers(approach.miss_distance.kilometers),
    velocityKmPerSec: formatOrbitalParameter(
      approach.relative_velocity.kilometers_per_second,
      2,
      'km/s'
    ),
  };
}

/**
 * Get all formatted data for an asteroid modal
 * @param asteroid - The asteroid to format
 * @returns Complete formatted data object
 */
export function getFormattedAsteroidData(asteroid: Asteroid) {
  return {
    id: asteroid.id,
    name: asteroid.name,
    hazardous: asteroid.is_potentially_hazardous_asteroid
      ? 'Hazardous'
      : 'Not Hazardous',
    diameter: formatNumber(asteroid.size, 2) + ' m',
    price: asteroid.price.toLocaleString(),
    orbital: getFormattedOrbitalData(asteroid),
    approach: getFormattedApproachData(asteroid),
    nasaUrl: asteroid.nasa_jpl_url,
  };
}

export function toggleStarred(asteroid_id: string) {
  // Call the backend mutation to toggle starred status
  return client.mutate({
    mutation: gql`
      mutation ToggleStarredAsteroid($asteroidId: String!) {
        toggleStarredAsteroid(asteroidId: $asteroidId)
      }
    `,
    variables: { asteroidId: asteroid_id },
  });
}

const ADD_TO_CART = gql`
  mutation AddToCart($asteroidId: String!) {
    addToCart(asteroidId: $asteroidId)
  }
`;

export function addToCart(asteroid_id: string): Promise<boolean> {
  // call the backend using graphql mutation to add to cart
  console.log('Adding to cart:', asteroid_id);
  return client
    .mutate({
      mutation: ADD_TO_CART,
      variables: { asteroidId: asteroid_id },
    })
    .then(response => {
      console.log('Add to cart response:', response);
      return true;
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      return false;
    });
}

const REMOVE_FROM_CART = gql`
  mutation removeFromCart($asteroidId: String!) {
    removeFromCart(asteroidId: $asteroidId)
  }
`;

export function removeFromCart(asteroid_id: string): Promise<boolean> {
  // call the backend using graphql mutation to remove from cart
  console.log('Removing from cart:', asteroid_id);
  return client
    .mutate({
      mutation: REMOVE_FROM_CART,
      variables: { asteroidId: asteroid_id },
    })
    .then(response => {
      console.log('Remove from cart response:', response);
      return true;
    })
    .catch(error => {
      console.error('Error removing from cart:', error);
      return false;
    });
}

const CHECKOUT_CART = gql`
  mutation CheckoutCart {
    checkoutCart {
      success
      message
    }
  }
`;

export type CheckoutResult = {
  success: boolean;
  message: string | null;
};

export function checkoutCart(): Promise<CheckoutResult> {
  // call the backend using graphql mutation to checkout cart
  console.log('Checking out cart');
  return client
    .mutate<{ checkoutCart: CheckoutResult }>({
      mutation: CHECKOUT_CART,
    })
    .then(response => {
      console.log('Checkout cart response:', response);
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
      console.error('Error checking out cart:', error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to checkout cart',
      };
    });
}
