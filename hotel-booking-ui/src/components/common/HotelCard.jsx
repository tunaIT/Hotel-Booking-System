import { MapPin, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
  // Ensure a beautiful deterministic image loads for every hotel based on ID if there's no DB imageUrl
  const imageUrl = hotel.imageUrl || `https://picsum.photos/seed/hotel-${hotel.id || 'fallback'}/800/600`;
  
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 group flex flex-col h-full border border-gray-100">
      <div className="relative h-56 sm:h-64 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={hotel.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {hotel.rating && (
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg flex items-center space-x-1 shadow-sm">
            <Star className="w-4 h-4 text-gold-400 fill-current" />
            <span className="text-sm font-bold text-gray-800">{hotel.rating}</span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight pr-4">{hotel.name}</h3>
        </div>
        
        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-gray-400" />
          <span className="text-sm font-medium">{hotel.city || hotel.location || 'Location unavailable'}</span>
        </div>
        
        {hotel.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-grow">
            {hotel.description}
          </p>
        )}
        
        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link 
            to={`/hotels/${hotel.id}`} 
            className="flex items-center justify-between w-full bg-brand-50 hover:bg-brand-600 text-brand-600 hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
          >
            <span>View Rooms & Prices</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
