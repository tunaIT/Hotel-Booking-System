import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2 } from 'lucide-react';
import hotelService from '../services/hotelService';
import HotelCard from '../components/common/HotelCard';
import Input from '../components/common/Input';

const HotelList = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(8);
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Fetch hotels with react-query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['hotels', { page, size, keyword }],
    queryFn: () => hotelService.getHotels({ page, size, keyword }),
    keepPreviousData: true, // Keep old data while fetching new page
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(0); // Reset to first page on new search
  };

  const currentHotels = data?.content || data?.data || data || [];
  const totalPages = data?.totalPages || 0;
  const isFirst = data?.first ?? page === 0;
  const isLast = data?.last ?? page >= totalPages - 1;

  // Render hotel items
  const renderHotels = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin h-10 w-10 text-blue-600 mb-4" />
          <p className="text-gray-500">Loading hotels...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center my-8">
          <p className="font-semibold text-lg mb-2">Failed to load hotels</p>
          <p className="text-sm">{error?.message || 'Something went wrong. Please try again later.'}</p>
        </div>
      );
    }

    if (!currentHotels || currentHotels.length === 0) {
      return (
        <div className="bg-blue-50/50 p-12 rounded-xl text-center border-2 border-dashed border-blue-100 my-8">
          <Search className="h-12 w-12 text-blue-300 mx-auto mb-4" />
          <p className="text-xl font-medium text-gray-700">No hotels found</p>
          <p className="text-gray-500 mt-2">Try adjusting your search filters to find what you're looking for.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-8">
        {currentHotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Explore Hotels</h1>
          <p className="text-gray-500 text-sm mt-1">Find the perfect place for your next stay.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-96">
          <Input 
            type="text"
            placeholder="Search by name or location..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-grow"
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Search size={20} />
          </button>
        </form>
      </div>

      {renderHotels()}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 py-4">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={isFirst || isLoading}
            className="px-4 py-2 border rounded-md shadow-sm bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600">
              Page <span className="font-semibold">{page + 1}</span> of <span className="font-semibold">{totalPages}</span>
            </span>
          </div>

          <button
            onClick={() => setPage(p => p + 1)}
            disabled={isLast || isLoading}
            className="px-4 py-2 border rounded-md shadow-sm bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HotelList;
