'use client';

import { gql } from '@apollo/client';
import client from '@/lib/apollo-client';

export interface DailyClaimStatus {
  isAvailable: boolean;
  nextClaimTime: string | null;
  coinsToEarn: number;
}

export interface ClaimResult {
  success: boolean;
  coinsEarned: number;
  message: string;
  nextClaimTime: string;
}

interface CheckDailyClaimResponse {
  checkDailyClaim: DailyClaimStatus;
}

interface ClaimDailyRewardResponse {
  claimDailyReward: ClaimResult;
}

const CHECK_DAILY_CLAIM = gql`
  query CheckDailyClaim {
    checkDailyClaim {
      isAvailable
      nextClaimTime
      coinsToEarn
    }
  }
`;

const CLAIM_DAILY_REWARD = gql`
  mutation ClaimDailyReward {
    claimDailyReward {
      success
      coinsEarned
      message
      nextClaimTime
    }
  }
`;

/**
 * Check if a daily claim is available for the current user
 * @returns {Promise<DailyClaimStatus>} The claim status
 */
export async function checkDailyClaim(): Promise<DailyClaimStatus> {
  try {
    const result = await client.query<CheckDailyClaimResponse>({
      query: CHECK_DAILY_CLAIM,
      fetchPolicy: 'network-only', // Always fetch fresh data
    });

    if (!result.data || !result.data.checkDailyClaim) {
      // console.log(
      //   'No data returned from daily claim check - user may not be authenticated'
      // );
      // Return a default "not available" status instead of throwing
      return {
        isAvailable: false,
        nextClaimTime: null,
        coinsToEarn: 200,
      };
    }

    return result.data.checkDailyClaim;
  } catch (error) {
    // console.log('Error checking daily claim:', error);
    // Return a safe default instead of throwing
    return {
      isAvailable: false,
      nextClaimTime: null,
      coinsToEarn: 200,
    };
  }
}

/**
 * Claim the daily reward for the current user
 * @returns {Promise<ClaimResult>} The result of the claim attempt
 */
export async function claimDailyReward(): Promise<ClaimResult> {
  try {
    const { data } = await client.mutate<ClaimDailyRewardResponse>({
      mutation: CLAIM_DAILY_REWARD,
    });

    if (!data) {
      throw new Error('No data returned from claim mutation');
    }

    return data.claimDailyReward;
  } catch (error) {
    // console.error('Error claiming daily reward:', error);
    throw error;
  }
}
