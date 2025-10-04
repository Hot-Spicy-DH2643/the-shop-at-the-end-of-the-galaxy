import { UserType } from '../users';
interface UserProps {
  user: UserType;
}

export default function Purchases({ user }: UserProps) {
  return (
    <div className="text-white">
      <h2 className="text-xl font-bold text-white">Purchases</h2>
      {user.owned_asteroids.map(asteroid => (
        <p key={asteroid}>{asteroid}</p>
      ))}
    </div>
  );
}
