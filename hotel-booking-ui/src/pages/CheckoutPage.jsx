import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays, isAfter, startOfDay } from 'date-fns';
import { ArrowLeft, Calendar, CreditCard, Loader2, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import bookingService from '../services/bookingService';

const CheckoutPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const room = location.state?.room;
  const hotel = location.state?.hotel; // In case we passed hotel

  const { handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      checkInDate: addDays(new Date(), 1), // Tomorrow
      checkOutDate: addDays(new Date(), 2), // Day after
    }
  });

  const checkInDate = watch('checkInDate');
  const checkOutDate = watch('checkOutDate');

  const bookingMutation = useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: () => {
      navigate('/booking-success');
    },
  });

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const totalPrice = room ? nights * room.price : 0;

  const onSubmit = (data) => {
    if (!roomId) return;
    const requestData = {
      roomId: parseInt(roomId),
      checkInDate: format(data.checkInDate, 'yyyy-MM-dd'),
      checkOutDate: format(data.checkOutDate, 'yyyy-MM-dd')
    };
    bookingMutation.mutate(requestData);
  };

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 bg-gray-50">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full">
          <Info className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Missing Room Details</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">We couldn't find the room you selected. Please go back and select a room to continue booking.</p>
          <button 
            onClick={() => navigate('/hotels')}
            className="w-full bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-blue-700 transition"
          >
            Browse Hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-8 group font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Go back
        </button>

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">Complete your booking</h1>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-10">
          
          {/* Booking Form */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
              <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
                <Calendar className="w-6 h-6 mr-3 text-blue-600"/> Dates of Stay
              </h2>
              
              {bookingMutation.isError && (
                <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-medium flex items-start">
                  <Info className="w-5 h-5 mr-3 shrink-0 mt-0.5" />
                  <span>Oops! We couldn't process that. {bookingMutation.error?.response?.data?.message || 'Please try again.'}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-gray-100">
                  {/* Check In */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Check-In</label>
                    <Controller
                      control={control}
                      name="checkInDate"
                      rules={{ 
                        required: "Required",
                        validate: value => !isAfter(startOfDay(new Date()), value) || "Cannot be in the past"
                      }}
                      render={({ field }) => (
                        <div className="relative">
                          <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            selectsStart
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            minDate={new Date()}
                            placeholderText="Select Date"
                            className={`w-full pl-4 pr-10 py-3.5 bg-gray-50 border ${errors.checkInDate ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} rounded-xl focus:ring-2 focus:border-transparent transition-all font-medium text-gray-900`}
                          />
                          <Calendar className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.checkInDate ? 'text-red-400' : 'text-gray-400'} pointer-events-none`} />
                        </div>
                      )}
                    />
                    {errors.checkInDate && <p className="text-red-500 text-sm mt-2 font-medium">{errors.checkInDate.message}</p>}
                  </div>

                  {/* Check Out */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Check-Out</label>
                    <Controller
                      control={control}
                      name="checkOutDate"
                      rules={{ 
                        required: "Required",
                        validate: value => isAfter(value, checkInDate) || "Must be after check-in"
                      }}
                      render={({ field }) => (
                        <div className="relative">
                          <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            selectsEnd
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            minDate={addDays(checkInDate || new Date(), 1)}
                            placeholderText="Select Date"
                            className={`w-full pl-4 pr-10 py-3.5 bg-gray-50 border ${errors.checkOutDate ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'} rounded-xl focus:ring-2 focus:border-transparent transition-all font-medium text-gray-900`}
                          />
                          <Calendar className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${errors.checkOutDate ? 'text-red-400' : 'text-gray-400'} pointer-events-none`} />
                        </div>
                      )}
                    />
                    {errors.checkOutDate && <p className="text-red-500 text-sm mt-2 font-medium">{errors.checkOutDate.message}</p>}
                  </div>
                </div>

                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100/50 flex items-start">
                  <ShieldCheck className="w-6 h-6 text-blue-600 mr-4 shrink-0 mt-0.5" />
                  <div>
                     <h4 className="font-bold text-gray-900 mb-1">Secure booking</h4>
                     <p className="text-gray-600 text-sm leading-relaxed">Your reservation is safe with us. By confirming, you agree to our terms of service and cancellation policy.</p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={bookingMutation.isPending || errors.checkInDate || errors.checkOutDate}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-blue-600/30 transition-all flex items-center justify-center disabled:opacity-70 disabled:active:scale-100 disabled:hover:shadow-none"
                  >
                    {bookingMutation.isPending ? (
                      <><Loader2 className="w-5 h-5 mr-3 animate-spin"/> Processing...</>
                    ) : (
                      <>Confirm & Pay <CreditCard className="w-5 h-5 ml-3"/></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sticky Order Summary */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24 overflow-hidden relative">
              
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>

              <h2 className="text-xl font-bold text-gray-900 mb-6">Price Details</h2>
              
              <div className="mb-6">
                <h3 className="font-bold text-lg text-gray-900 leading-tight">{hotel?.name || 'Selected Property'}</h3>
                <p className="text-gray-500 font-medium mt-1 mb-4 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-green-500" /> {room.roomType}
                </p>
                <div className="px-4 py-2 bg-gray-50 rounded-lg inline-block">
                  <p className="text-sm font-semibold text-gray-700">Capacity: {room.capacity} Guests</p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">${room.price} x {nights} nights</span>
                  <span className="font-semibold text-gray-900">${totalPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Taxes & Fees</span>
                  <span className="font-semibold text-green-600 text-sm">Included</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-900 text-lg">Total (USD)</span>
                  <span className="text-3xl font-black text-blue-600">${totalPrice}</span>
                </div>
              </div>
              
              {(errors.checkOutDate || errors.checkInDate) && (
                <div className="mt-6 text-sm font-medium text-red-500 bg-red-50 p-3 rounded-lg flex items-start">
                   <Info className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                   Fix date errors above to see final pricing.
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
