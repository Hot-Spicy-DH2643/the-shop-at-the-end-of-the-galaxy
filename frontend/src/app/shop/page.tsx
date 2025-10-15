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
  type SortOption,
  type UIFilters,
  convertUIFiltersToBackend,
} from '@/store/useAppViewModel';
import { onHandleProductClick, onHandleStarred } from '@/store/useAppViewModel';
import AsteroidModal from '@/components/asteroidModal';

const SORT_OPTIONS: Array<{ name: string; value: SortOption }> = [
  { name: 'None', value: 'None' }, // for when no sorting is selected
  { name: 'Size: Small to Big', value: 'size-asc' },
  { name: 'Size: Big to Small', value: 'size-desc' },
  { name: 'Price: Low to High', value: 'price-asc' },
  { name: 'Price: High to Low', value: 'price-desc' },
  { name: 'Approaching: Soon to Later', value: 'distance-asc' },
  { name: 'Approaching: Later to Soon', value: 'distance-desc' },
];

const HAZARD_FILTER = {
  id: 'hazardous',
  name: 'Hazard Level',
  options: [
    { id: 0, value: 'all', label: 'All', checked: true },
    { id: 1, value: 'hazardous', label: 'Hazardous', checked: false },
    { id: 2, value: 'non-hazardous', label: 'Non-Hazardous', checked: false },
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
    {
      value: 'IEO',
      label: 'Atira/Interior Earth Object (IEO)',
      checked: false,
    },
  ] as const,
};

export default function Shop() {
  // Get state and actions from Zustand store
  const {
    loading,
    asteroids,
    setAsteroids,
    setUserData,
    currentPage,
    totalPages,
    totalCount,
  } = useAppStore();

  // Keep filter state local as it's UI-specific
  // Distance is stored in 0-100 range for UI slider
  const [filter, setFilter] = useState<UIFilters>({
    hazardous: 'all',
    sizeMin: 0,
    sizeMax: 3000,
    distanceMin: 0, // 0-100 range
    distanceMax: 100, // 0-100 range
    priceMin: 100,
    priceMax: 900,
    orbitTypes: [],
    sortBy: 'None',
  });

  const selectedAsteroidId = useAppStore(state => state.selectedAsteroidId);
  const selectedAsteroid = asteroids.find(a => a.id === selectedAsteroidId);

  console.log('Current filter state:', filter);

  // Fetch asteroids on mount
  useEffect(() => {
    // Convert UI filters to backend format before sending
    const backendFilters = convertUIFiltersToBackend(filter);
    setAsteroids(1, backendFilters);
    setUserData();
  }, [filter, setAsteroids]);

  // Handler for page changes
  const handlePageChange = (newPage: number) => {
    const backendFilters = convertUIFiltersToBackend(filter);
    setAsteroids(newPage, backendFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="galaxy-bg-space font-sans">
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
                <AccordionTrigger className="group py-4 inline-flex text-lg !font-modak text-white hover:underline justify-between gap-4 cursor-pointer">
                  FILTER
                  <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 translate-y-1.5 transition-transform duration-200 text-white group-hover:text-gray-400" />
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
                            type="radio"
                            name="hazard-level"
                            id={`hazard-${index}`}
                            className="h-4 w-4 border-gray-300 text-purple-400 accent-purple-500 focus:ring-purple-500 cursor-pointer"
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
                            className="ml-3 text-sm font-medium text-white cursor-pointer"
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
                            className="h-4 w-4 rounded border-gray-300 text-purple-400 accent-purple-500 focus:ring-purple-500 cursor-pointer"
                            checked={
                              option.value === 'all'
                                ? filter.orbitTypes?.length === 0
                                : filter.orbitTypes?.includes(option.value)
                            }
                            onChange={e => {
                              if (option.value === 'all') {
                                // "All" clears any specific selections
                                setFilter(prev => ({
                                  ...prev,
                                  orbitTypes: [],
                                }));
                              } else {
                                setFilter(prev => ({
                                  ...prev,
                                  orbitTypes: e.target.checked
                                    ? [...(prev.orbitTypes ?? []), option.value]
                                    : prev.orbitTypes?.filter(
                                        o => o !== option.value
                                      ),
                                }));
                              }
                            }}
                          />
                          <label
                            htmlFor={`orbit-${index}`}
                            className="ml-3 text-sm font-medium text-white cursor-pointer"
                          >
                            {option.label}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/*Size and distance sliders*/}
                  <div>
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-modak text-white">Size</h3>
                        <span className="text-xs text-gray-300">
                          {filter.sizeMin} - {filter.sizeMax} meters
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={3000}
                        step={50}
                        value={[filter.sizeMin ?? 0, filter.sizeMax ?? 3000]}
                        onValueChange={(value: [number, number]) =>
                          setFilter(prev => ({
                            ...prev,
                            sizeMin: value[0],
                            sizeMax: value[1],
                          }))
                        }
                      />
                    </div>

                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-modak text-white">
                          Miss Distance
                        </h3>
                        <span className="text-xs text-gray-300">
                          {filter.distanceMin} - {filter.distanceMax} million km
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[
                          filter.distanceMin ?? 0,
                          filter.distanceMax ?? 100,
                        ]}
                        onValueChange={(value: [number, number]) =>
                          setFilter(prev => ({
                            ...prev,
                            distanceMin: value[0],
                            distanceMax: value[1],
                          }))
                        }
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-modak text-white">Price</h3>
                        <span className="text-xs text-gray-300">
                          {filter.priceMin} - {filter.priceMax} CosmoCoins
                        </span>
                      </div>
                      <Slider
                        min={100}
                        max={900}
                        step={10}
                        value={[filter.priceMin ?? 100, filter.priceMax ?? 900]}
                        onValueChange={(value: [number, number]) =>
                          setFilter(prev => ({
                            ...prev,
                            priceMin: value[0],
                            priceMax: value[1],
                          }))
                        }
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Sort - Sorts the results */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="group py-4 inline-flex text-lg font-modak text-white hover:underline justify-between gap-4 cursor-pointer">
                SORT
                <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-1.5 transition-transform duration-200 text-white group-hover:text-gray-400" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {SORT_OPTIONS.map(option => (
                  <DropdownMenuItem
                    key={option.name}
                    className={`cursor-pointer ml-4 py-2 px-4 text-sm rounded-none
                            ${
                              option.value === filter.sortBy
                                ? 'bg-purple-500 text-white' // Selected style
                                : 'bg-black hover:bg-gray-800 text-white' // Default style
                            }`}
                    onClick={() => {
                      setFilter(prev => ({
                        ...prev, // keep other filter properties unchanged
                        sortBy: option.value, // update only the sort property
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
            {loading ? (
              new Array(20) // loading state with 20 skeletons
                .fill(null)
                .map((_, index) => <ProductSkeleton key={index} />)
            ) : asteroids.length === 0 ? (
              <li className="col-span-full flex flex-col items-center justify-center py-16 text-white">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-modak mb-2">No Asteroids Found</h3>
                <p className="text-gray-400 text-center max-w-md">
                  Try adjusting your filters to see more results. You may need
                  to increase the size or distance ranges, or change your hazard
                  level selection.
                </p>
              </li>
            ) : (
              asteroids.map(asteroid => (
                <Product
                  key={asteroid.id}
                  asteroid={asteroid}
                  onHandleProductClick={() => onHandleProductClick(asteroid.id)}
                  onHandleStarred={() => onHandleStarred(asteroid.id)}
                />
              ))
            )}
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
                  &lt;
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
                  &gt;
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
