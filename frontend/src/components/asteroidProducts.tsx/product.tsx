import AsteroidSVG from '../asteroidSVG';
import type { Asteroid } from '@/types/product';

interface ProductProps {
  asteroid: Asteroid;
  // add any onClick handlers if needed
}

//what do we do with pricing and ownership tags??

function calculateAsteroidSizeM(asteroid: Asteroid): number {
  const { estimated_diameter } = asteroid;
  const min = estimated_diameter.kilometers.estimated_diameter_min;
  const max = estimated_diameter.kilometers.estimated_diameter_max;
  return ((min + max) / 2) * 1000; // convert to meters
}

export default function Product({ asteroid }: ProductProps) {
  const diameterM = calculateAsteroidSizeM(asteroid);

  return (
    <div className="group animate-fade-in rounded flex flex-col items-center overflow-hidden m-4 cursor-pointer">
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
        <p className="text-gray-400 text-xs">Diameter: {diameterM.toFixed(1)} m</p>

        {/* Price placeholder */}
        <p className="text-gray-400 text-xs pb-1">price</p>
      </div>
    </div>
  );
}
