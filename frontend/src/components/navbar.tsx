'use client';

import { useState } from 'react';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Page 1', href: '#' },
  { label: 'Page 2', href: '#' },
  { label: 'Page 3', href: '#' },
  { label: 'Login', href: '#' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-blue-900 text-white">
      <div className="flex items-center justify-between h-14 px-4">
        <span className="text-l sm:text-xl md:text-2xl pt-1 font-modak">
          THE SHOP AT THE END OF THE GALAXY
        </span>
        <button
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle navigation"
          className="lg:hidden group relative isolate grid place-items-center w-12 h-12 overflow-visible focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-full"
        >
          <span className="pointer-events-none absolute inset-0 m-auto w-6 h-6 rounded-full transition-transform duration-300 ease-out group-hover:scale-125 z-0 galaxy-bg-space" />
          <span className="relative z-10 flex flex-col items-center justify-center gap-1.5">
            <span className="block w-10 h-0.5 bg-white rounded-full" />
            <span className="block w-10 h-0.5 bg-white rounded-full" />
            <span className="block w-10 h-0.5 bg-white rounded-full" />
          </span>
        </button>
        {/* Desktop nav */}
        <div className="hidden lg:flex ml-8">
          <ul className="flex flex-row items-center">
            {navLinks.map(link => (
              <li key={link.label}>
                <a href={link.href} className="block px-6 py-2">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Mobile nav */}
      <div
        className={`${open ? 'block' : 'hidden'} lg:hidden w-full text-white font-bold galaxy-bg-space`}
      >
        <ul className="flex flex-col">
          {navLinks.map(link => (
            <li key={link.label}>
              <a href={link.href} className="block px-6 py-2">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
