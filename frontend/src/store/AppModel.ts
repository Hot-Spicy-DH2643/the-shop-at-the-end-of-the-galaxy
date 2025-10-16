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
}

type Owner = {
  uid: string;
  name: string;
};

export type ShopAsteroid = Asteroid & {
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
};

type Friend = {
  uid: string;
  name: string;
};

type UserAsteriod = {
  id: string;
  name: string;
  is_potentially_hazardous_asteroid: boolean;
  price: number;
  size: number;
};

export type UserData = {
  uid: string;
  name: string;
  coins: number;
  owned_asteroids: UserAsteriod[];
  starred_asteroids: UserAsteriod[];
  followers: Friend[];
  following: Friend[];
  cart_asteroids: UserAsteriod[];
};

export type AppState = {
  userData: UserData | null;
  viewedProfile: UserData | null;
  asteroids: ShopAsteroid[];
  loading: boolean;
  error: string | null;
  selectedAsteroidId: string | null;
  // Pagination state
  currentPage: number;
  totalPages: number;
  totalCount: number;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAsteroids: (page?: number, filters?: BackendFilters) => Promise<void>;
  setSelectedAsteroidId: (id: string | null) => void;
  setUserData: () => Promise<void>;
  updateProfileData: (newName: string) => void;

  cart: ShopAsteroid[];
  addToCart: (asteroid: ShopAsteroid) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  setViewedProfile: (uid: string) => Promise<void>;

  addToStarredAsteroids: (asteroid_id: string) => void;
  deleteFromStarredAsteroids: (asteroid_id: string) => void;
};

// GraphQL query to fetch asteroids with pagination
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
    asteroids: ShopAsteroid[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export const DEFAULT_PAGE_SIZE = 24;

export interface AsteroidsResult {
  asteroids: ShopAsteroid[];
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
      }
    }
  }
`;

export async function fetchAsteroidById(
  id: string
): Promise<ShopAsteroid | null> {
  try {
    const { data } = await client.query<{ asteroid: ShopAsteroid }>({
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
  mutation FollowUser($followerUid: String!, $targetUid: String!) {
    followUser(followerUid: $followerUid, targetUid: $targetUid) {
      uid
      name
      followers {
        uid
        name
      }
      following {
        uid
        name
      }
    }
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($followerUid: String!, $targetUid: String!) {
    unfollowUser(followerUid: $followerUid, targetUid: $targetUid) {
      uid
      name
      followers {
        uid
        name
      }
      following {
        uid
        name
      }
    }
  }
`;

export async function fetchUserData(uid: string): Promise<UserData | null> {
  try {
    const { data } = await client.query<{ user: UserData }>({
      query: GET_USER_BY_ID,
      variables: { uid },
      fetchPolicy: 'network-only',
    });

    if (!data || !data.user) {
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

// ============================================
// SORTING FUNCTIONS - Pure Business Logic
// ============================================

/**
 * Helper function to get the time difference from now to closest approach date
 * @param asteroid - The asteroid to analyze
 * @returns Absolute time difference in milliseconds, or Infinity if no data
 */
function getClosestApproachTimeDiff(asteroid: ShopAsteroid): number {
  const now = new Date().getTime();

  if (
    !asteroid.close_approach_data ||
    asteroid.close_approach_data.length === 0
  ) {
    return Infinity;
  }

  // Find the approach date closest to now (absolute time difference)
  const closestApproach = asteroid.close_approach_data.reduce(
    (closest, current) => {
      const currentDate = new Date(current.close_approach_date_full).getTime();
      const closestDate = new Date(closest.close_approach_date_full).getTime();

      const currentDiff = Math.abs(currentDate - now);
      const closestDiff = Math.abs(closestDate - now);

      return currentDiff < closestDiff ? current : closest;
    }
  );

  return Math.abs(
    new Date(closestApproach.close_approach_date_full).getTime() - now
  );
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
  asteroids: ShopAsteroid[],
  sortBy: SortOption = 'None',
  limit?: number
): ShopAsteroid[] {
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
        // Near to far (by time - closest approach date to now)
        const timeA = getClosestApproachTimeDiff(a);
        const timeB = getClosestApproachTimeDiff(b);
        return timeA - timeB;
      }

      case 'distance-desc': {
        // Far to near (by time - furthest approach date from now)
        const timeA = getClosestApproachTimeDiff(a);
        const timeB = getClosestApproachTimeDiff(b);
        return timeB - timeA;
      }

      default:
        return 0;
    }
  });

  return limit ? sorted.slice(0, limit) : sorted;
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
export function getFormattedOrbitalData(asteroid: ShopAsteroid) {
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
export function getFormattedApproachData(asteroid: ShopAsteroid) {
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
export function getFormattedAsteroidData(asteroid: ShopAsteroid) {
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
