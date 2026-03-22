import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { LogOut, User, Calendar } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                HotelApp
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/hotels"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Hotels
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/my-bookings" className="flex items-center space-x-2 text-gray-600 group hover:text-blue-600 transition-colors cursor-pointer mr-4">
                  <Calendar size={20} />
                  <span className="text-sm font-medium">My Bookings</span>
                </Link>
                <div className="flex items-center space-x-2 text-gray-600 group hover:text-blue-600 transition-colors cursor-pointer">
                  <User size={20} />
                  <span className="text-sm font-medium">Profile</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors ml-4 px-3 py-2 rounded-md hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut size={20} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
