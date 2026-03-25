import { useState, useEffect } from 'react';
import hotelService from '../../services/hotelService';
import roomService from '../../services/roomService';
import { Plus, PencilLine, Trash2, X, DoorOpen, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const RoomManagementModal = ({ hotelId, hotelName, onClose }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [formData, setFormData] = useState({
    roomType: '',
    price: '',
    capacity: '',
    description: ''
  });

  useEffect(() => {
    fetchRooms();
  }, [hotelId]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await hotelService.getHotelRooms(hotelId);
      setRooms(data || []);
    } catch (error) {
      toast.error('Failed to fetch rooms for this hotel.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (room) => {
    setIsEditing(true);
    setEditingRoomId(room.id);
    setFormData({
      roomType: room.roomType,
      price: room.price,
      capacity: room.capacity,
      description: room.description || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room? It might have active bookings.')) {
      try {
        await roomService.deleteRoom(id);
        toast.success('Room deleted successfully.');
        fetchRooms();
      } catch (error) {
        toast.error('Failed to delete room. It might be linked to existing bookings.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        hotelId,
        roomType: formData.roomType,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        description: formData.description
      };

      if (isEditing) {
        await roomService.updateRoom(editingRoomId, payload);
        toast.success('Room updated successfully!');
      } else {
        await roomService.createRoom(payload);
        toast.success('Room created successfully!');
      }

      // Reset form
      setIsEditing(false);
      setEditingRoomId(null);
      setFormData({ roomType: '', price: '', capacity: '', description: '' });
      
      // Refresh list
      fetchRooms();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingRoomId(null);
    setFormData({ roomType: '', price: '', capacity: '', description: '' });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 transition-opacity">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
          <div>
             <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               <DoorOpen size={22} className="text-blue-600"/> 
               Manage Rooms
             </h3>
             <p className="text-sm text-gray-500 mt-1">Editing rooms for <span className="font-semibold text-gray-700">{hotelName}</span></p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition-colors">
            <X size={20}/>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 flex flex-col md:flex-row gap-6">
          
          {/* Left: Rooms List Table */}
          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Room List ({rooms.length})</h4>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-gray-50 shadow-sm">
                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Price</th>
                      <th className="px-4 py-3">Cap.</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {loading ? (
                      <tr><td colSpan="5" className="text-center py-8 text-gray-400">Loading rooms...</td></tr>
                    ) : rooms.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-8 text-gray-400">No rooms available. Create one to the right!</td></tr>
                    ) : (
                      rooms.map(room => (
                        <tr key={room.id} className={`hover:bg-blue-50/30 transition-colors ${editingRoomId === room.id ? 'bg-blue-50/50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}`}>
                          <td className="px-4 py-3 text-gray-500">#{room.id}</td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{room.roomType}</td>
                          <td className="px-4 py-3 text-emerald-600 font-medium">${room.price}</td>
                          <td className="px-4 py-3 text-gray-600 font-mono bg-gray-100 rounded text-center w-8">{room.capacity}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <button onClick={() => handleEdit(room)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Edit">
                                <PencilLine size={16} />
                              </button>
                              <button onClick={() => handleDelete(room.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Add/Edit Room Form */}
          <div className="w-full md:w-[320px] flex-shrink-0">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
               <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                 {isEditing ? <><PencilLine size={16} className="text-blue-600"/> Edit Room #{editingRoomId}</> : <><Plus size={16} className="text-green-600"/> Add New Room</>}
               </h4>

               <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Room Type</label>
                    <input required placeholder="E.g., Deluxe Suite" type="text" value={formData.roomType} onChange={e => setFormData({...formData, roomType: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm transition-shadow" />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Price ($)</label>
                      <input required min="0" step="0.01" type="number" placeholder="100" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm transition-shadow" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Capacity</label>
                      <input required min="1" max="20" type="number" placeholder="2" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm transition-shadow" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                    <textarea rows="3" required placeholder="Room features..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm transition-shadow resize-none" />
                  </div>
                  
                  <div className="pt-2 flex flex-col gap-2">
                     <button type="submit" className={`w-full py-2.5 rounded-xl font-bold text-white shadow-sm flex items-center justify-center gap-2 transition-colors ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                       <Save size={16} />
                       {isEditing ? 'Update Room' : 'Create Room'}
                     </button>
                     {isEditing && (
                       <button type="button" onClick={handleCancelEdit} className="w-full py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors">
                         Cancel Edit
                       </button>
                     )}
                  </div>
               </form>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomManagementModal;
