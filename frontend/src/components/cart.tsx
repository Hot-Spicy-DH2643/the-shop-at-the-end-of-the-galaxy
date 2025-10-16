'use client';

import Image from 'next/image';
import { useAppStore } from '@/store/useAppViewModel';
import CartItem from './cartItem';
import { useEffect } from 'react';
import Link from 'next/link';

const cartLinks = [{ label: 'Checkout', href: '/checkout' }];

export default function Cart() {
  // const cart = useAppStore(state => state.cart);
  //const cart = fakeCart; // using fake data for now

  //const total = cart.reduce((sum, item) => sum + item.price, 0);

  const { userData, setUserData } = useAppStore();

  useEffect(() => {
    setUserData(); // fetches from backend and sets global store
    console.log('User cart items', userData?.cart_asteroids);
  }, [setUserData]);

  const cart = userData?.cart_asteroids || [];
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (!userData)
    return (
      <p className="text-center text-gray-400 mt-10">Loading your cart...</p>
    );

  return (
    <div className="flex flex-col bg-gray-950 text-white rounded-xl w-full h-[80vh] max-h-[600px] overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h2 className="text-2xl font-semibold">Your Cart</h2>
        <span className="text-sm text-gray-400">{cart.length} items</span>
      </div>

      {/* Scrollable items */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {cart.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">Your cart is empty.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <tbody>
              {userData?.cart_asteroids.map(item => (
                <CartItem
                  key={item.id}
                  id={parseInt(item.id)}
                  name={item.name}
                  price={item.price}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 px-6 py-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total:</span>
          <div className="text-xl font-bold flex items-center gap-1">
            <Image
              src="/cosmocoin-tiny.png"
              alt="coin"
              width={18}
              height={18}
            />
            <span>{total}</span>
          </div>
        </div>

        <Link href="/checkout" className="block">
          <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all py-3 rounded-lg font-semibold text-white cursor-pointer">
            Go to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}
