import Navbar from '@/components/navbar';

export default function shop() {
  const asteroids = [
    {
      id: 1,
      name: 'Asteroid A',
      price: '$100',
      src: '/test-asteroids/asteroid_fixed_2021AB.svg',
      size: 'Size: 50m',
      hazardLevel: 'Hazard Level: Low',
    },
    {
      id: 2,
      name: 'Asteroid B',
      price: '$150',
      src: '/test-asteroids/asteroid_fixed_3542519.svg',
      size: 'Size: 100m',
      hazardLevel: 'Hazard Level: Medium',
    },
    {
      id: 3,
      name: 'Asteroid C',
      price: '$200',
      src: '/test-asteroids/asteroid_fixed_Asteroid777.svg',
      size: 'Size: 150m',
      hazardLevel: 'Hazard Level: High',
    },
    {
      id: 4,
      name: 'Asteroid D',
      price: '$250',
      src: '/test-asteroids/asteroid_fixed_Comet99.svg',
      size: 'Size: 150m',
      hazardLevel: 'Hazard Level: High',
    },
    {
      id: 5,
      name: 'Asteroid E',
      price: '$300',
      src: '/test-asteroids/asteroid_fixed_Comet99.svg',
      size: 'Size: 300m',
      hazardLevel: 'Hazard Level: Medium',
    },
    {
      id: 6,
      name: 'Asteroid F',
      price: '$350',
      src: '/test-asteroids/asteroid_fixed_XJ42.svg',
      size: 'Size: 500m',
      hazardLevel: 'Hazard Level: Low',
    },
    {
      id: 7,
      name: 'Asteroid A',
      price: '$100',
      src: '/test-asteroids/asteroid_fixed_2021AB.svg',
      size: 'Size: 50m',
      hazardLevel: 'Hazard Level: Low',
    },
    {
      id: 8,
      name: 'Asteroid B',
      price: '$150',
      src: '/test-asteroids/asteroid_fixed_3542519.svg',
      size: 'Size: 100m',
      hazardLevel: 'Hazard Level: Medium',
    },
    {
      id: 9,
      name: 'Asteroid C',
      price: '$200',
      src: '/test-asteroids/asteroid_fixed_Asteroid777.svg',
      size: 'Size: 150m',
      hazardLevel: 'Hazard Level: High',
    },
    {
      id: 10,
      name: 'Asteroid D',
      price: '$250',
      src: '/test-asteroids/asteroid_fixed_Comet99.svg',
      size: 'Size: 150m',
      hazardLevel: 'Hazard Level: High',
    },
    {
      id: 11,
      name: 'Asteroid E',
      price: '$300',
      src: '/test-asteroids/asteroid_fixed_Comet99.svg',
      size: 'Size: 300m',
      hazardLevel: 'Hazard Level: Medium',
    },
    {
      id: 12,
      name: 'Asteroid F',
      price: '$350',
      src: '/test-asteroids/asteroid_fixed_XJ42.svg',
      size: 'Size: 500m',
      hazardLevel: 'Hazard Level: Low',
    },
  ];

  return (
    <div className="galaxy-bg-space">
      <Navbar />
      {/* Banner */}
      <div className="w-full h-40 bg-transparent text-white items-center justify-center flex text-4xl font-bold py-6 px-4">
        Asteroids
      </div>
      <div className="bg-transparent flex space-x-4 p-4 ">
        {/* filter */}
        <button className="w-30 h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Size
        </button>
        <button className="w-30 h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Hazardous
        </button>
        <button className="w-30 h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Price
        </button>
        <button className="w-30 h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Distance
        </button>
        <button className="w-30 h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"></button>
      </div>

      {/* Product Grid */}
      <div className="bg-transparent grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 flex-grow">
        {asteroids.map(product => (
          <div
            key={product.id}
            className="rounded bg-grey-200 flex flex-col items-center p-8 m-2 overflow-hidden "
          >
            <img
              className="w-[100px] hover:scale-[1.10] transition duration-300"
              src={product.src}
              alt={product.name}
            />
            <p className="text-white font-bold text-lg pt-4">{product.name}</p>
            <p className="text-gray-400">{product.size}</p>
            <p className="text-gray-400">{product.hazardLevel}</p>
            <p className="text-gray-400">{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
