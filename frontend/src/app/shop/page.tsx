import Navbar from "@/components/navbar";

export default function shop() {
    const products = [
    { id: 1, name: "Asteroid A", price: "$100", src: "/test-asteroids/asteroid_fixed_2021AB.svg"},
    { id: 2, name: "Asteroid B", price: "$150", src: "/test-asteroids/asteroid_fixed_3542519.svg" },
    { id: 3, name: "Asteroid C", price: "$200", src: "/test-asteroids/asteroid_fixed_Asteroid777.svg" },
    { id: 4, name: "Asteroid D", price: "$250", src: "/test-asteroids/asteroid_fixed_Comet99.svg" },
    { id: 5, name: "Asteroid E", price: "$300", src: "/test-asteroids/asteroid_fixed_Comet99.svg" },
    { id: 6, name: "Asteroid F", price: "$350", src: "/test-asteroids/asteroid_fixed_XJ42.svg" },
    ];
  
    return (
    <div className="flex flex-col min-h-screen">
        <Navbar/>
            {/* Banner */}
            <div className="w-full bg-blue-600 text-white py-6 px-4 text-center text-2xl font-bold">
                Asteroids
            </div>
            <div>
                {/* filter */}
                <button>Size</button>
                <button>Hazardous</button>

            </div>


            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 flex-grow">
                {products.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center ">
                        <img src={product.src} alt={product.name} className="w-24 h-24 object-cover mb-2 rounded" />
                        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                        <p className="text-blue-600 font-bold">{product.price}</p>
                    </div>
                ))}
            </div>
        </div>
  );
}
