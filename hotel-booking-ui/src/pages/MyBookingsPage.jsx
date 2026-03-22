import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Calendar, Trash2, Clock, CheckCircle2, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import bookingService from '../services/bookingService';

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'PENDING':
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
    case 'CONFIRMED':
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Confirmed</span>;
    case 'CANCELLED':
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>;
    case 'COMPLETED':
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Completed</span>;
    default:
      return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{status}</span>;
  }
};

const MyBookingsPage = () => {
  const queryClient = useQueryClient();
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState(null);

  // Fetch bookings
  const { data: bookings, isLoading, isError, error } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: bookingService.getMyBookings,
  });

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: bookingService.deleteBooking,
    onSuccess: () => {
      toast.success('Booking cancelled successfully');
      queryClient.invalidateQueries(['my-bookings']);
      setSelectedBookingToCancel(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
      setSelectedBookingToCancel(null);
    }
  });

  const handleCancelClick = (booking) => {
    setSelectedBookingToCancel(booking);
  };

  const confirmCancel = () => {
    if (selectedBookingToCancel) {
      cancelMutation.mutate(selectedBookingToCancel.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100">
          <h3 className="font-semibold text-lg flex items-center mb-2">
            <AlertCircle className="w-5 h-5 mr-2" /> 
            Failed to load bookings
          </h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 pt-4">My Bookings</h1>

      {!bookings || bookings.length === 0 ? (
        <div className="bg-white border text-center border-gray-100 p-12 rounded-2xl shadow-sm">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">No bookings yet</h2>
          <p className="text-gray-500">Looks like you haven't made any reservations.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex flex-col sm:flex-row transition-all hover:shadow-md">
              
              <div className="p-6 flex-grow flex flex-col justify-center">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Room #{booking.roomId}</h3>
                    <p className="text-sm text-gray-500 font-medium">Booking Reference: #{booking.id}</p>
                  </div>
                  <StatusBadge status={booking.status || 'CONFIRMED'} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mt-2 mb-4">
                  <div>
                    <p className="text-gray-500 mb-1">Check-in</p>
                    <p className="font-semibold text-gray-900">{booking.checkInDate ? format(parseISO(booking.checkInDate), 'MMM dd, yyyy') : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Check-out</p>
                    <p className="font-semibold text-gray-900">{booking.checkOutDate ? format(parseISO(booking.checkOutDate), 'MMM dd, yyyy') : 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 sm:w-64 border-t sm:border-t-0 sm:border-l border-gray-100 flex flex-col justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">${booking.totalPrice}</p>
                </div>
                
                {(!booking.status || booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                  <button 
                    onClick={() => handleCancelClick(booking)}
                    className="mt-6 w-full flex items-center justify-center text-red-600 bg-red-50 hover:bg-red-100 font-medium py-2.5 px-4 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {selectedBookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Booking?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel your reservation for 
                <span className="font-semibold text-gray-900"> Room #{selectedBookingToCancel.roomId}</span>? 
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedBookingToCancel(null)}
                  disabled={cancelMutation.isPending}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  Keep Booking
                </button>
                <button 
                  onClick={confirmCancel}
                  disabled={cancelMutation.isPending}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
                >
                  {cancelMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Yes, Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyBookingsPage;
