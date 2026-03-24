import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import { MapPin, Star, ArrowLeft, Users, BedDouble, CreditCard, Loader2, Info, CheckCircle2, Wifi, Coffee, MessageSquare } from 'lucide-react';
import hotelService from '../services/hotelService';
import reviewService from '../services/reviewService';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Fetch hotel details
  const {
    data: hotel,
    isLoading: isHotelLoading,
    error: hotelError
  } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelService.getHotelById(id),
    enabled: !!id,
  });

  // Fetch rooms for this hotel
  const {
    data: rooms,
    isLoading: isRoomsLoading,
    error: roomsError
  } = useQuery({
    queryKey: ['hotel-rooms', id],
    queryFn: () => hotelService.getHotelRooms(id),
    enabled: !!id,
  });

  // Fetch reviews for this hotel
  const {
    data: reviews,
    isLoading: isReviewsLoading
  } = useQuery({
    queryKey: ['hotel-reviews', id],
    queryFn: () => hotelService.getHotelReviews(id),
    enabled: !!id,
  });

  // Submit review mutation
  const submitReview = useMutation({
    mutationFn: (reviewData) => reviewService.createReview(reviewData),
    onSuccess: () => {
      toast.success('Review submitted successfully!');
      setIsReviewModalOpen(false);
      setReviewText('');
      setRating(5);
      queryClient.invalidateQueries({ queryKey: ['hotel-reviews', id] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit review. Have you booked this hotel?');
    }
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    submitReview.mutate({ hotelId: id, rating, comment: reviewText });
  };

  if (isHotelLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium tracking-wide">Gathering hotel details...</p>
      </div>
    );
  }

  if (hotelError || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-red-100 text-center max-w-lg w-full">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotel Not Found</h2>
          <p className="text-gray-500 mb-8">{hotelError?.message || 'We could not load the details for this property.'}</p>
          <button
            onClick={() => navigate('/hotels')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = hotel.imageUrl || `https://picsum.photos/seed/hotelhero-${hotel.id || 1}/1600/900`;

  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-20">

      {/* Immersive Hero Header */}
      <div className="relative h-[60vh] min-h-[500px] bg-gray-900">
        <img
          src={imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

        {/* Navigation overlay */}
        <div className="absolute top-8 left-0 right-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white/90 hover:text-white transition-colors group bg-black/20 hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full w-fit"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Back to Search</span>
          </button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="text-white max-w-3xl animate-slide-up">
                {hotel.rating && (
                  <div className="inline-flex items-center bg-gold-500/90 backdrop-blur-md px-3 py-1 rounded-lg text-white font-bold text-sm mb-4 shadow-lg border border-gold-400">
                    <Star className="w-4 h-4 mr-1.5 fill-current" />
                    {hotel.rating} out of 5
                  </div>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-white drop-shadow-lg">{hotel.name}</h1>
                <div className="flex items-center text-gray-200 text-lg">
                  <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                  {hotel.city || hotel.location || hotel.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-8">

            {/* Description */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Property</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                {hotel.description || 'Experience a blend of comfort and luxury at our wonderful property. Perfectly situated for both leisure and business travelers.'}
              </p>

              {/* Dummy Amenities */}
              <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3"><Wifi className="w-5 h-5 text-blue-600" /></div>
                  <span className="font-medium">Free WiFi</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3"><Coffee className="w-5 h-5 text-blue-600" /></div>
                  <span className="font-medium">Breakfast</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3"><CheckCircle2 className="w-5 h-5 text-blue-600" /></div>
                  <span className="font-medium">Daily Cleaning</span>
                </div>
              </div>
            </div>

            {/* Rooms Section */}
            <div id="rooms" className="scroll-mt-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-extrabold text-gray-900">Available Rooms</h2>
              </div>

              {isRoomsLoading ? (
                <div className="flex justify-center items-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <Loader2 className="animate-spin h-10 w-10 text-blue-500 mb-4" />
                </div>
              ) : roomsError ? (
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">
                  Failed to load rooms. Please try refreshing the page.
                </div>
              ) : !rooms || rooms.length === 0 ? (
                <div className="bg-white border text-center border-gray-100 p-16 rounded-3xl shadow-sm">
                  <BedDouble className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl font-bold text-gray-900 mb-2">No rooms available currently.</p>
                  <p className="text-gray-500">Please check back later or modify your search dates.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {rooms.map((room) => (
                    <div key={room.id} className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row gap-8">
                      {/* Room Visual Dummy placeholder */}
                      <div className="w-full md:w-1/3 bg-gray-100 rounded-2xl h-48 md:h-auto relative overflow-hidden shrink-0">
                        <img src={`https://picsum.photos/seed/room-${room.id}/600/400`} className="w-full h-full object-cover" alt="Room interior" />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-2xl font-bold text-gray-900">{room.roomType}</h3>
                            <div className="text-right">
                              <span className="text-3xl font-black text-blue-600 block leading-none">${room.price}</span>
                              <span className="text-xs text-gray-500 font-semibold tracking-wide uppercase mt-1 block">Per Night</span>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-6 mt-4">
                            {room.description || 'Relax and unwind in this beautifully appointed room designed for your utmost comfort and convenience.'}
                          </p>

                          <div className="flex items-center flex-wrap gap-3 mb-8">
                            <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-gray-700">
                              <Users className="w-4 h-4 mr-2 text-blue-500" />
                              <span className="font-semibold text-sm">Sleeps {room.capacity}</span>
                            </div>
                            <div className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-gray-700">
                              <BedDouble className="w-4 h-4 mr-2 text-blue-500" />
                              <span className="font-semibold text-sm">1 King Bed</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/checkout/${room.id}`, { state: { room, hotel } })}
                          className="w-full md:w-auto self-end bg-black hover:bg-gray-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all flex items-center justify-center active:scale-95"
                        >
                          <CreditCard className="w-5 h-5 mr-2" />
                          Reserve Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div id="reviews" className="scroll-mt-24 mt-16 font-sans">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-extrabold text-gray-900">Guest Reviews</h2>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error('Please log in to write a review');
                      navigate('/login');
                      return;
                    }
                    setIsReviewModalOpen(true);
                  }}
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold py-2 px-4 rounded-xl transition-colors flex items-center gap-2"
                >
                  <MessageSquare size={18} /> Write a Review
                </button>
              </div>

              {isReviewsLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>
              ) : !reviews || reviews.length === 0 ? (
                <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl text-center">
                  <p className="text-gray-500 font-medium">No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-5">
                      <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-blue-600">
                          {review.userName ? review.userName.charAt(0).toUpperCase() : <Users size={20} />}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{review.userName || 'Verified Guest'}</h4>
                            <p className="text-sm text-gray-500 mb-2">
                              {review.createdAt ? format(parseISO(review.createdAt), 'dd/MM/yyyy HH:mm') : 'Recently'}
                              {review.updatedAt && review.updatedAt !== review.createdAt && <span className="italic ml-2 text-xs">(Đã chỉnh sửa)</span>}
                            </p>
                          </div>
                          {review.hotelName && (
                            <span className="text-xs font-semibold tracking-wide uppercase bg-gray-50 text-gray-500 border border-gray-200 rounded-lg px-2.5 py-1">
                              {review.hotelName}
                            </span>
                          )}
                        </div>
                        <div className="flex text-amber-400 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} className={i < review.rating ? 'fill-current' : 'text-gray-200'} />
                          ))}
                        </div>
                        <p className="text-gray-700 leading-relaxed text-[15px]">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Sticky Summary / CTA Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to book?</h3>
              <p className="text-gray-500 text-sm mb-6">Select a room to proceed with your reservation securely.</p>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-6">
                <h4 className="font-bold text-blue-900 flex items-center mb-2"><CheckCircle2 className="w-5 h-5 mr-2 text-blue-600" /> Best Price Guarantee</h4>
                <p className="text-blue-700/80 text-sm">You are getting the best possible rate by booking directly on LuxeStay.</p>
              </div>

              <button
                onClick={() => document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-blue-600/30"
              >
                View Options
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Star size={20} className="text-gold-500 fill-current" /> Write a Review
              </h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors">✕</button>
            </div>
            <form onSubmit={handleReviewSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 transition-transform hover:scale-110 ${rating >= star ? 'text-gold-500' : 'text-gray-300'}`}
                    >
                      <Star size={32} className={rating >= star ? 'fill-current' : ''} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Experience</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Tell us what you liked or how we can improve..."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsReviewModalOpen(false)} className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" disabled={submitReview.isPending} className="px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-70 flex items-center gap-2">
                  {submitReview.isPending ? <Loader2 size={18} className="animate-spin" /> : <MessageSquare size={18} />}
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelDetail;
