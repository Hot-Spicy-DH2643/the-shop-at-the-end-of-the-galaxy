import { useEffect, useState } from 'react';
import { getUser, UserType, AsteroidType } from '../users';
import AsteroidSVGMoving from '@/components/asteroidSVGMoving';
import AstroidSVG from '@/components/asteroidSVGMoving';

export default function Galaxy() {
  const [userAsteroids, setUserAsteroids] = useState<AsteroidType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return <div className="text-white">Loading your galaxy</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg mb-6">
        My Galaxy
      </h2>

      {userAsteroids.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userAsteroids.map(asteroid => (
            <div
              key={asteroid.id}
              className="bg-black/20 p-4 rounded-lg hover:bg-black/30 transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 relative mb-4">
                  <AstroidSVG id={asteroid.id.toString()} size={120} />
                </div>
                <h3 className="text-white font-bold">Asteroid {asteroid.id}</h3>
                <p className="text-gray-400 text-sm">
                  {asteroid.isMyfavotire ? '⭐ Favorite' : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-white text-center p-8">
          <p className="mb-4">You have not purchased any asteroids yet </p>
          <a
            href="/shop"
            className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-6 py-2 rounded shadow hover:scale-105 hover:shadow-xl transition cursor-pointer inline-block"
          >
            Browse Shop
          </a>
        </div>
      )}
    </div>
  );
}

/*
  return (
    <div>
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
        Galaxy
      </h2>
      <p className="text-white mt-2">Galaxy is here.</p>
    </div>
  );
}
*/
