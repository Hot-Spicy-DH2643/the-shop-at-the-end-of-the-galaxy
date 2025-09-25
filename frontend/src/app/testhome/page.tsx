export default function Testhome() {
  return (
    <div className="font-sans">
      <main className="flex flex-col lg:flex-row text-black min-h-screen">
        <div className="galaxy-heroarea order-1 lg:order-2 w-full lg:w-2/5 bg-blue-200 p-4 flex flex-col items-center justify-center h-[40vh] lg:h-screen">
          <h2>All the nice titles</h2>
          <p>go here...</p>
        </div>
        <div className="galaxy-storefront order-2 lg:order-1 w-full lg:w-3/5 bg-green-200 p-4 h-[60vh] lg:h-screen overflow-hidden">
          <div className="rounded bg-white shadow flex flex-col items-center w-100 m-4">
            <img
              className="w-[150px]"
              src="/test-asteroids/asteroid_fixed_2021AB.svg"
            ></img>
            <p className="font-bold text-lg">Asteroid Name 1</p>
            <p>Asteroid Data 1A</p>
            <p>Asteroid Data 1B</p>
          </div>
          <div className="rounded bg-white shadow flex flex-col items-center w-100 m-4">
            <img
              className="w-[150px]"
              src="/test-asteroids/asteroid_fixed_3542519.svg"
            ></img>
            <p className="font-bold text-lg">Asteroid Name 2</p>
            <p>Asteroid Data 2A</p>
            <p>Asteroid Data 2B</p>
          </div>
          <div className="rounded bg-white shadow flex flex-col items-center w-100 m-4">
            <img
              className="w-[150px]"
              src="/test-asteroids/asteroid_fixed_Asteroid777.svg"
            ></img>
            <p className="font-bold text-lg">Asteroid Name 3</p>
            <p>Asteroid Data 3A</p>
            <p>Asteroid Data 3B</p>
          </div>
          <div className="rounded bg-white shadow flex flex-col items-center w-100 m-4">
            <img
              className="w-[150px]"
              src="/test-asteroids/asteroid_fixed_Comet99.svg"
            ></img>
            <p className="font-bold text-lg">Asteroid Name 4</p>
            <p>Asteroid Data 4A</p>
            <p>Asteroid Data 4B</p>
          </div>
          <div className="rounded bg-white shadow flex flex-col items-center w-100 m-4">
            <img
              className="w-[150px]"
              src="/test-asteroids/asteroid_fixed_XJ42.svg"
            ></img>
            <p className="font-bold text-lg">Asteroid Name 5</p>
            <p>Asteroid Data 5A</p>
            <p>Asteroid Data 5B</p>
          </div>
        </div>
      </main>
    </div>
  );
}
