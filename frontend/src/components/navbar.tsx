'use client';

import { useState } from 'react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-blue-900 text-white">
      <div className="flex items-center justify-between h-14 px-4">
        <span className="text-lg font-bold font-modak">
          The Shop at the End of the Galaxy
        </span>
        <button
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle navigation"
          className="
    lg:hidden group relative isolate grid place-items-center
    w-12 h-12 overflow-visible
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-full
  "
        >
          {/* Saturn planet (with gradient) */}
          <span
            className="
    pointer-events-none absolute inset-0 m-auto
    w-6 h-6 rounded-full
    transition-transform duration-300 ease-out
    group-hover:scale-125
    z-0
  "
            style={{
              background:
                'radial-gradient(circle at 30% 30%, #fde68a, #facc15, #f59e0b)',
            }}
          />

          {/* Rings (hamburger lines) */}
          <span className="relative z-10 flex flex-col items-center justify-center gap-1.5">
            <span className="block w-10 h-0.5 bg-blue-500 rounded-full" />
            <span className="block w-10 h-0.5 bg-blue-500 rounded-full" />
            <span className="block w-10 h-0.5 bg-blue-500 rounded-full" />
          </span>
        </button>

        {/* On lg+, show nav links inline to the right */}
        <div className="hidden lg:flex ml-8">
          <ul className="flex flex-row items-center">
            <li>
              <a href="#" className="block px-6 py-2">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="block px-6 py-2">
                Page 1
              </a>
            </li>
            <li>
              <a href="#" className="block px-6 py-2">
                Page 2
              </a>
            </li>
            <li>
              <a href="#" className="block px-6 py-2">
                Page 3
              </a>
            </li>
            <li>
              <a href="#" className="block px-6 py-2">
                Login
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* Mobile nav: visible when open, hidden on lg+ */}
      <div
        className={`${open ? 'block' : 'hidden'} lg:hidden w-full bg-blue-500`}
      >
        <ul className="flex flex-col">
          <li>
            <a href="#" className="block px-6 py-2">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="block px-6 py-2">
              Page 1
            </a>
          </li>
          <li>
            <a href="#" className="block px-6 py-2">
              Page 2
            </a>
          </li>
          <li>
            <a href="#" className="block px-6 py-2">
              Page 3
            </a>
          </li>
          <li>
            <a href="#" className="block px-6 py-2">
              Login
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
