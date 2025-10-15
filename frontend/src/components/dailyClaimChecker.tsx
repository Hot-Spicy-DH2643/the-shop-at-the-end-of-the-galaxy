'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/store/useAuthViewModel';
import { useDailyClaimViewModel } from '@/store/useDailyClaimViewModel';

export default function DailyClaimChecker({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useAuthStore();
  const {
    showModal,
    setShowModal,
    checkClaimAvailability,
    claimStatus,
    claimResult,
    claiming,
    performClaim,
    resetClaimResult,
  } = useDailyClaimViewModel();

  useEffect(() => {
    if (authLoading) {
      console.log('Daily claim: Waiting for auth to complete...');
      return;
    }

    const timer = setTimeout(() => {
      checkClaimAvailability();
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, [authLoading, user, checkClaimAvailability]);

  // Handler functions
  const handleClaim = () => {
    performClaim();
  };

  const handleClose = () => {
    resetClaimResult();
    setShowModal(false);
  };

  const coinsToEarn = claimStatus?.coinsToEarn || 200;
  const claimed = claimResult?.success || false;
  const claimMessage = claimResult?.message || '';
  const loading = claiming;

  return (
    <>
      {children}

      {/* daily claim modal */}
      {showModal && (
        <div className="galaxy-bg-space fixed inset-0 z-50 flex items-center justify-center bg-opacity-90 backdrop-blur-sm">
          <div className="relative bg-black rounded-2xl shadow-2xl border-2 border-purple-400 p-8 max-w-md w-full mx-4 animate-fade-in">
            <div className="text-center mb-6">
              <div className="mb-1 mt-3 animate-bounce">
                <Image
                  src="/cosmocoin-large.png"
                  alt="coin icon"
                  className="inline-block mr-1"
                  width={65}
                  height={65}
                />
              </div>
              <h2 className="font-modak mb-4 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300 bg-clip-text text-transparent drop-shadow-lg text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl">
                {claimed ? 'REWARD CLAIMED!' : 'MORE COSMOCOINS!'}
              </h2>
              <p className="text-white">
                {claimed
                  ? claimMessage
                  : `Your daily reward of ${coinsToEarn} CosmoCoins is ready.`}
              </p>
            </div>

            {!claimed && (
              <div className="bg-black bg-opacity-30 rounded-xl p-6 -mt-4 mb-2 text-center">
                <div className="font-modak mb-0 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300 bg-clip-text text-transparent drop-shadow-lg text-5xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-7xl">
                  +{coinsToEarn}
                </div>
              </div>
            )}

            {claimed && claimMessage && (
              <div className="border border-purple-400 rounded-lg p-4 mb-6 text-center">
                <p className="text-purple-200">
                  You&apos;ve claimed {coinsToEarn} CosmoCoins.
                </p>
                <p className="text-sm text-gray-300 mt-2">
                  Come back tomorrow for more rewards.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              {!claimed ? (
                <>
                  <button
                    onClick={handleClaim}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:cursor-pointer"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Claiming...
                      </span>
                    ) : (
                      'Claim CosmoCoins'
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleClose}
                  className="w-full bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 hover:cursor-pointer"
                >
                  Continue
                </button>
              )}
            </div>

            {!claimed && (
              <p className="text-xs text-gray-400 text-center mt-4">
                Daily rewards reset at midnight
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
