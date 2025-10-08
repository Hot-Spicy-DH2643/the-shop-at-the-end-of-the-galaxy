'use client';

import Navbar from '@/components/navbar';
import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/accordion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/dropdown'
import { ChevronDownIcon, Filter } from 'lucide-react';
import axios from 'axios';
import type { Asteroid } from '@/types/product';
import Product from '@/components/asteroidProducts.tsx/product';
import ProductSkeleton from '@/components/asteroidProducts.tsx/productSkeleton';

const SORT_OPTIONS = [
  { name: 'None', value: 'None' }, // for when no sorting is selected
  { name: 'Size: Small to Big', value: 'size-asc' },
  { name: 'Size: Big to Small', value: 'size-desc' },
  { name: 'Price: Low to High', value: 'price-asc' },
  { name: 'Price: High to Low', value: 'price-desc' },
  { name: 'Distance: Near to Far', value: 'distance-asc' },
  { name: 'Distance: Far to Near', value: 'distance-desc' },
] as const;

const HAZARD_FILTER = {
  id: 'hazardous',
  name: 'Hazard Level',
  options: [
    { value: 'all', label: 'All', checked: true },
    { value: 'hazardous', label: 'Hazardous', checked: false },
    { value: 'non-hazardous', label: 'Non-Hazardous', checked: false },
  ] as const,
}

interface FakeDataResponse {
  near_earth_objects: {
    [date: string]: Asteroid[];
  };
}

export default function shop() {
  const [filter, setFilter] = useState({ 
    hazardous: [""],
    sort: 'None',
  });
  const [posts, setPosts] = useState<Asteroid[]>([]);

  console.log('Current filter state:', filter);

  useEffect(() => {
    // Fetch data from API
    //axios.get("https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY")
    axios
      .get<FakeDataResponse>('/fakedata.json')
      .then(response => {
        // Combine all arrays from near_earth_objects into one array
        const neo = response.data.near_earth_objects;
        const allAsteroids: Asteroid[] = Object.values(neo).flat();
        setPosts(allAsteroids);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setPosts([]);
      });
  }, []);

  function handleProductClick(productId: number) {
    console.log(`Product with ID ${productId} clicked`);
    // should open the product component
  }

  function handleLikedClick(productId: number) {
    console.log(`Like button for product ID ${productId} clicked`);
    // Implement like button logic here
  }

  return (
    <div className="galaxy-bg-space">
      <Navbar />
      {/* Banner */}

      <div className="w-full h-40 bg-transparent text-white items-center justify-center flex text-5xl font-modak py-6 px-4">
        ASTEROIDS
      </div>   
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-6">
        <div className='flex justify-between items-start flex-wrap gap-4'>
          <div className="block">
            {/*Filter - Filters the results*/}
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="tgroup ext-4xl font-modak tracking-tight text-white justify-between gap-4">
                FILTER
                 <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4  transition-transform duration-200 text-white group-hover:text-gray-400" />
                </AccordionTrigger>
                <AccordionContent className='pt-6 animate-none grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/*Hazard filter*/}
                <div>
                  <h3 className="text-sm font-modak text-white mb-4">Hazard level</h3>
                  <ul className="space-y-4"> 
                    {HAZARD_FILTER.options.map((option, index) => (
                      <li key={option.value} className="flex items-center">
                        <input
                          type = "checkbox"
                          id={`hazard-${index}`}
                          className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                          />
                        <label
                          htmlFor={`hazard-${index}`}
                          className="ml-3 text-sm font-medium text-white"> {option.label}</label>
                      </li>
                    ))} 
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-modak text-white mb-4">Size</h3>
                </div>
               

                {/*Distance Slider*/}
                {/*Size Slider*/}
                
                {/*Orbit class type filter*/}
                {/*Approaches - what type of filter??*/}
                
                </AccordionContent>
              
              </AccordionItem>
            </Accordion>
          </div>

          {/* Sort - Sorts the results */}
          <div className='flex items-center'>
            <DropdownMenu>
                <DropdownMenuTrigger className='group py-4 inline-flex text-sm font-modak text-white hover:underline justify-between gap-4'>
                  SORT
                  <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200 text-white group-hover:text-gray-400" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end'>
                  {SORT_OPTIONS.map(option => (
                          <button
                            key={option.name}
                            className={`text-left w-full block ml-4 py-2 px-4 text-sm
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
                            }}>
                            {option.name}
                          </button>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <button className='-m-2 ml-4 p-2 text-white hover:text-gray-400 sm:ml-6 lg:hidden'>
                <Filter className='h-5 w-5'/>
              </button>
          </div>
        </div>
      </main>

      <section>
        <div>
          {/* Product Grid */}
          <ul className="bg-transparent grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4 p-4 flex-grow">
            {posts
              ? posts.map(asteroid => (
                  <Product
                    key={asteroid.id}
                    asteroid={asteroid}
                    //onProductClick={() => handleProductClick(asteroid.id)}
                    //onLikedClick={() => handleLikedClick(asteroid.id)}
                  />
                ))
              : new Array(20) // loading state with 12 skeletons
                  .fill(null)
                  .map((_, index) => <ProductSkeleton key={index} />)}
          </ul>
        </div>
      </section>
    </div>
  );
}
