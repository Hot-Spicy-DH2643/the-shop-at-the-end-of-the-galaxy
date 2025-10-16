'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import AsteroidSVGMoving from './asteroidSVGMoving';
import { useAppStore } from '@/store/useAppViewModel';

interface CheckoutItemProps {
  cart: { id: string; name: string; price: number }[];
}

export default function CheckoutItem({ cart }: CheckoutItemProps) {
  const removeFromCart = useAppStore(state => state.removeFromCart);

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  return (
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

          <div className="text-right text-xl font-semibold flex items-center gap-2">
            <Image
              src="/cosmocoin-tiny.png"
              alt="coin icon"
              className="inline-block mr-1"
              width={18}
              height={18}
            />
            {item.price}

            {/* Remove button */}
            <button
              onClick={() => handleRemove(item.id)}
              className="p-1 text-gray-500 hover:text-pink-500 transition cursor-pointer"
              aria-label="Remove item"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
