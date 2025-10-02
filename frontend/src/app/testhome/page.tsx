import Link from 'next/link';
import Navbar from '@/components/navbar';
import AsteroidSVG from '@/components/asteroidSVG';

const testAsteroids = [
  {
    id: 1,
    name: 'Asteroid Name 1',
    size: '30-45 km',
    hazardLevel: 'high risk',
    price: '1000 GC',
    // imageUrl: '/test-asteroids/asteroid_fixed_2021AB.svg',
  },
  {
    id: 2,
    name: 'Asteroid Name 2',
    size: '42-52 km',
    hazardLevel: 'low risk',
    price: '900 GC',
    // imageUrl: '/test-asteroids/asteroid_fixed_3542519.svg',
  },
  {
    id: 3,
    name: 'Asteroid Name 3',
    size: '50-65 km',
    hazardLevel: 'safe',
    price: '400 GC',
    // imageUrl: '/test-asteroids/asteroid_fixed_Asteroid777.svg',
  },
  {
    id: 4,
    name: 'Asteroid Name 4',
    size: '10-24 km',
    hazardLevel: 'low risk',
    price: '800 GC',
    // imageUrl: '/test-asteroids/asteroid_fixed_Comet99.svg',
  },
  {
    id: 5,
    name: 'Asteroid Name 5',
    size: '20-32 km',
    hazardLevel: 'medium risk',
    price: '500 GC',
    // imageUrl: '/test-asteroids/asteroid_fixed_XJ42.svg',
  },
  {
    id: 6,
    name: 'Asteroid Name 6',
    size: '10-12 km',
    hazardLevel: 'safe',
    price: '300 GC',
    // imageUrl: '/test-asteroids/asteroid_fixed_2021AB.svg',
  },
  {
    id: 7,
    name: 'Asteroid Name 7',
    size: '20-32 km',
    hazardLevel: 'medium risk',
    price: '500 GC',
    //imageUrl: '/test-asteroids/asteroid_fixed_3542519.svg',
  },
  {
    id: 8,
    name: 'Asteroid Name 8',
    size: '90-112 km',
    hazardLevel: 'medium risk',
    price: '1500 GC',
    // imageUrl: '/test-asteroids/asteroid_fixed_Comet99.svg',
  },
];

const repeatedAsteroids = Array(10).fill(testAsteroids).flat();
// repeat the same asteroids 10 times to simulate a larger dataset for the scrolling effect

export default function Testhome() {
  return (
    <div className="flex flex-col min-h-screen h-full font-sans">
      <Navbar />

      <main className="flex-1 galaxy-homepage flex flex-col lg:flex-row text-black h-[calc(100vh-56px)]">
        <div className="galaxy-heroarea order-1 lg:order-2 w-full lg:w-2/5 lg:h-full bg-white p-8 flex flex-col items-center justify-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-modak mb-2 text-blue-900 p-8 py-2 uppercase leading-7 sm:leading-10 lg:leading-8 xl:leading-10">
            Own a piece of the cosmos, because why should Earth have it all?
          </h2>
          <p className="p-8 py-2 text-l md:text-xl">
            Explore rare asteroids, comets, and cosmic oddities. Bid, collect,
            and show them off in your very own solar system!
          </p>
          <div className="py-4 flex flex-col sm:flex-row lg:flex-col xl:flex-row justify-start gap-4 p-8 w-full">
            <Link
              href="/about"
              className="border border-blue-600 text-blue-900 bg-transparent px-6 py-2 rounded hover:bg-blue-50 transition cursor-pointer"
            >
              🔍 More Info
            </Link>
            <Link
              href="/shop"
              className="bg-blue-900 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition cursor-pointer"
            >
              🪐 Open Shop
            </Link>
          </div>
        </div>

        <div className="galaxy-storefront galaxy-bg-space order-2 lg:order-1 w-full lg:w-3/5 lg:h-full p-4 overflow-hidden relative flex-1">
          {repeatedAsteroids.map((asteroid, idx) => (
            <div
              key={`${asteroid.id}-${idx}`}
              className={`absolute w-80 ${idx % 2 === 0 ? 'left-0' : 'right-0'} animate-moveUp mx-[-40px] sm:mx-[0px] md:mx-[10vw] lg:mx-[-2vw] xl:mx-[5vw] 2xl:mx-[10vw]`}
              style={{
                top: `${idx * 180}px`, // space out cards, start just below top
                animationDuration: '60s', // slower movement
              }}
            >
              <div className="rounded bg-[rgba(23,23,23,0.7)] shadow flex flex-col items-center p-8 m-4 overflow-hidden">
                {/* <img
                  className="w-[100px] hover:scale-[1.08] transition duration-300"
                  src={asteroid.imageUrl}
                  alt={asteroid.name}
                /> */}
                <div className="w-[100px] hover:scale-[1.08] transition duration-300">
                  <AsteroidSVG id={`${asteroid.id}-${idx}`} size={100} />
                </div>
                <p className="text-white font-bold text-lg pt-4">
                  {asteroid.name}
                </p>
                <p className="text-gray-400">{asteroid.size}</p>
                <p className="text-gray-400">{asteroid.hazardLevel}</p>
                <p className="text-gray-400">{asteroid.price}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
