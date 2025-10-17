import AsteroidSVG from '../asteroidSVG';
import Link from 'next/link';
import { Asteroid } from '@/store/AppModel';
import { useAppStore } from '@/store/useAppViewModel';
import { Star, Orbit, Telescope, ShoppingBasket } from 'lucide-react';
import Image from 'next/image';

// orbit icon for asteroids owned by you
// telescope for asteroids owned by others
// shopping basket if its in your basket

interface ProductProps {
  asteroid: Asteroid;
  isStarred: boolean;
  onHandleProductClick: (id: string) => void;
  onHandleStarred: (id: string) => void;
}

export default function Product({
  asteroid,
  isStarred,
  onHandleProductClick,
  onHandleStarred,
}: ProductProps) {

  const {userData} = useAppStore();
  
  return (
    <div className="relative">
      <div className='absolute right-3 flex flex-col items-center space-y-2'>
        {/* Star button*/}
        <button
            onClick={() => onHandleStarred(asteroid.id)}
            className="cursor-pointer"
          >
            {isStarred ? (
              <Star
                className="hover:scale-[1.08] transition duration-300 text-yellow-300"
                fill="yellow"
              />
            ) : (
              <Star className="hover:scale-[1.08] transition duration-300 text-white" />
            )}
          </button>
          
          {asteroid.owner ? (
            userData?.owned_asteroids.some(a => a.id === asteroid.id) ? (
              /* Owned by user */
              <Orbit className="hover:scale-[1.08] transition duration-300 text-white right-2" />
            ) : (
              /* Owned by other user */
              <Telescope className="hover:scale-[1.08] transition duration-300 text-white right-2" />
            )
          ) : null}
      </div>

      <div
        onClick={() => onHandleProductClick(asteroid.id)}
        className="group animate-fade-in rounded flex flex-col items-center m-4 cursor-pointer"
      >
        {/* Asteroid Image */}
        <div className="group-hover:scale-[1.08] transition duration-300 p-1 pb-2">
          <AsteroidSVG id={asteroid.id} size={100} />
        </div>

        {/* Text Information */}
        <div className="flex flex-col items-center text-center space-y-1 group-hover:scale-[1.08] transition duration-300">
          {/* Name */}
          <h3 className="text-white font-bold text-lg truncate">
            {asteroid.name.length > 18
              ? `${asteroid.name.substring(0, 15)}...`
              : asteroid.name}
          </h3>

          {/* Hazardous / Diameter */}
          <p className="text-gray-400 text-xs">
            {asteroid.is_potentially_hazardous_asteroid
              ? 'Hazardous'
              : 'Not Hazardous'}
          </p>

          {/* Size */}
          <p className="text-gray-400 text-xs">Size: {asteroid.size} m</p>

          {/* Price */}

          {userData?.cart_asteroids.some(a => a.id === asteroid.id) 
            ? <button  onClick={handleRemoveFromCart}>

            </button>
        }

          <p className="mt-1 font-bold text-purple-400">
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
      </div>
    </div>
  );
}
