import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { MapPin, Users, Calendar as CalendarIcon, Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [city, setCity] = useState('');
  const [capacity, setCapacity] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (capacity) params.append('capacity', capacity);
    // Note: Dates could also be passed if backend supported it, but for now we just pass what the API supports.
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/luxuryhotel/2000/1000" 
            alt="Luxury Hotel Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-gray-50/90 z-0"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Find Your <span className="text-gold-400">Perfect</span> Stay
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-12 max-w-2xl">
            Discover luxury hotels, breathtaking views, and unforgettable experiences worldwide.
          </p>

          {/* Floating Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="w-full max-w-4xl glass p-3 md:p-4 rounded-2xl flex flex-col md:flex-row gap-3 shadow-2xl"
          >
            {/* Location Input */}
            <div className="flex-1 bg-white/60 hover:bg-white transition-colors rounded-xl flex items-center px-4 py-3">
              <MapPin className="text-blue-600 mr-3 w-5 h-5" />
              <div className="flex flex-col flex-1 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Location</label>
                <input 
                  type="text" 
                  placeholder="Where are you going?"
                  className="bg-transparent border-none outline-none text-gray-900 font-medium placeholder-gray-400 w-full"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            {/* Dates Input */}
            <div className="flex-1 bg-white/60 hover:bg-white transition-colors rounded-xl flex items-center px-4 py-3 cursor-pointer">
              <CalendarIcon className="text-blue-600 mr-3 w-5 h-5 flex-shrink-0" />
              <div className="flex flex-col flex-1 text-left w-full">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Dates</label>
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  placeholderText="Check in - Check out"
                  className="bg-transparent border-none outline-none text-gray-900 font-medium placeholder-gray-400 w-full cursor-pointer"
                  minDate={new Date()}
                />
              </div>
            </div>

            {/* Guests Input */}
            <div className="flex-[0.7] bg-white/60 hover:bg-white transition-colors rounded-xl flex items-center px-4 py-3">
              <Users className="text-blue-600 mr-3 w-5 h-5" />
              <div className="flex flex-col flex-1 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Guests</label>
                <input 
                  type="number" 
                  min="1"
                  placeholder="How many?"
                  className="bg-transparent border-none outline-none text-gray-900 font-medium placeholder-gray-400 w-full"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 md:px-8 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg hover:shadow-blue-600/30 active:scale-95"
            >
              <Search className="w-5 h-5 md:mr-2" />
              <span className="hidden md:inline">Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* Recommended Section (Static Preview) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Destinations</h2>
        <p className="text-gray-500 mb-8">Popular places to stay that we recommend for you.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Da Nang', 'Hanoi', 'Ho Chi Minh'].map((dest, i) => (
            <div key={dest} onClick={() => { setCity(dest); navigate(`/hotels?city=${dest}`); }} className="relative h-64 rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all">
              <img 
                src={`https://picsum.photos/seed/${dest.replace(' ', '')}/800/600`} 
                alt={dest}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold">{dest}</h3>
                <p className="text-sm opacity-80 mt-1">Explore hotels</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
