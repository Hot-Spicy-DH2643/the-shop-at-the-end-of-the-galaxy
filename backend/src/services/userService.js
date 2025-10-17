import { User } from '../models/User.js';
import {
  calculateAsteroidPrice,
  getAsteroidById,
} from './externalApiService.js';

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

export async function updateUserName(userId, newName) {
  try {
    const user = await User.findOneAndUpdate(
      { uid: userId },
      { name: newName },
      { new: true }
    );

    if (!user) {
      throw new Error(`User with uid ${userId} not found`);
    }

    // Return the user with followers and following populated
    return await getUserById(userId);
  } catch (error) {
    console.error(`Error updating user name for ${userId}:`, error.message);
    throw error;
  }
}

export async function toggleStarredAsteroid(userId, asteroidId) {
  try {
    const user = await User.findOne({ uid: userId }).exec();

    if (!user) {
      throw new Error(`User with uid ${userId} not found`);
    }

    const index = user.starred_asteroid_ids.indexOf(asteroidId);
    if (index === -1) {
      // Asteroid not starred, add it
      user.starred_asteroid_ids.push(asteroidId);
    } else {
      // Asteroid already starred, remove it
      user.starred_asteroid_ids.splice(index, 1);
    }

    await user.save();
    return true;
  } catch (error) {
    console.error(
      `Error toggling starred asteroid for user ${userId}:`,
      error.message
    );
    throw error;
  }
}

export async function addToCart(userId, asteroidId) {
  try {
    console.log(`Adding asteroid ${asteroidId} to cart for user ${userId}`);
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

export async function removeFromCart(userId, asteroidId) {
  try {
    const user = await User.findOne({ uid: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the asteroid is in the cart
    const index = user.cart_asteroid_ids.indexOf(asteroidId);
    if (index === -1) {
      throw new Error('Asteroid not found in cart');
    }

    // Remove the asteroid from the cart
    user.cart_asteroid_ids.splice(index, 1);

    await user.save();
    console.log(`Asteroid ${asteroidId} removed from cart for user ${userId}`);
    return user;
  } catch (error) {
    console.error(
      `Error removing asteroid ${asteroidId} from cart for user ${userId}:`,
      error.message
    );
    throw error;
  }
}

export async function checkoutCart(userId) {
  try {
    const user = await User.findOne({ uid: userId });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the cart is empty
    if (user.cart_asteroid_ids.length === 0) {
      throw new Error('Cart is empty');
    }

    // Check if all asteroids in the cart are available
    for (const asteroidId of user.cart_asteroid_ids) {
      if (user.owned_asteroid_ids.includes(asteroidId)) {
        throw new Error(`Asteroid ${asteroidId} is already owned by the user`);
      }
      const asteroid = await getAsteroidById(asteroidId);
      if (!asteroid) {
        throw new Error(`Asteroid ${asteroidId} not found`);
      }
      if (asteroid.owner) {
        throw new Error(
          `Asteroid ${asteroidId} is already owned by another user`
        );
      }
    }

    // Check if user has enough coins to purchase all asteroids in the cart, asteroid price can be calculated using externalApiService
    let totalPrice = 0;
    for (const asteroidId of user.cart_asteroid_ids) {
      const asteroid = await getAsteroidById(asteroidId);
      if (!asteroid) {
        throw new Error(`Asteroid ${asteroidId} not found`);
      }
      const price = calculateAsteroidPrice(asteroid);
      totalPrice += price;
    }

    if (user.coins < totalPrice) {
      throw new Error('Insufficient coins to complete the purchase');
    }

    // Transfer cart items to owned items
    user.owned_asteroid_ids.push(...user.cart_asteroid_ids);

    // Clear the cart
    user.cart_asteroid_ids = [];

    // Deduct the total price from user's coins
    user.coins -= totalPrice;

    await user.save();
    console.log(`User ${userId} checked out their cart successfully`);
    return true;
  } catch (error) {
    console.error(`Error during checkout for user ${userId}:`, error.message);
    throw error;
  }
}
