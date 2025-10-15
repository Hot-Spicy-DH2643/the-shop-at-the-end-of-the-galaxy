import {
  getAllUsers,
  getUserById,
  addToStarredAsteroids,
  deleteFromStarredAsteroids,
} from '../../services/userService.js';

export const userResolvers = {
  Query: {
    // Get all users
    allUsers: async (parent, args) => {
      try {
        return await getAllUsers();
      } catch (error) {
        console.error('Error in users resolver:', error);
        throw new Error('Failed to fetch all users');
      }
    },

    // Get a specific user by ID
    user: async (parent, { uid }) => {
      try {
        console.log('Fetching user with ID:', uid);
        return await getUserById(uid);
      } catch (error) {
        console.error('Error in user resolver:', error);
        throw new Error(`Failed to fetch a user with ID: ${uid}`);
      }
    },
  },
  Mutation: {
    addToCart: async (parent, { asteroidId }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        await addToCart(context.user.uid, asteroidId);
        return true;
      } catch (error) {
        console.error('Error in addToCart mutation:', error);
        throw new Error('Failed to add asteroid to cart');
      }
    },
    addToStarredAsteroids: async (parent, { asteroidId }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        await addToStarredAsteroids(context.user.uid, asteroidId);
        return true;
      } catch (error) {
        console.error('Error in addToStarredAsteroids mutation:', error);
        throw new Error('Failed to add asteroid to starred list');
      }
    },
    deleteFromStarredAsteroids: async (parent, { asteroidId }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        await deleteFromStarredAsteroids(context.user.uid, asteroidId);
        return true;
      } catch (error) {
        console.error('Error in deleteFromStarredAsteroids mutation:', error);
        throw new Error('Failed to delete asteroid from starred list');
      }
    },
  },
};
