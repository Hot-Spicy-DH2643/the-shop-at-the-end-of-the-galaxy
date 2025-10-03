'use client';
import Navbar from '@/components/navbar';
import asteroids from '@/fakeData';
import { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/accordion';

const FILTER_OPTIONS = [
  { name: 'None', value: 'None' }, // for when no filter is selected
  { name: 'Hazardous: Less to More', value: 'Hazardous-asc' },
  { name: 'Hazardous: More to Less', value: 'Hazardous-desc' },
  { name: 'Size: Small to Big', value: 'size-asc' },
  { name: 'Size: Big to Small', value: 'size-desc' },
  { name: 'Price: Low to High', value: 'price-asc' },
  { name: 'Price: High to Low', value: 'price-desc' },
  { name: 'Distance: Near to Far', value: 'distance-asc' },
  { name: 'Distance: Far to Near', value: 'distance-desc' },
] as const;

export default function shop() {
  const [filter, setFilter] = useState({
    sort: 'None',
  });
  console.log('Current filter state:', filter);

  function handleProductClick(productId: number) {
    console.log(`Product with ID ${productId} clicked`);
    // should open the product component
  }

  function handleLikedClick(productId: number) {
    console.log(`Like button for product ID ${productId} clicked`);
    // Implement like button logic here
  }

  return (
    <div className="galaxy-bg-space ">
      <Navbar />

      {/* Banner */}
      <div className="w-full h-40 bg-transparent text-white items-center justify-center flex text-4xl font-modak py-6 px-4">
        ASTEROIDS
      </div>

      {/* Filtering 54:10*/}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <div className="flex items-baseline justify-between border-b border-grey-200 pb-6 pt-24">
                <AccordionTrigger className="text-4xl font-modak tracking-tight text-white">
                  Filter Options
                </AccordionTrigger>
                <AccordionContent>
                  {FILTER_OPTIONS.map(option => (
                    <button
                      key={option.name}
                      className={`ml-4 font-bold py-2 px-4 rounded
                        ${
                          option.value === filter.sort
                            ? 'bg-blue-900 text-white' // Selected style
                            : 'bg-blue-500 hover:bg-blue-900 text-white' // Default style
                        }`}
                      onClick={() => {
                        setFilter(prev => ({
                          ...prev, // keep other filter properties unchanged
                          sort: option.value, // update only the sort property
                        }));
                      }}
                    >
                      {option.name}
                    </button>
                  ))}
                  <button className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
                    filter Icon
                  </button>
                </AccordionContent>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </main>

      {/* Product Grid */}
      <div className="bg-transparent grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4 p-4 flex-grow">
        {asteroids.map(product => (
          <div
            key={product.id}
            className="group rounded flex flex-col items-center overflow-hidden"
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
