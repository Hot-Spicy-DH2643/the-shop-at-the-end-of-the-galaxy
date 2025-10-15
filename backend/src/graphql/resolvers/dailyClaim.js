// In-memory storage for daily claims
// Structure: { userId: { lastClaimDate: 'YYYY-MM-DD', coins: 0 } }
const dailyClaimStorage = new Map();

const DAILY_REWARD_AMOUNT = 200;

/**
 * Check if a user can claim their daily reward
 * @param {string} userId - The user's unique identifier
 * @returns {Object} Status of daily claim availability
 */
function checkClaimAvailability(userId) {
  // TODO: Replace with persistent storage in production
  // 1. Create a database model (e.g. UserClaim) or add fields to the existing User model
  // 2. Replace the Map operations with database queries
  // Instead of
  // const userClaim = dailyClaimStorage.get(userId);
  // Use something like:
  // const userClaim = await UserClaim.findOne({ where: { userId } });
  // And for saving:
  // await userClaim.save();
  const userClaim = dailyClaimStorage.get(userId);
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  if (!userClaim || userClaim.lastClaimDate !== today) {
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
 * Process a daily claim for a user
 * @param {string} userId - The user's unique identifier
 * @returns {Object} Result of the claim attempt
 */
function processClaim(userId) {
  const status = checkClaimAvailability(userId);

  if (!status.isAvailable) {
    return {
      success: false,
      coinsEarned: 0,
      message: 'Daily reward already claimed today. Come back tomorrow!',
      nextClaimTime: status.nextClaimTime,
    };
  }

  // Record the claim
  const today = new Date().toISOString().split('T')[0];
  const userClaim = dailyClaimStorage.get(userId) || { coins: 0 };
  userClaim.lastClaimDate = today;
  userClaim.coins += DAILY_REWARD_AMOUNT;
  dailyClaimStorage.set(userId, userClaim);

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
    checkDailyClaim: (parent, args, context) => {
      // Require authentication
      if (!context.user) {
        throw new Error('Authentication required to check daily claim');
      }

      const userId = context.user.uid || context.user.email;
      return checkClaimAvailability(userId);
    },
  },
  Mutation: {
    claimDailyReward: (parent, args, context) => {
      // Require authentication
      if (!context.user) {
        throw new Error('Authentication required to claim daily reward');
      }

      const userId = context.user.uid || context.user.email;
      return processClaim(userId);
    },
  },
};

// Exporting storage for testing purposes
// export { dailyClaimStorage };
