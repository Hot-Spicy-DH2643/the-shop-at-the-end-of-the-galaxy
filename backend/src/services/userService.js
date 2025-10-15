import { User } from '../models/User.js';
import { Asteroid } from '../models/Asteroid.js';
import { getAsteroidById } from './externalApiService.js';

export async function getAllUsers() {
  try {
    const allUsers = await User.find();
    return allUsers;
  } catch (error) {
    console.error('Error getting all user:', error.message);
    throw error;
  }
}

export async function getUserById(userId) {
  try {
    const user = await User.findOne({ uid: userId });

    if (!user) {
      return null;
    }

    const owned_asteroid_ids = user.owned_asteroid_ids;
    const owned_asteroids = await Promise.all(
      owned_asteroid_ids.map(id => getAsteroidById(id))
    );

    const starred_asteroid_ids = user.starred_asteroid_ids;
    const starred_asteroids = await Promise.all(
      starred_asteroid_ids.map(id => getAsteroidById(id))
    );

    // Fetch followers' details
    const followers = await User.find(
      { uid: { $in: user.follower_ids } },
      { uid: 1, name: 1, _id: 0 }
    );

    // Fetch following users' details
    const following = await User.find(
      { uid: { $in: user.following_ids } },
      { uid: 1, name: 1, _id: 0 }
    );

    const cart_asteroid_ids = user.cart_asteroid_ids;
    const cart_asteroids = await Promise.all(
      cart_asteroid_ids.map(id => getAsteroidById(id))
    );

    // Transform the user object to include followers and following
    return {
      ...user.toObject(),
      starred_asteroids,
      owned_asteroids,
      cart_asteroids,
      followers,
      following,
    };
  } catch (error) {
    console.error(`Error getting users by ${userId}:`, error.message);
    throw error;
  }
}
