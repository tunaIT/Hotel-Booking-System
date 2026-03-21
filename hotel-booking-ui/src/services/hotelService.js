import api from './api';

const hotelService = {
  // Get paginated list of hotels with optional keyword and other filters
  getHotels: async ({ page = 0, size = 10, keyword = '', ...params }) => {
    try {
      // Backend likely uses standard Spring Data pagination (page, size)
      // and maybe a keyword param for search, adjust to match exact API
      const response = await api.get('/hotels', {
        params: {
          page,
          size,
          keyword: keyword || undefined,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }
  },

  // Get a single hotel by ID
  getHotelById: async (id) => {
    try {
      const response = await api.get(`/hotels/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching hotel ${id}:`, error);
      throw error;
    }
  },

  // Get rooms by hotel ID
  getHotelRooms: async (id) => {
    try {
      const response = await api.get(`/hotels/${id}/rooms`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rooms for hotel ${id}:`, error);
      throw error;
    }
  },

  // Get reviews by hotel ID
  getHotelReviews: async (id) => {
    try {
      const response = await api.get(`/hotels/${id}/reviews`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for hotel ${id}:`, error);
      throw error;
    }
  }
};

export default hotelService;
