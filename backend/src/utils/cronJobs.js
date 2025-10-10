import cron from 'node-cron';
import { cacheAsteroidsData } from '../services/externalApiService.js';

/**
 * Initialize cron jobs
 * Runs daily at midnight (00:00) to cache asteroid data from NASA API
 */
export function initializeCronJobs() {
  console.log('⏰ Initializing cron jobs...');

  // Schedule daily cache update at midnight (00:00)
  // Cron format: second minute hour day month weekday
  // '0 0 * * *' means: at 00:00 every day
  cron.schedule('0 0 * * *', async () => {
    console.log('🌙 Midnight cron job triggered: Caching asteroid data...');
    try {
      const result = await cacheAsteroidsData();
      console.log(
        `✅ Cron job completed successfully: ${result.count} asteroids cached`
      );
    } catch (error) {
      console.error('❌ Cron job failed:', error.message);
    }
  });

  console.log('✅ Cron jobs initialized: Daily asteroid cache at midnight');

  // Optional: Run cache immediately on startup if database is empty
  // You can comment this out if you don't want initial caching on startup
  checkAndCacheOnStartup();
}

/**
 * Check if cache is empty and populate it on startup
 */
async function checkAndCacheOnStartup() {
  try {
    const { Asteroid } = await import('../models/Asteroid.js');
    const count = await Asteroid.countDocuments();

    if (count === 0) {
      console.log(
        '⚠️  No cached asteroid data found on startup. Running initial cache...'
      );
      await cacheAsteroidsData();
    } else {
      console.log(`ℹ️  Found ${count} cached asteroids in database`);
    }
  } catch (error) {
    console.error('❌ Error checking cache on startup:', error.message);
  }
}
