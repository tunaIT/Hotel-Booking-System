import api from './api';

const bookingService = {
  createBooking: async (bookingRequest) => {
    const response = await api.post('/bookings', bookingRequest);
    return response.data;
  },
  
  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },

  // --- Admin ---
  getAllBookings: async () => {
    const response = await api.get('/admin/bookings');
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`/admin/bookings/${id}`);
    return response.data;
  },

  updateBookingStatus: async (id, statusData) => {
    const response = await api.put(`/admin/bookings/${id}/status`, statusData);
    return response.data;
  }
};

export default bookingService;
