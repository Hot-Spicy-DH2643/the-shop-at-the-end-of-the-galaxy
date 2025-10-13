import Link from 'next/link';
import AsteroidSVGMoving from '@/components/asteroidSVGMoving';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-0">
          404
        </h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-gray-400 max-w-xs mx-auto mb-8">
          Looks like you&apos;ve ventured too far into the galaxy. This page
          doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="bg-gradient-to-r from-blue-800 via-purple-800 to-pink-700 text-white px-6 py-3 rounded shadow hover:scale-105 hover:shadow-xl transition cursor-pointer text-center m-1 mt-3 w-full md:w-auto"
        >
          Return Home
        </Link>
        <div className="flex justify-center items-center mt-9">
          <AsteroidSVGMoving id="404" size={70} bgsize={120} />
        </div>
      </div>
    </div>
  );
}
