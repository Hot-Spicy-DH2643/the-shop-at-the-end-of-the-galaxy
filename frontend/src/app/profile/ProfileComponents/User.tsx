'use client';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppViewModel';
import { useAuthStore } from '@/store/useAuthViewModel';

export default function User() {
  const { user: firebaseUser } = useAuthStore();
  const { userData, setUserData } = useAppStore();

  useEffect(() => {
    setUserData();
  }, []);

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
            <td>{firebaseUser?.displayName}</td>
          </tr>
          <tr>
            <td className="font-bold">Email:</td>
            <td>{firebaseUser?.email}</td>
          </tr>
          <tr>
            <td className="font-bold">Owned:</td>
            <td>{userData?.owned_asteroid_ids.length} asteroids</td>
          </tr>
          <tr>
            <td className="font-bold">Have:</td>
            {userData?.following.length !== 0 ? (
              <td>{userData?.following.length} friends</td>
            ) : (
              <td>0 friend</td>
            )}
          </tr>
          <tr className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            <td>Coins:</td>
            <td>{userData?.coins}</td>
          </tr>
        </tbody>
      </table>
      <button className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-6 py-2 rounded shadow hover:scale-105 hover:shadow-xl transition cursor-pointer text-center m-1 my-2 md:w-autor">
        Change Infomation
      </button>
    </div>
  );
}
