import AsteroidSVG from "../asteroidSVG"
import type { Asteroid } from "@/types/product"

interface ProductProps {
  asteroid: Asteroid;
  // add any onClick handlers if needed
}

//what do we do with pricing and ownership tags??

function calculateAsteroidSizeM(asteroid: Asteroid): number {
  const { estimated_diameter } = asteroid;
  const min = estimated_diameter.kilometers.estimated_diameter_min;
  const max = estimated_diameter.kilometers.estimated_diameter_max;
  return (min + max) / 2 * 1000; // convert to meters
}

export default function Product({ asteroid }: ProductProps) {
    const diameterM = calculateAsteroidSizeM(asteroid);

    return (

        <div className="group animate-fade-in rounded flex flex-col items-center overflow-hidden ">
        
            {/* Asteroid Image */}
            <div className="mb-3 group-hover:scale-[1.08] transition duration-300 p-4">
                <AsteroidSVG id={asteroid.id} size={100} />
            </div>

            {/* Text Information */}
            <div className="flex flex-col items-center text-center space-y-1 group-hover:underline transition duration-300 p-">
                {/* Name */}
                <h3 className="text-white font-bold text-sm truncate">
                {asteroid.name}
                </h3>

                {/* Hazardous / Diameter */}
                <p className="text-gray-400 text-xs">
                {asteroid.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Not Hazardous'}, Diameter:{" "}
                {diameterM.toFixed(1)} m
                </p>

                {/* Price placeholder */}
                <p className="text-gray-400 text-xs font-medium">price</p>
            </div>
       
        
            {/* 
            <div className="group relative">
                <div className="group rounded flex flex-col items-center overflow-hidden hover:scale-[1.10] transition duration-300">
                    <AsteroidSVG id={asteroid.id} size={100} />
                </div>
                <div className="group rounded flex flex-col items-center overflow-hidden">
                    <div>
                        <h3 className="text-sm text-white"> {asteroid.name} </h3>
                        <p className="mt-1 text-sm text-gray-500"> 
                            {asteroid.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Not Hazardous'},
                            Diameter: {diameterKm.toFixed(1)} m
                        </p>
                        <p className="text-sm font-medium text-gray-500"> price </p>
                    </div>
                </div>
            </div>
            */}
         </div>
    );
}
