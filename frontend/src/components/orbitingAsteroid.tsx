import { AsteroidType } from '../app/profile/users';
import AsteroidSVGMoving from './asteroidSVGMoving';

//TODO: I am gonna work more with this component later, now I just want to make sure
//TODO: everything works :D

interface OrbitingAsteroidProps {
  asteroid: AsteroidType;
  isSelected: boolean;
  orbitRadius: number;
  orbitDuration: number;
  orbitTilt: number;
  depth: number;
  onClick: (asteroid: AsteroidType) => void;
}

export default function OrbitingAsteroid({
  asteroid,
  isSelected,
  orbitRadius,
  orbitDuration,
  orbitTilt,
  depth,
  onClick,
}: OrbitingAsteroidProps) {
  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        width: `${orbitRadius * 2}px`,
        height: `${orbitRadius * 2}px`,
        marginLeft: `-${orbitRadius}px`,
        marginTop: `-${orbitRadius}px`,
        animation: `spin ${orbitDuration}s linear infinite`,
        transform: `rotateX(${orbitTilt}deg) translateZ(${depth}px)`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform"
        onClick={() => onClick(asteroid)}
      >
        <AsteroidSVGMoving id={asteroid.id.toString()} size={60} bgsize={40} />
      </div>
    </div>
  );
}
