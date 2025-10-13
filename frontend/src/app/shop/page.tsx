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
  DropdownMenuItem,
} from '@/components/dropdown';
import { Slider } from '@/components/slider';
import { ChevronDownIcon, Filter } from 'lucide-react';
import Product from '@/components/asteroidProducts.tsx/product';
import ProductSkeleton from '@/components/asteroidProducts.tsx/productSkeleton';
import {
  useAppStore,
  useSortedAsteroids,
  useFilteredAsteroids,
  type SortOption,
  type FilterState
} from '@/store/useAppViewModel';
import { onHandleProductClick, onHandleStarred } from '@/store/useAppViewModel';
import AsteroidModal from '@/components/asteroidModal';

const SORT_OPTIONS: Array<{ name: string; value: SortOption }> = [
  { name: 'None', value: 'None' }, // for when no sorting is selected
  { name: 'Size: Small to Big', value: 'size-asc' },
  { name: 'Size: Big to Small', value: 'size-desc' },
  { name: 'Price: Low to High', value: 'price-asc' },
  { name: 'Price: High to Low', value: 'price-desc' },
  { name: 'Distance: Near to Far', value: 'distance-asc' },
  { name: 'Distance: Far to Near', value: 'distance-desc' },
];

const HAZARD_FILTER = {
  id: 'hazardous',
  name: 'Hazard Level',
  options: [
    { value: 'all', label: 'All', checked: true },
    { value: 'hazardous', label: 'Hazardous', checked: false },
    { value: 'non-hazardous', label: 'Non-Hazardous', checked: false },
  ] as const,
};

const ORBIT_FILTER = {
  id: 'orbit_type',
  name: 'Orbit Type',
  options: [
    { value: 'all', label: 'All', checked: true },
    { value: 'APO', label: 'Apollo (APO)', checked: false },
    { value: 'ATE', label: 'Aten (ATE)', checked: false },
    { value: 'AMO', label: 'Amor (AMO)', checked: false },
    { value: 'IEO', label: 'Atira/Interior Earth Object (IEO)', checked: false },
  ] as const,
};

export default function Shop() {
  // Get state and actions from Zustand store
  const { loading, setAsteroids, currentPage, totalPages, totalCount } =
    useAppStore();

  // Keep filter state local as it's UI-specific
  const [filter, setFilter] = useState<FilterState>({
    hazardous: 'all',
    sizeRange: [0, 100],
    distanceRange: [0, 100],
    orbitType: [],
    sort: 'None',
  });

  // MVVM: Get sorted asteroids based on current filter
  // This automatically re-sorts when filter.sort changes
  const filteredAsteroids = useFilteredAsteroids(filter);


  const selectedAsteroidId = useAppStore(state => state.selectedAsteroidId);
  const selectedAsteroid = filteredAsteroids.find(
    a => a.id === selectedAsteroidId
  );

  console.log('Current filter state:', filter);

  // Fetch asteroids on mount
  useEffect(() => {
    setAsteroids(1);
  }, [setAsteroids]);

  // Handler for page changes
  const handlePageChange = (newPage: number) => {
    setAsteroids(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="galaxy-bg-space">
      <Navbar />
      {/* Banner */}

      <div className="w-full h-40 bg-transparent text-white items-center justify-center flex text-5xl font-modak py-6 px-4">
        SHOP
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="block">
            {/*Filter - Filters the results*/}
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="group py-4 inline-flex text-sm !font-modak text-white hover:underline justify-between gap-4 cursor-pointer">
                  FILTER
                  <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4  transition-transform duration-200 text-white group-hover:text-gray-400" />
                </AccordionTrigger>
                <AccordionContent className="pt-6 animate-none grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/*Hazard filter*/}
                  <div>
                    <h3 className="text-sm font-modak text-white mb-4">
                      Hazard Level
                    </h3>
                    <ul className="space-y-4">
                      {HAZARD_FILTER.options.map((option, index) => (
                        <li key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`hazard-${index}`}
                            className="h-4 w-4 rounded border-gray-300 text-purple-400 focus:ring-purple-500"
                            checked={filter.hazardous === option.value} // controlled by state
                            onChange={() => {
                              setFilter(prev => ({
                                ...prev,
                                hazardous: option.value, // update selected value
                              }));
                            }}
                          />
                          <label
                            htmlFor={`hazard-${index}`}
                            className="ml-3 text-sm font-medium text-white"
                          >
                            {option.label}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Orbit Type Filter */}
                  <div>
                    <h3 className="text-sm font-modak text-white mb-4">
                      Orbit Type
                    </h3>
                    <ul className="space-y-4">
                      {ORBIT_FILTER.options.map((option, index) => (
                        <li key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`orbit-${index}`}
                            className="h-4 w-4 rounded border-gray-300 text-purple-400 focus:ring-purple-500"
                            checked={
                              option.value === 'all'
                                ? filter.orbitType.length === 0
                                : filter.orbitType.includes(option.value)
                            }
                            onChange={e => {
                              if (option.value === 'all') {
                                // "All" clears any specific selections
                                setFilter(prev => ({ ...prev, orbitTypes: [] }));
                              } else {
                                setFilter(prev => ({
                                  ...prev,
                                  orbitTypes: e.target.checked
                                    ? [...prev.orbitType, option.value]
                                    : prev.orbitType.filter(o => o !== option.value),
                                }));
                              }
                            }}
                          />
                          <label
                            htmlFor={`orbit-${index}`}
                            className="ml-3 text-sm font-medium text-white"
                          >
                            {option.label}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/*Size and distance sliders*/}
                  <div>
                    <div>
                      <h3 className="text-sm font-modak text-white mb-4">
                        Size
                      </h3>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={filter.sizeRange}
                        onValueChange={(value: [number, number]) =>
                          setFilter(prev => ({ ...prev, sizeRange: value }))
                        }
                      />
                    </div>

                    <div>
                      <h3 className="text-sm font-modak text-white mb-4">
                        Distance Away
                      </h3>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={filter.distanceRange}
                        onValueChange={(value: [number, number]) =>
                          setFilter(prev => ({ ...prev, distanceRange: value }))
                        }
                      />
                    </div>
                  </div>


                  


                  

                  {/*Orbit class type filter - same type as HAZARDOUS*/}
                  {/*Approaches - what type of filter??*/}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Sort - Sorts the results */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="group py-4 inline-flex text-sm font-modak text-white hover:underline justify-between gap-4 cursor-pointer">
                SORT
                <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200 text-white group-hover:text-gray-400" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {SORT_OPTIONS.map(option => (
                  <DropdownMenuItem
                    key={option.name}
                    className={`cursor-pointer ml-4 py-2 px-4 text-sm rounded-none
                            ${
                              option.value === filter.sort
                                ? 'bg-gray-800 text-white' // Selected style
                                : 'bg-black hover:bg-gray-800 text-white' // Default style
                            }`}
                    onClick={() => {
                      setFilter(prev => ({
                        ...prev, // keep other filter properties unchanged
                        sort: option.value, // update only the sort property
                      }));
                    }}
                  >
                    {option.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button className="-m-2 ml-4 p-2 text-white hover:text-gray-400 sm:ml-6 lg:hidden">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </main>

      <section>
        <div>
          {/* Product Grid */}
          <ul className="bg-transparent grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4 p-4 flex-grow">
            {loading
              ? new Array(20) // loading state with 20 skeletons
                  .fill(null)
                  .map((_, index) => <ProductSkeleton key={index} />)
              : filteredAsteroids.map(asteroid => (
                  <Product
                    key={asteroid.id}
                    asteroid={asteroid}
                    onHandleProductClick={() =>
                      onHandleProductClick(asteroid.id)
                    }
                    onHandleStarred={() => onHandleStarred(asteroid.id)}
                  />
                ))}
          </ul>
          
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border border-white/30 bg-transparent text-white rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    pageNum => {
                      const showPage =
                        pageNum <= 3 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 &&
                          pageNum <= currentPage + 1);

                      const showEllipsisBefore =
                        pageNum === 4 && currentPage > 5;
                      const showEllipsisAfter =
                        pageNum === totalPages - 1 &&
                        currentPage < totalPages - 2;

                      if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <span
                            key={pageNum}
                            className="px-2 py-1.5 text-white"
                          >
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1.5 text-sm rounded ${
                            currentPage === pageNum
                              ? 'bg-purple-600 text-white'
                              : 'border border-white/30 bg-transparent text-white hover:bg-white/10'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border border-white/30 bg-transparent text-white rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  Next
                </button>
              </div>

              <span className="text-white text-sm">
                Page {currentPage} of {totalPages} ({totalCount} total
                asteroids)
              </span>
            </div>
          )}

        </div>
      </section>

      {selectedAsteroidId && selectedAsteroid && (
        <AsteroidModal
          asteroid={selectedAsteroid}
          onClose={() => useAppStore.getState().setSelectedAsteroidId(null)}
          onHandleStarred={() => onHandleStarred(selectedAsteroid.id)}
        />
      )}
    </div>
  );
}
