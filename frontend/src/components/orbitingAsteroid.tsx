interface OrbitPathProps {
  radius: number;
  depth: number;
  tilt?: number;
}

export default function OrbitPath({ radius, depth, tilt = 0 }: OrbitPathProps) {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        transform: `translateZ(${depth}px) rotateX(${tilt}deg)`,
      }}
    >
      <div
        className="w-full h-full rounded-full border border-white/10"
        style={{ transform: 'scale(1, 0.3)' }}
      />
    </div>
  );
}
