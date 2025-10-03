{
  /*
  This component defines SVG filters for asteroid movement effects.
  It is used in the AsteroidModal component to add motion trails to the asteroid SVG.
  */
}

export default function AsteroidMovementFilters() {
  return (
    <svg aria-hidden="true" className="absolute w-0 h-0">
      <defs>
        <filter
          id="speedTrail"
          x="-150%"
          y="-150%"
          width="400%"
          height="400%"
          colorInterpolationFilters="sRGB"
        >
          <feOffset in="SourceGraphic" dx="-4" dy="0" result="t1" />
          <feGaussianBlur in="t1" stdDeviation="3 0" result="b1" />
          <feColorMatrix
            in="b1"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 0.55 0"
            result="b1f"
          />
          <feOffset in="SourceGraphic" dx="-8" dy="0" result="t2" />
          <feGaussianBlur in="t2" stdDeviation="6 0" result="b2" />
          <feColorMatrix
            in="b2"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 0.33 0"
            result="b2f"
          />
          <feMerge>
            <feMergeNode in="b2f" />
            <feMergeNode in="b1f" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
