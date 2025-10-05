'use client';
import { useState } from 'react';
import { UserType } from './users';

import User from './ProfileComponents/User';
import Galaxy from './ProfileComponents/Galaxy';
import Purchases from './ProfileComponents/Purchases';
import Friends from './ProfileComponents/Friends';
interface ProfileTabProps {
  user: UserType;
}

type Tab = 'user' | 'purchases' | 'galaxy' | 'friends';

const ProfileTab = ({ user }: ProfileTabProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('user');

  return (
    <div className="flex flex-col mt-10 md:mt-0">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {(['user', 'purchases', 'galaxy', 'friends'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm sm:px-6 sm:py-2 sm:text-base font-bold rounded shadow cursor-pointer ${
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
        {activeTab === 'user' && <User user={user} />}
        {activeTab === 'purchases' && <Purchases user={user} />}
        {activeTab === 'galaxy' && <Galaxy />}
        {activeTab === 'friends' && <Friends />}
      </div>
    </div>
  );
};

export default ProfileTab;
