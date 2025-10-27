'use client';

import type { DailyClaimStatus, ClaimResult } from '@/types';

export type DailyClaimState = {
  claimStatus: DailyClaimStatus | null;
  loading: boolean;
  claiming: boolean;
  error: string | null;
  claimResult: ClaimResult | null;
  hasCheckedThisSession: boolean;
  showModal: boolean;

  checkClaimAvailability: (force?: boolean) => Promise<void>;
  performClaim: () => Promise<void>;
  setShowModal: (show: boolean) => void;
  resetClaimResult: () => void;
  resetSession: () => void;
};
