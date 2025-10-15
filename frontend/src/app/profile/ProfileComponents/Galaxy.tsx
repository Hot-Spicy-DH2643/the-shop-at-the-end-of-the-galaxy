import { useEffect, useState } from 'react';
import Sun from '@/components/centralPlanet';
import OrbitPath from '@/components/orbitingAsteroid';
import AsteroidDetails from '@/components/asteroidDetails';
import AsteroidSVG from '@/components/asteroidSVG';
import '@/app/globals.css';
import { useAppStore } from '@/store/useAppViewModel';
import { Maximize } from 'lucide-react';
import { Minimize } from 'lucide-react';

const ORBIT_LANES = [
  { radius: 60, depth: -30, duration: 15, tilt: 15 },
  { radius: 90, depth: -15, duration: 20, tilt: 10 },
  { radius: 120, depth: 0, duration: 25, tilt: 5 },
  { radius: 150, depth: 15, duration: 30, tilt: -5 },
  { radius: 180, depth: 30, duration: 35, tilt: -10 },
];

//TODO: I am gonna structure up this code, now I have just written everything
//TODO: to make sure it works, but do not worry! :D

export default function Galaxy() {
  const [userAsteroids, setUserAsteroids] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { userData, setUserData } = useAppStore();

  useEffect(() => {
    setUserData();
  }, []);

  useEffect(() => {
    console.log('User Data in Galaxy:', userData);
    if (userData) {
      setUserAsteroids(userData.owned_asteroids.map(a => a.id));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-white">Loading your galaxy..</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const handleAsteroidClick = (asteroid: string) => {
    setSelectedAsteroid(asteroid);
  };

  /*
  const handleGalaxyClick = () => {
    setIsExpanded(true);
  };*/

  return (
    <div className="flex justify-center items-start w-full py-10 bg-transparent gap-8">
      <div className="relative flex-1 max-w-5xl h-[200px] w-[80%] bg-black text-white rounded-2xl overflow-hidden shadow-2xl perspective-3d hover:shadow-blue-500/20 hover:shadow-xl transition-all duration-300">
        <button
          className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors"
          onClick={e => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
        >
          <Maximize size={20} />
        </button>
        <div className="absolute inset-0 transform-gpu rotate-x-[25deg] rotate-z-[10deg] [transform-style:preserve-3d]">
          <Sun size={16} />

          {/*{ORBIT_LANES.map((lane, index) => (
            <OrbitPath key={index} {...lane} />
          ))}

          {/* Code for the Orbiting asteroids*/}
          {userAsteroids.map((asteroid, index) => {
            const lane = ORBIT_LANES[index % ORBIT_LANES.length];
            return (
              <div
                key={asteroid}
                className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
                style={{
                  width: `${lane.radius * 2}px`,
                  height: `${lane.radius * 2}px`,
                  marginLeft: `-${lane.radius}px`,
                  marginTop: `-${lane.radius}px`,
                  transform: `translateZ(${lane.depth}px) rotateX(${lane.tilt}deg)`,
                  animation: `spin ${lane.duration}s linear infinite`,
                }}
              >
                <div
                  className="absolute inset-0 rounded-full border border-white/10"
                  style={{ transform: 'scale(1, 0.3)' }}
                />
                <div
                  className="absolute left-1/2 top-0 -translate-x-1/2 cursor-pointer transition-transform hover:scale-110"
                  onClick={e => {
                    e.stopPropagation();
                    handleAsteroidClick(asteroid);
                  }}
                  style={{
                    filter:
                      asteroid === selectedAsteroid
                        ? 'drop-shadow(0 0 10px #fff)'
                        : 'none',
                  }}
                >
                  <AsteroidSVG id={asteroid.toString()} size={50} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Code for the Info Panel */}
      {!isExpanded && (
        <div className="w-[20%] min-w-[230px] bg-gray-900/80 backdrop-blur-lg p-6 rounded-xl border border-gray-700 shadow-lg text-white">
          <AsteroidDetails asteroid={selectedAsteroid} />
        </div>
      )}

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
              <Sun size={64} />

              {ORBIT_LANES.map((lane, index) => (
                <div
                  key={`expanded-${index}`}
                  className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
                  style={{
                    width: `${lane.radius * 6}px`,
                    height: `${lane.radius * 6}px`,
                    marginLeft: `-${lane.radius * 3}px`,
                    marginTop: `-${lane.radius * 3}px`,
                    transform: `translateZ(${lane.depth * 3}px) rotateX(${lane.tilt}deg)`,
                    animation: `spin ${lane.duration * 2}s linear infinite`,
                  }}
                >
                  <OrbitPath
                    radius={lane.radius * 3}
                    depth={lane.depth * 3}
                    tilt={lane.tilt}
                  />
                </div>
              ))}

              {/* Orbiting asteroids in model */}
              {userAsteroids.map((asteroid, index) => {
                const lane = {
                  radius: ORBIT_LANES[index % ORBIT_LANES.length].radius * 3,
                  depth: ORBIT_LANES[index % ORBIT_LANES.length].depth * 3,
                  duration: ORBIT_LANES[index % ORBIT_LANES.length].duration,
                  tilt: ORBIT_LANES[index % ORBIT_LANES.length].tilt,
                };

                return (
                  <div
                    key={`modal-${asteroid}`}
                    className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
                    style={{
                      width: `${lane.radius * 2}px`,
                      height: `${lane.radius * 2}px`,
                      marginLeft: `-${lane.radius}px`,
                      marginTop: `-${lane.radius}px`,
                      transform: `translateZ(${lane.depth}px) rotateX(${lane.tilt}deg)`,
                      animation: `spin ${lane.duration}s linear infinite`,
                    }}
                  >
                    <div
                      className="absolute left-1/2 top-0 -translate-x-1/2 cursor-pointer transition-transform hover:scale-110"
                      onClick={() => handleAsteroidClick(asteroid)}
                      style={{
                        filter:
                          asteroid === selectedAsteroid
                            ? 'drop-shadow(0 0 10px #fff)'
                            : 'none',
                      }}
                    >
                      <AsteroidSVG id={asteroid.toString()} size={80} />
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
            <Minimize size={20} />
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
