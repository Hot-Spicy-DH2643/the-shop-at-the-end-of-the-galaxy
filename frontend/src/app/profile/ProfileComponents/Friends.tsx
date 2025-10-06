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
