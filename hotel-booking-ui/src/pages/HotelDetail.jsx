import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Star, ArrowLeft, Users, Bed, CreditCard, Loader2 } from 'lucide-react';
import hotelService from '../services/hotelService';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch hotel details
  const { 
    data: hotel, 
    isLoading: isHotelLoading, 
    error: hotelError 
  } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelService.getHotelById(id),
    enabled: !!id,
  });

  // Fetch rooms for this hotel
  const { 
    data: rooms, 
    isLoading: isRoomsLoading, 
    error: roomsError 
  } = useQuery({
    queryKey: ['hotel-rooms', id],
    queryFn: () => hotelService.getHotelRooms(id),
    enabled: !!id,
  });

  if (isHotelLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (hotelError || !hotel) {
    return (
      <div className="bg-red-50 text-red-600 p-8 rounded-xl text-center max-w-2xl mx-auto my-12">
        <p className="font-semibold text-xl mb-2">Failed to load hotel details</p>
        <p>{hotelError?.message || 'The requested hotel could not be found.'}</p>
        <button 
          onClick={() => navigate('/hotels')}
          className="mt-6 bg-red-100 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium text-red-700"
        >
          Back to Hotels
        </button>
      </div>
    );
  }

  const imageUrl = hotel.imageUrl || 'https://images.unsplash.com/photo-1542314831-c6a4d2748610?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back</span>
      </button>

      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-64 sm:h-80 md:h-96 relative">
          <img 
            src={imageUrl} 
            alt={hotel.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{hotel.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base opacity-90">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {hotel.city || hotel.location || hotel.address}
              </span>
              {hotel.rating && (
                <span className="flex items-center bg-blue-600/80 backdrop-blur-sm px-2 py-0.5 rounded text-white font-semibold shadow-sm">
                  <Star className="w-4 h-4 mr-1 fill-current text-yellow-300" />
                  {hotel.rating}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">About this Hotel</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {hotel.description || 'No description available for this hotel.'}
          </p>
        </div>
      </div>

      {/* Rooms Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Bed className="w-6 h-6 mr-2 text-blue-600" />
          Available Rooms
        </h2>

        {isRoomsLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          </div>
        ) : roomsError ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            Failed to load rooms. Please try again.
          </div>
        ) : !rooms || rooms.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 p-12 rounded-xl text-center">
            <Bed className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-500">No rooms available.</p>
            <p className="text-sm text-gray-400 mt-1">Check back later or try another hotel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="bg-white border text-left border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{room.roomType}</h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-blue-600 block">${room.price}</span>
                      <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Per Night</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-6">
                    {room.description ? (
                       <p className="line-clamp-3 mb-4">{room.description}</p>
                    ) : (
                       <p className="italic text-gray-400 mb-4">No specific description provided for this room.</p>
                    )}
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Users className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-medium text-sm">Sleeps {room.capacity}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Book this Room
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default HotelDetail;
