'use client';
{
  /*
  This component generates an asteroid SVG with movement effects.
  */
}
import AsteroidSVG from './asteroidSVG';
import AsteroidMovementFilters from './asteroidMovementFilters';

export default function AsteroidSVGMoving({
  id,
  size = 100,
  bgsize = 300,
}: {
  id: string;
  size?: number;
  bgsize?: number;
}) {
  return (
    <div className="relative">
      <div
        className="galaxy-bg-space rounded-full overflow-hidden relative group/space"
        style={{ width: bgsize, height: bgsize }}
      >
        {/* camera/perspective */}
        <div
          className="absolute inset-0"
          style={{ perspective: '900px', transformStyle: 'preserve-3d' }}
        >
          {/* mover: only the flythrough/wobble animations */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
            style={{
              animation:
                'flythrough 6s linear infinite, wobble 4s ease-in-out infinite',
            }}
          >
            {/* hoverWrap: only hover scale (no rotation) */}
            <div className="transition-transform duration-300 will-change-transform group-hover/space:scale-110">
              {/* spinner: keep rotation speed constant */}
              <div
                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.35)] animate-spin [animation-duration:15s]"
                style={{ filter: 'url(#speedTrail)' }}
              >
                <AsteroidSVG id={id} size={size} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AsteroidMovementFilters />
    </div>
  );
}
