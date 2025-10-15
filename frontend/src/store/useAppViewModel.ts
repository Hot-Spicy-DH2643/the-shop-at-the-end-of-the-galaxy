'use client';

import { create } from 'zustand';
import type { AppState } from './AppModel';
import {
  fetchAsteroids,
  fetchUserData,
  DEFAULT_PAGE_SIZE,
  sortAsteroids,
  type SortOption,
  filterAndSortAsteroids,
  type FilterState,
  shopAsteroid,
  getFormattedAsteroidData,
} from './AppModel';
import { useAsteroidViewers } from '@/hooks/useAsteroidViewers';

const useAppStore = create<AppState>(set => ({
  loading: false,
  error: null,
  userData: null,
  asteroids: [],
  selectedAsteroidId: null,
  currentPage: 1,
  totalPages: 0,
  totalCount: 0,
  setSelectedAsteroidId: (id: string | null) => set({ selectedAsteroidId: id }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setAsteroids: async (page: number = 1) => {
    try {
      set({ loading: true, error: null });
      // Fetch asteroids from GraphQL backend with pagination
      // Price and size are now calculated server-side
      const result = await fetchAsteroids(page, DEFAULT_PAGE_SIZE);
      set({
        asteroids: result.asteroids,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
        loading: false,
      });
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

// =========================
//  CUSTOM HOOKS

{
  /* Sorting */
}
export function useSortedAsteroids(
  sortBy: SortOption = 'None', // sorting criteria (e.g., 'price-asc', 'size-desc', etc.)
  limit?: number // limit to return only the first N asteroids
) {
  const asteroids = useAppStore(state => state.asteroids);
  return sortAsteroids(asteroids, sortBy, limit);
}

// custom hook specifically for the landing/home page
export function useAsteroidsSortedByClosestApproach(limit?: number) {
  const asteroids = useAppStore(state => state.asteroids);
  return sortAsteroids(asteroids, 'distance-asc', limit);
}

{
  /* Filtering */
}
export function useFilteredAsteroids(filters: FilterState) {
  const asteroids = useAppStore(state => state.asteroids);
  return filterAndSortAsteroids(asteroids, filters);
}

// =========================
//  EVENT HANDLERS

export function onHandleProductClick(id: string) {
  // open the product modal component with detailed info
  useAppStore.getState().setSelectedAsteroidId(id);
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

// =========================
//  ASTEROID MODAL VIEWMODEL

/**
 * Manages the business logic and state for displaying asteroid details
 */
export function useAsteroidModalViewModel(asteroid: shopAsteroid) {
  const formatted = getFormattedAsteroidData(asteroid);

  const { viewerCount, isConnected, isLoading } = useAsteroidViewers(
    asteroid.id
  );

  const viewerText = isLoading
    ? 'Loading viewer count...'
    : viewerCount === 1
      ? '1 explorer eyeing this right now'
      : `${viewerCount} explorers eyeing this right now`;

  const handleAddToCalendar = () => {
    const approach = asteroid.close_approach_data?.[0];
    if (!approach) return;

    const startDate = new Date(approach.close_approach_date_full);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    // Detect if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      const formatDateForICS = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//The Shop at the End of the Galaxy//EN',
        'BEGIN:VEVENT',
        `DTSTART:${formatDateForICS(startDate)}`,
        `DTEND:${formatDateForICS(endDate)}`,
        `SUMMARY:Asteroid ${asteroid.name} Close Approach`,
        `DESCRIPTION:Asteroid ${asteroid.name} will pass Earth at a distance of ${formatted.approach.distanceAU} (${formatted.approach.distanceKm}) traveling at ${formatted.approach.velocityKmPerSec}.\\n\\nMore info: ${asteroid.nasa_jpl_url}`,
        `URL:${asteroid.nasa_jpl_url}`,
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([icsContent], {
        type: 'text/calendar;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `asteroid-${asteroid.name.replace(/[^a-z0-9]/gi, '_')}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Google Calendar for desktop
      const formatDateForCalendar = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const calendarUrl = new URL(
        'https://calendar.google.com/calendar/render'
      );
      calendarUrl.searchParams.append('action', 'TEMPLATE');
      calendarUrl.searchParams.append(
        'text',
        `Asteroid ${asteroid.name} Close Approach`
      );
      calendarUrl.searchParams.append(
        'details',
        `Asteroid ${asteroid.name} will pass Earth at a distance of ${formatted.approach.distanceAU} (${formatted.approach.distanceKm}) traveling at ${formatted.approach.velocityKmPerSec}.\n\nMore info: ${asteroid.nasa_jpl_url}`
      );
      calendarUrl.searchParams.append(
        'dates',
        `${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}`
      );

      window.open(calendarUrl.toString(), '_blank', 'noopener,noreferrer');
    }
  };

  return {
    formatted,
    viewerCount,
    isConnected,
    isLoading,
    viewerText,
    handleAddToCalendar,
  };
}

export { useAppStore };
export type { SortOption, FilterState };
