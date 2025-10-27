'use client';

import type { Asteroid, UIFilters, BackendFilters } from '../types';

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