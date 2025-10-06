import Image from 'next/image';
import { UserType } from '../users';
interface UserProps {
  user: UserType;
}

export default function Friends({ user }: UserProps) {
  // const friends = user.friends;
  const friends = [];

  if (friends.length === 0) {
    return (
      <div className="text-white">
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
          Friends
        </h2>
        <div className="flex flex-row items-center mt-10">
          <style>
            {`
              @keyframes blurPulse {
                0%, 100% { filter: blur(0px); opacity: 1;}
                50% { filter: blur(5px); opacity: 0.3;}
              }
            `}
          </style>
          <Image
            src="/default-user-img.png"
            alt="Profile"
            width={100}
            height={100}
            className="w-20 h-20 md:w-40 md:h-40 rounded-full object-contain filter animate-[blurPulse_6s_ease-in-out_infinite]"
          />

          <p className="ml-10 text-lg">
            <span className="font-bold">{user.username}</span> has{' '}
            <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              no{' '}
            </span>{' '}
            friend{' '}
            <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              yet.
            </span>
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="text-white">
      <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
        Friends
      </h2>

      <p className="mt-4 text-lg">
        <span className="font-bold">{user.username}</span> has{' '}
        <span className="font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {friends.length}
        </span>{' '}
        friends.
      </p>
    </div>
  );
}
