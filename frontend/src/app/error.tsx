'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import AsteroidSVGMoving from '@/components/asteroidSVGMoving';

export default function Error({
  error,
}: {
  error: Error & { digest?: string; statusCode?: number };
}) {
  const errorWithStatus = error as Error & {
    statusCode?: number;
    status?: number;
    code?: string | number;
  };

  const statusCode: string | number =
    errorWithStatus.statusCode ||
    errorWithStatus.status ||
    (typeof errorWithStatus.code === 'number' ? errorWithStatus.code : null) ||
    error.message.match(/\b(4\d{2}|5\d{2})\b/)?.[0] ||
    error.name.match(/\b(4\d{2}|5\d{2})\b/)?.[0] ||
    '500';

  useEffect(() => {
    // console.error('Error caught:', error);
    // console.log('Extracted statusCode:', statusCode);
  }, [error, statusCode]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-0">
          {statusCode}
        </h1>
        <h2 className="text-3xl font-semibold">Something went wrong!</h2>

        <p className="text-gray-400 max-w-xs mx-auto mb-8">
          Houston, we have a problem! An unexpected error occurred in the cosmic
          void.
          {error.digest && (
            <span className="block text-sm text-gray-500 mt-2">
              Error ID: {error.digest}
            </span>
          )}
        </p>

        <Link
          href="/"
          className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-6 py-3 rounded shadow hover:scale-105 hover:shadow-xl transition cursor-pointer text-center m-1 mt-3 w-full md:w-auto"
        >
          Return Home
        </Link>
        <div className="flex justify-center items-center mt-9">
          <AsteroidSVGMoving id="500" size={70} bgsize={120} />
        </div>
      </div>
    </div>
  );
}
