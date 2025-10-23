import { User } from '../../models/User.js';

const DAILY_REWARD_AMOUNT = 200;

/**
 * Check if a user can claim their daily reward (persistent)
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<Object>} Status of daily claim availability
 */
export async function checkClaimAvailability(userId) {
  const user = await User.findOne({ uid: userId });
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  if (!user || user.lastDailyClaimDate !== today) {
    return {
      isAvailable: true,
      nextClaimTime: null,
      coinsToEarn: DAILY_REWARD_AMOUNT,
    };
  }

  // Calculate next claim time (midnight tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return {
    isAvailable: false,
    nextClaimTime: tomorrow.toISOString(),
    coinsToEarn: DAILY_REWARD_AMOUNT,
  };
}

/**
 * Process a daily claim for a user (persistent)
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<Object>} Result of the claim attempt
 */
export async function processClaim(userId) {
  const status = await checkClaimAvailability(userId);

  if (!status.isAvailable) {
    return {
      success: false,
      coinsEarned: 0,
      message: 'Daily reward already claimed today. Come back tomorrow!',
      nextClaimTime: status.nextClaimTime,
    };
  }

  // Record the claim in the database
  const today = new Date().toISOString().split('T')[0];
  const user = await User.findOne({ uid: userId });
  if (!user) {
    return {
      success: false,
      coinsEarned: 0,
      message: 'User not found.',
      nextClaimTime: null,
    };
  }
  user.lastDailyClaimDate = today;
  user.coins = (user.coins || 0) + DAILY_REWARD_AMOUNT;
  await user.save();

  // Calculate next claim time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return {
    success: true,
    coinsEarned: DAILY_REWARD_AMOUNT,
    message: `Congratulations!`,
    nextClaimTime: tomorrow.toISOString(),
  };
}

export const dailyClaimResolvers = {
  Query: {
    checkDailyClaim: async (parent, args, context) => {
      // Require authentication
      if (!context.user) {
        throw new Error('Authentication required to check daily claim');
      }

      const userId = context.user.uid || context.user.email;
      return await checkClaimAvailability(userId);
    },
  },
  Mutation: {
    claimDailyReward: async (parent, args, context) => {
      // Require authentication
      if (!context.user) {
        throw new Error('Authentication required to claim daily reward');
      }

      const userId = context.user.uid || context.user.email;
      return await processClaim(userId);
    },
  },
};
