import Image from 'next/image';
import Navbar from '@/components/navbar';
import ProfileTab from './ProfileTabs';
import { getUser, UserType } from './users';

export default async function Profile() {
  const user: UserType = await getUser();

  return (
    <div className="galaxy-bg-space min-h-screen">
      <Navbar />

      {/* Banner */}
      <div className="bg-black/30 py-10 flex justify-center">
        <h1 className="text-4xl font-bold text-white">PROFILE</h1>
      </div>

      {/* Profile content */}
      <div className="flex flex-col lg:flex-row flex-wrap justify-center items-center lg:items-start px-8 mt-4 md:mt-20 md:gap-8 lg:gap-12">
        {/* Profile Image */}
        <div className="flex flex-row lg:flex-col justify-center items-center gap-4">
          <div className="w-20 h-20 md:w-40 md:h-40 rounded-full bg-gray-400"></div>
          {/* Replace with your image:
          <img src="/profile.jpg" alt="Profile"
            className="w-32 h-32 rounded-full object-contain border-2 border-gray-300"
          /> */}
          <div className="text-white text-center leading-8">
            {/* user information */}
            <h4 className="text-2xl md:text-4xl lg:text-3xl xl:text-4xl font-semibold">
              Hello👋
            </h4>
            <h4 className="text-2xl font-semibold">{user.username}</h4>
          </div>
        </div>

        {/* Buttons beside image */}
        <ProfileTab user={user} />
      </div>
    </div>
  );
}
