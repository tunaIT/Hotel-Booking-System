import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, MapPin, Users, DollarSign, Filter } from 'lucide-react';
import hotelService from '../services/hotelService';
import HotelCard from '../components/common/HotelCard';

const HotelList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial states from URL
  const initialCity = searchParams.get('city') || '';
  const initialCapacity = searchParams.get('capacity') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';

  // Local state for the filter form
  const [filters, setFilters] = useState({
    city: initialCity,
    capacity: initialCapacity,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
  });

  // State applied to the query (updated on "Apply Filters")
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [page, setPage] = useState(0);
  const size = 9;

  // Sync URL params if user arrives via a link or hero search
  useEffect(() => {
    setFilters({
      city: searchParams.get('city') || '',
      capacity: searchParams.get('capacity') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
    });
    setAppliedFilters({
      city: searchParams.get('city') || '',
      capacity: searchParams.get('capacity') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
    });
    setPage(0);
  }, [searchParams]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['hotels', { ...appliedFilters, page, size }],
    queryFn: () => hotelService.getHotels({ ...appliedFilters, page, size }),
    keepPreviousData: true,
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    setAppliedFilters(filters);
    setPage(0);
    
    // Update URL parameters
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.capacity) params.append('capacity', filters.capacity);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    setSearchParams(params);
  };

  const clearFilters = () => {
    const emptyFilters = { city: '', capacity: '', minPrice: '', maxPrice: '' };
    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(0);
    setSearchParams(new URLSearchParams());
  };

  const currentHotels = data?.content || data?.data || data || [];
  const totalPages = data?.totalPages || 0;
  const isFirst = data?.first ?? page === 0;
  const isLast = data?.last ?? page >= totalPages - 1;

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className="w-full md:w-1/4 lg:w-1/5 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-blue-600" /> Filters
                </h2>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>

              <form onSubmit={applyFilters} className="space-y-6">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="text"
                      name="city"
                      placeholder="e.g. Hanoi"
                      value={filters.city}
                      onChange={handleFilterChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>

                {/* Capacity Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Guests (Min)</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="number"
                      name="capacity"
                      placeholder="How many people?"
                      min="1"
                      value={filters.capacity}
                      onChange={handleFilterChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                     Price Range <span className="text-gray-400 font-normal ml-1">(per night)</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="number"
                        name="minPrice"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="number"
                        name="maxPrice"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 pt-3.5 rounded-xl transition-all shadow-md hover:shadow-blue-600/30 active:scale-[0.98]"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-extrabold text-gray-900">Explore Hotels</h1>
              <p className="text-gray-500 mt-2">Showing the best properties for your next stay.</p>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 border-dashed">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
                <p className="text-gray-500 font-medium tracking-wide">Finding perfect stays...</p>
              </div>
            ) : isError ? (
              <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center border border-red-100">
                <p className="font-bold text-xl mb-2">Failed to load hotels</p>
                <p>{error?.message || 'Something went wrong. Please try again later.'}</p>
              </div>
            ) : !currentHotels || currentHotels.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl text-center border border-gray-100 shadow-sm">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-500 max-w-md mx-auto">We couldn't find any hotels matching your current filters. Try adjusting your search criteria or clear filters to see more options.</p>
                <button 
                  onClick={clearFilters}
                  className="mt-6 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-12 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 w-fit mx-auto">
                    <button
                      onClick={() => { setPage(p => Math.max(0, p - 1)); window.scrollTo(0,0); }}
                      disabled={isFirst || isLoading}
                      className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50 text-gray-700 hover:bg-gray-100"
                    >
                      Previous
                    </button>
                    
                    <span className="text-sm font-medium text-gray-500">
                      Page <span className="text-gray-900 font-bold px-1">{page + 1}</span> of <span className="text-gray-900 font-bold px-1">{totalPages}</span>
                    </span>

                    <button
                      onClick={() => { setPage(p => p + 1); window.scrollTo(0,0); }}
                      disabled={isLast || isLoading}
                      className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default HotelList;
