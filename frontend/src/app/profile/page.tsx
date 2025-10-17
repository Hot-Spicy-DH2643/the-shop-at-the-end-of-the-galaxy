'use client';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import ProfileTab from './ProfileTabs';

import { useAuthStore } from '@/store/useAuthViewModel';
import { useAppStore } from '@/store/useAppViewModel';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Profile() {
  const { user } = useAuthStore();
  const { userData, viewedProfile, setUserData, loading, setViewedProfile } =
    useAppStore();
  const router = useRouter();

  // Fetch user data on mount
  useEffect(() => {
    // console.log('Fetching user data, user:', user);
    if (user?.uid) {
      setUserData();
    }
    // setViewedProfile("kQFpp5VtxSUAHeVP3We5yGZp5mp1"); // temporary line to access another users page
  }, [setUserData, user]);

  // Determine which profile to display
  const profileData = viewedProfile || userData;
  const isOwnProfile = !viewedProfile;

  if (!user || loading || !profileData) {
    return (
      <div className="galaxy-bg-space min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="galaxy-bg-space min-h-screen">
      <Navbar />

      {/* Banner */}
      <div className="w-full h-40 bg-transparent text-white items-center justify-center flex text-5xl font-modak py-6 px-4">
        PROFILE
      </div>

      {/* Container for back button and profile content */}
      <div className="px-8 mt-4 max-w-5xl mx-auto">
        {/* Profile content */}
        <div className="flex-col">
          {/* Back button when viewing other profile */}
          {!isOwnProfile && (
            <div className="mb-6">
              <button
                onClick={() => {
                  useAppStore.setState({ viewedProfile: null });
                  router.push('/profile');
                }}
                className="text-purple-400 hover:text-pink-400 transition flex items-center gap-3 text-xl font-semibold cursor-pointer px-4 py-2 hover:bg-purple-400/10 rounded-lg"
              >
                <span className="text-2xl">◄</span> Back to My Profile
              </button>
            </div>
          )}
          <div className="flex flex-col lg:flex-row flex-wrap lg:items-start md:gap-8 lg:gap-12">
            {/* Profile Image */}
            <div className="flex flex-row lg:flex-col justify-center items-center gap-4">
              {/* <div className="w-20 h-20 md:w-40 md:h-40"></div> */}
              <Image
                src="/default-user-img.png"
                alt="Profile"
                width={160}
                height={160}
                className="w-20 h-20 md:w-40 md:h-40 rounded-full object-contain"
              />
              <div className="text-white text-center leading-8">
                {/* user information */}
                <h4 className="text-2xl md:text-4xl lg:text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
                  {isOwnProfile ? 'Hello,' : ''}
                </h4>

                <h4 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg pb-3">
                  {isOwnProfile ? user?.displayName : profileData?.name}
                </h4>

                {/* Follow/Unfollow button */}
                {!isOwnProfile && (
                  <button className="inline-block bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-8 rounded shadow hover:scale-105 hover:shadow-xl transition cursor-pointer text-center">
                    Follow
                  </button>
                )}
              </div>
            </div>

            {/* Buttons beside image */}
            <ProfileTab profileData={profileData} isOwnProfile={isOwnProfile} />
          </div>
        </div>
      </div>
    </div>
  );
}
