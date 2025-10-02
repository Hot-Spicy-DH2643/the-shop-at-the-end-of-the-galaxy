import Link from 'next/link';
import Navbar from '@/components/navbar';
import AsteroidMovingSVG from '@/components/asteroidSVGMoving';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen h-full font-sans">
      <Navbar />
      <main>
        <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
          <section className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-modak mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
              ABOUT THE SHOP
            </h1>

            <div className="flex flex-col lg:flex-row items-center">
              <div>
                <AsteroidMovingSVG
                  id="119InvariantRobot"
                  size={150}
                  bgsize={300}
                />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl m-6 lg:ml-8 text-white font-bold">
                  Welcome to{' '}
                  <strong className="font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
                    The Shop at the End of the Galaxy
                  </strong>{' '}
                  - your one-stop destination for all things cosmic and
                  extraordinary!
                </h2>
              </div>
            </div>

            <div>
              <p className="m-6 mt-0 lg:text-lg lg:mt-8">
                Located at the very edge of known space, our shop has been
                serving intergalactic travelers, space explorers, and cosmic
                wanderers for over 42 millennia. Whether you&apos;re looking for
                exotic alien artifacts or rare cosmic materials, we&apos;ve got
                you covered.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold m-6 mt-8 mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
                Our Mission
              </h2>
              <p className="m-6">
                To provide the finest goods and services to beings from across
                the universe, while maintaining the highest standards of quality
                and customer satisfaction. No matter which dimension you&apos;re
                from!
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-extrabold m-6 mt-8 mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
                Why Choose Us?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 m-4">
                <div className="rounded bg-neutral-900 bg-opacity-70 shadow flex flex-col items-center p-6 m-2 text-white">
                  <span className="text-4xl mb-2">🪐</span>
                  <span className="font-bold text-lg mb-1">
                    Over 42,000 years of intergalactic trading experience
                  </span>
                </div>
                <div className="rounded bg-neutral-900 bg-opacity-70 shadow flex flex-col items-center p-6 m-2 text-white">
                  <span className="text-4xl mb-2">🌌</span>
                  <span className="font-bold text-lg mb-1">
                    Products sourced from 15 different galaxies
                  </span>
                </div>
                <div className="rounded bg-neutral-900 bg-opacity-70 shadow flex flex-col items-center p-6 m-2 text-white">
                  <span className="text-4xl mb-2">🛸</span>
                  <span className="font-bold text-lg mb-1">
                    24/7 customer support (across all time zones and dimensions)
                  </span>
                </div>
                <div className="rounded bg-neutral-900 bg-opacity-70 shadow flex flex-col items-center p-6 m-2 text-white">
                  <span className="text-4xl mb-2">🚀</span>
                  <span className="font-bold text-lg mb-1">
                    Free shipping to anywhere in the known universe
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-center text-center mt-8">
                <h2 className="text-2xl font-extrabold m-6 mt-8 mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
                  Ready to Spend your Credits?
                </h2>
                <Link
                  href="/shop"
                  className="inline-block bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-6 py-2 rounded shadow hover:scale-105 hover:shadow-xl transition cursor-pointer text-center"
                >
                  🪐 Start Browsing
                </Link>
              </div>

              <div className="flex flex-row justify-center mt-12 gap-12">
                <AsteroidMovingSVG id="970801ML" size={150} bgsize={300} />
                <AsteroidMovingSVG id="010512PK" size={150} bgsize={300} />
                <AsteroidMovingSVG id="651117ZB" size={150} bgsize={300} />
                <AsteroidMovingSVG id="690424IB" size={150} bgsize={300} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
