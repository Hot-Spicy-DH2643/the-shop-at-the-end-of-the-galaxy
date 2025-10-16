import AsteroidSVG from '../asteroidSVG';
import { ShopAsteroid } from '@/store/AppModel';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface ProductProps {
  asteroid: ShopAsteroid;
  onHandleProductClick: (id: string) => void;
  onHandleStarred: (id: string) => void;
}

export default function Product({
  asteroid,
  onHandleProductClick,
  onHandleStarred,
}: ProductProps) {
  return (
    <div className="relative">
      {/* Star button*/}
      <button
        onClick={() => onHandleStarred(asteroid.id)}
        className="p-1 absolute top-1 right-2 z-10 cursor-pointer"
      >
        {asteroid.is_starred ? (
          <Star
            className="hover:scale-[1.08] transition duration-300 text-yellow-300"
            fill="yellow"
          />
        ) : (
          <Star className="hover:scale-[1.08] transition duration-300 text-white" />
        )}
      </button>

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
