'use client';

import { create } from 'zustand';
import type { AppState } from './AppModel';
import { fetchAsteroids, fetchUserData } from './AppModel';
import type { shopAsteroid } from './AppModel';
import { use } from 'react';

//Antonio can change this to a fixed price calculation if needed
function generateRandomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateAverageDiameterM(asteroid: shopAsteroid): number {
  const { estimated_diameter } = asteroid;
  const min = estimated_diameter.kilometers.estimated_diameter_min;
  const max = estimated_diameter.kilometers.estimated_diameter_max;
  return ((min + max) / 2) * 1000; // convert to meters
}

export function fetchOrbitalData(id: string) {
  //const response = await axios.get("https://api.nasa.gov/neo/rest/v1/neo/" + {id} + "api_key=" + process.env.SARA_NASA_API_KEY);
  //return response.data; 
}

export function onHandleProductClick(id: string) {
  // open the product modal component with detailed info
  useAppStore.getState().setSelectedAsteroidId(id);
  
  // also get the orbital data using the fetch
  /*fetchOrbitalData(id).then(orbitalData => {
    useAppStore.setState(state => ({
      asteroids: state.asteroids.map(asteroid =>
        asteroid.id === id ?
          { ...asteroid, orbital_data: orbitalData } : asteroid
      ),
    }));
  });*/
}

export function onHandleStarred(id: string) {
  // toggle the starred status of the asteroid - and add to/remove from favorites??
  useAppStore.setState(state => {
    const updatedAsteroids = state.asteroids.map(asteroid =>
      asteroid.id === id
        ? { ...asteroid, is_starred: !asteroid.is_starred }
        : asteroid
    );
    return { asteroids: updatedAsteroids };
  });
}





const useAppStore = create<AppState>(set => ({
  loading: false,
  error: null,
  userData: null,
  asteroids: [],
  selectedAsteroidId: null,
  setSelectedAsteroidId: (id: string | null) => set({ selectedAsteroidId: id }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setAsteroids: async () => {
    try {
      set({ loading: true, error: null });
      let asteroids = await fetchAsteroids();
      asteroids = asteroids.map(asteroid => ({
        ...asteroid,
        price: generateRandomPrice(100, 1000), // Assign a random price between 100 and 1000
        size: calculateAverageDiameterM(asteroid), // Calculate average diameter in meters
        ownership_id: null,
        is_starred: false,
      }));
      set({ asteroids, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : 'Failed to fetch asteroids',
        loading: false,
      });
    }
  },
  setUserData: async () => {
    try {
      set({ loading: true, error: null });
      const userData = await fetchUserData();
      if (userData) {
        set({ userData, loading: false });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch user',
        loading: false,
      });
    }
  },
}));

export { useAppStore };
