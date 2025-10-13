'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import User from './ProfileComponents/User';
import Galaxy from './ProfileComponents/Galaxy';
import Purchases from './ProfileComponents/Purchases';
import Friends from './ProfileComponents/Friends';

type Tab = 'user' | 'purchases' | 'galaxy' | 'friends';

const ProfileTab = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get('tab') as Tab) || 'user';
  const [activeTab, setActiveTab] = useState<Tab>(currentTab);

  useEffect(() => {
    setActiveTab(currentTab);
  }, [currentTab]);

  const handleNavigation = (tab: Tab) => {
    setActiveTab(tab);
    const newUrl = `/profile?tab=${tab}`;
    router.push(newUrl);
  };

  return (
    <div className="flex flex-col mt-10 md:mt-0">
      {/* Tab Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {(['user', 'purchases', 'galaxy', 'friends'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => handleNavigation(tab)}
            className={`px-4 py-3 text-sm sm:px-6 sm:py-2 sm:text-base font-bold text-white rounded shadow cursor-pointer box-border ${
              activeTab === tab
                ? 'bg-gradient-to-br bg-gray-900 border border-soild'
                : 'bg-black/50 hover:bg-gray-900'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content Panel */}
      <div className="bg-black/20 rounded shadow-md min-h-[150px] p-6 transition-all duration-300">
        {activeTab === 'user' && <User />}
        {activeTab === 'purchases' && <Purchases />}
        {activeTab === 'galaxy' && <Galaxy />}
        {activeTab === 'friends' && <Friends />}
      </div>
    </div>
  );
};

export default ProfileTab;
