import {
  getAsteroids,
  getAsteroidById,
  cacheAsteroidsData,
} from '../../services/externalApiService.js';
import { CacheMetadata } from '../../models/CacheMetadata.js';

export const asteroidResolvers = {
  Query: {
    // Get all asteroids with pagination
    asteroids: async (parent, {page = 1, pageSize = 20, filters = null}, context) => {
      try {
        return await getAsteroids(page, pageSize, filters, context);
      } catch (error) {
        console.error("Error in asteroids resolver:", error);
        throw new Error("Failed to fetch filtered asteroids");
      }
    },

    // Get a specific asteroid by ID
    asteroid: async (parent, { id }) => {
      try {
        return await getAsteroidById(id);
      } catch (error) {
        console.error('Error in asteroid resolver:', error);
        throw new Error(`Failed to fetch asteroid with ID: ${id}`);
      }
    },

    // Get cache status
    cacheStatus: async () => {
      try {
        const metadata = await CacheMetadata.findOne({
          key: 'asteroids_feed',
        });

        if (!metadata) {
          return {
            lastUpdated: new Date().toISOString(),
            status: 'never_cached',
            recordCount: 0,
            errorMessage: 'Cache has never been updated',
          };
        }

        return {
          lastUpdated: metadata.lastUpdated.toISOString(),
          status: metadata.status,
          recordCount: metadata.recordCount,
          errorMessage: metadata.errorMessage,
        };
      } catch (error) {
        console.error('Error in cacheStatus resolver:', error);
        throw new Error('Failed to fetch cache status');
      }
    },
  },

  Mutation: {
    // TODO: Might delete
    // Manually trigger cache refresh
    refreshAsteroidCache: async (parent, args, context) => {
      try {
        // Optional: Add authentication check here
        // if (!context.user || !context.user.isAdmin) {
        //   throw new Error('Unauthorized: Admin access required');
        // }

        console.log('🔄 Manual cache refresh triggered');
        await cacheAsteroidsData();

        const metadata = await CacheMetadata.findOne({
          key: 'asteroids_feed',
        });

        return {
          lastUpdated: metadata.lastUpdated.toISOString(),
          status: metadata.status,
          recordCount: metadata.recordCount,
          errorMessage: metadata.errorMessage,
        };
      } catch (error) {
        console.error('Error in refreshAsteroidCache mutation:', error);
        throw new Error('Failed to refresh asteroid cache');
      }
    },
  },
};
