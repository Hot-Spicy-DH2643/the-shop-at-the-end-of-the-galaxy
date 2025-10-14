import { User } from '../models/User.js';

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

    // Transform the user object to include followers and following
    return {
      ...user.toObject(),
      followers,
      following,
    };
  } catch (error) {
    console.error(`Error getting users by ${userId}:`, error.message);
    throw error;
  }
}
