import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { Calendar, Trash2, Clock, CheckCircle2, ChevronRight, AlertCircle, Loader2, MapPin, Star, Users, Home, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import bookingService from '../services/bookingService';

const StatusBadge = ({ status }) => {
  const styles = {
    PENDING: "bg-amber-50 text-amber-600 border-amber-200",
    CONFIRMED: "bg-emerald-50 text-emerald-600 border-emerald-200",
    CANCELLED: "bg-rose-50 text-rose-600 border-rose-200",
    COMPLETED: "bg-slate-50 text-slate-600 border-slate-200"
  };
  const defaultStyle = "bg-blue-50 text-blue-600 border-blue-200";
  const appliedStyle = styles[status] || defaultStyle;

  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${appliedStyle}`}>
      {status || 'UNKNOWN'}
    </span>
  );
};

const MyBookingsPage = () => {
  const queryClient = useQueryClient();
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState(null);

  const { data: bookings, isLoading, isError, error } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: bookingService.getMyBookings,
  });

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-slate-500 font-medium animate-pulse">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 flex items-start shadow-sm">
          <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-lg mb-1">Failed to load bookings</h3>
            <p className="text-red-600/80">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 sm:px-6">
      <div className="py-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-2">My Bookings</h1>
        <p className="text-slate-500">Manage your past and upcoming hotel reservations.</p>
      </div>

      {!bookings || bookings.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-md border border-slate-200 text-center p-16 rounded-3xl shadow-sm flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
            <Calendar className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">No bookings found</h2>
          <p className="text-slate-500 max-w-md mx-auto">You haven't made any reservations yet. Start exploring our hotels to find your next perfect stay.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="group bg-white rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden transition-all duration-300 flex flex-col md:flex-row">
              
              {/* Decorative side accent */}
              <div className="hidden md:block w-2 bg-gradient-to-b from-blue-500 to-indigo-600"></div>

              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start md:items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-1 md:mt-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {booking.hotelName || `Hotel Booking`}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                          {booking.hotelCity && (
                            <span className="flex items-center text-slate-500"><MapPin className="w-3.5 h-3.5 mr-1" />{booking.hotelCity}</span>
                          )}
                          {booking.hotelRating && (
                            <span className="flex items-center text-amber-500 font-medium"><Star className="w-3.5 h-3.5 mr-1 fill-amber-500" />{booking.hotelRating}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="block md:hidden"><StatusBadge status={booking.status || 'CONFIRMED'} /></div>
                  </div>

                  <div className="mt-6 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Room Info</p>
                      <p className="font-semibold text-slate-800 flex items-center">
                        <Home className="w-4 h-4 mr-2 text-slate-400" />
                        {booking.roomType ? booking.roomType : `Room #${booking.roomId}`}
                      </p>
                      {booking.roomCapacity && (
                        <p className="text-sm text-slate-500 flex items-center mt-1">
                          <Users className="w-3.5 h-3.5 mr-2 text-slate-400" />
                          {booking.roomCapacity} {booking.roomCapacity > 1 ? 'Guests' : 'Guest'}
                        </p>
                      )}
                    </div>
                    <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                    <div className="flex gap-8">
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Check-in</p>
                        <p className="font-semibold text-slate-800">{booking.checkInDate ? format(parseISO(booking.checkInDate), 'MMM dd, yyyy') : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Check-out</p>
                        <p className="font-semibold text-slate-800">{booking.checkOutDate ? format(parseISO(booking.checkOutDate), 'MMM dd, yyyy') : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-6 text-xs text-slate-400">
                  <span>Ref: #{booking.id}</span>
                  {booking.createdAt && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>Booked: {format(parseISO(booking.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-6 md:p-8 md:w-72 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-between">
                <div className="hidden md:flex justify-end mb-6">
                  <StatusBadge status={booking.status || 'CONFIRMED'} />
                </div>
                
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-1">Total Amount</p>
                  <p className="text-3xl font-extrabold text-slate-900">${booking.totalPrice}</p>
                </div>
                
                {(!booking.status || booking.status === 'PENDING') && (
                  <button 
                    onClick={() => handleCancelClick(booking)}
                    className="mt-8 w-full flex items-center justify-center gap-2 text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 shadow-sm font-semibold py-3 px-4 rounded-xl transition-all duration-200 ease-out"
                  >
                    <Trash2 className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {selectedBookingToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-6 text-rose-500 mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-center text-slate-900 mb-2">Cancel Booking?</h3>
              <p className="text-slate-500 text-center mb-8">
                Are you sure you want to cancel your stay at <strong className="text-slate-800">{selectedBookingToCancel.hotelName || 'this hotel'}</strong>? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedBookingToCancel(null)}
                  disabled={cancelMutation.isPending}
                  className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                >
                  Keep It
                </button>
                <button 
                  onClick={confirmCancel}
                  disabled={cancelMutation.isPending}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-rose-200 hover:shadow-md disabled:opacity-70"
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
