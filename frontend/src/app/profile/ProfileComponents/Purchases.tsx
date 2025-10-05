'use client';
import { useEffect, useState } from 'react';
import { UserType } from '../users';
import AsteroidSVGMoving from '@/components/asteroidSVGMoving';
interface UserProps {
  user: UserType;
}

export default function Purchases({ user }: UserProps) {
  // const asteroids = user.owned_asteroids;
  const asteroids = []; // For testing no purchases

  const [zeroPurchaseId, setZeroPurchaseId] = useState<string>('0000000');

  useEffect(() => {
    const id = Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(7, '0');
    setZeroPurchaseId(id);
  }, []);

  if (asteroids.length === 0) {
    return (
      <div className="text-white">
        <h2 className="text-xl font-bold text-white">Purchases</h2>
        <div className="flex flex-row items-center mt-10">
          <AsteroidSVGMoving id={zeroPurchaseId} size={100} bgsize={160} />
          <p className="ml-10 text-lg">
            <span className="font-bold">{user.username}</span> has no asteroids{' '}
            <span className=" text-yellow-300">yet</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h2 className="text-xl font-bold text-white">Purchases</h2>

      <p className="mt-4 text-lg">
        <span className="font-bold">{user.username}</span> has{' '}
        <span className="font-bold text-yellow-300">{asteroids.length}</span>{' '}
        asteroids.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {asteroids.map((asteroid, idx) => (
          <div
            key={asteroid.id}
            className="relative rounded bg-[rgba(23,23,23,0.7)]1 shadow text-center cursor-pointer"
          >
            <div className="p-6">
              {asteroid.isMyfavotire ? (
                <p className="font-bold font-3xl mt-4 text-yellow-300 absolute top-2 left-2 z-40">
                  ⭐️
                </p>
              ) : null}

              <div className="flex flex-col justify-center items-center hover:scale-[1.08] transition duration-300">
                <AsteroidSVGMoving
                  id={`${asteroid.id}-${idx}`}
                  size={100}
                  bgsize={160}
                />

                <p className="font-bold font-sm mt-4">({asteroid.id})</p>
                <p>Size</p>
                <p>Hazard Level</p>
                <p>Price</p>
                <p>Show_Purchased_Date</p>
                <button
                  className={`text-white px-6 py-2 mt-8 rounded shadow
                 transition cursor-pointer ${
                   asteroid.isMyfavotire
                     ? 'outline outline-offset-2 outline-blue-500 hover:bg-blue-500'
                     : 'bg-blue-900 hover:bg-blue-500'
                 }`}
                >
                  {asteroid.isMyfavotire
                    ? 'Remove from my Favorites'
                    : 'Add to my Favorites'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
