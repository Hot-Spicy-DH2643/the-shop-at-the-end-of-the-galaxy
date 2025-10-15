'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthViewModel';
import { useAppStore } from '@/store/useAppViewModel';
import type { UserData } from '@/store/AppModel';
import EditProfileModal from '@/components/editProfileModal';
import { gql } from '@apollo/client';
import client from '@/lib/apollo-client';

interface UserProps {
  profileData: UserData | null;
  isOwnProfile: boolean;
}

const UPDATE_USER_NAME = gql`
  mutation UpdateUserName($uid: String!, $name: String!) {
    updateUserName(uid: $uid, name: $name) {
      uid
      name
    }
  }
`;

export default function User({ profileData, isOwnProfile }: UserProps) {
  const { user: firebaseUser } = useAuthStore();
  const { setUserData } = useAppStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const displayName = isOwnProfile
    ? firebaseUser?.displayName
    : profileData?.name;
  const displayEmail = isOwnProfile ? firebaseUser?.email : 'Hidden';

  const handleUpdateProfile = async (newName: string) => {
    if (!firebaseUser?.uid) return;

    try {
      // Update backend via GraphQL
      await client.mutate({
        mutation: UPDATE_USER_NAME,
        variables: {
          uid: firebaseUser.uid,
          name: newName,
        },
      });

      // Refresh user data
      await setUserData();
    } catch (error) {
      console.error('Error updating user name in backend:', error);
      throw error;
    }
  };

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
            <td>{profileData?.owned_asteroid_ids.length || 0} asteroids</td>
          </tr>
          <tr>
            <td className="font-bold pr-10">Have:</td>
            {profileData?.following.length !== 0 ? (
              <td>{profileData?.following.length} friends</td>
            ) : (
              <td>0 friend</td>
            )}
          </tr>
          {isOwnProfile && (
            <tr className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              <td className="pr-10">Coins:</td>
              <td>{profileData?.coins || 0}</td>
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
            onUpdate={handleUpdateProfile}
          />
        </>
      )}
    </div>
  );
}
