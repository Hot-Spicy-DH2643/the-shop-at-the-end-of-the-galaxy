'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthViewModel';
import { useAppStore } from '@/store/useAppViewModel';

import AsteroidSVGMoving from '@/components/asteroidSVGMoving';

export default function Purchases() {
  const { user: firebaseUser } = useAuthStore();
  const { userData, setUserData } = useAppStore();

  useEffect(() => {
    setUserData();
  }, []);

  const user_owned_asteroids = userData?.owned_asteroids;
  const user_starred_asteroids = userData?.starred_asteroids;

  const [zeroPurchaseId, setZeroPurchaseId] = useState<string>('0000000');

  const { asteroids, setAsteroids } = useAppStore();

  useEffect(() => {
    if (user_owned_asteroids?.length === 0) {
      const id = Math.floor(Math.random() * 10000000)
        .toString()
        .padStart(7, '0');
      setZeroPurchaseId(id);
    }
    if (asteroids.length === 0) {
      setAsteroids();
    }
  }, []);

  if (user_owned_asteroids?.length === 0) {
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
            <span className="font-bold">{firebaseUser?.displayName}</span> has{' '}
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

      <p className="mt-4 text-lg">
        <span className="font-bold">{firebaseUser?.displayName}</span> has{' '}
        <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {user_owned_asteroids?.length}
        </span>{' '}
        asteroids.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {user_owned_asteroids?.map((asteroid, idx) => (
          <div
            key={asteroid.id}
            className="relative rounded bg-[rgba(23,23,23,0.7)]1 shadow text-center cursor-pointer"
          >
            <div className="p-6">
              <div className="flex flex-col text-sm justify-center items-center hover:scale-[1.08] transition duration-300">
                <AsteroidSVGMoving
                  id={`${asteroid.id}-${idx}`}
                  size={100}
                  bgsize={160}
                />

                <p className="font-bold font-sm mt-4">{asteroid.name}</p>
                <p>
                  {asteroid.is_potentially_hazardous_asteroid
                    ? 'Hazardous'
                    : 'Not Hazardous'}
                </p>
                <p>Diameter: {asteroid.size.toFixed(2)} m</p>
                <p>Price</p>
                <button className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-6 py-2 rounded shadow hover:scale-105 hover:shadow-xl transition cursor-pointer text-center m-1 my-2 md:w-auto">
                  Show Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
