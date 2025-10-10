'use client';

import axios from 'axios';

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
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAsteroids: () => Promise<void>;
  setUser: (userId: string) => Promise<void>;
};

interface FakeDataResponse {
  near_earth_objects: {
    [date: string]: shopAsteroid[];
  };
}

export async function fetchAsteroids(): Promise<shopAsteroid[]> {
  try {
    const response = await axios.get<FakeDataResponse>('/fakedata.json');

    // Combine all arrays from near_earth_objects into one array
    const neo = response.data.near_earth_objects;
    const allAsteroids: shopAsteroid[] = Object.values(neo).flat();

    return allAsteroids;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

export async function fetchUser(userId: string): Promise<User | null> {
  //will use userID later with GraphQL
  console.log('userId is: ', userId);

  //using fake user data for now
  const baseUrl = 'http://localhost:3000';

  try {
    const response = await axios.get<User>(`${baseUrl}/userFakeData.json`);
    if (!response.status) throw new Error('Failed to fetch');

    const user: User = await response.data;

    console.log(user);

    return user;
  } catch (error) {
    throw error;
  }
}
