#!/usr/bin/env node

/**
 * Test script for asteroid caching system
 * Run with: node scripts/test-cache.js
 */

import '../src/config/dotenv.js';
import { connectDatabase } from '../src/loaders/database.js';
import {
  cacheAsteroidsData,
  getAsteroids,
  getAsteroidById,
} from '../src/services/externalApiService.js';
import { CacheMetadata } from '../src/models/CacheMetadata.js';
import { Asteroid } from '../src/models/Asteroid.js';

async function testCache() {
  try {
    console.log('🧪 Starting cache test...\n');

    // Connect to database
    console.log('1️⃣  Connecting to database...');
    await connectDatabase();
    console.log('✅ Connected\n');

    // Check current cache status
    console.log('2️⃣  Checking cache status...');
    const metadata = await CacheMetadata.findOne({ key: 'asteroids_feed' });
    if (metadata) {
      console.log('   Last Updated:', metadata.lastUpdated);
      console.log('   Status:', metadata.status);
      console.log('   Record Count:', metadata.recordCount);
    } else {
      console.log('   No cache metadata found');
    }
    console.log();

    // Count current asteroids
    console.log('3️⃣  Counting asteroids in database...');
    const count = await Asteroid.countDocuments();
    console.log(`   Found ${count} asteroids\n`);

    // Test cache refresh
    console.log('4️⃣  Testing cache refresh...');
    console.log('   This will fetch data from NASA API...');
    const result = await cacheAsteroidsData();
    console.log('   ✅ Cache refresh completed');
    console.log('   Cached:', result.count, 'asteroids');
    console.log('   Errors:', result.errors);
    console.log();

    // Test getAsteroids
    console.log('5️⃣  Testing getAsteroids()...');
    const asteroids = await getAsteroids();
    console.log(`   ✅ Retrieved ${asteroids.length} asteroids`);

    if (asteroids.length > 0) {
      const sample = asteroids[0];
      console.log('   Sample asteroid:');
      console.log('   - ID:', sample.id);
      console.log('   - Name:', sample.name);
      console.log('   - Price:', sample.price);
      console.log('   - Size:', sample.size);
      console.log('   - Hazardous:', sample.is_potentially_hazardous_asteroid);
    }
    console.log();

    // Test getAsteroidById
    if (asteroids.length > 0) {
      console.log('6️⃣  Testing getAsteroidById()...');
      const testId = asteroids[0].id;
      const asteroid = await getAsteroidById(testId);
      console.log('   ✅ Retrieved asteroid:', asteroid.name);
      console.log('   - Has orbital data:', !!asteroid.orbital_data);
      console.log();
    }

    // Display statistics
    console.log('7️⃣  Cache Statistics:');
    const hazardousCount = await Asteroid.countDocuments({
      is_potentially_hazardous_asteroid: true,
    });
    const safeCount = await Asteroid.countDocuments({
      is_potentially_hazardous_asteroid: false,
    });

    console.log('   Total asteroids:', count);
    console.log('   Hazardous:', hazardousCount);
    console.log('   Safe:', safeCount);

    // Size distribution
    console.log('\n   Size distribution:');
    for (let size = 1; size <= 5; size++) {
      const sizeCount = await Asteroid.countDocuments({ size });
      console.log(`   - Size ${size}: ${sizeCount} asteroids`);
    }
    console.log();

    console.log('✅ All tests completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run tests
testCache();
