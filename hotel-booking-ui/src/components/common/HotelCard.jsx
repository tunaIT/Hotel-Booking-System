import { MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
  // Use a placeholder image if not provided
  const imageUrl = hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 sm:h-56">
        <img 
          src={imageUrl} 
          alt={hotel.name} 
          className="w-full h-full object-cover"
        />
        {hotel.rating && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold text-gray-700">{hotel.rating}</span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{hotel.name}</h3>
          <div className="text-right">
            <span className="text-lg font-bold text-blue-600">${hotel.price || hotel.pricePerNight}</span>
            <span className="text-sm text-gray-500 block">/night</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{hotel.location || hotel.address}</span>
        </div>
        
        {hotel.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {hotel.description}
          </p>
        )}
        
        <Link 
          to={`/hotels/${hotel.id}`} 
          className="block w-full text-center bg-blue-50 text-blue-600 font-medium py-2 rounded-lg hover:bg-blue-100 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default HotelCard;
