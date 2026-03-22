import { CheckCircle, Home, CalendarCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center px-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Đặt phòng thành công!</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi. Thông tin đặt phòng chi tiết đã được gửi tới email của bạn.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Trang chủ
          </button>
          
          {/* Bạn có thể thêm link tới My Bookings nếu đã làm chức năng đó */}
          {/* <button
            onClick={() => navigate('/my-bookings')}
            className="w-full sm:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <CalendarCheck className="w-5 h-5 mr-2" />
            Booking của tôi
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
