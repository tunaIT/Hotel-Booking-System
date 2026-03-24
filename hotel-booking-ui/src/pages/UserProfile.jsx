import { useState, useEffect, useContext } from 'react';
import { userService } from '../services/userService';
import { AuthContext } from '../contexts/AuthContext';
import { User, Mail, Save, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (user?.username) {
      fetchMyData(user.username);
    }
  }, [user]);

  const fetchMyData = async (email) => {
    try {
      setLoading(true);
      const allUsers = await userService.getAllUsers();
      const me = allUsers.find(u => u.email === email);
      if (me) {
        setCurrentUserData(me);
        setFormData({ name: me.name || '', email: me.email || '', password: '' });
      } else {
        toast.error('Could not load user profile');
      }
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserData) return;
    
    try {
      // We pass the role back because the backend might expect it
      const payload = {
        name: formData.name,
        email: formData.email,
        role: currentUserData.role
      };
      
      if (formData.password) {
        payload.password = formData.password;
      }

      await userService.updateUser(currentUserData.id, payload);
      toast.success('Profile updated successfully!');
      
      // Clear password field after save
      setFormData(prev => ({ ...prev, password: '' }));
      fetchMyData(formData.email); // Refetch to sync

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
     return <div className="min-h-screen pt-24 text-center text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
           
           <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
             <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-full p-1 shadow-md">
                 <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-3xl font-bold">
                    {currentUserData?.name?.charAt(0) || 'U'}
                 </div>
             </div>
           </div>

           <div className="pt-16 px-8 pb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
              <p className="text-gray-500 text-sm mb-8">Manage your personal information and security.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User size={16}/> Full Name
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail size={16}/> Email Address
                  </label>
                  <input 
                    required 
                    type="email" 
                    value={formData.email} 
                    disabled // Usually changing email might require re-login, but for this demo let's allow or disable it
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 text-gray-500 rounded-xl cursor-not-allowed" 
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed directly.</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Lock size={16}/> Change Password
                  </label>
                  <input 
                    type="password" 
                    placeholder="Leave blank to keep current password"
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all" 
                  />
                </div>

                <div className="pt-6 flex justify-end">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                    <Save size={18} /> Save Changes
                  </button>
                </div>

              </form>
           </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
