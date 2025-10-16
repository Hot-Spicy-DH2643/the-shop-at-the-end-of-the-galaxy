'use client';

import { useState } from 'react';
import AsteroidSVG from '@/components/asteroidSVG';
import AsteroidSVGMoving from '@/components/asteroidSVGMoving';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import { useAppStore } from '@/store/useAppViewModel';
import Link from 'next/link';
import CartItem from '@/components/cartItem';
import { useEffect } from 'react';
import CheckoutItem from '@/components/checkoutItem';

//TODO: Right now hardcoded with fake data. Just to be able to style it.
// I am gonna work on the functionality

export default function Checkout() {
  const { userData, setUserData, clearCart } = useAppStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setUserData();
  }, [setUserData]);

  const cart = userData?.cart_asteroids || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleConfirm = () => {
    if ((userData?.coins ?? 0) < total) {
      alert("You don't have enough coins to complete this purchase!");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="galaxy-bg-space min-h-screen text-white flex flex-col items-center justify-center">
        <div className="bg-gray-900/80 p-10 rounded-3xl shadow-2xl border border-fuchsia-700 text-center max-w-md">
          <h1 className="text-3xl font-bold mb-4"> Purchase Successful!</h1>
          <p className="text-white-300 mb-6">
            Your new asteroids are now orbiting in your galaxy
          </p>

          <Link href="/shop">
            <button
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all py-3 rounded-lg font-semibold text-white"
              onClick={() => setIsSuccess(false)}
            >
              Back to Shop
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
            disabled={isProcessing}
            className={`mt-4 w-full py-3 rounded-xl text-lg font-semibold transition-all duration-300 
    bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 cursor-pointer
    ${
      isProcessing
        ? 'bg-gray-700 cursor-not-allowed opacity-70'
        : 'hover:scale-102 hover:shadow-[0_0_20px_4px_rgba(236,72,255,0.6)] hover:brightness-110'
    }`}
          >
            {isProcessing ? 'Processing...' : 'Confirm Purchase'}
          </button>
        </div>
      </div>
      {/* Explore More Section, right now hardcoded*/}

      <div className="w-full max-w-4xl mt-12 text-center">
        <h2 className="text-2xl mb-6 text-white/90 font-modak">
          Wanna look for more?
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {['Lunar Dust', 'Crystal Core', 'Solar Fragment', 'Iron Meteor'].map(
            (name, i) => (
              <div
                key={i}
                className="bg-gray-900/50 border border-fuchsia-700 rounded-2xl p-4 hover:border-blue-500/50 transition cursor-pointer flex flex-col items-center"
              >
                <AsteroidSVGMoving id={`extra-${i}`} size={60} bgsize={70} />
                <h4 className="mt-3 font-semibold">{name}</h4>
                <p className="text-gray-400 text-sm mt-1">
                  <Image
                    src="/cosmocoin-tiny.png"
                    alt="coin icon"
                    className="inline-block mr-1"
                    width={18}
                    height={18}
                  />
                  99
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
