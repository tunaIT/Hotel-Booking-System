import { useState, useEffect } from 'react';
import hotelService from '../../services/hotelService';
import { Plus, PencilLine, Trash2, ArrowLeft, X, Hotel } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Pagination states
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [size] = useState(10);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    city: '', 
    description: '',
    rating: 0
  });

  useEffect(() => {
    fetchHotels(page);
  }, [page]);

  const fetchHotels = async (pageNumber) => {
    try {
      setLoading(true);
      const data = await hotelService.getHotels({ page: pageNumber, size });
      setHotels(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      toast.error('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await hotelService.deleteHotel(id);
        toast.success('Hotel deleted successfully');
        fetchHotels(page);
      } catch (error) {
        toast.error('Failed to delete hotel. It might have active bookings.');
      }
    }
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setFormData({ 
       name: hotel.name || '', 
       city: hotel.city || '', 
       description: hotel.description || '',
       rating: hotel.rating || 0
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingHotel(null);
    setFormData({ name: '', city: '', description: '', rating: 0 });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHotel) {
        await hotelService.updateHotel(editingHotel.id, formData);
        toast.success('Hotel updated successfully');
      } else {
        await hotelService.createHotel(formData);
        toast.success('Hotel created successfully');
      }
      setIsModalOpen(false);
      fetchHotels(page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Hotel Management</h1>
              <p className="text-gray-600 mt-1">Manage all luxury properties in your catalog.</p>
            </div>
          </div>
          <button 
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus size={18} /> Add Hotel
          </button>
        </div>

        {/* Hotels Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Property Name</th>
                  <th className="px-6 py-4">City</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">Loading hotels...</td></tr>
                ) : hotels.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-500">No hotels found.</td></tr>
                ) : (
                  hotels.map(hotel => (
                    <tr key={hotel.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-500">#{hotel.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                              <Hotel size={16} />
                           </div>
                           {hotel.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">{hotel.city}</span>
                      </td>
                      <td className="px-6 py-4 text-amber-500 font-bold">
                        ★ {hotel.rating || '0.0'}
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {hotel.createdAt ? new Date(hotel.createdAt).toLocaleDateString('vi-VN') : '---'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(hotel)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <PencilLine size={18} />
                          </button>
                          <button onClick={() => handleDelete(hotel.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
              <div className="flex gap-2">
                <button 
                  disabled={page === 0} 
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition-colors"
                >
                  Previous
                </button>
                <button 
                  disabled={page >= totalPages - 1} 
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hotel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
             <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Hotel size={20} className="text-blue-600"/> 
                  {editingHotel ? 'Edit Hotel' : 'Create New Hotel'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full p-1 transition-colors"><X size={20}/></button>
             </div>
             <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Hotel Name</label>
                  <input required placeholder="E.g., Grand Plaza Hotel" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                  <input required placeholder="E.g., Hanoi" type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Rating (0-5)</label>
                  <input required min="0" max="5" step="0.1" type="number" value={formData.rating} onChange={e => setFormData({...formData, rating: parseFloat(e.target.value)})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea rows="3" required placeholder="Describe the hotel amenities and views..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-shadow resize-none" />
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                   <button type="submit" className="px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                     {editingHotel ? 'Save Changes' : 'Create Hotel'}
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelManagement;
