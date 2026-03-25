import { useState, useEffect } from 'react';
import bookingService from '../../services/bookingService';
import { ArrowLeft, CalendarDays, CheckCircle, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getAllBookings();
      // Assume data is an array since getAllBookings returns a list of BookingResponse.
      // If it's paginated, it might be data.content. I'll rely on our backend response: List<BookingResponse>
      setBookings(data || []);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await bookingService.updateBookingStatus(id, { status: newStatus });
      toast.success(`Booking status updated to ${newStatus}`);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle size={14} /> Confirmed</span>;
      case 'PENDING':
        return <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold"><Clock size={14} /> Pending</span>;
      case 'CANCELLED':
        return <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold"><XCircle size={14} /> Cancelled</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
               <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
              <p className="text-gray-600 mt-1">Review and manage all user reservations in the system.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">User Email</th>
                  <th className="px-6 py-4">Hotel / Room</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-8 text-gray-500">Loading bookings...</td></tr>
                ) : bookings.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8 text-gray-500">No bookings found.</td></tr>
                ) : (
                  bookings.map(booking => (
                    <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-500 font-medium">#{booking.id}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{booking.userEmail}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{booking.hotelName}</div>
                        <div className="text-sm text-gray-500">{booking.roomType} / {booking.hotelCity}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <CalendarDays size={14} className="text-blue-500" /> 
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-[14px] flex justify-center text-gray-300">→</span>
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-bold">
                        {formatCurrency(booking.totalPrice)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 outline-none shadow-sm cursor-pointer"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirm</option>
                          <option value="CANCELLED">Cancel</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
