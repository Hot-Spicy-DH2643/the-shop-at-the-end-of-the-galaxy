import { UserType } from '../users';
import AsteroidSVG from '@/components/asteroidSVG';
import AsteroidMovingSVG from '@/components/asteroidSVGMoving';

interface UserProps {
  user: UserType;
}

const testAsteroids = [
  {
    id: 1847584,
    name: 'Asteroid Name 1',
    size: '30-45 km',
    hazardLevel: 'high risk',
    price: '1000 GC',
  },
  {
    id: 2849203,
    name: 'Asteroid Name 2',
    size: '42-52 km',
    hazardLevel: 'low risk',
    price: '900 GC',
  },
  {
    id: 3029374,
    name: 'Asteroid Name 3',
    size: '50-65 km',
    hazardLevel: 'safe',
    price: '400 GC',
  },
  {
    id: 4039475,
    name: 'Asteroid Name 4',
    size: '10-24 km',
    hazardLevel: 'low risk',
    price: '800 GC',
  },
];

export default function Purchases({ user }: UserProps) {
  return (
    <div className="text-white">
      <h2 className="text-xl font-bold">Your Purchases: </h2>
      <br />

      <div className="text-white p-4">
        <div className="grid grid-cols-4 gap-x-10 gap-y-4">
          {[
            '403975',
            '3029374',
            '2849203',
            '403975',
            '3029374',
            '2849203',
            '403975',
            '3029374',
            '2849203',
            '403975',
            '3029374',
            '2849203',
            '403975',
            '3029374',
            '2849203',
            '403975',
          ].map((id, index) => (
            <div key={index} className="animate-spin360 w-16 h-16">
              <AsteroidSVG id={id} size={60} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
