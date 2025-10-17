'use client';
import AsteroidSVGMoving from './asteroidSVGMoving';
import Image from 'next/image';
import { Asteroid, getFormattedAsteroidData } from '@/store/AppModel';
import { Star, ShoppingBasket, CalendarPlus, Eye, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppViewModel';
import { X, Orbit, Telescope} from 'lucide-react';
import { useAsteroidViewers } from '@/hooks/useAsteroidViewers';

interface modalProps {
  asteroid: Asteroid;
  onClose: () => void;
  onHandleStarred: (id: string) => void;
}

export default function AsteroidModal({
  asteroid,
  onClose,
  onHandleStarred,
}: modalProps) {
  // Format asteroid data
  const formatted = getFormattedAsteroidData(asteroid);

  // Viewer logic
  const { viewerCount, isConnected, isLoading } = useAsteroidViewers(
    asteroid.id
  );

  const viewerText = isLoading
    ? 'Loading viewer count...'
    : viewerCount === 1
      ? '1 explorer eyeing this right now'
      : `${viewerCount} explorers eyeing this right now`;

  // Handle add to calendar
  const handleAddToCalendar = () => {
    const approach = asteroid.close_approach_data?.[0];
    if (!approach) return;

    const startDate = new Date(approach.close_approach_date_full);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    // Detect if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      const formatDateForICS = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//The Shop at the End of the Galaxy//EN',
        'BEGIN:VEVENT',
        `DTSTART:${formatDateForICS(startDate)}`,
        `DTEND:${formatDateForICS(endDate)}`,
        `SUMMARY:Asteroid ${asteroid.name} Close Approach`,
        `DESCRIPTION:Asteroid ${asteroid.name} will pass Earth at a distance of ${formatted.approach.distanceAU} (${formatted.approach.distanceKm}) traveling at ${formatted.approach.velocityKmPerSec}.\\n\\nMore info: ${asteroid.nasa_jpl_url}`,
        `URL:${asteroid.nasa_jpl_url}`,
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([icsContent], {
        type: 'text/calendar;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `asteroid-${asteroid.name.replace(/[^a-z0-9]/gi, '_')}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Google Calendar for desktop
      const formatDateForCalendar = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const calendarUrl = new URL(
        'https://calendar.google.com/calendar/render'
      );
      calendarUrl.searchParams.append('action', 'TEMPLATE');
      calendarUrl.searchParams.append(
        'text',
        `Asteroid ${asteroid.name} Close Approach`
      );
      calendarUrl.searchParams.append(
        'details',
        `Asteroid ${asteroid.name} will pass Earth at a distance of ${formatted.approach.distanceAU} (${formatted.approach.distanceKm}) traveling at ${formatted.approach.velocityKmPerSec}.\n\nMore info: ${asteroid.nasa_jpl_url}`
      );
      calendarUrl.searchParams.append(
        'dates',
        `${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}`
      );

      window.open(calendarUrl.toString(), '_blank', 'noopener,noreferrer');
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const { userData, addToCart, removeFromCart } = useAppStore();

  const handleAddToCart = () => {
    addToCart(asteroid.id);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(asteroid.id);
  };

  // console.log('asteroidModal.tsx file : ', asteroid);
  // console.log('owner info: ', asteroid.owner);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto pt-6"
      onClick={handleBackdropClick}
      >
      <div className="relative w-[90vw] max-w-xl m-2 bg-black pt-4 p-4 rounded-lg shadow-2xl">
        <button
          className="absolute top-4 right-4 text-3xl text-gray-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
          onClick={onClose}
        >
          <X/>
        </button>

        <div className="w-100% flex flex-col md:flex-row items-center gap-6 p-4 pb-0">
          <div>
            <AsteroidSVGMoving size={100} id={asteroid.id} bgsize={160} />
          </div>

          <div className="w-full mx-auto px-4 md:px-8 mt-4 !text-white">
            <div className="flex flex-row mb-4 justify-between items-center gap-2">
              <h2 className="text-lg md:text-xl lg:text-2xl font-mono break-words flex-1 min-w-0">
                {asteroid.name}
              </h2>

              <button
                onClick={() => onHandleStarred(asteroid.id)}
                className="cursor-pointer flex-shrink-0"
              >
                {/* Check if asteroid is starred by the current user */}
                {userData?.starred_asteroids.some(a => a.id === asteroid.id) ? (
                  <Star
                    size={20}
                    className="hover:scale-[1.08] transition duration-300 text-yellow-300"
                    fill="yellow"
                  />
                ) : (
                  <Star
                    size={20}
                    className="hover:scale-[1.08] transition duration-300 text-white"
                  />
                )}
              </button>
            </div>

            <p>ID: {formatted.id}</p>
            <p>{formatted.hazardous}</p>
            <p>Diameter: {formatted.diameter}</p>
            <p className="mt-4 text-xl font-bold text-purple-400 mr-8 mb-4">
              <Image
                src="/cosmocoin-tiny.png"
                alt="coin icon"
                className="inline-block mr-1"
                width={20}
                height={20}
              />
              {formatted.price}
            </p>
          </div>
        </div>

        <div className="mb-6 text-sm font-bold mx-auto px-8 mt-2 items-center flex flex-col md:flex-row justify-center">
          {asteroid.owner ? (
            userData?.uid === asteroid.owner.uid ? (
              // Owned by current user
              <p className="bg-purple-500 text-white px-6 py-2 rounded shadow flex items-center justify-center space-x-2 text-center">
                <Orbit className="inline-block" size={22} />
                <span>Already in your orbit</span>
              </p>
            ) : (
              // Owned by another user
              <p className="bg-purple-500 text-white px-6 py-2 rounded shadow flex items-center justify-center space-x-2 text-center">
                <Telescope className="inline-block" size={22} />
                <span>Explore {asteroid.owner.name}'s orbit</span>
              </p>
            )
          ) : userData?.cart_asteroids.some(a => a.id === asteroid.id) ? (
            // In cart
            <button
              onClick={handleRemoveFromCart}
              className="bg-red-700 text-white px-6 py-2 rounded shadow hover:scale-105 hover:shadow-xl transition flex items-center justify-center space-x-2 w-full md:w-auto"
            >
              <Trash2 className="inline-block" size={22} />
              <span>Remove from Basket</span>
            </button>
          ) : (
            // Not owned / not in cart
            <button
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-6 py-2 rounded shadow hover:scale-105 hover:shadow-xl transition flex items-center justify-center space-x-2 w-full md:w-auto"
            >
              <ShoppingBasket className="inline-block" size={22} />
              <span>Add to basket</span>
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-lg shadow bg-gradient-to-br from-gray-900 via-gray-950 to-black mb-6">
          <table className="w-full text-left">
            <tbody>
              <tr className="border-b border-gray-800 last:border-b-0">
                <td className="px-4 py-3 text-purple-200 font-semibold w-1/3">
                  Orbit class type:
                </td>
                <td className="px-4 py-3 text-pink-100">
                  {formatted.orbital.orbitClass} (
                  {formatted.orbital.orbitDescription})
                </td>
              </tr>
              <tr className="border-b border-gray-800 last:border-b-0">
                <td className="px-4 py-3 text-purple-200 font-semibold">
                  Interest:
                </td>
                <td className="px-4 py-3 text-pink-100">
                  <Eye className="inline-block mr-2 mb-1" size={16} />
                  {isLoading ? (
                    <span className="text-gray-400 italic">{viewerText}</span>
                  ) : (
                    viewerText
                  )}
                  {!isConnected && !isLoading && (
                    <span className="text-xs text-gray-500 ml-2">
                      (offline)
                    </span>
                  )}
                </td>
              </tr>
              <tr className="border-b border-gray-800 last:border-b-0">
                <td className="px-4 py-3 text-purple-200 font-semibold align-top">
                  Parameters:
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block mr-2 mb-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-purple-200 text-xs font-mono px-3 py-1 rounded-full border border-purple-900 shadow-sm tracking-tight">
                    a = {formatted.orbital.semiMajorAxis}
                  </span>
                  <span className="inline-block mr-2 mb-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-purple-200 text-xs font-mono px-3 py-1 rounded-full border border-purple-900 shadow-sm tracking-tight">
                    e = {formatted.orbital.eccentricity}
                  </span>
                  <span className="inline-block mr-2 bg-gradient-to-r from-gray-800 via-gray-900 to-black text-purple-200 text-xs font-mono px-3 py-1 rounded-full border border-purple-900 shadow-sm tracking-tight">
                    i = {formatted.orbital.inclination}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-purple-200 font-semibold">
                  More details:
                </td>
                <td className="px-4 py-3 text-pink-100">
                  <a
                    href={formatted.nasaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 underline hover:text-purple-200 break-all inline-flex items-center gap-1"
                  >
                    View in NASA Database
                    <span className="text-xs">↗</span>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="overflow-hidden rounded-lg shadow bg-gradient-to-br from-gray-900 via-gray-950 to-black mb-6">
          <table className="w-full text-left">
            <tbody>
              <tr className="border-b border-gray-800 last:border-b-0">
                <td className="px-4 py-3 text-purple-200 font-semibold w-1/3">
                  Next approach:
                </td>
                <td className="px-4 py-3 text-pink-100">
                  {formatted.approach.date} &nbsp;{' '}
                  <button
                    onClick={handleAddToCalendar}
                    className="text-purple-400 underline hover:text-purple-200 cursor-pointer"
                  >
                    Add to calendar{' '}
                    <CalendarPlus className="inline-block mb-1" size={14} />
                  </button>
                </td>
              </tr>
              <tr className="border-b border-gray-800 last:border-b-0">
                <td className="px-4 py-3 text-purple-200 font-semibold">
                  Miss distance:
                </td>
                <td className="px-4 py-3 text-pink-100">
                  {formatted.approach.distanceAU} &nbsp;{' '}
                  <span className="text-xs text-gray-400">
                    {formatted.approach.distanceKm}
                  </span>
                </td>
              </tr>
              <tr className="border-b border-gray-800 last:border-b-0">
                <td className="px-4 py-3 text-purple-200 font-semibold align-top">
                  Speed:
                </td>
                <td className="px-4 py-3 text-purple-200">
                  {formatted.approach.velocityKmPerSec}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <p className="text-xs text-gray-500 italic text-center">
            Data sourced from NASA API.
          </p>
        </div>
      </div>
    </div>
  );
}
