import { useEffect, useState } from 'react';
import { getUser, UserType, AsteroidType } from '../users';
/*import CentralPlanet from '@/components/centralPlanet';
import OrbitingAsteroid from '@/components/orbitingAsteroid';*/
import AsteroidSVGMoving from '@/components/asteroidSVGMoving';

//TODO: I am gonna structure up this code, now I have just written everything
//TODO: to make sure it works, but do not worry! :D

export default function Galaxy() {
  const [userAsteroids, setUserAsteroids] = useState<AsteroidType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState<AsteroidType | null>(
    null
  );
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchUserAsteroids = async () => {
      try {
        const userData = await getUser();
        setUserAsteroids(userData.owned_asteroids);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch asteroids');
        setLoading(false);
      }
    };

    fetchUserAsteroids();
  }, []);

  if (loading) {
    return <div className="text-white">Loading your galaxy..</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const handleAsteroidClick = (asteroid: AsteroidType) => {
    setSelectedAsteroid(asteroid);
  };

  const handleGalaxyClick = () => {
    setIsExpanded(true);
  };

  return (
    <div className="flex justify-center items-start w-full py-10 bg-transparent gap-8">
      {/* Code for the Galxy Field*/}
      <div
        className="relative flex-1 max-w-5xl h-[150px] w-[80%] bg-black text-white rounded-2xl overflow-hidden shadow-2xl perspective-3d cursor-pointer hover:shadow-blue-500/20 hover:shadow-xl transition-all duration-300"
        onClick={handleGalaxyClick}
      >
        <div className="absolute inset-0 transform-gpu rotate-x-[25deg] rotate-z-[10deg] [transform-style:preserve-3d]">
          {/* Code for the SUN */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-16 h-16 rounded-full bg-yellow-500 shadow-[0_0_50px_#fff,0_0_100px_#ff0]"></div>
          </div>

          {/* Code for the Orbiting asteroids*/}
          {userAsteroids.map(asteroid => {
            const orbitRadius = 80 + Math.random() * 200;
            const orbitDuration = 20 + Math.random() * 15;
            const orbitTilt = Math.random() * 30 - 15;
            const depth = Math.random() * 100 - 50;
            return (
              <div
                key={asteroid.id}
                className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
                style={{
                  width: `${orbitRadius * 2}px`,
                  height: `${orbitRadius * 2}px`,
                  marginLeft: `-${orbitRadius}px`,
                  marginTop: `-${orbitRadius}px`,
                  transform: `translateZ(${depth}px) rotateY(${orbitTilt}deg)`,
                  animation: `spin ${orbitDuration}s linear infinite`,
                }}
              >
                <div
                  className="absolute left-1/2 top-0 cursor-pointer transition-transform hover:scale-110"
                  onClick={e => {
                    e.stopPropagation();
                    handleAsteroidClick(asteroid);
                  }}
                  style={{
                    filter:
                      asteroid.id === selectedAsteroid?.id
                        ? 'drop-shadow(0 0 10px #fff)'
                        : 'none',
                  }}
                >
                  <AsteroidSVGMoving
                    id={asteroid.id.toString()}
                    size={40}
                    bgsize={50}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Code for the Info Panel */}
      <div className="w-[20%] min-w-[230px] bg-gray-900/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700 shadow-lg">
        {selectedAsteroid ? (
          <div>
            <h3 className="text-xl font-bold mb-4 ">Asteroid Details</h3>
            <p className="mb-2">ID: {selectedAsteroid.id}</p>
            <p className="mb-2">
              Status: {selectedAsteroid.isMyfavotire ? 'Favorite' : 'Regular'}
            </p>
          </div>
        ) : (
          <div className="text-gray-400 italic">
            Select an asteroid to view its details
          </div>
        )}
      </div>

      {/* Code for Expanding the Galaxy model*/}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="w-[90vw] h-[90vh] bg-black/80 rounded-3xl overflow-hidden perspective-3d"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute inset-0 transform-gpu rotate-x-[25deg] rotate-z-[10deg] [transform-style:preserve-3d]">
              {/* Sun in model */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-16 h-16 rounded-full bg-yellow-500 shadow-[0_0_50px_#fff,0_0_100px_#ff0]"></div>
              </div>

              {/* Orbiting asteroids in model */}
              {userAsteroids.map(asteroid => {
                const orbitRadius = 250 + Math.random() * 400;
                const orbitDuration = 20 + Math.random() * 15;
                const orbitTilt = Math.random() * 30 - 15;
                const depth = Math.random() * 200 - 100;

                return (
                  <div
                    key={`modal-${asteroid.id}`}
                    className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
                    style={{
                      width: `${orbitRadius * 2}px`,
                      height: `${orbitRadius * 2}px`,
                      marginLeft: `-${orbitRadius}px`,
                      marginTop: `-${orbitRadius}px`,
                      transform: `translateZ(${depth}px) rotateY(${orbitTilt}deg)`,
                      animation: `spin ${orbitDuration}s linear infinite`,
                    }}
                  >
                    <div
                      className="absolute left-1/2 top-0 cursor-pointer transition-transform hover:scale-110"
                      onClick={() => handleAsteroidClick(asteroid)}
                    >
                      <AsteroidSVGMoving
                        id={asteroid.id.toString()}
                        size={100}
                        bgsize={120}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Close button for the model */}
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-xl"
            onClick={() => setIsExpanded(false)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .perspective-3d {
          perspective: 800px;
        }
      `}</style>
    </div>
  );
}
