import axios from 'axios';
import { Asteroid } from '../models/Asteroid.js';
import { CacheMetadata } from '../models/CacheMetadata.js';

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_API_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

/**
 * Calculate price based on asteroid properties
 * @param {Object} asteroid - Asteroid data from NASA API
 * @returns {number} Calculated price
 */
function calculateAsteroidPrice(asteroid) {
  const basePrice = 1000;
  const diameterFactor =
    asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 1;
  const hazardMultiplier = asteroid.is_potentially_hazardous_asteroid
    ? 1.5
    : 1.0;
  const magnitudeFactor = Math.abs(asteroid.absolute_magnitude_h || 20);

  return Math.round(
    basePrice * diameterFactor * hazardMultiplier * (magnitudeFactor / 10)
  );
}

/**
 * Calculate size category based on diameter
 * @param {Object} asteroid - Asteroid data
 * @returns {number} Size category (1-5)
 */
function calculateSize(asteroid) {
  const diameter =
    asteroid.estimated_diameter?.kilometers?.estimated_diameter_max || 0;

  if (diameter < 0.1) return 1;
  if (diameter < 0.5) return 2;
  if (diameter < 1.0) return 3;
  if (diameter < 5.0) return 4;
  return 5;
}

/**
 * Fetch asteroid data from NASA API
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of asteroid objects
 */
export async function fetchFromNASA(startDate, endDate) {
  try {
    console.log(
      `🚀 Fetching asteroids from NASA API: ${startDate} to ${endDate}`
    );

    const response = await axios.get(`${NASA_API_BASE_URL}/feed`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        api_key: NASA_API_KEY,
      },
    });

    // Flatten the near_earth_objects structure
    const neo = response.data.near_earth_objects;
    const asteroids = [];

    for (const date in neo) {
      asteroids.push(...neo[date]);
    }

    console.log(`✅ Fetched ${asteroids.length} asteroids from NASA API`);
    return asteroids;
  } catch (error) {
    console.error('❌ Error fetching from NASA API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * Fetch detailed orbital data for a specific asteroid
 * @param {string} asteroidId - NASA asteroid ID
 * @returns {Promise<Object>} Orbital data
 */
export async function fetchAsteroidDetails(asteroidId) {
  try {
    const response = await axios.get(`${NASA_API_BASE_URL}/neo/${asteroidId}`, {
      params: {
        api_key: NASA_API_KEY,
      },
    });

    return response.data.orbital_data;
  } catch (error) {
    console.error(
      `❌ Error fetching details for asteroid ${asteroidId}:`,
      error.message
    );
    return null;
  }
}

/**
 * Transform NASA API data to our database format with shop-specific fields
 * @param {Object} nasaAsteroid - Raw asteroid data from NASA
 * @param {Object} orbitalData - Orbital data from detailed endpoint
 * @returns {Object} Transformed asteroid object
 */
function transformAsteroidData(nasaAsteroid, orbitalData = null) {
  return {
    id: nasaAsteroid.id,
    neo_reference_id: nasaAsteroid.neo_reference_id,
    name: nasaAsteroid.name,
    nasa_jpl_url: nasaAsteroid.nasa_jpl_url,
    absolute_magnitude_h: nasaAsteroid.absolute_magnitude_h,
    estimated_diameter: nasaAsteroid.estimated_diameter,
    is_potentially_hazardous_asteroid:
      nasaAsteroid.is_potentially_hazardous_asteroid,
    close_approach_data: nasaAsteroid.close_approach_data,
    is_sentry_object: nasaAsteroid.is_sentry_object,
    orbital_data: orbitalData,
    price: calculateAsteroidPrice(nasaAsteroid),
    size: calculateSize(nasaAsteroid),
  };
}

/**
 * Cache asteroids data from NASA API to MongoDB
 * Fetches data for 1 month from today
 * @returns {Promise<Object>} Result with count and status
 */
export async function cacheAsteroidsData() {
  try {
    console.log('🔄 Starting asteroid data caching process...');

    // Update cache metadata to in_progress
    await CacheMetadata.findOneAndUpdate(
      { key: 'asteroids_feed' },
      {
        key: 'asteroids_feed',
        status: 'in_progress',
        lastUpdated: new Date(),
      },
      { upsert: true }
    );

    // Calculate date range (today + 1 month)
    const today = new Date();
    const finalEndDate = new Date(today);
    finalEndDate.setDate(finalEndDate.getDate() + 30); // 1 month = 30 days

    // Fetch data in 7-day chunks (NASA API limit)
    const allAsteroids = [];
    let currentStart = new Date(today);

    while (currentStart < finalEndDate) {
      const currentEnd = new Date(currentStart);
      currentEnd.setDate(currentEnd.getDate() + 6); // 7 days inclusive (start + 6 days)

      // Don't exceed the final end date
      if (currentEnd > finalEndDate) {
        currentEnd.setTime(finalEndDate.getTime());
      }

      const startDateStr = currentStart.toISOString().split('T')[0];
      const endDateStr = currentEnd.toISOString().split('T')[0];

      console.log(`📅 Fetching chunk: ${startDateStr} to ${endDateStr}`);

      // Fetch from NASA API
      const nasaAsteroids = await fetchFromNASA(startDateStr, endDateStr);
      allAsteroids.push(...nasaAsteroids);

      // Move to next chunk
      currentStart.setDate(currentStart.getDate() + 7);
    }

    console.log(
      `✅ Total asteroids fetched from all chunks: ${allAsteroids.length}`
    );

    // Transform and save to database
    let successCount = 0;
    let errorCount = 0;

    for (const nasaAsteroid of allAsteroids) {
      try {
        // Fetch detailed orbital data
        const orbitalData = await fetchAsteroidDetails(nasaAsteroid.id);

        const transformedData = transformAsteroidData(
          nasaAsteroid,
          orbitalData
        );

        // Upsert asteroid data (update and insert) ??
        await Asteroid.findOneAndUpdate(
          { id: transformedData.id },
          transformedData,
          {
            upsert: true,
            new: true,
          }
        );

        successCount++;
      } catch (error) {
        console.error(
          `❌ Error saving asteroid ${nasaAsteroid.id}:`,
          error.message
        );
        errorCount++;
      }
    }

    // Update cache metadata
    await CacheMetadata.findOneAndUpdate(
      { key: 'asteroids_feed' },
      {
        status: 'success',
        lastUpdated: new Date(),
        recordCount: successCount,
        errorMessage: errorCount > 0 ? `${errorCount} errors occurred` : null,
      }
    );

    console.log(
      `✅ Caching completed: ${successCount} asteroids saved, ${errorCount} errors`
    );

    return {
      success: true,
      count: successCount,
      errors: errorCount,
    };
  } catch (error) {
    console.error('❌ Error in cacheAsteroidsData:', error.message);

    // Update cache metadata to failed
    await CacheMetadata.findOneAndUpdate(
      { key: 'asteroids_feed' },
      {
        status: 'failed',
        lastUpdated: new Date(),
        errorMessage: error.message,
      }
    );

    throw error;
  }
}

/**
 * Get asteroids from database or fetch from API if cache is empty
 * @returns {Promise<Array>} Array of asteroids
 */
export async function getAsteroids() {
  try {
    // Check if we have cached data
    const count = await Asteroid.countDocuments();

    if (count === 0) {
      console.log('⚠️  No cached data found. Fetching from NASA API...');
      await cacheAsteroidsData();
    }

    // Return all asteroids from database
    const asteroids = await Asteroid.find().lean();
    return asteroids;
  } catch (error) {
    console.error('❌ Error getting asteroids:', error.message);
    throw error;
  }
}

/**
 * Get a single asteroid by ID
 * @param {string} asteroidId - Asteroid ID
 * @returns {Promise<Object>} Asteroid object
 */
export async function getAsteroidById(asteroidId) {
  try {
    let asteroid = await Asteroid.findOne({ id: asteroidId }).lean();

    // If not in cache, try to fetch from NASA
    if (!asteroid) {
      console.log(
        `⚠️  Asteroid ${asteroidId} not in cache. Fetching from NASA...`
      );

      const response = await axios.get(
        `${NASA_API_BASE_URL}/neo/${asteroidId}`,
        {
          params: { api_key: NASA_API_KEY },
        }
      );

      const nasaAsteroid = response.data;
      const transformedData = transformAsteroidData(
        nasaAsteroid,
        nasaAsteroid.orbital_data
      );

      // Save to database
      asteroid = await Asteroid.findOneAndUpdate(
        { id: transformedData.id },
        transformedData,
        { upsert: true, new: true }
      ).lean();
    }

    return asteroid;
  } catch (error) {
    console.error(`❌ Error getting asteroid ${asteroidId}:`, error.message);
    throw error;
  }
}
