'use client';

import { useState } from 'react';
import AsteroidSVG from '@/components/asteroidSVG';
import AsteroidSVGMoving from '@/components/asteroidSVGMoving';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import { useAppStore } from '@/store/useAppViewModel';

//TODO: Right now hardcoded with fake data. Just to be able to style it.
// I am gonna work on the functionality

export default function Checkout() {
  const cart = useAppStore(state => state.cart);
  const clearCart = useAppStore(state => state.clearCart);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleConfirm = () => {
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
          <button
            //Need to navigate back to shop
            onClick={() => setIsSuccess(false)}
            className="px-6 py-3 rounded-xl transition text-lg font-semibold bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 cursor-pointer hover:scale-102 hover:shadow-[0_0_20px_4px_rgba(236,72,255,0.6)] hover:brightness-110"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="galaxy-bg-space min-h-screen text-white flex flex-col items-center gap-12">
      <Navbar />
      <div className="w-full max-w-3xl space-y-6">
        <h2 className="text-3xl font-bold text-center mb-8">Your cart:</h2>

        {/* Items in cart */}
        <div className="space-y-4">
          {cart.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-6 bg-gray-900/60 border border-fuchsia-700 rounded-2xl p-4 shadow-md"
            >
              <div className="w-16 h-16 flex items-center justify-center">
                <AsteroidSVGMoving id={item.id} size={70} bgsize={70} />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-400 text-sm">ID: {item.id}</p>
              </div>

              <div className="text-right text-xl font-semibold">
                <Image
                  src="/cosmocoin-tiny.png"
                  alt="coin icon"
                  className="inline-block mr-1"
                  width={18}
                  height={18}
                />
                {item.price}
              </div>
            </div>
          ))}
        </div>

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
        <h2 className="text-2xl font-bold mb-6 text-white/90">
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
