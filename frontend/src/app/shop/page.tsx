'use client';

import Navbar from '@/components/navbar';
import { useEffect, useState } from 'react';
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
import { ChevronDownIcon } from 'lucide-react';
import Product from '@/components/asteroidProducts.tsx/product';
import ProductSkeleton from '@/components/asteroidProducts.tsx/productSkeleton';
import { useAppStore, type SortOption } from '@/store/useAppViewModel';
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

const OWNERSHIP_FILTER = {
  id: 'ownership',
  name: 'Ownership',
  options: [
    { id: 0, value: 'all', label: 'All', checked: true },
    { id: 1, value: 'owned', label: 'Owned', checked: false },
    { id: 2, value: 'not-owned', label: 'Available', checked: false },
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
      label: 'Atira (IEO)',
      checked: false,
    },
  ] as const,
};

export default function Shop() {
  // Get state and actions from Zustand store
  const {
    loading,
    asteroids,
    userData,
    setAsteroids,
    // setUserData,
    currentPage,
    totalPages,
    totalCount,
    selectedAsteroid,
    onHandleProductClick,
    onHandleStarred,
    filters,
    setFilters,
    resetFilters,
  } = useAppStore();

  const [sizeRange, setSizeRange] = useState<[number, number]>([
    filters.sizeMin ?? 0,
    filters.sizeMax ?? 3000,
  ]);
  const [distanceRange, setDistanceRange] = useState<[number, number]>([
    filters.distanceMin ?? 0,
    filters.distanceMax ?? 100,
  ]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceMin ?? 100,
    filters.priceMax ?? 900,
  ]);

  useEffect(() => {
    setSizeRange([filters.sizeMin ?? 0, filters.sizeMax ?? 3000]);
  }, [filters.sizeMin, filters.sizeMax]);

  useEffect(() => {
    setDistanceRange([filters.distanceMin ?? 0, filters.distanceMax ?? 100]);
  }, [filters.distanceMin, filters.distanceMax]);

  useEffect(() => {
    setPriceRange([filters.priceMin ?? 100, filters.priceMax ?? 900]);
  }, [filters.priceMin, filters.priceMax]);

  console.log('Current filter state:', filters);

  // Handler for resetting all filters
  const handleResetFilters = () => {
    resetFilters();
    setSizeRange([0, 3000]);
    setDistanceRange([0, 100]);
    setPriceRange([100, 900]);
  };

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
    <div className="galaxy-bg-space font-sans min-h-screen">
      <Navbar />
      {/* Banner */}

      <div className="w-full h-40 bg-transparent text-white items-center justify-center flex text-5xl font-modak py-6 px-4">
        SHOP
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 my-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            {/*Filter - Filters the results*/}
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <div className="flex items-center justify-between">
                  <AccordionTrigger className="group py-4 text-lg !font-modak text-white hover:underline cursor-pointer w-fit">
                    <span className="inline-flex items-center gap-2">
                      FILTER
                      <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 transition-transform duration-200 text-white group-hover:text-gray-400" />
                    </span>
                  </AccordionTrigger>
                </div>
                <AccordionContent className="pt-2 animate-none grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-9">
                  {/* Ownership Filter */}
                  <div className="lg:col-span-1 px-4">
                    <h3 className="text-m font-modak text-white mb-4">
                      Ownership
                    </h3>
                    <ul className="space-y-4">
                      {OWNERSHIP_FILTER.options.map((option, index) => (
                        <li key={option.value} className="flex items-center">
                          <input
                            type="radio"
                            name="ownership-level"
                            id={`ownership-${index}`}
                            className="h-4 w-4 border-gray-300 text-purple-400 accent-purple-500 focus:ring-purple-500 cursor-pointer"
                            checked={filters.ownership === option.value}
                            onChange={() => {
                              setFilters(prev => ({
                                ...prev,
                                ownership: option.value,
                              }));
                            }}
                          />
                          <label
                            htmlFor={`ownership-${index}`}
                            className="ml-3 text-sm font-medium text-white cursor-pointer"
                          >
                            {option.label}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/*Hazard filter*/}
                  <div className="lg:col-span-1 px-4">
                    <h3 className="text-m font-modak text-white mb-4">
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
                            checked={filters.hazardous === option.value} // controlled by state
                            onChange={() => {
                              setFilters(prev => ({
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
                  <div className="lg:col-span-1 px-4">
                    <h3 className="text-m font-modak text-white mb-4">
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
                                ? filters.orbitTypes?.length === 0
                                : filters.orbitTypes?.includes(option.value)
                            }
                            onChange={e => {
                              if (option.value === 'all') {
                                // "All" clears any specific selections
                                setFilters(prev => ({
                                  ...prev,
                                  orbitTypes: [],
                                }));
                              } else {
                                setFilters(prev => ({
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
                            className="ml-3 text-sm font-medium text-white cursor-pointer "
                          >
                            {option.label}
                          </label>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={handleResetFilters}
                      className="text-md mt-8 font-modak text-purple-400 hover:text-purple-300 hover:underline cursor-pointer"
                    >
                      RESET ALL FILTERS
                    </button>
                  </div>

                  {/*Size, distance, price sliders*/}
                  <div className="lg:col-span-2 px-4">
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-modak text-white">Size</h3>
                        <span className="text-xs text-gray-300">
                          {sizeRange[0]} - {sizeRange[1]} meters
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={3000}
                        step={50}
                        value={sizeRange}
                        onValueChange={(value: [number, number]) =>
                          setSizeRange(value)
                        }
                        onValueCommit={(value: [number, number]) =>
                          setFilters(prev => ({
                            ...prev,
                            sizeMin: value[0],
                            sizeMax: value[1],
                          }))
                        }
                      />
                    </div>

                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-m font-modak text-white">
                          Miss Distance
                        </h3>
                        <span className="text-xs text-gray-300">
                          {distanceRange[0]} - {distanceRange[1]} million km
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={distanceRange}
                        onValueChange={(value: [number, number]) =>
                          setDistanceRange(value)
                        }
                        onValueCommit={(value: [number, number]) =>
                          setFilters(prev => ({
                            ...prev,
                            distanceMin: value[0],
                            distanceMax: value[1],
                          }))
                        }
                      />
                    </div>

                    <div className="pb-2">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-m font-modak text-white">Price</h3>
                        <span className="text-xs text-gray-300">
                          {priceRange[0]} - {priceRange[1]} CosmoCoins
                        </span>
                      </div>
                      <Slider
                        min={100}
                        max={900}
                        step={10}
                        value={priceRange}
                        onValueChange={(value: [number, number]) =>
                          setPriceRange(value)
                        }
                        onValueCommit={(value: [number, number]) =>
                          setFilters(prev => ({
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
          <div className="flex items-center shrink-0">
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
                              option.value === filters.sortBy
                                ? 'bg-purple-500 text-white' // Selected style
                                : 'bg-black hover:bg-gray-800 text-white' // Default style
                            }`}
                    onClick={() => {
                      setFilters(prev => ({
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
          </div>
        </div>
      </main>

      <section className="max-w-8xl mx-auto">
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
                  isStarred={
                    userData?.starred_asteroids.some(
                      a => a.id === asteroid.id
                    ) ?? false
                  }
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
                              : 'border border-white/30 bg-transparent text-white hover:bg-white/10 cursor-pointer'
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

      {selectedAsteroid && (
        <AsteroidModal
          asteroid={selectedAsteroid}
          onClose={() => useAppStore.getState().setSelectedAsteroid(null)}
          onHandleStarred={() => onHandleStarred(selectedAsteroid.id)}
        />
      )}
    </div>
  );
}
