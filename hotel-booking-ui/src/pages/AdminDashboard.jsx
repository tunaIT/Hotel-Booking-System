import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LayoutDashboard, Users, Hotel, CalendarCheck } from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) return null;

  // Protect route
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ADMIN');
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage hotels, users, and bookings from this central hub.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div onClick={() => window.location.href='/admin/hotels'} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow ring-2 ring-transparent hover:ring-blue-200">
            <div className="bg-blue-100 p-4 rounded-xl">
              <Hotel className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hotels</h3>
              <p className="text-sm text-gray-500">Manage properties</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="bg-green-100 p-4 rounded-xl">
              <CalendarCheck className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Bookings</h3>
              <p className="text-sm text-gray-500">View reservations</p>
            </div>
          </div>

          <div onClick={() => window.location.href='/admin/users'} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow ring-2 ring-transparent hover:ring-purple-200">
            <div className="bg-purple-100 p-4 rounded-xl">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Users</h3>
              <p className="text-sm text-gray-500">Manage customers</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="bg-orange-100 p-4 rounded-xl">
              <LayoutDashboard className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Reports</h3>
              <p className="text-sm text-gray-500">Revenue analytics</p>
            </div>
          </div>

        </div>

        <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center py-20">
             <LayoutDashboard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
             <h2 className="text-xl font-bold text-gray-700">Select a module to manage</h2>
             <p className="text-gray-500 mt-2">API integration for admin endpoints pending.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
