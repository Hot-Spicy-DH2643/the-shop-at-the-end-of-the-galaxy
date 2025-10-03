'use client';
import AsteroidSVGMoving from './asteroidSVGMoving';

export default function AsteroidModal() {
  return (
    <div className="w-50 bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Asteroid Details</h2>
      <div className="mb-2">
        <strong>Name:</strong> Asteroid 12345
      </div>
      <div>
        <AsteroidSVGMoving size={100} id="119InvariantRobot" bgsize={160} />
      </div>
    </div>
  );
}
