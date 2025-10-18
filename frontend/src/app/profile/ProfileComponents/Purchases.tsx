'use client';
import { useEffect, useState } from 'react';
import type { UserData } from '@/store/AppModel';
import {
  useAppStore,
  onHandleProductClick,
  onHandleStarred,
  type SortOption,
} from '@/store/useAppViewModel';
import { sortAsteroids } from '@/store/AppModel';
import AsteroidSVGMoving from '@/components/asteroidSVGMoving';
import AsteroidModal from '@/components/asteroidModal';
import { Star } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/dropdown';
import { ChevronDownIcon } from 'lucide-react';

const SORT_OPTIONS: Array<{ name: string; value: SortOption }> = [
  { name: 'None', value: 'None' }, // for when no sorting is selected
  { name: 'Size: Small to Big', value: 'size-asc' },
  { name: 'Size: Big to Small', value: 'size-desc' },
  { name: 'Price: Low to High', value: 'price-asc' },
  { name: 'Price: High to Low', value: 'price-desc' },
  { name: 'Approaching: Soon to Later', value: 'distance-asc' },
  { name: 'Approaching: Later to Soon', value: 'distance-desc' },
];

interface PurchasesProps {
  profileData: UserData | null;
  isOwnProfile: boolean;
}

export default function Purchases({
  profileData,
  isOwnProfile,
}: PurchasesProps) {
  // const owned_asteroid_ids = []; // For testing no purchases
  const owned_asteroids = profileData?.owned_asteroids;
  const starred_asteroids = profileData?.starred_asteroids;

  const [zeroPurchaseId, setZeroPurchaseId] = useState<string>('0000000');
  const [filter, setFilter] = useState<string>('None');

  const sortedOwnedAsteroids = profileData?.owned_asteroids
    ? sortAsteroids(profileData.owned_asteroids, filter as SortOption)
    : [];

  const { selectedAsteroid } = useAppStore();

  useEffect(() => {
    if (owned_asteroids?.length === 0) {
      const id = Math.floor(Math.random() * 10000000)
        .toString()
        .padStart(7, '0');
      setZeroPurchaseId(id);
    }
  }, [owned_asteroids]);

  if (owned_asteroids?.length === 0) {
    return (
      <div className="text-white">
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
          Purchases
        </h2>
        <div className="flex flex-row items-center mt-10 text-center">
          <style>
            {`
              @keyframes blurPulse {
                0% { filter: blur(0px); opacity: 1;}
                100% { filter: blur(5px); opacity: 0.3;}
              }
            `}
          </style>
          <div className="filter animate-[blurPulse_2s_ease-in-out_forwards]">
            <AsteroidSVGMoving id={zeroPurchaseId} size={100} bgsize={160} />
          </div>
          <p className="ml-10 text-lg">
            <span className="font-bold">{profileData?.name}</span> has{' '}
            <span className="block sm:inline"> </span>
            <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              no{' '}
            </span>{' '}
            asteroid{' '}
            <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              yet.
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
        Purchases
      </h2>

      <p className="relative text-lg my-4">
        {/* Sort - Sorts the results */}
        <div className="flex items-center shrink-0 absolute top-0 right-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex text-lg font-modak text-white hover:underline justify-between gap-4 cursor-pointer">
              SORT
              <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-1.5 transition-transform duration-200 text-white group-hover:text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map(option => (
                <DropdownMenuItem
                  key={option.name}
                  className={`cursor-pointer ml-4 py-2 px-4 text-sm rounded-none
                            ${
                              option.value === filter
                                ? 'bg-purple-500 text-white' // Selected style
                                : 'bg-black hover:bg-gray-800 text-white' // Default style
                            }`}
                  onClick={() => {
                    setFilter(option.value);
                  }}
                >
                  {option.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <span className="font-bold">{profileData?.name}</span> has{' '}
        <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {owned_asteroids?.length}
        </span>{' '}
        asteroids.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {sortedOwnedAsteroids?.map(asteroid => (
          <div
            key={asteroid.id}
            className="relative rounded bg-[rgba(23,23,23,0.7)]1 shadow text-center cursor-pointer"
          >
            <div className="p-6">
              {starred_asteroids?.some(a => a.id === asteroid.id) ? (
                <button
                  onClick={() => onHandleStarred(asteroid.id)}
                  className="p-1 absolute top-1 right-2 z-10 cursor-pointer"
                >
                  <Star
                    className="transition duration-300 text-yellow-300"
                    fill="yellow"
                  />
                </button>
              ) : (
                <button
                  onClick={() => onHandleStarred(asteroid.id)}
                  className="p-1 absolute top-1 right-2 z-10 cursor-pointer"
                >
                  <Star className="hover:scale-[1.08] transition duration-300 text-white" />
                </button>
              )}
              <div className="flex flex-col text-sm justify-center items-center hover:scale-[1.08] transition duration-300">
                <AsteroidSVGMoving id={asteroid.id} size={100} bgsize={160} />

                <p className="font-bold font-sm mt-4">{asteroid.name}</p>
                <p>
                  {asteroid.is_potentially_hazardous_asteroid
                    ? 'Hazardous'
                    : 'Not Hazardous'}
                </p>
                <p>Diameter: {asteroid.size.toFixed(2)} m</p>
                <p>Price: {asteroid.price}</p>
                <button
                  className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-6 py-2 rounded shadow hover:scale-105 hover:shadow-xl transition cursor-pointer text-center m-1 my-2 md:w-auto"
                  onClick={() => onHandleProductClick(asteroid.id)}
                >
                  Show Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedAsteroid && (
        <AsteroidModal
          asteroid={selectedAsteroid}
          onClose={() => useAppStore.getState().setSelectedAsteroid(null)}
          onHandleStarred={() => onHandleStarred(selectedAsteroid.id)}
        />
      )}
    </div>
  );
}
