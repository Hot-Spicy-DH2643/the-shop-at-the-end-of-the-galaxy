'use client';

import Image from 'next/image';
import Navbar from '@/components/navbar';
import ProfileTab from './ProfileTabs';
// import { getUser, UserType } from './users';
import { useAuthStore } from '@/store/useAuthViewModel';
import { useAppStore } from '@/store/useAppViewModel';

export default function Profile() {
  const { user } = useAuthStore();
  const { userData } = useAppStore();

  if (!userData) {
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

      {/* Profile content */}
      <div className="flex flex-col lg:flex-row flex-wrap justify-center items-center lg:items-start px-8 mt-4 md:mt-20 md:gap-8 lg:gap-12">
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
              Hello,
            </h4>

            <h4 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
              {user.displayName}
            </h4>
          </div>
        </div>

        {/* Buttons beside image */}
        <ProfileTab user={userData} />
      </div>
    </div>
  );
}
