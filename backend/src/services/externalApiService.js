import axios from 'axios';
import { Asteroid } from '../models/Asteroid.js';
import { User } from '../models/User.js';
import { CacheMetadata } from '../models/CacheMetadata.js';

const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_API_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

/**
 * Calculate price based on asteroid properties
 * @param {Object} asteroid - Asteroid data from NASA API
 * @returns {number} Calculated price
 */
export function calculateAsteroidPrice(asteroid) {
  const now = new Date();
  const clampBetween0and1 = value => Math.max(0, Math.min(1, value));
  const toNumber = (value, fallback = 0) => {
    const num =
      typeof value === 'string'
        ? parseFloat(value)
        : typeof value === 'number'
          ? value
          : NaN;
    return Number.isFinite(num) ? num : fallback;
  };

  const getAverageDiameterKm = () => {
    const diameter = asteroid.estimated_diameter?.kilometers;
    const minDiameter = toNumber(diameter?.estimated_diameter_min, 0.05);
    const maxDiameter = toNumber(diameter?.estimated_diameter_max, minDiameter);
    return (minDiameter + maxDiameter) / 2;
  };

  const parseDate = dateStr => (dateStr ? new Date(dateStr) : undefined);

  const getUpcomingCloseApproachDate = () => {
    const approaches = asteroid.close_approach_data || [];
    const approachDates = approaches
      .map(
        c =>
          parseDate(c.close_approach_date_full) ??
          parseDate(c.close_approach_date)
      )
      .filter(Boolean);
    approachDates.sort((a, b) => a.getTime() - b.getTime());
    const future = approachDates.find(date => date >= now);
    return future ?? approachDates.at(-1);
  };

  // Deterministic RNG helpers
  const hashStringToInt = s => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };
  const mulberry32 = seed => () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const averageDiameterKm = getAverageDiameterKm();
  const sizeFactor = clampBetween0and1(
    Math.log10(1 + averageDiameterKm * 100) / 2
  );

  const absoluteMagnitudeH = toNumber(asteroid.absolute_magnitude_h, 22);
  const brightnessFactor = clampBetween0and1((25 - absoluteMagnitudeH) / 10);

  const orbitClassType = (
    asteroid.orbital_data?.orbit_class?.orbit_class_type || ''
  ).toUpperCase();
  const rarityFactor = orbitClassType.startsWith('AMO')
    ? 0.8
    : orbitClassType.startsWith('ATE')
      ? 0.7
      : orbitClassType.startsWith('APO')
        ? 0.6
        : 0.6;

  const upcomingApproachDate = getUpcomingCloseApproachDate();
  const daysUntilApproach = upcomingApproachDate
    ? (upcomingApproachDate.getTime() - now.getTime()) / 86_400_000
    : 365;
  const hypeFactor = clampBetween0and1(
    Math.exp(-Math.abs(daysUntilApproach) / 180)
  );

  const moidAu =
    toNumber(asteroid.orbital_data?.moid_au) ||
    toNumber(asteroid.orbital_data?.moid);
  const inclinationDegrees = toNumber(asteroid.orbital_data?.inclination, 10);
  const moidDifficulty = 1 - clampBetween0and1(moidAu / 0.5); // close = harder
  const inclinationDifficulty = clampBetween0and1(inclinationDegrees / 30); // higher = harder
  const accessibilityFactor = clampBetween0and1(
    0.6 * moidDifficulty + 0.4 * inclinationDifficulty
  );

  const nextApproachVelocityKps = upcomingApproachDate
    ? toNumber(
        (asteroid.close_approach_data || []).find(
          c =>
            (c.close_approach_date_full &&
              new Date(c.close_approach_date_full).getTime() ===
                upcomingApproachDate.getTime()) ||
            (c.close_approach_date &&
              new Date(c.close_approach_date).getTime() ===
                upcomingApproachDate.getTime())
        )?.relative_velocity?.kilometers_per_second,
        10
      )
    : 10;
  const velocityFactor = clampBetween0and1((nextApproachVelocityKps - 5) / 30);

  const hazardFactor = asteroid.is_potentially_hazardous_asteroid ? 1 : 0;

  const rng = mulberry32(
    hashStringToInt(asteroid.neo_reference_id || asteroid.name || 'neo')
  );
  const randomnessFactor = rng();

  const weights = {
    size: 0.25,
    brightness: 0.1,
    rarity: 0.1,
    hype: 0.15,
    accessibility: 0.15,
    velocity: 0.1,
    hazard: 0.1,
    randomness: 0.03,
  };

  const weightedScore =
    weights.size * sizeFactor +
    weights.brightness * brightnessFactor +
    weights.rarity * rarityFactor +
    weights.hype * hypeFactor +
    weights.accessibility * accessibilityFactor +
    weights.velocity * velocityFactor +
    weights.hazard * hazardFactor +
    weights.randomness * randomnessFactor;

  // All prices are between 100 and 900 CosmoCoins
  const price = 100 + Math.round(800 * clampBetween0and1(weightedScore));
  return price;
}

/**
 * Calculate size category based on diameter
 * @param {Object} asteroid - Asteroid data
 * @returns {number} Average diameter in meters
 */
function calculateSize(asteroid) {
  const { estimated_diameter } = asteroid;
  const min = estimated_diameter.kilometers.estimated_diameter_min;
  const max = estimated_diameter.kilometers.estimated_diameter_max;
  return (((min + max) / 2) * 1000).toFixed(2); // convert to meteors
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
 * Build MongoDB query from filters
 * @param {Object} filters - Filter parameters
 * @returns {Object} MongoDB query object
 */
function buildFilterQuery(filters) {
  const query = {};

  if (!filters) return query;

  // Hazard filter
  if (filters.hazardous && filters.hazardous !== 'all') {
    query.is_potentially_hazardous_asteroid = filters.hazardous === 'hazardous';
  }

  // Size range filter
  if (filters.sizeMin !== undefined || filters.sizeMax !== undefined) {
    query.size = {};
    if (filters.sizeMin !== undefined) {
      query.size.$gte = filters.sizeMin;
    }
    if (filters.sizeMax !== undefined) {
      query.size.$lte = filters.sizeMax;
    }
  }

  // Price range filter
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    query.price = {};
    if (filters.priceMin !== undefined) {
      query.price.$gte = filters.priceMin;
    }
    if (filters.priceMax !== undefined) {
      query.price.$lte = filters.priceMax;
    }
  }

  // Distance range filter (closest approach distance)
  if (filters.distanceMin !== undefined || filters.distanceMax !== undefined) {
    // We'll need to filter this in-memory or use aggregation pipeline
    // For now, let's mark it for post-query filtering
  }

  // Orbit type filter
  if (filters.orbitTypes && filters.orbitTypes.length > 0) {
    query['orbital_data.orbit_class.orbit_class_type'] = {
      $in: filters.orbitTypes,
    };
  }

  return query;
}

/**
 * Get closest approach distance for an asteroid
 * @param {Object} asteroid - Asteroid object
 * @returns {number} Distance in kilometers
 */
function getClosestApproachDistance(asteroid) {
  if (
    !asteroid.close_approach_data ||
    asteroid.close_approach_data.length === 0
  ) {
    return Infinity;
  }

  const distances = asteroid.close_approach_data.map(approach =>
    parseFloat(approach.miss_distance.kilometers)
  );

  return Math.min(...distances);
}

/**
 * Apply distance filtering and sorting to asteroids
 * @param {Array} asteroids - Array of asteroid objects
 * @param {Object} filters - Filter parameters
 * @returns {Array} Filtered and sorted asteroids
 */
function applyDistanceFilterAndSort(asteroids, filters) {
  let filtered = [...asteroids];

  // Apply distance filter if specified
  if (
    filters &&
    (filters.distanceMin !== undefined || filters.distanceMax !== undefined)
  ) {
    filtered = filtered.filter(asteroid => {
      const distance = getClosestApproachDistance(asteroid);
      if (filters.distanceMin !== undefined && distance < filters.distanceMin) {
        return false;
      }
      if (filters.distanceMax !== undefined && distance > filters.distanceMax) {
        return false;
      }
      return true;
    });
  }

  // Apply sorting if specified
  if (filters && filters.sortBy && filters.sortBy !== 'None') {
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'size-asc':
          return a.size - b.size;
        case 'size-desc':
          return b.size - a.size;
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'distance-asc': {
          const distA = getClosestApproachDistance(a);
          const distB = getClosestApproachDistance(b);
          return distA - distB;
        }
        case 'distance-desc': {
          const distA = getClosestApproachDistance(a);
          const distB = getClosestApproachDistance(b);
          return distB - distA;
        }
        default:
          return 0;
      }
    });
  }

  return filtered;
}

/**
 * Get asteroids from database or fetch from API if cache is empty
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Number of items per page
 * @returns {Promise<Object>} Paginated asteroids with metadata
 */
export async function getAsteroids(page = 1, pageSize = 20, filters = null) {
  try {
    // Check if we have cached data
    let totalCount = await Asteroid.countDocuments();

    if (totalCount === 0) {
      console.log('⚠️  No cached data found. Fetching from NASA API...');
      await cacheAsteroidsData();
      // Recount after caching
      totalCount = await Asteroid.countDocuments();
    }

    // Build MongoDB query from filters
    const query = buildFilterQuery(filters);

    // Get filtered count
    const filteredCount = await Asteroid.countDocuments(query);

    // Fetch all matching documents (we need to sort/filter by distance in-memory)
    let asteroids = await Asteroid.find(query).lean();

    // Find in User to find the ownership of each asteroid
    for (let asteroid of asteroids) {
      const ownerUser = await User.findOne({ owned_asteroid_ids: asteroid.id });
      asteroid.owner = ownerUser ? ownerUser : null;
    }

    // Apply distance filtering and sorting
    asteroids = applyDistanceFilterAndSort(asteroids, filters);

    // Update total count after distance filtering
    const finalCount = asteroids.length;
    const totalPages = Math.ceil(finalCount / pageSize);

    // Apply pagination after filtering and sorting
    const skip = (page - 1) * pageSize;
    const paginatedAsteroids = asteroids.slice(skip, skip + pageSize);

    console.log(
      `📊 Results: ${paginatedAsteroids.length} asteroids (page ${page}/${totalPages}, total: ${finalCount})`
    );

    return {
      asteroids: paginatedAsteroids,
      totalCount: finalCount,
      page,
      pageSize,
      totalPages,
    };
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

    // Find owner user
    const ownerUser = await User.findOne({ owned_asteroid_ids: asteroid.id });
    asteroid.owner = ownerUser ? ownerUser : null;

    return asteroid;
  } catch (error) {
    console.error(`❌ Error getting asteroid ${asteroidId}:`, error.message);
    throw error;
  }
}
