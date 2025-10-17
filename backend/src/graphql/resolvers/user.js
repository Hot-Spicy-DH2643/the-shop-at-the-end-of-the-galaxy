import {
  addToCart,
  removeFromCart,
  getAllUsers,
  getUserById,
  toggleStarredAsteroid,
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
        throw new Error('Failed to add asteroid to cart', error);
      }
    },
    removeFromCart: async (parent, { asteroidId }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }
        await removeFromCart(context.user.uid, asteroidId);
        return true;
      } catch (error) {
        console.error('Error in removeFromCart mutation:', error);
        throw new Error('Failed to remove asteroid from cart', error);
      }
    },
    toggleStarredAsteroid: async (parent, { asteroidId }, context) => {
      const user = context.user;
      if (!user) {
        throw new Error('Authentication required');
      }

      // Call the service function to toggle the starred status
      try {
        const result = await toggleStarredAsteroid(user.uid, asteroidId);
        return result;
      } catch (error) {
        console.error('Error toggling starred asteroid:', error);
        throw new Error('Failed to toggle starred asteroid');
      }
    },
  },
};
