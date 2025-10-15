import { useEffect, useState, useRef } from 'react';
import AsteroidSVG from '@/components/asteroidSVG';
import AsteroidModal from '@/components/asteroidModal';
import '@/app/globals.css';
import type { UserData } from '@/store/AppModel';
import { useGalaxyViewModel } from '@/store/useAppViewModel';

// Configuration for the orbital system
const ORBITAL_CENTER_X = -50; // pixels from left - ADJUST THIS to move Earth horizontally
const ORBITAL_CENTER_Y = 100; // pixels from top - ADJUST THIS to move Earth vertically
const ORBITAL_BAND_INNER = 400; // inner radius of the orbital band
const ORBITAL_BAND_OUTER = 550; // outer radius of the orbital band
const ASTEROID_SIZE = 80; // Increased from 60 to 80
const ACCELERATION_DURATION = 10; // seconds to reach full speed after drag release

interface AsteroidOrbit {
  id: string;
  radius: number; // distance from center
  speed: number; // degrees per second
  startAngle: number; // starting angle in degrees
}

interface GalaxyProps {
  profileData: UserData | null;
  isOwnProfile: boolean;
}

// Simple hash function to generate consistent number from string ID
const hashStringToNumber = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

export default function Galaxy({ profileData }: GalaxyProps) {
  const [loading, setLoading] = useState(true);
  const [asteroidOrbits, setAsteroidOrbits] = useState<AsteroidOrbit[]>([]);
  const [selectedAsteroidId, setSelectedAsteroidId] = useState<string | null>(
    null
  );

  // Use the Galaxy viewmodel hook for modal management
  const { modalAsteroid, handleAsteroidClick, closeModal } =
    useGalaxyViewModel(profileData);

  // Individual asteroid angles (key: asteroid id, value: current angle)
  const [asteroidAngles, setAsteroidAngles] = useState<Record<string, number>>(
    {}
  );

  // Earth rotation state (degrees)
  const [earthRotation, setEarthRotation] = useState(0);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const hasDraggedRef = useRef(false); // Track if user actually dragged (moved mouse)
  const dragStartRef = useRef<{
    x: number;
    y: number;
    angles: Record<string, number>;
  }>({
    x: 0,
    y: 0,
    angles: {},
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Acceleration state - tracks time since drag release for smooth speed ramp-up
  const accelerationStartTimeRef = useRef<number | null>(null);

  // Wrapper for handleAsteroidClick to prevent clicks during drag
  const onAsteroidClick = (asteroidId: string) => {
    console.log('Click detected! hasDragged:', hasDraggedRef.current);
    if (hasDraggedRef.current) {
      console.log('Blocked due to dragging');
      return; // Don't open modal if user was dragging
    }

    console.log('Opening modal for asteroid:', asteroidId);
    setSelectedAsteroidId(asteroidId);
    handleAsteroidClick(asteroidId);
  };

  // Initialize asteroids and their orbits
  useEffect(() => {
    if (profileData) {
      const asteroids = profileData.owned_asteroids.map(a => a.id);

      // Create orbital data for each asteroid
      const orbits: AsteroidOrbit[] = asteroids.map((id, index) => {
        // Distribute asteroids across the orbital band
        const radiusStep =
          (ORBITAL_BAND_OUTER - ORBITAL_BAND_INNER) /
          Math.max(asteroids.length - 1, 1);
        const radius = ORBITAL_BAND_INNER + index * radiusStep;

        // Use ID hash to generate consistent speed between 3-12 degrees per second
        const hash = hashStringToNumber(id);
        const speed = 3 + (hash % 9); // Gives range 3-11

        // Starting angles: bottom-right going counter-clockwise
        // Bottom-right is around 315 degrees (or -45 degrees)
        // Spread them out in the visible quarter (roughly 270-360 degrees)
        const angleSpread = 90; // degrees to spread asteroids
        const startAngle =
          270 + (index * angleSpread) / Math.max(asteroids.length - 1, 1);

        return { id, radius, speed, startAngle };
      });

      setAsteroidOrbits(orbits);

      // Initialize angles for each asteroid
      const initialAngles: Record<string, number> = {};
      orbits.forEach(orbit => {
        initialAngles[orbit.id] = orbit.startAngle;
      });
      setAsteroidAngles(initialAngles);
    }
    setLoading(false);
  }, [profileData]);

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    hasDraggedRef.current = false; // Reset drag flag
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    dragStartRef.current = {
      x: clientX,
      y: clientY,
      angles: { ...asteroidAngles }, // Store current angles
    };
  };

  // Handle drag move
  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    // Calculate angle delta based on drag distance
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    // If mouse moved more than a few pixels, mark as dragged
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasDraggedRef.current = true;
    }

    // Convert drag to rotation (both horizontal and vertical drag contribute)
    // Inverted to match intuitive drag direction
    const baseRotationDelta = -(deltaX - deltaY) * 0.5; // sensitivity factor

    // Apply rotation delta proportional to each asteroid's speed
    const newAngles: Record<string, number> = {};
    asteroidOrbits.forEach(orbit => {
      const speedMultiplier = orbit.speed / 7; // Normalize around average speed (7 is middle of 3-11)
      const individualDelta = baseRotationDelta * speedMultiplier;
      newAngles[orbit.id] =
        dragStartRef.current.angles[orbit.id] + individualDelta;
    });
    setAsteroidAngles(newAngles);
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
    // Start acceleration timer when drag is released
    accelerationStartTimeRef.current = Date.now();
  };

  // Add global mouse up listener
  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, []);

  // Auto-rotation when not dragging
  useEffect(() => {
    if (isDragging || asteroidOrbits.length === 0) return;

    let animationFrameId: number;
    let lastTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      // Calculate acceleration factor (0 to 1) based on time since drag release
      let accelerationFactor = 1;
      if (accelerationStartTimeRef.current !== null) {
        const timeSinceRelease =
          (currentTime - accelerationStartTimeRef.current) / 1000;
        if (timeSinceRelease < ACCELERATION_DURATION) {
          // Smooth easing function (ease-out cubic)
          const progress = timeSinceRelease / ACCELERATION_DURATION;
          accelerationFactor = 1 - Math.pow(1 - progress, 3);
        } else {
          // Acceleration complete, clear the timer
          accelerationStartTimeRef.current = null;
          accelerationFactor = 1;
        }
      }

      // Update each asteroid's angle based on its individual speed and acceleration
      setAsteroidAngles(prev => {
        const newAngles: Record<string, number> = {};
        asteroidOrbits.forEach(orbit => {
          const currentAngle = prev[orbit.id] || orbit.startAngle;
          const effectiveSpeed = orbit.speed * accelerationFactor;
          newAngles[orbit.id] = currentAngle + effectiveSpeed * deltaTime;
        });
        return newAngles;
      });

      // Rotate Earth slowly (one full rotation every 60 seconds = 6 degrees per second)
      setEarthRotation(prev => prev + 6 * deltaTime);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDragging, asteroidOrbits]);

  if (loading) {
    return <div className="text-white">Loading your galaxy..</div>;
  }

  return (
    <div className="flex justify-center items-center w-full py-10 bg-transparent">
      <div
        ref={containerRef}
        className="relative w-[600px] h-[600px] bg-black rounded-lg overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        style={{
          touchAction: 'none',
        }}
      >
        {/* Earth image - positioned at top-left with natural rotation */}
        <div
          className="absolute rounded-full shadow-2xl shadow-blue-500/30 overflow-hidden"
          style={{
            width: '600px',
            height: '600px',
            left: `${ORBITAL_CENTER_X - 300}px`, // Center the 600px circle on the orbital center
            top: `${ORBITAL_CENTER_Y - 300}px`,
            backgroundImage: 'url(/NASA-EARTH.png)',
            backgroundSize: '110%', // Scale up slightly to hide black edges
            backgroundPosition: 'center',
            transform: `rotate(${earthRotation}deg)`,
            transition: isDragging ? 'none' : 'transform 50ms linear',
          }}
        />

        {/* Asteroids - each with individual rotation */}
        {asteroidOrbits.map(orbit => {
          const currentAngle = asteroidAngles[orbit.id] || orbit.startAngle;
          const angleInRadians = (currentAngle * Math.PI) / 180;
          const x = ORBITAL_CENTER_X + orbit.radius * Math.cos(angleInRadians);
          const y = ORBITAL_CENTER_Y + orbit.radius * Math.sin(angleInRadians);

          return (
            <div
              key={orbit.id}
              className="absolute transition-transform hover:scale-125 cursor-pointer"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${ASTEROID_SIZE}px`,
                height: `${ASTEROID_SIZE}px`,
                transform: `translate(-50%, -50%)`,
                filter:
                  orbit.id === selectedAsteroidId
                    ? 'drop-shadow(0 0 10px #fff)'
                    : 'none',
                transitionDuration: isDragging ? '0ms' : '50ms',
                pointerEvents: 'auto', // Ensure pointer events work
              }}
              onClick={e => {
                e.stopPropagation();
                console.log('Div clicked for asteroid:', orbit.id);
                onAsteroidClick(orbit.id);
              }}
            >
              <div style={{ pointerEvents: 'none' }}>
                <AsteroidSVG id={orbit.id} size={ASTEROID_SIZE} />
              </div>
            </div>
          );
        })}

        {/* Optional: Show orbital paths for debugging */}
        {/* Uncomment to see the orbital circles */}
        {/*
        {asteroidOrbits.map((orbit) => (
          <div
            key={`orbit-${orbit.id}`}
            className="absolute border border-white/10 rounded-full pointer-events-none"
            style={{
              width: `${orbit.radius * 2}px`,
              height: `${orbit.radius * 2}px`,
              left: `${ORBITAL_CENTER_X}px`,
              top: `${ORBITAL_CENTER_Y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
        */}

        {/* Instructions */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-2 rounded text-white text-xs">
          Drag anywhere to rotate the orbital system
        </div>
      </div>

      {/* Asteroid Modal */}
      {modalAsteroid && (
        <AsteroidModal
          asteroid={modalAsteroid}
          onClose={closeModal}
          onHandleStarred={(id: string) => {
            console.log('Starred asteroid:', id);
            // TODO: Implement star functionality
          }}
        />
      )}
    </div>
  );
}
