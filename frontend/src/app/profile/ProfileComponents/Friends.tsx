'use client';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthViewModel';
import { useAppStore } from '@/store/useAppViewModel';

export default function Friends() {
  const { user: firebaseUser } = useAuthStore();
  const { userData, setUserData } = useAppStore();

  useEffect(() => {
    setUserData();
  }, []);

  // const friends = [];
  const following_ids = userData?.following_ids;

  const router = useRouter();

  const handleNavigation = (friendUsername: string) => {
    const newUrl = `/profile?tab=friends?friend=${friendUsername}`;
    router.push(newUrl);
  };

  if (following_ids?.length === 0) {
    return (
      <div className="text-white">
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
          Friends
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
          <Image
            src="/default-user-img.png"
            alt="Profile"
            width={100}
            height={100}
            className="w-20 h-20 md:w-40 md:h-40 rounded-full object-contain filter animate-[blurPulse_2s_ease-in-out_forwards]"
          />

          <p className="ml-10 text-lg">
            <span className="font-bold">{firebaseUser?.displayName}</span> has{' '}
            <span className="block sm:inline"> </span>
            <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              no{' '}
            </span>{' '}
            friend{' '}
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
        Friends
      </h2>

      <p className="mt-4 text-lg">
        <span className="font-bold">{firebaseUser?.displayName}</span> has{' '}
        <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {following_ids?.length}
        </span>{' '}
        friends.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {following_ids?.map(following_id => (
          <div
            key={following_id}
            className="relative rounded bg-[rgba(23,23,23,0.7)]1 shadow text-center cursor-pointer"
          >
            <div className="p-6">
              <div className="flex flex-col justify-center items-center hover:scale-[1.08] transition duration-300">
                <Image
                  src="/default-user-img.png"
                  alt="Profile"
                  width={100}
                  height={100}
                  className="w-20 h-20 md:w-40 md:h-40 rounded-full object-contain hue-rotate-90"
                />
                <p className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {following_id}
                </p>
                <p>{following_id}</p>
                <button
                  className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-6 py-2 rounded shadow hover:scale-105 hover:shadow-xl transition cursor-pointer text-center m-1 my-2 md:w-auto"
                  onClick={() => handleNavigation(following_id)}
                >
                  Visit Galaxy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
