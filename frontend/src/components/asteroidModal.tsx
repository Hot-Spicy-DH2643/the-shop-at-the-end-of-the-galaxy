'use client';
import AsteroidSVGMoving from './asteroidSVGMoving';
import Image from 'next/image';
import { shopAsteroid } from '@/store/AppModel';
import { Star, ShoppingBasket } from 'lucide-react';

interface modalProps {
  asteroid: shopAsteroid;
  onClose: () => void;
  onHandleStarred: (id: string) => void;
}

export default function AsteroidModal({
  asteroid,
  onClose,
  onHandleStarred,
}: modalProps) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative w-[90vw] max-w-xl m-2 bg-black p-4 rounded-lg shadow-2xl">
        <button
          className="absolute top-4 right-5 text-3xl text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="w-100% flex flex-col md:flex-row items-center gap-4 p-4 pb-0">
          <div>
            <AsteroidSVGMoving size={100} id={asteroid.id} bgsize={160} />
          </div>

          <div className="w-100 mx-auto px-8 mt-4">
            <div className="flex flex-row mb-4 justify-between items-center">
              <h2 className="text-xl md:text-2xl font-mono">{asteroid.name}</h2>

              <button
                onClick={() => onHandleStarred(asteroid.id)}
                className="cursor-pointer"
              >
                {asteroid.is_starred ? (
                  <Star
                    size={22}
                    className="hover:scale-[1.08] transition duration-300 text-yellow-300"
                    fill="yellow"
                  />
                ) : (
                  <Star
                    size={22}
                    className="hover:scale-[1.08] transition duration-300 text-grey-600"
                  />
                )}
              </button>
            </div>

            <p>ID: {asteroid.id}</p>
            <p>
              {asteroid.is_potentially_hazardous_asteroid
                ? 'Hazardous'
                : 'Not Hazardous'}
            </p>
            <p>Diameter: {asteroid.size.toFixed(2)} m</p>
            <p className="mt-4 text-lg font-bold text-purple-400 mr-8 mb-4">
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

        <div className="mb-6 text-sm font-bold mx-auto px-8 mt-2 items-center flex flex-col md:flex-row justify-center">
          <button className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-6 py-2 rounded shadow hover:scale-105 hover:shadow-xl transition cursor-pointer text-center m-1 my-2 w-full md:w-auto">
            <ShoppingBasket className="inline-block mr-2 mb-1" size={22} />
            Add to basket
          </button>
        </div>

        <div className="overflow-hidden rounded-lg shadow bg-gradient-to-br from-gray-900 via-gray-950 to-black mb-6">
          <table className="w-full text-left">
            <tbody>
              <tr className="border-b border-gray-800 last:border-b-0">
                <td className="px-4 py-3 text-purple-200 font-semibold w-1/3">
                  Orbit class type:
                </td>
                <td className="px-4 py-3 text-pink-100">
                  AMO (Near-Earth asteroid orbits){' '}
                  {/* TODO: These need to be updated with real values. */}
                  {asteroid.orbital_data?.orbit_class.orbit_class_type} + ({asteroid.orbital_data?.orbit_class.orbit_class_description})
                </td>
              </tr>
              <tr className="border-b border-gray-800 last:border-b-0">
                <td className="px-4 py-3 text-purple-200 font-semibold">
                  Interest:
                </td>
                <td className="px-4 py-3 text-pink-100">
                  👀 7 explorers eyeing this right now
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-purple-200 font-semibold align-top">
                  Parameters:
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block mr-2 mb-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-purple-200 text-xs font-mono px-3 py-1 rounded-full border border-purple-900 shadow-sm tracking-tight">
                    a = ({asteroid.orbital_data?.semi_major_axis}).toFixed(3) AU
                  </span>
                  <span className="inline-block mr-2 mb-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-purple-200 text-xs font-mono px-3 py-1 rounded-full border border-purple-900 shadow-sm tracking-tight">
                    e = ({asteroid.orbital_data?.eccentricity}).toFixed(3)
                  </span>
                  <span className="inline-block mr-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-purple-200 text-xs font-mono px-3 py-1 rounded-full border border-purple-900 shadow-sm tracking-tight">
                    i = ({asteroid.orbital_data?.inclination}).toFixed(3)&deg;
                  </span>
                  <span className="inline-block mr-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-purple-200 text-xs font-mono px-3 py-1 rounded-full border border-purple-900 shadow-sm tracking-tight">
                    {asteroid.nasa_jpl_url}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto rounded-lg shadow mt-6">
          <div className="overflow-hidden rounded-lg shadow bg-gradient-to-br from-gray-900 via-gray-950 to-black mb-6">
            <table className="w-full text-left text-white">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-purple-200 font-bold rounded-tl-lg">
                    Event
                  </th>
                  <th className="px-4 py-3 text-purple-200 font-bold">
                    Date & Time (UTC)
                  </th>
                  <th className="px-4 py-3 text-purple-200 font-bold">
                    Miss Distance
                  </th>
                  <th className="px-4 py-3 text-purple-200 font-bold rounded-tr-lg">
                    Speed
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800 last:border-b-0">
                  <td className="px-4 py-3 font-semibold">Next Approach</td>
                  <td className="px-4 py-3">
                    {asteroid.close_approach_data[0].close_approach_date_full}
                    <br />
                    <a
                      href="#"
                      className="text-purple-400 underline hover:text-purple-200"
                    >
                      {/*TODO add functionality for calender*/}
                      Add to calendar
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    ({asteroid.close_approach_data[0].miss_distance.astronomical}).toFixed(5) AU
                    <br />
                    <span className="text-xs text-gray-400">
                      ({asteroid.close_approach_data[0].miss_distance.kilometers}/1000000).toFixed(2) M km
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    ({asteroid.close_approach_data[0].relative_velocity.kilometers_per_second}).toFixed(2) km/s
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-500 italic text-center">
            Data sourced from NASA API.
          </p>
        </div>
      </div>
    </div>
  );
}
