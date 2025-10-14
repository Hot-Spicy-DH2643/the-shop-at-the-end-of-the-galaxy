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

export type shopAsteroid = Asteroid & {
  price: number;
  ownership_id: string | null;
  starred_asteroid_ids: boolean;
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

export type UserData = {
  uid: string;
  name: string;
  coins: number;
  owned_asteroid_ids: string[];
  starred_asteroid_ids: string[];
  followers: Friend[];
  following: Friend[];
  cart_asteroid_ids: string[];
};

export type AppState = {
  userData: UserData | null;
  viewedProfile: UserData | null;
  asteroids: shopAsteroid[];
  loading: boolean;
  error: string | null;
  selectedAsteroidId: string | null;
  // Pagination state
  currentPage: number;
  totalPages: number;
  totalCount: number;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAsteroids: (page?: number) => Promise<void>;
  setSelectedAsteroidId: (id: string | null) => void;
  setUserData: () => Promise<void>;
  setViewedProfile: (uid: string) => Promise<void>;
};

// GraphQL query to fetch asteroids with pagination
const GET_ASTEROIDS = gql`
  query GetAsteroids($page: Int, $pageSize: Int) {
    asteroids(page: $page, pageSize: $pageSize) {
      asteroids {
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
    asteroids: (Asteroid & { price: number; size: number })[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export const DEFAULT_PAGE_SIZE = 24;

export interface AsteroidsResult {
  asteroids: shopAsteroid[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export async function fetchAsteroids(
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE
): Promise<AsteroidsResult> {
  try {
    const { data } = await client.query<AsteroidsResponse>({
      query: GET_ASTEROIDS,
      variables: { page, pageSize },
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

    // Transform backend data to include frontend-specific fields
    const asteroids: shopAsteroid[] = data.asteroids.asteroids.map(
      asteroid => ({
        ...asteroid,
        ownership_id: null, // TODO: Get from user data
        starred_asteroid_ids: false, // TODO: Get from user data
      })
    );

    return {
      asteroids,
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

const GET_USER_BY_ID = gql`
  query GetUserById($uid: String!) {
    user(uid: $uid) {
      uid
      name
      coins
      owned_asteroid_ids
      starred_asteroid_ids
      followers {
        uid
        name
      }
      following {
        uid
        name
      }
      cart_asteroid_ids
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

// ============================================
// SORTING FUNCTIONS - Pure Business Logic
// ============================================

/**
 * Helper function to get the closest approach distance from Earth for an asteroid
 * Currently unused, but kept for future reference if physical distance sorting is needed
 * @param asteroid - The asteroid to analyze
 * @returns Distance in kilometers, or Infinity if no data
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getClosestApproachDistance(asteroid: shopAsteroid): number {
  if (
    !asteroid.close_approach_data ||
    asteroid.close_approach_data.length === 0
  ) {
    return Infinity;
  }

  // Find the approach with minimum distance to Earth
  const closestApproach = asteroid.close_approach_data.reduce(
    (closest, current) => {
      const currentDist = parseFloat(current.miss_distance.kilometers);
      const closestDist = parseFloat(closest.miss_distance.kilometers);
      return currentDist < closestDist ? current : closest;
    }
  );

  return parseFloat(closestApproach.miss_distance.kilometers);
}

/**
 * Helper function to get the time difference from now to closest approach date
 * @param asteroid - The asteroid to analyze
 * @returns Absolute time difference in milliseconds, or Infinity if no data
 */
function getClosestApproachTimeDiff(asteroid: shopAsteroid): number {
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
  asteroids: shopAsteroid[],
  sortBy: SortOption = 'None',
  limit?: number
): shopAsteroid[] {
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
