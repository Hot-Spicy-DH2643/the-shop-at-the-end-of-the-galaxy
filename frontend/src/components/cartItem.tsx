'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import AsteroidSVGMoving from '@/components/asteroidSVGMoving';
import { useAppStore } from '@/store/useAppViewModel';
import { Asteroid } from '@/store/AppModel';

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  asteroid: Asteroid;
}

export default function CartItem({ id, name, price, asteroid }: CartItemProps) {
  const { removeFromCart } = useAppStore();

  const handleRemoveFromCart = () => {
    // console.log('Removing from cart:', asteroid.id);
    removeFromCart(asteroid.id);
  };

  return (
    <tr className="border-b border-white/10 last:border-none">
      <td className="py-3">
        <div className="flex items-center gap-3">
          <AsteroidSVGMoving id={id.toString()} size={42} bgsize={36} />
          <span className="text-base">{name}</span>
        </div>
      </td>

      <td className="py-3 text-right text-gray-400">
        <div className="inline-flex items-center gap-1">
          <Image src="/cosmocoin-tiny.png" alt="coin" width={16} height={16} />
          <span>{price}</span>
        </div>
      </td>

      <td className="py-3 text-right">
        <button
          onClick={handleRemoveFromCart}
          className="p-1 text-gray-500 hover:text-pink-500 transition cursor-pointer"
          aria-label="Remove item"
        >
          <X size={18} />
        </button>
      </td>
    </tr>
  );
}
