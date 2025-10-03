import { UserType } from '../users';

interface UserProps {
  user: UserType;
}

export default function Friends({ user }: UserProps) {
  return (
    <div className="text-white">
      <h2 className="text-xl font-bold">Friends</h2>
    </div>
  );
}
