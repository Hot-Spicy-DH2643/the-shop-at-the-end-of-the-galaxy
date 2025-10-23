'use client';

import { useState } from 'react';
import AsteroidSVGMoving from '@/components/asteroidSVGMoving';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import { useAppStore } from '@/store/useAppViewModel';
import Link from 'next/link';
import { useEffect } from 'react';
import CheckoutItem from '@/components/checkoutItem';
import CheckoutAlert from '@/components/checkoutAlert';
import { fetchAsteroids, type Asteroid } from '@/store/AppModel';
import AsteroidModal from '@/components/asteroidModal';

export default function Checkout() {
  const {
    userData,
    setUserData,
    checkout,
    checkoutLoading,
    selectedAsteroid,
    setSelectedAsteroid,
    onHandleProductClick,
    onHandleStarred,
  } = useAppStore();

  const [isSuccess, setIsSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [hasCheckoutError, setHasCheckoutError] = useState(false);
  const [exploreAsteroids, setExploreAsteroids] = useState<Asteroid[]>([]);

  useEffect(() => {
    setUserData();
  }, [setUserData]);

  useEffect(() => {
    if (!userData) return;

    const loadAsteroids = async () => {
      const desiredCount = 4;
      const pageSize = 20;
      const cartIds = new Set(userData.cart_asteroids.map(a => a.id));
      const available: Asteroid[] = [];
      const seenIds = new Set<string>();
      let page = 1;
      let totalPages = Infinity;

      // Maybe in the future we can have dedicated API endpoint for this to fetch random available asteroids directly
      while (available.length < desiredCount && page <= totalPages) {
        const result = await fetchAsteroids(page, pageSize);
        const allAsteroids = result.asteroids;
        totalPages = result.totalPages || 0;

        for (const asteroid of allAsteroids) {
          if (
            !asteroid.owner &&
            !cartIds.has(asteroid.id) &&
            !seenIds.has(asteroid.id)
          ) {
            available.push(asteroid);
            seenIds.add(asteroid.id);
            if (available.length === desiredCount) break;
          }
        }

        if (!allAsteroids.length || page >= totalPages) {
          break;
        }
        page += 1;
      }

      for (let i = available.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [available[i], available[j]] = [available[j], available[i]];
      }

      setExploreAsteroids(available.slice(0, desiredCount));
    };

    loadAsteroids();
  }, [userData]);

  const cart = userData?.cart_asteroids || [];
  console.log('User cart asteroids:', cart);
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const hasUnavailableAsteroids = cart.some(
    asteroid => asteroid.owner && asteroid.owner.uid !== userData?.uid
  );

  const handleConfirm = () => {
    if (!userData) return;

    const userCoins = userData.coins ?? 0;

    //Not enough money → show alert and return
    if (userCoins < total) {
      setAlertMessage("You don't have enough coins to complete this purchase!");
      return;
    }

    if (userData.cart_asteroids.length === 0) {
      setAlertMessage('Your cart is empty!');
      return;
    }

    setAlertMessage(null);
    setHasCheckoutError(false);
    setIsSuccess(false);

    if (hasUnavailableAsteroids) {
      setAlertMessage(
        'Some asteroids in your cart are already owned by other users. Remove them to continue.'
      );
      return;
    }

    //Proceed to checkout
    checkout().then(result => {
      if (result.success) {
        setIsSuccess(true);
        setHasCheckoutError(false);
      } else {
        setAlertMessage(
          result.message ??
            'An error occurred during checkout. Please try again later.'
        );
        setHasCheckoutError(true);
      }
    });
  };

  if (hasCheckoutError) {
    const failureMessage =
      alertMessage ??
      'Something went wrong while processing your checkout. Please review your cart and try again.';

    return (
      <div className="galaxy-bg-space min-h-screen text-white flex flex-col items-center justify-center">
        <div className="bg-gray-900/80 p-10 rounded-3xl shadow-2xl border border-red-600 text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-red-400">
            Purchase Failed
          </h1>
          <p className="text-white-300 mb-6">{failureMessage}</p>

          <button
            className="w-full mt-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition-all py-3 rounded-lg font-semibold text-white cursor-pointer"
            onClick={() => {
              setHasCheckoutError(false);
              setAlertMessage(null);
            }}
          >
            Back to Checkout
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="galaxy-bg-space min-h-screen text-white flex flex-col items-center justify-center">
        <div className="bg-gray-900/80 p-10 rounded-3xl shadow-2xl border border-fuchsia-700 text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4"> Purchase Successful!</h1>
          <p className="text-white-300 mb-6">
            Your new asteroids are now orbiting in your galaxy
          </p>

          <Link href="/profile">
            <button
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all py-3 rounded-lg font-semibold text-white cursor-pointer"
              onClick={() => setIsSuccess(false)}
            >
              Go to Profile
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="galaxy-bg-space min-h-screen text-white flex flex-col items-center gap-12">
      <Navbar />
      <div className="w-full max-w-3xl space-y-6">
        <h2 className="text-4xl text-center mb-8 font-modak">YOUR CART</h2>

        {/* Items in cart */}
        <CheckoutItem cart={cart} />

        {/* Total Summary */}
        <div className="bg-gray-900/80 border border-fuchsia-700 rounded-2xl p-6 mt-8 shadow-xl text-center">
          <div className="flex justify-between mb-4 text-xl font-semibold">
            <span>Total:</span>
            <span>
              <Image
                src="/cosmocoin-tiny.png"
                alt="coin icon"
                className="inline-block mr-1"
                width={18}
                height={18}
              />
              {total}
            </span>
          </div>
          {/* User Balance */}
          <div className="flex justify-between mb-4 text-lg text-gray-400">
            <span>Your Balance:</span>
            <span className="flex items-center gap-1">
              <Image
                src="/cosmocoin-tiny.png"
                alt="coin icon"
                className="inline-block"
                width={16}
                height={16}
              />
              {userData?.coins ?? 0}
            </span>
          </div>

          <button
            onClick={handleConfirm}
            disabled={
              checkoutLoading ||
              (userData?.coins ?? 0) < total ||
              cart.length === 0 ||
              hasUnavailableAsteroids
            }
            className={`mt-4 w-full py-3 rounded-xl text-lg font-semibold transition-all duration-300 
              ${
                checkoutLoading
                  ? 'cursor-wait'
                  : (userData?.coins ?? 0) < total ||
                      cart.length === 0 ||
                      hasUnavailableAsteroids
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer'
              }
              ${
                (userData?.coins ?? 0) < total ||
                cart.length === 0 ||
                hasUnavailableAsteroids
                  ? 'bg-gray-700 opacity-70 hover:brightness-100'
                  : 'bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 hover:scale-102 hover:shadow-[0_0_20px_4px_rgba(236,72,255,0.6)] hover:brightness-110'
              }
              ${checkoutLoading ? 'opacity-70' : ''}
            `}
          >
            {checkoutLoading ? 'Processing...' : 'Confirm Purchase'}
          </button>

          {hasUnavailableAsteroids && (
            <p className="mt-4 text-sm text-red-400">
              Remove asteroids already owned by other users before checking out.
            </p>
          )}

          {alertMessage && (
            <CheckoutAlert
              message={alertMessage}
              onClose={() => setAlertMessage(null)}
            />
          )}
        </div>
      </div>
      {/* Explore More Section*/}

      <div className="w-full max-w-3xl mt-12 text-center pb-12">
        <h2 className="text-2xl mb-6 text-white/90 font-modak">
          Wanna look for more?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {exploreAsteroids.map(asteroid => (
            <div
              key={asteroid.id}
              className="bg-gray-900/50 border border-fuchsia-700 rounded-2xl p-4 hover:border-blue-500/50 transition cursor-pointer flex flex-col items-center"
              onClick={() => onHandleProductClick(asteroid.id)}
            >
              <AsteroidSVGMoving id={asteroid.id} size={60} bgsize={70} />
              <h4 className="mt-3 font-semibold">{asteroid.name}</h4>
              <p className="text-gray-400 text-sm mt-1">
                <Image
                  src="/cosmocoin-tiny.png"
                  alt="coin icon"
                  className="inline-block mr-1"
                  width={18}
                  height={18}
                />
                {asteroid.price}
              </p>
            </div>
          ))}
        </div>
      </div>
      {selectedAsteroid && (
        <AsteroidModal
          asteroid={selectedAsteroid}
          onClose={() => setSelectedAsteroid(null)}
          onHandleStarred={() => onHandleStarred(selectedAsteroid.id)}
        />
      )}
    </div>
  );
}
