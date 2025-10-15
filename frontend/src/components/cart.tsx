'use client';

import AsteroidSVGMoving from '@/components/asteroidSVGMoving';
import Image from 'next/image';
import { useAppStore } from '@/store/useAppViewModel';
import { X } from 'lucide-react';

//TODO: Right now hardcoded with fake data. Just to be able to style it.
// I am gonna work on the functionality

// Temporary fake data (for styling)
const fakeCart = [
  { id: 1209384, name: 'Starlight Sneakers', price: 120 },
  { id: 2192847, name: 'Cosmic Hoodie', price: 95 },
  { id: 3102937, name: 'Nebula Jacket', price: 250 },
  { id: 4102937, name: 'Galaxy Watch', price: 300 },
  { id: 5293847, name: 'Moonlight Bag', price: 180 },
];
export default function Cart() {
  //const cart = useAppStore(state => state.cart);
  //const clearCart = useAppStore(state => state.clearCart);

  const cart = fakeCart; // using fake data for now

  const total = cart.reduce((sum, item) => sum + item.price, 0);

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
              {cart.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-white/10 last:border-none"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <AsteroidSVGMoving
                        id={item.id.toString()}
                        size={42}
                        bgsize={36}
                      />
                      <span className="text-base">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right text-gray-400">
                    <div className="inline-flex items-center gap-1">
                      <Image
                        src="/cosmocoin-tiny.png"
                        alt="coin"
                        width={16}
                        height={16}
                      />
                      <span>{item.price}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      className="p-1 text-gray-500 hover:text-pink-500 transition"
                      aria-label="Remove item"
                    >
                      <X size={18} />
                    </button>
                  </td>
                </tr>
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

        <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all py-3 rounded-lg font-semibold text-white">
          Go to Checkout
        </button>
      </div>
    </div>
  );
}
