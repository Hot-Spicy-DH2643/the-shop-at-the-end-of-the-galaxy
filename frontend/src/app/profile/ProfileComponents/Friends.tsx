'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthViewModel';
import type { UserData } from '@/store/AppModel';

interface FriendsProps {
  profileData: UserData | null;
  isOwnProfile: boolean;
}

export default function Friends({ profileData, isOwnProfile }: FriendsProps) {
  const { user: firebaseUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(
    'following'
  );

  const displayName = profileData?.name || firebaseUser?.displayName;

  const followers = profileData?.followers || [];
  const following = profileData?.following || [];
  const activeList = activeTab === 'followers' ? followers : following;

  const router = useRouter();

  const handleNavigation = (friendUid: string) => {
    const isSelf = friendUid === firebaseUser?.uid;
    router.push(isSelf ? '/profile' : `/profile?uid=${friendUid}`);
  };

  if (followers.length === 0 && following.length === 0) {
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
            <span className="font-bold">{displayName}</span> has{' '}
            <span className="block sm:inline"> </span>
            <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              no{' '}
            </span>{' '}
            followers or following{' '}
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

      {/* Tab Navigation */}
      <div className="mt-6 flex gap-8 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('following')}
          className={`pb-3 px-2 font-semibold transition-all cursor-pointer ${
            activeTab === 'following'
              ? 'border-b-2 border-pink-400 text-pink-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Following
          <span className="ml-2 text-sm">({following.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('followers')}
          className={`pb-3 px-2 font-semibold transition-all cursor-pointer ${
            activeTab === 'followers'
              ? 'border-b-2 border-pink-400 text-pink-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Followers
          <span className="ml-2 text-sm">({followers.length})</span>
        </button>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeList.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">
              {activeTab === 'followers'
                ? 'No followers yet'
                : 'Not following anyone yet'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {activeList.map(person => (
              <div
                key={person.uid}
                className="flex items-center justify-between bg-[rgba(23,23,23,0.7)] rounded-lg shadow p-3 hover:bg-[rgba(33,33,33,0.8)] transition duration-200"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Image
                    src="/default-user-img.png"
                    alt="Profile"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-contain hue-rotate-90"
                  />
                  <p className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {person.name}
                  </p>
                </div>
                <button
                  className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-4 py-1.5 rounded shadow cursor-pointer hover:scale-105 hover:shadow-lg transition text-sm"
                  onClick={() => handleNavigation(person.uid)}
                >
                  Visit Galaxy
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
