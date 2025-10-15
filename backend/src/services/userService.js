import { User } from '../models/User.js';
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

export async function addToCart(userId, asteroidId) {
  try {
    const user = await User.findOne({ uid: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the asteroid is already in the cart
    if (user.cart_asteroid_ids.includes(asteroidId)) {
      throw new Error('Asteroid already in cart');
    }

    user.cart_asteroid_ids.push(asteroidId);
    await user.save();
    console.log(`Asteroid ${asteroidId} added to cart for user ${userId}`);
    return user;
  } catch (error) {
    console.error(
      `Error adding asteroid ${asteroidId} to cart for user ${userId}:`,
      error.message
    );
    throw error;
  }
}

export async function addToStarredAsteroids(userId, asteroidId) {
  try {
    const user = await User.findOne({ uid: userId });
    console.log(user);

    if (!user) {
      throw new Error('User not found');
    }

    // Check if the asteroid is already in the starred list
    if (user.starred_asteroid_ids.includes(asteroidId)) {
      throw new Error('Asteroid already in starred list');
    }

    user.starred_asteroid_ids.push(asteroidId);
    await user.save();
    console.log(
      `Asteroid ${asteroidId} added to starred list for user ${userId}`
    );
    return user;
  } catch (error) {
    console.error(
      `Error adding asteroid ${asteroidId} to starred list for user ${userId}:`,
      error.message
    );
    throw error;
  }
}

export async function deleteFromStarredAsteroids(userId, asteroid_id) {
  try {
    const user = await User.findOne({ uid: userId });
    console.log(user);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the asteroid is in the starred list
    if (!user.starred_asteroid_ids.includes(asteroid_id)) {
      throw new Error('Asteroid not found in starred list');
    }

    user.starred_asteroid_ids = user.starred_asteroid_ids.filter(
      id => id !== asteroid_id
    );
    await user.save();
    console.log(
      `Asteroid ${asteroid_id} removed from starred list for user ${userId}`
    );
    return user;
  } catch (error) {
    console.error(
      `Error removing asteroid ${asteroid_id} from starred list for user ${userId}:`,
      error.message
    );
    throw error;
  }
}
