import { User } from '../models/User.js';
import { Asteroid } from '../models/Asteroid.js';

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

    const owned_asteroids = await Asteroid.find(
      { id: { $in: user.owned_asteroids } },
      {
        id: 1,
        name: 1,
        is_potentially_hazardous_asteroid: 1,
        price: 1,
        size: 1,
        _id: 0,
      }
    );

    const starred_asteroids = await Asteroid.find(
      { id: { $in: user.starred_asteroids } },
      {
        id: 1,
        name: 1,
        is_potentially_hazardous_asteroid: 1,
        price: 1,
        size: 1,
        _id: 0,
      }
    );

    // Fetch followers' details
    const followers = await User.find(
      { uid: { $in: user.followers } },
      { uid: 1, name: 1, _id: 0 }
    );

    // Fetch following users' details
    const following = await User.find(
      { uid: { $in: user.following } },
      { uid: 1, name: 1, _id: 0 }
    );

    // Transform the user object to include followers and following
    return {
      ...user.toObject(),
      starred_asteroids,
      owned_asteroids,
      followers,
      following,
    };
  } catch (error) {
    console.error(`Error getting users by ${userId}:`, error.message);
    throw error;
  }
}
