'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthViewModel';
import { ShoppingBasket } from 'lucide-react';
import Cart from './cart';
import { useAppStore } from '@/store/useAppViewModel';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Login', href: '/login' },
];

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { userData } = useAppStore(); // to get the cart from global store
  const cartCount = userData?.cart_asteroids?.length || 0;

  return (
    <nav className="w-full text-white bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700">
      <div className="flex items-center justify-between h-14 px-4">
        <Link
          href="/"
          className="text-l sm:text-xl md:text-2xl pt-1 font-modak"
        >
          THE SHOP AT THE END OF THE GALAXY
        </Link>
        <button
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle navigation"
          className="lg:hidden group relative isolate grid place-items-center w-12 h-12 overflow-visible focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-full cursor-pointer"
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
            {navLinks.map(link => {
              return (
                <li key={link.label}>
                  <Link
                    href={
                      user && link.label === 'Login' ? '/profile' : link.href
                    }
                    className="block px-6 py-2 relative transition-all duration-500
    before:content-[''] before:absolute before:left-0 before:bottom-1 before:w-0 before:h-0.5 before:bg-white before:transition-all before:duration-500
    hover:before:w-full"
                  >
                    {user && link.label === 'Login'
                      ? `Hello, ${user.displayName}`
                      : link.label}
                  </Link>
                </li>
              );
            })}
            {user && (
              <li>
                <button
                  onClick={logout}
                  className="cursor-pointer block px-6 py-2 relative transition-all duration-500
    before:content-[''] before:absolute before:left-0 before:bottom-1 before:w-0 before:h-0.5 before:bg-white before:transition-all before:duration-500
    hover:before:w-full"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>

          {user && (
            <button
              onClick={() => setShowCart(v => !v)}
              className="ml-4 relative p-2 rounded-full hover:bg-white/20 transition cursor-pointer"
              aria-label="View cart"
            >
              <ShoppingBasket size={24} />

              {/* Badge */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
      {/* Mobile nav */}
      <div
        className={`${open ? 'block' : 'hidden'} lg:hidden w-full text-white font-bold galaxy-bg-space`}
      >
        <ul className="flex flex-col space-y-3 py-4 ">
          {navLinks.map(link => (
            <li key={link.label}>
              <Link
                href={user && link.label === 'Login' ? '/profile' : link.href}
                className="block px-6 py-2"
              >
                {user && link.label === 'Login' ? 'Profile' : link.label}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <button
                onClick={logout}
                className="block px-6 py-2 cursor-pointer"
              >
                Logout
              </button>
            </li>
          )}

          <li className="px-6 py-2">
            {user && (
              <button
                onClick={() => setShowCart(v => !v)}
                className="relative p-2 rounded-full hover:bg-white/20 transition cursor-pointer"
                aria-label="View cart"
              >
                <ShoppingBasket size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
          </li>
        </ul>
      </div>

      {user && showCart && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="relative bg-gray-950 text-white w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-fuchsia-700 shadow-2xl p-6">
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl"
              aria-label="Close cart"
            >
              ✕
            </button>
            <Cart />
          </div>
        </div>
      )}
    </nav>
  );
}
