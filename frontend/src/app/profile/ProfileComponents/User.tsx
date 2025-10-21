'use client';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppViewModel';
import { useAuthStore } from '@/store/useAuthViewModel';
import type { UserData } from '@/store/AppModel';
import EditProfileModal from '@/components/editProfileModal';

interface UserProps {
  profileData: UserData | null;
  isOwnProfile: boolean;
}

import AsteroidSVGMoving from '@/components/asteroidSVGMoving';
import AsteroidModal from '@/components/asteroidModal';
import { Star } from 'lucide-react';

export default function User({ profileData, isOwnProfile }: UserProps) {
  const { user: firebaseUser } = useAuthStore();
  const {
    updateProfileData,
    selectedAsteroid,
    onHandleProductClick,
    onHandleStarred,
  } = useAppStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [zeroFavAsteroidId, setZeroFavAsteroidId] = useState<string>('0000000');

  useEffect(() => {
    if (profileData?.starred_asteroids?.length === 0) {
      const id = Math.floor(Math.random() * 10000000)
        .toString()
        .padStart(7, '0');
      setZeroFavAsteroidId(id);
    }
  }, []);

  const displayName = isOwnProfile
    ? firebaseUser?.displayName
    : profileData?.name;
  const displayEmail = isOwnProfile ? firebaseUser?.email : 'Hidden';

  return (
    <div className="text-white">
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
        User Information
      </h2>
      <br />

      <table className="border-separate border-spacing-y-2 text-left">
        <tbody>
          <tr>
            <td className="font-bold pr-10">Name:</td>
            <td>{displayName}</td>
          </tr>
          {isOwnProfile && (
            <tr>
              <td className="font-bold pr-10">Email:</td>
              <td>{displayEmail}</td>
            </tr>
          )}
          <tr>
            <td className="font-bold pr-10">Owned:</td>
            <td>{profileData?.owned_asteroids.length || 0} asteroids</td>
          </tr>
          <tr>
            <td className="font-bold">Favorite:</td>
            <td>{profileData?.starred_asteroids.length} asteroids</td>
          </tr>
          {isOwnProfile && (
            <tr className="font-bold">
              <td className="pr-10">
                <span
                  className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                  style={{ WebkitTextFillColor: 'transparent' }}
                >
                  Coins:
                </span>
              </td>
              <td>
                <span
                  className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                  style={{ WebkitTextFillColor: 'transparent' }}
                >
                  {profileData?.coins ?? 0}
                </span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <br />
      {isOwnProfile && (
        <>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-6 py-2 rounded shadow hover:scale-105 hover:shadow-xl transition cursor-pointer text-center md:w-autor"
          >
            Edit Profile
          </button>
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            currentName={displayName || ''}
            onUpdate={updateProfileData}
          />
        </>
      )}

      <h2 className="mt-10 text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
        Favorite Asteroids
      </h2>

      {/* user favorite asteroids */}
      {profileData?.starred_asteroids.length === 0 ? (
        <div className="text-white">
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
              <AsteroidSVGMoving
                id={zeroFavAsteroidId}
                size={100}
                bgsize={160}
              />
            </div>
            <p className="ml-10 text-lg">
              <span className="font-bold">{firebaseUser?.displayName}</span> has{' '}
              <span className="block sm:inline"> </span>
              <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                no{' '}
              </span>{' '}
              favorite asteroid{' '}
              <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                yet.
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="text-white">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {profileData?.starred_asteroids.map(asteroid => (
              <div
                key={asteroid.id}
                className="relative rounded bg-[rgba(23,23,23,0.7)]1 shadow text-center cursor-pointer"
              >
                <div className="p-6">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onHandleStarred(asteroid.id);
                    }}
                    className="p-1 absolute top-1 right-2 z-10 cursor-pointer"
                  >
                    <Star
                      className="transition duration-300 text-yellow-300"
                      fill="yellow"
                    />
                  </button>
                  <div
                    className="flex flex-col text-sm justify-center items-center hover:scale-[1.08] transition duration-300"
                    onClick={() => onHandleProductClick(asteroid.id)}
                  >
                    <AsteroidSVGMoving
                      id={asteroid.id}
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
                    <p>Price: {asteroid.price}</p>
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
      )}
    </div>
  );
}
