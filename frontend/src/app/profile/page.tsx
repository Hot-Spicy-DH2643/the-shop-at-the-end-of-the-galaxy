'use client';

import Navbar from '@/components/navbar';
import Galaxy from '@/components/galaxy';
import User from '@/components/user';
import Purchases from '@/components/purchases';
import Friends from '@/components/friends';
import { useState } from 'react';

type Tab = 'user' | 'purchases' | 'galaxy' | 'friends';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>('user');

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
              show_user_ID
            </h4>
            <p>Hello👋, show_user_name</p>
          </div>
        </div>

        {/* Buttons beside image */}
        <div className="flex flex-col mt-10 md:mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {(['user', 'purchases', 'galaxy', 'friends'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm sm:px-6 sm:py-2 sm:text-base font-bold rounded shadow ${
                  activeTab === tab
                    ? 'bg-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {tab.toUpperCase().replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Content Panel */}
          <div className="bg-black/20 p-6 rounded shadow-md min-h-[150px] w-full transition-all duration-300">
            {activeTab === 'user' && <User />}
            {activeTab === 'purchases' && <Purchases />}
            {activeTab === 'galaxy' && <Galaxy />}
            {activeTab === 'friends' && <Friends />}
          </div>
        </div>
      </div>
    </div>
  );
}
