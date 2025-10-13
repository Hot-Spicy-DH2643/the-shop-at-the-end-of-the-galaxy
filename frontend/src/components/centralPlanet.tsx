interface SunProps {
  size?: number;
}

export default function Sun({ size = 16 }: SunProps) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      <div
        className="rounded-full bg-yellow-500 shadow-[0_0_50px_#fff,0_0_100px_#ff0]"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: '0 0 60px #fff, 0 0 150px #ffb700, 0 0 250px #ff0',
        }}
      />
    </div>
  );
}
//TODO: Add "real" sun here
//TODO: Use this component in galaxy
