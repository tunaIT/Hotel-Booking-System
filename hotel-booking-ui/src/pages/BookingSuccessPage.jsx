import { CheckCircle, Home, CalendarCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-20">
      <div className="bg-white p-10 md:p-14 rounded-3xl shadow-xl shadow-green-900/5 border border-green-50 max-w-xl w-full text-center relative overflow-hidden animate-slide-up">
        
        {/* Decorative background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-50 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-50 rounded-full mix-blend-multiply filter blur-2xl opacity-70"></div>

        <div className="relative z-10">
          <div className="flex justify-center mb-8 relative">
            <div className="bg-green-100 p-5 rounded-full relative">
              <CheckCircle className="w-20 h-20 text-green-500" />
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-gold-400 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-10 text-lg leading-relaxed">
            Thank you for choosing LuxeStay. Your reservation is complete, and a confirmation email has been sent to your inbox.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/my-bookings')}
              className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-blue-600/30 transition-all text-sm md:text-base"
            >
              <CalendarCheck className="w-5 h-5 mr-2" />
              View My Bookings
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-auto flex items-center justify-center bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-800 font-bold py-4 px-8 rounded-xl transition-all text-sm md:text-base"
            >
              <Home className="w-5 h-5 mr-2 text-gray-500" />
              Return Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
