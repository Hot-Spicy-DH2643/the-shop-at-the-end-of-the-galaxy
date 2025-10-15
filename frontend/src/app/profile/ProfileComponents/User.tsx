'use client';
import { useAuthStore } from '@/store/useAuthViewModel';
import type { UserData } from '@/store/AppModel';

interface UserProps {
  profileData: UserData | null;
  isOwnProfile: boolean;
}

export default function User({ profileData, isOwnProfile }: UserProps) {
  const { user: firebaseUser } = useAuthStore();

  const displayName = isOwnProfile
    ? firebaseUser?.displayName
    : profileData?.name;
  const displayEmail = isOwnProfile ? firebaseUser?.email : 'Hidden';

  return (
    <div className="text-white">
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
        User Information
      </h2>
      <br />

      <table className="border-separate border-spacing-x-10 -ml-10 border-spacing-y-2">
        <tbody>
          <tr>
            <td className="font-bold">Name:</td>
            <td>{displayName}</td>
          </tr>
          {isOwnProfile && (
            <tr>
              <td className="font-bold">Email:</td>
              <td>{displayEmail}</td>
            </tr>
          )}
          <tr>
            <td className="font-bold">Owned:</td>
            <td>{profileData?.owned_asteroid_ids.length || 0} asteroids</td>
          </tr>
          <tr>
            <td className="font-bold">Have:</td>
            {profileData?.following.length !== 0 ? (
              <td>{profileData?.following.length} friends</td>
            ) : (
              <td>0 friend</td>
            )}
          </tr>
          {isOwnProfile && (
            <tr className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              <td>Coins:</td>
              <td>{profileData?.coins || 0}</td>
            </tr>
          )}
        </tbody>
      </table>
      {isOwnProfile && (
        <button className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-6 py-2 rounded shadow hover:scale-105 hover:shadow-xl transition cursor-pointer text-center m-1 my-2 md:w-autor">
          Change Infomation
        </button>
      )}
    </div>
  );
}
