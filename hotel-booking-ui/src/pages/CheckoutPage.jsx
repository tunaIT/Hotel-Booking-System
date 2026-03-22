import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, addDays, isAfter, startOfDay } from 'date-fns';
import { ArrowLeft, Calendar, CreditCard, Loader2, Info } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import bookingService from '../services/bookingService';

const CheckoutPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const room = location.state?.room;

  // Form setup
  const { handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      checkInDate: addDays(new Date(), 1), // Default check-in tomorrow
      checkOutDate: addDays(new Date(), 2), // Default check-out day after tomorrow
    }
  });

  const checkInDate = watch('checkInDate');
  const checkOutDate = watch('checkOutDate');

  // Mutation for creating booking
  const bookingMutation = useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: () => {
      navigate('/booking-success');
    },
  });

  // Derived calculations
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <Info className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">Room details missing</h2>
        <p className="text-gray-500 mb-6">Please go back and select a room to book.</p>
        <button 
          onClick={() => navigate('/hotels')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Browse Hotels
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-500 hover:text-blue-600 transition-colors mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back</span>
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout & Booking</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-6">Booking Details</h2>
            
            {bookingMutation.isError && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm">
                Error creating booking. {bookingMutation.error?.response?.data?.message || 'Please try again.'}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Check In */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Check-In Date</label>
                  <Controller
                    control={control}
                    name="checkInDate"
                    rules={{ 
                      required: "Check-in date is required",
                      validate: value => 
                        !isAfter(startOfDay(new Date()), value) || "Check-in cannot be in the past"
                    }}
                    render={({ field }) => (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          selectsStart
                          startDate={checkInDate}
                          endDate={checkOutDate}
                          minDate={new Date()} // Prevent picking past dates
                          placeholderText="Select Check-In Date"
                          className={`w-full pl-10 pr-4 py-2 border ${errors.checkInDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                        />
                      </div>
                    )}
                  />
                  {errors.checkInDate && <p className="text-red-500 text-sm mt-1">{errors.checkInDate.message}</p>}
                </div>

                {/* Check Out */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Check-Out Date</label>
                  <Controller
                    control={control}
                    name="checkOutDate"
                    rules={{ 
                      required: "Check-out date is required",
                      validate: value => 
                        isAfter(value, checkInDate) || "Check-out must be after check-in"
                    }}
                    render={({ field }) => (
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          selectsEnd
                          startDate={checkInDate}
                          endDate={checkOutDate}
                          minDate={addDays(checkInDate || new Date(), 1)} // Check out must be at least 1 day after check in
                          placeholderText="Select Check-Out Date"
                          className={`w-full pl-10 pr-4 py-2 border ${errors.checkOutDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                        />
                      </div>
                    )}
                  />
                  {errors.checkOutDate && <p className="text-red-500 text-sm mt-1">{errors.checkOutDate.message}</p>}
                </div>
              </div>

              {/* Note: Normally here we'd collect Guest Names if required, but the backend BookingRequest currently only needs roomId, checkInDate, checkOutDate. */}

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={bookingMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-sm transition-colors flex items-center disabled:opacity-70"
                >
                  {bookingMutation.isPending ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin"/> Processing...</>
                  ) : (
                    <><CreditCard className="w-5 h-5 mr-2"/> Confirm Booking</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-3">Booking Summary</h2>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-900">{room.roomType}</h3>
              <p className="text-gray-500 text-sm mt-1">Capacity: {room.capacity} People</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-gray-200 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Price per night</span>
                <span className="font-medium">${room.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total nights</span>
                <span className="font-medium">{nights}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-300">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">${totalPrice}</span>
              </div>
            </div>
            
            {errors.checkOutDate || errors.checkInDate ? (
              <div className="mt-4 text-xs text-red-500 bg-red-50 p-2 rounded">
                 Please resolve date validation errors to see accurate total.
              </div>
            ) : null}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CheckoutPage;
