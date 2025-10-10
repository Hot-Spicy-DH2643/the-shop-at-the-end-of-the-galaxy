'use client';

import { create } from 'zustand';
import type { AppState } from './AppModel';
import { fetchAsteroids, fetchUser } from './AppModel';
import type { shopAsteroid } from './AppModel';
import { use } from 'react';

export function generateAsteroidPrice(
  asteroid: shopAsteroid,
  now = new Date()
): number {
  //   const clampBetween0and1 = (value: number) => Math.max(0, Math.min(1, value));
  //   const toNumber = (value: unknown, fallback = 0) => {
  //     const num =
  //       typeof value === 'string'
  //         ? parseFloat(value)
  //         : typeof value === 'number'
  //           ? value
  //           : NaN;
  //     return Number.isFinite(num) ? num : fallback;
  //   };

  //   const getAverageDiameterKm = () => {
  //     const diameter = asteroid.estimated_diameter?.kilometers;
  //     const minDiameter = toNumber(diameter?.estimated_diameter_min, 0.05);
  //     const maxDiameter = toNumber(diameter?.estimated_diameter_max, minDiameter);
  //     return (minDiameter + maxDiameter) / 2;
  //   };

  //   const parseDate = (dateStr?: string) =>
  //     dateStr ? new Date(dateStr) : undefined;

  //   const getUpcomingCloseApproachDate = () => {
  //     const approaches = asteroid.close_approach_data || [];
  //     const approachDates = approaches
  //       .map(
  //         c =>
  //           parseDate(c.close_approach_date_full) ??
  //           parseDate(c.close_approach_date)
  //       )
  //       .filter(Boolean) as Date[];
  //     approachDates.sort((a, b) => a.getTime() - b.getTime());
  //     const future = approachDates.find(date => date >= now);
  //     return future ?? approachDates.at(-1);
  //   };

  //   // Deterministic RNG helpers
  //   const hashStringToInt = (s: string) => {
  //     let h = 2166136261;
  //     for (let i = 0; i < s.length; i++) {
  //       h ^= s.charCodeAt(i);
  //       h = Math.imul(h, 16777619);
  //     }
  //     return h >>> 0;
  //   };
  //   const mulberry32 = (seed: number) => () => {
  //     let t = (seed += 0x6d2b79f5);
  //     t = Math.imul(t ^ (t >>> 15), t | 1);
  //     t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  //     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  //   };

  //   const averageDiameterKm = getAverageDiameterKm();
  //   const sizeFactor = clampBetween0and1(
  //     Math.log10(1 + averageDiameterKm * 100) / 2
  //   );

  //   const absoluteMagnitudeH = toNumber(asteroid.absolute_magnitude_h, 22);
  //   const brightnessFactor = clampBetween0and1((25 - absoluteMagnitudeH) / 10);

  //   const orbitClassType = (
  //     asteroid.orbital_data?.orbit_class?.orbit_class_type || ''
  //   ).toUpperCase();
  //   const rarityFactor = orbitClassType.startsWith('AMO')
  //     ? 0.8
  //     : orbitClassType.startsWith('ATE')
  //       ? 0.7
  //       : orbitClassType.startsWith('APO')
  //         ? 0.6
  //         : 0.6;

  //   const upcomingApproachDate = getUpcomingCloseApproachDate();
  //   const daysUntilApproach = upcomingApproachDate
  //     ? (upcomingApproachDate.getTime() - now.getTime()) / 86_400_000
  //     : 365;
  //   const hypeFactor = clampBetween0and1(
  //     Math.exp(-Math.abs(daysUntilApproach) / 180)
  //   );

  //   const moidAu =
  //     toNumber(asteroid.orbital_data?.moid_au) ||
  //     toNumber(asteroid.orbital_data?.moid);
  //   const inclinationDegrees = toNumber(asteroid.orbital_data?.inclination, 10);
  //   const moidDifficulty = 1 - clampBetween0and1(moidAu / 0.5); // close = harder
  //   const inclinationDifficulty = clampBetween0and1(inclinationDegrees / 30); // higher = harder
  //   const accessibilityFactor = clampBetween0and1(
  //     0.6 * moidDifficulty + 0.4 * inclinationDifficulty
  //   );

  //   const nextApproachVelocityKps = upcomingApproachDate
  //     ? toNumber(
  //         (asteroid.close_approach_data || []).find(
  //           c =>
  //             (c.close_approach_date_full &&
  //               new Date(c.close_approach_date_full).getTime() ===
  //                 upcomingApproachDate.getTime()) ||
  //             (c.close_approach_date &&
  //               new Date(c.close_approach_date).getTime() ===
  //                 upcomingApproachDate.getTime())
  //         )?.relative_velocity?.kilometers_per_second,
  //         10
  //       )
  //     : 10;
  //   const velocityFactor = clampBetween0and1((nextApproachVelocityKps - 5) / 30);

  //   const hazardFactor = asteroid.is_potentially_hazardous_asteroid ? 1 : 0;

  //   const rng = mulberry32(
  //     hashStringToInt(asteroid.neo_reference_id || asteroid.name || 'neo')
  //   );
  //   const randomnessFactor = rng();

  //   const weights = {
  //     size: 0.25,
  //     brightness: 0.1,
  //     rarity: 0.1,
  //     hype: 0.15,
  //     accessibility: 0.15,
  //     velocity: 0.1,
  //     hazard: 0.1,
  //     randomness: 0.03,
  //   } as const;

  //   const weightedScore =
  //     weights.size * sizeFactor +
  //     weights.brightness * brightnessFactor +
  //     weights.rarity * rarityFactor +
  //     weights.hype * hypeFactor +
  //     weights.accessibility * accessibilityFactor +
  //     weights.velocity * velocityFactor +
  //     weights.hazard * hazardFactor +
  //     weights.randomness * randomnessFactor;

  //   // All prices are between 100 and 900 CosmoCoins
  //   const price = 100 + Math.round(800 * clampBetween0and1(weightedScore));
  //   return price;
  return 100;
}

function calculateAverageDiameterM(asteroid: shopAsteroid): number {
  const { estimated_diameter } = asteroid;
  const min = estimated_diameter.kilometers.estimated_diameter_min;
  const max = estimated_diameter.kilometers.estimated_diameter_max;
  return ((min + max) / 2) * 1000; // convert to meters
}

export function onHandleProductClick(id: string) {
  // should open the product modal component with detailed info
  useAppStore.getState().setSelectedAsteroidId(id);
}

export function onHandleStarred(id: string) {
  // should toggle the starred status of the asteroid - and add to/remove from favorites??
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
        price: generateAsteroidPrice(asteroid), // Assign a random price between 100 and 900
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
  setUser: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const userData = await fetchUser(userId);
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
