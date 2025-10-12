'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import AsteroidSVG from '@/components/asteroidSVG';
import { useAppStore } from '@/store/useAppViewModel';

export default function Home() {
  // MVVM: accessing asteroids from the ViewModel (Zustand store)
  const { asteroids, setAsteroids } = useAppStore();

  // Fetching asteroids on mount if not already loaded
  useEffect(() => {
    if (asteroids.length === 0) {
      setAsteroids(1); // Fetch first page
    }
  }, [asteroids.length, setAsteroids]);

  // Using the 30 asteroids for the scrolling effect
  const displayAsteroids = asteroids;
  return (
    <div className="flex flex-col min-h-screen h-full font-sans">
      <Navbar />

      <main className="flex-1 galaxy-homepage flex flex-col lg:flex-row text-black h-[calc(100vh-56px)]">
        <div className="galaxy-heroarea order-1 lg:order-2 w-full lg:w-2/5 lg:h-full bg-white p-8 flex flex-col items-center justify-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-modak mb-2 bg-gradient-to-r from-blue-900 via-purple-800 to-pink-700 bg-clip-text text-transparent drop-shadow-lg p-8 py-2 uppercase leading-7 sm:leading-10 lg:leading-8 xl:leading-10">
            Own a piece of the cosmos, because why should Earth have it all?
          </h2>
          <p className="p-8 py-2 text-l md:text-xl">
            Explore rare asteroids, comets, and cosmic oddities. Bid, collect,
            and show them off in your very own solar system!
          </p>
          <div className="py-4 flex flex-col sm:flex-row lg:flex-col xl:flex-row justify-start gap-4 p-8 w-full">
            <Link
              href="/about"
              className="border border-blue-600 text-blue-900 bg-transparent px-6 py-2 rounded hover:bg-blue-50 hover:scale-105 hover:shadow-xl transition cursor-pointer text-center"
            >
              🔍 More Info
            </Link>
            <Link
              href="/shop"
              className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-6 py-2 rounded shadow hover:scale-105 hover:shadow-xl transition cursor-pointer text-center"
            >
              🪐 Open Shop
            </Link>
          </div>
        </div>

        <div className="galaxy-storefront galaxy-bg-space order-2 lg:order-1 w-full lg:w-3/5 lg:h-full p-4 overflow-hidden relative flex-1">
          {displayAsteroids.length > 0 ? (
            displayAsteroids.map((asteroid, idx) => (
              <div
                key={`${asteroid.id}`}
                className={`absolute w-80 ${idx % 2 === 0 ? 'left-0' : 'right-0'} animate-moveUp mx-[-40px] sm:mx-[0px] md:mx-[10vw] lg:mx-[-2vw] xl:mx-[5vw] 2xl:mx-[10vw]`}
                style={{
                  top: `${idx * 180}px`, // space out cards, start just below top
                  animationDuration: '60s', // slower movement
                }}
              >
                <div className="rounded bg-[rgba(23,23,23,0.7)] shadow flex flex-col items-center p-8 m-4 overflow-hidden">
                  <div className="w-[100px] hover:scale-[1.08] transition duration-300">
                    <AsteroidSVG id={`${asteroid.id}`} size={100} />
                  </div>
                  <p className="text-white font-bold text-lg pt-4">
                    {asteroid.name}
                  </p>
                  <p className="text-gray-400">
                    {asteroid.is_potentially_hazardous_asteroid
                      ? 'Hazardous'
                      : 'Not Hazardous'}
                  </p>
                  <p className="text-gray-400">Size: {asteroid.size} m</p>
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
            ))
          ) : (
            // Loading placeholder - show while asteroids are being fetched
            <div className="flex items-center justify-center h-full">
              <p className="text-white text-xl">Loading asteroids...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
