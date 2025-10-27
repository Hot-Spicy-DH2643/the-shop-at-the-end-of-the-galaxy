'use client';
import Image from 'next/image';
import Navbar from '@/components/navbar';
import ProfileTab from './ProfileTabs';

import { useAuthStore } from '@/store/useAuthViewModel';
import { useAppStore } from '@/store/useAppViewModel';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Suspense } from 'react';

const ProfileContent = () => {
  const { user } = useAuthStore();
  const {
    userData,
    viewedProfile,
    setUserData,
    userLoading,
    updateFollow,
    updateUnfollow,
    setViewedProfile,
    error,
  } = useAppStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const profileUid = searchParams.get('uid');
  const queryString = searchParams.toString();
  const userId = user?.uid;
  const isAuthenticated = Boolean(userId);
  const isOwnProfile =
    isAuthenticated && (!profileUid || profileUid === userId);
  const viewingUid = isOwnProfile ? userId : profileUid;

  // Fetch user data on mount
  useEffect(() => {
    // // console.log('Fetching user data, user:', user);
    if (userId) {
      setUserData();
    }
  }, [setUserData, userId]);

  useEffect(() => {
    if (!userId || profileUid) return;
    const params = new URLSearchParams(queryString);
    params.set('uid', userId);
    const newQuery = params.toString();
    router.replace(
      newQuery ? `/profile?${newQuery}` : `/profile?uid=${userId}`
    );
  }, [profileUid, queryString, router, userId]);

  useEffect(() => {
    if (isAuthenticated || profileUid) return;
    router.replace('/login');
  }, [isAuthenticated, profileUid, router]);

  useEffect(() => {
    if (!viewingUid || isOwnProfile) {
      if (viewedProfile) {
        useAppStore.setState({ viewedProfile: null });
      }
      return;
    }

    if (viewedProfile?.uid !== viewingUid) {
      setViewedProfile(viewingUid);
    }
  }, [viewingUid, isOwnProfile, setViewedProfile, viewedProfile]);

  // Determine which profile to display
  const profileData = isOwnProfile ? userData : viewedProfile;
  const awaitingProfile =
    (isOwnProfile && userId && (userLoading || (!profileData && !error))) ||
    (!isOwnProfile && profileUid && !profileData && !error);
  const profileErrorMessage = profileUid
    ? error || 'Profile not found.'
    : isAuthenticated
      ? 'Unable to load your profile.'
      : 'Please sign in or supply a profile link.';

  if (!viewingUid && !isAuthenticated) {
    return null;
  }

  if (awaitingProfile) {
    return (
      <div className="galaxy-bg-space min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="galaxy-bg-space min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center h-screen px-6 text-center">
          <p className="text-white text-xl">{profileErrorMessage}</p>
        </div>
      </div>
    );
  }

  const canFollow = isAuthenticated && !isOwnProfile;
  const isFollowing =
    canFollow &&
    Boolean(
      userData?.following?.some(friend => friend.uid === profileData.uid)
    );

  const handleFollowClick = async () => {
    if (!canFollow) return;
    try {
      if (isFollowing) {
        await updateUnfollow(profileData.uid);
      } else {
        await updateFollow(profileData.uid);
      }
    } catch (err) {
      // console.error('Error updating follow status:', err);
    }
  };

  return (
    <div className="galaxy-bg-space min-h-screen pb-20">
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
          {!isOwnProfile && isAuthenticated && (
            <div className="mb-6">
              <button
                onClick={() => {
                  useAppStore.setState({ viewedProfile: null });
                  router.push(`/profile?uid=${userId}`);
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
                {canFollow && (
                  <button
                    onClick={handleFollowClick}
                    className="inline-block bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-8 rounded shadow hover:scale-105 hover:shadow-xl transition cursor-pointer text-center"
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
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
};

export default function Profile() {
  return (
    <Suspense
      fallback={
        <div className="galaxy-bg-space min-h-screen">
          <Navbar />
          <div className="flex justify-center items-center h-screen">
            <p className="text-white text-xl">Loading...</p>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
