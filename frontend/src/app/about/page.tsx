export default function About() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          About The Shop at the End of the Galaxy
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-6">
            Welcome to The Shop at the End of the Galaxy - your one-stop
            destination for all things cosmic and extraordinary!
          </p>

          <p className="mb-6">
            Located at the very edge of known space, our shop has been serving
            intergalactic travelers, space explorers, and cosmic wanderers for
            over 42 millennia. Whether you&apos;re looking for exotic alien
            artifacts, rare cosmic materials, or just a good cup of Pan-Galactic
            Gargle Blaster, we&apos;ve got you covered.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="mb-6">
            To provide the finest goods and services to beings from across the
            universe, while maintaining the highest standards of quality and
            customer satisfaction. No matter which dimension you&apos;re from!
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Why Choose Us?</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Over 42,000 years of experience</li>
            <li>Products sourced from 15 different galaxies</li>
            <li>
              24/7 customer support (across all time zones and dimensions)
            </li>
            <li>Free shipping to anywhere in the known universe</li>
            <li>Accepts all major galactic currencies</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
