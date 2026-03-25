import api from './api';

const roomService = {
  createRoom: async (roomData) => {
    try {
      const response = await api.post('/admin/rooms', roomData);
      return response.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },
  
  updateRoom: async (id, roomData) => {
    try {
      const response = await api.put(`/admin/rooms/${id}`, roomData);
      return response.data;
    } catch (error) {
      console.error(`Error updating room ${id}:`, error);
      throw error;
    }
  },

  deleteRoom: async (id) => {
    try {
      const response = await api.delete(`/admin/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting room ${id}:`, error);
      throw error;
    }
  }
};

export default roomService;
