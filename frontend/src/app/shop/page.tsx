'use client';
import Navbar from '@/components/navbar';
import asteroids from '@/fakeData';
import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/accordion';
import axios from 'axios';
import AsteroidSVG from '@/components/asteroidSVG';

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
  const [posts, setPosts] = useState<FakeData[]>([]);

  console.log('Current filter state:', filter);

  interface FakeData {
    id: string;
    neo_reference_id: string;
    name: string;
    nasa_jpl_url: string;
    absolute_magnitude_h: number;
    estimated_diameter: {
      kilometers: {
        estimated_diameter_min: number;
        estimated_diameter_max: number;
      };
      meters: {
        estimated_diameter_min: number;
        estimated_diameter_max: number;
      };
      miles: {
        estimated_diameter_min: number;
        estimated_diameter_max: number;
      };
      feet: {
        estimated_diameter_min: number;
        estimated_diameter_max: number;
      };
    };
    is_potentially_hazardous_asteroid: boolean;
    close_approach_data: Array<{
      close_approach_date: string;
      close_approach_date_full: string;
      epoch_date_close_approach: number;
      relative_velocity: {
        kilometers_per_second: string;
        kilometers_per_hour: string;
        miles_per_hour: string;
      };
      miss_distance: {
        astronomical: string;
        lunar: string;
        kilometers: string;
        miles: string;
      };
      orbiting_body: string;
    }>;
    is_sentry_object: boolean;
  }

  interface FakeDataResponse {
  near_earth_objects: {
    [date: string]: FakeData[];
  };
}

  useEffect(() => {
    // Fetch data from API
    //axios.get("https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY")
    axios
      .get<FakeDataResponse>('/fakedata.json')
      .then(response => {
        // Combine all arrays from near_earth_objects into one array
        const neo = response.data.near_earth_objects;
        const allAsteroids: FakeData[] = Object.values(neo).flat();
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
    <div className="galaxy-bg-space ">
      <Navbar />
      {/* Banner */}
      <div className="w-full h-40 bg-transparent text-white items-center justify-center flex text-4xl font-modak py-6 px-4">
        ASTEROIDS
      </div>

      {/* Filtering */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <div className="flex justify-between ">
                <AccordionTrigger className="text-4xl font-modak tracking-tight text-white">
                  Filter Options
                </AccordionTrigger>
                <AccordionContent>
                  <div className='flex flex-wrap'>
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

                  </div>
                  
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
        {posts.map(post => (
          <div
            key={post.id}
            className="group rounded flex flex-col items-center overflow-hidden hover:scale-[1.10] transition duration-300"
          >
            <AsteroidSVG id={post.id} size={100} />
            <p className="text-white font-bold text-lg pt-4">{post.name}</p>
            <p className="text-gray-400">{post.absolute_magnitude_h}</p>
            <p className="text-gray-400">
              {post.is_potentially_hazardous_asteroid}
            </p>
            {/*<p className="text-gray-400">{posts.price}</p>*/}
          </div>
        ))}
      </div>
    </div>
  );
}
