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

    followUser: async (parent, { targetUid }, context) => {
      const currentUser = context.user;

      if (!currentUser) {
        throw new Error('Authentication required');
      }

      try {
        const targetUser = await getUserById(targetUid);
        if (!targetUser) {
          throw new Error('Target user not found');
        }

        // Ensure arrays exist
        const following = currentUser.following || [];
        const followers = targetUser.followers || [];

        // Check if already following
        const alreadyFollowing = following.some(
          // .some() - stops as soon as condition is true
          friend => friend.uid === targetUid
        );

        if (alreadyFollowing) {
          return { message: 'Already following this user' };
        }

        /// Add each other to follower/following arrays
        following.push({ uid: targetUser.uid, name: targetUser.name });
        followers.push({ uid: currentUser.uid, name: currentUser.name });

        // Persist both
        await Promise.all([
          updateUserById(currentUser.uid, { following }),
          updateUserById(targetUser.uid, { followers }),
        ]);

        return true;
      } catch (error) {
        console.error('Error in followUser mutation:', error);
        throw new Error('Failed to follow user');
      }
    },

    unfollowUser: async (parent, { targetUid }, context) => {
      const currentUser = context.user;

      if (!currentUser) {
        throw new Error('Authentication required');
      }

      try {
        const targetUser = await getUserById(targetUid);
        if (!targetUser) {
          throw new Error('Target user not found');
        }

        // Ensure arrays exist
        const following = currentUser.following || [];
        const followers = targetUser.followers || [];

        // Check if already following
        const alreadyFollowing = following.some(
          // .some() - stops as soon as condition is true
          friend => friend.uid === targetUid
        );

        if (alreadyFollowing) {
          return { message: 'Already following this user' };
        }

        const updatedFollowing =
          currentUser.following?.filter(friend => friend.uid !== targetUid) ||
          [];
        const updatedFollowers =
          targetUser.followers?.filter(
            follower => follower.uid !== currentUser.uid
          ) || [];

        await Promise.all([
          updateUserById(currentUser.uid, { following: updatedFollowing }),
          updateUserById(targetUser.uid, { followers: updatedFollowers }),
        ]);

        return true;
      } catch (error) {
        console.error('Error in unfollowUser mutation:', error);
        throw new Error('Failed to unfollow user');
      }
    },
  },
};
