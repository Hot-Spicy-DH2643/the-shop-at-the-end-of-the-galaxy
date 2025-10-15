import { updateUserName } from '../../services/userService.js';

export const mutationResolvers = {
  Mutation: {
    // Add mutation resolvers here as needed
    placeholder: () => 'This is a placeholder mutation',

    // Update user name
    updateUserName: async (parent, { uid, name }) => {
      try {
        console.log('Updating user name:', { uid, name });
        return await updateUserName(uid, name);
      } catch (error) {
        console.error('Error in updateUserName resolver:', error);
        throw new Error(`Failed to update user name: ${error.message}`);
      }
    },
  },
};
