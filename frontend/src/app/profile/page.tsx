'use client';

import Navbar from '@/components/navbar';
import Galaxy from '@/components/galaxy';
import Purchases from '@/components/purchases';
import Coins from '@/components/coins';
import Friends from '@/components/friends';
import { useState } from 'react';

type Tab = 'purchases' | 'galaxy' | 'coins' | 'friends';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>('purchases');

  return (
    <div className="galaxy-bg-space min-h-screen">
      <Navbar />

      {/* Banner */}
      <div className="bg-black/30 py-10 flex justify-center">
        <h1 className="text-4xl font-bold text-white">PROFILE</h1>
      </div>

      {/* Profile content */}
      <div className="flex items-center mt-10 px-8">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-64 h-64 rounded-full bg-gray-400"></div>
          {/* Replace with your image:
          <img src="/profile.jpg" alt="Profile"
            className="w-32 h-32 rounded-full object-contain border-2 border-gray-300"
          /> */}
        </div>

        {/* Buttons beside image */}
        <div className="flex flex-col ml-24 -mt-20">
          <div className="flex flex-wrap gap-4 mb-6">
            {(['purchases', 'galaxy', 'coins', 'friends'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-bold text-sm rounded shadow ${
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
            {activeTab === 'purchases' && <Purchases />}
            {activeTab === 'galaxy' && <Galaxy />}
            {activeTab === 'coins' && <Coins />}
            {activeTab === 'friends' && <Friends />}
          </div>
        </div>
      </div>
    </div>
  );
}
