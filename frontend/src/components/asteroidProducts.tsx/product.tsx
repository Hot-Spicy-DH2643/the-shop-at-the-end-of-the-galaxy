import AsteroidSVG from '../asteroidSVG';
import { shopAsteroid } from '@/store/AppModel';
import { Star } from "lucide-react";

interface ProductProps {
  asteroid: shopAsteroid;
  onHandleProductClick: (id: string) => void;
  onHandleStarred: (id: string) => void;
}

export default function Product({ asteroid, onHandleProductClick, onHandleStarred }: ProductProps) {

  return (
    <div className='relative'>
      {/* Star button*/}
        <button onClick={() => onHandleStarred(asteroid.id)} className="p-1 absolute top-1 right-2 z-10 cursor-pointer">
          {asteroid.is_starred
          ? <Star className="hover:scale-[1.08] transition duration-300 text-yellow-300" fill='yellow' />
          : <Star className='hover:scale-[1.08] transition duration-300 text-grey-600'/>
          }
          
        </button>

      <div onClick={() => onHandleProductClick(asteroid.id)} className="group animate-fade-in rounded flex flex-col items-center overflow-hidden m-4 cursor-pointer">
        {/* Asteroid Image */}
        <div className="group-hover:scale-[1.08] transition duration-300 p-1 pb-2">
          <AsteroidSVG id={asteroid.id} size={100} />
        </div>

        {/* Text Information */}
        <div className="flex flex-col items-center text-center space-y-1 group-hover:scale-[1.08] transition duration-300">
          {/* Name */}
          <h3 className="text-white font-bold text-lg truncate">
            {asteroid.name}
          </h3>

          {/* Hazardous / Diameter */}
          <p className="text-gray-400 text-xs">
            {asteroid.is_potentially_hazardous_asteroid
              ? 'Hazardous'
              : 'Not Hazardous'}
          </p>
          
          {/* Diameter */}
          <p className="text-gray-400 text-xs">Diameter: {asteroid.size.toFixed(2)} m</p>

          {/* Price */}
          <p className="text-gray-400 text-xs pb-1">{asteroid.price} GC</p>
        </div>
      </div>
    </div>
    
  );
}
