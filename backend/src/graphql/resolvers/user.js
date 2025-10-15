import { getAllUsers, getUserById } from '../../services/userService.js';

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
  Mutation: {},
};
