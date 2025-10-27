'use client';

import { create } from 'zustand';
import { checkDailyClaim, claimDailyReward } from '@/api/dailyClaimAPI';
import type { DailyClaimState } from './DailyClaimModel';

export const useDailyClaimStore = create<DailyClaimState>((set, get) => ({
  claimStatus: null,
  loading: false,
  claiming: false,
  error: null,
  claimResult: null,
  hasCheckedThisSession: false,
  showModal: false,

  checkClaimAvailability: async (force = false) => {
    const { hasCheckedThisSession } = get();

    if (hasCheckedThisSession && !force) {
      // console.log('Daily claim: Already checked this session');
      return;
    }

    set({ loading: true, error: null });

    try {
      // console.log('Daily claim: Checking availability...');
      const status = await checkDailyClaim();

      set({
        claimStatus: status,
        loading: false,
        hasCheckedThisSession: true,
      });

      if (status.isAvailable) {
        // console.log('Daily claim: Available! Showing modal...');
        set({ showModal: true });
      } else {
        // console.log('Daily claim: Not available (already claimed today)');
      }
    } catch (error) {
      // console.error('Daily claim: Error checking availability', error);
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Failed to check daily claim',
        loading: false,
        hasCheckedThisSession: true,
      });
    }
  },

  performClaim: async () => {
    set({ claiming: true, error: null });

    try {
      // console.log('Daily claim: Claiming reward...');
      const result = await claimDailyReward();

      set({
        claimResult: result,
        claiming: false,
      });

      if (result.success) {
        set({
          claimStatus: {
            isAvailable: false,
            nextClaimTime: result.nextClaimTime,
            coinsToEarn: result.coinsEarned,
          },
        });
      }
    } catch (error) {
      // console.error('Daily claim: Error claiming reward', error);
      set({
        error:
          error instanceof Error ? error.message : 'Failed to claim reward',
        claiming: false,
      });
    }
  },

  setShowModal: (show: boolean) => {
    set({ showModal: show });
  },

  resetClaimResult: () => {
    set({ claimResult: null });
  },

  resetSession: () => {
    set({
      claimStatus: null,
      claimResult: null,
      loading: false,
      claiming: false,
      error: null,
      hasCheckedThisSession: false,
      showModal: false,
    });
  },
}));

/**
 * Hook to access daily claim state and actions
 */
export function useDailyClaimViewModel() {
  return useDailyClaimStore();
}

/**
 * Hook to access only claim status
 */
export function useClaimStatus() {
  return useDailyClaimStore(state => state.claimStatus);
}

/**
 * Hook to access only modal state
 */
export function useClaimModal() {
  return {
    showModal: useDailyClaimStore(state => state.showModal),
    setShowModal: useDailyClaimStore(state => state.setShowModal),
  };
}
