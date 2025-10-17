import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import AsteroidSVG from '@/components/asteroidSVG';
import AsteroidModal from '@/components/asteroidModal';
import '@/app/globals.css';
import type { UserData, Asteroid } from '@/store/AppModel';
import { fetchAsteroidById } from '@/store/AppModel';

// Configuration for the orbital system (base values for 600px container)
const BASE_CONTAINER_SIZE = 600;
const ORBITAL_CENTER_X = -50; // pixels from left - ADJUST THIS to move Earth horizontally
const ORBITAL_CENTER_Y = 100; // pixels from top - ADJUST THIS to move Earth vertically
const ORBITAL_BAND_INNER = 400; // inner radius of the orbital band
const ORBITAL_BAND_OUTER = 650; // outer radius of the orbital band
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

  // Container size state for responsive scaling
  const [containerSize, setContainerSize] = useState(BASE_CONTAINER_SIZE);
  const scaleFactor = containerSize / BASE_CONTAINER_SIZE;

  // Modal state for asteroid details
  const [modalAsteroid, setModalAsteroid] = useState<Asteroid | null>(null);

  const handleAsteroidClick = useCallback(async (asteroidId: string) => {
    try {
      const asteroidData = await fetchAsteroidById(asteroidId);
      if (asteroidData) {
        setModalAsteroid(asteroidData);
      }
    } catch (error) {
      console.error('Error fetching asteroid details:', error);
    }
  }, []);

  const closeModal = useCallback(() => {
    setModalAsteroid(null);
  }, []);

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

  // Track container size for responsive scaling
  useEffect(() => {
    if (!containerRef.current) {
      console.log('Container ref not ready yet');
      return;
    }

    // Set initial size immediately
    const initialSize = containerRef.current.getBoundingClientRect().width;
    console.log('Initial container size:', initialSize);
    setContainerSize(initialSize);

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const size = entry.contentRect.width; // Use width since it's square
        console.log(
          'Container size:',
          size,
          'Scale factor:',
          size / BASE_CONTAINER_SIZE
        );
        setContainerSize(size);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [loading]); // Re-run when loading changes

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
    <div className="flex justify-center items-center w-full py-4 md:py-10 bg-transparent px-4">
      <div
        ref={containerRef}
        className="relative w-full max-w-[600px] aspect-square bg-black rounded-lg overflow-hidden cursor-grab active:cursor-grabbing select-none"
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
          className="absolute rounded-full overflow-hidden"
          style={{
            width: `${BASE_CONTAINER_SIZE * scaleFactor}px`,
            height: `${BASE_CONTAINER_SIZE * scaleFactor}px`,
            left: `${(ORBITAL_CENTER_X - BASE_CONTAINER_SIZE / 2) * scaleFactor}px`,
            top: `${(ORBITAL_CENTER_Y - BASE_CONTAINER_SIZE / 2) * scaleFactor}px`,
            transform: `rotate(${earthRotation}deg)`,
            transition: isDragging ? 'none' : 'transform 50ms linear',
            boxShadow: `
              0 0 40px 15px rgba(59, 130, 246, 0.4),
              0 0 70px 25px rgba(59, 130, 246, 0.25),
              0 0 100px 35px rgba(59, 130, 246, 0.15)
            `,
          }}
        >
          <Image
            src="/NASA-EARTH.png"
            alt="Earth"
            fill
            className="object-cover"
            style={{
              transform: 'scale(1.1)', // Scale up slightly to hide black edges
            }}
            draggable={false}
            priority
          />
        </div>

        {/* Asteroids - each with individual rotation */}
        {asteroidOrbits.map(orbit => {
          const currentAngle = asteroidAngles[orbit.id] || orbit.startAngle;
          const angleInRadians = (currentAngle * Math.PI) / 180;
          const x =
            (ORBITAL_CENTER_X + orbit.radius * Math.cos(angleInRadians)) *
            scaleFactor;
          const y =
            (ORBITAL_CENTER_Y + orbit.radius * Math.sin(angleInRadians)) *
            scaleFactor;

          // Asteroid size with less aggressive scaling (min 50px, scales up to 80px)
          // Uses a dampened scale factor: scales slower on small screens
          const minAsteroidSize = 50;
          const maxAsteroidSize = ASTEROID_SIZE;
          const scaledAsteroidSize = Math.max(
            minAsteroidSize,
            maxAsteroidSize * Math.max(0.7, scaleFactor) // Never go below 70% scale
          );

          return (
            <div
              key={orbit.id}
              className="absolute transition-transform hover:scale-125 cursor-pointer"
              style={{
                left: `${x}px`,
                top: `${y}px`,
                width: `${scaledAsteroidSize}px`,
                height: `${scaledAsteroidSize}px`,
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
                <AsteroidSVG id={orbit.id} size={scaledAsteroidSize} />
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
        <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-black/60 backdrop-blur-sm px-2 py-1 md:px-3 md:py-2 rounded text-white text-[10px] md:text-xs">
          Drag to rotate
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
