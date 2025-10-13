import { AsteroidType } from '../app/profile/users';

interface AsteroidDetailsProps {
  asteroid: AsteroidType | null;
}

export default function AsteroidDetails({ asteroid }: AsteroidDetailsProps) {
  if (!asteroid) {
    return (
      <div className="text-gray-400 italic">
        Select an asteroid to view its details
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Asteroid Details</h3>
      <p className="mb-2">ID: {asteroid.id}</p>
      <p className="mb-2">
        Status: {asteroid.isMyfavotire ? 'Favorite' : 'Regular'}
      </p>
    </div>
  );
}
