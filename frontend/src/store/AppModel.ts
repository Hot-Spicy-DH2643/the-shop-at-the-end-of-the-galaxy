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
  is_starred: boolean;
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
  id: string;
  name: string;
  username: string;
  email: string;
};

export type UserData = {
  id: number;
  name: string;
  username: string;
  email: string;
  coins: number;
  owned_asteroids: string[];
  favorite_asteroids: string[];
  friends: Friend[];
};

export type AppState = {
  userData: UserData | null;
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
        is_starred: false, // TODO: Get from user data
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

export async function fetchUserData(): Promise<UserData | null> {
  // will auto carry cookie when using graphql

  //using fake user data for now
  const baseUrl = 'http://localhost:3000';

  try {
    const response = await fetch(`${baseUrl}/userFakeData.json`);
    if (!response.ok) throw new Error('Failed to fetch');

    const userData: UserData = await response.json();

    console.log(userData);

    return userData;
  } catch (error) {
    throw error;
  }
}
