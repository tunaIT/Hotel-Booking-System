import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { LogOut, User, Calendar, Menu, X, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if we are on the homepage
  const isHome = location.pathname === '/';
  
  // Check if user is admin
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') || user?.roles?.includes('ADMIN');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine navbar background based on page and scroll
  const navClasses = `fixed w-full z-50 transition-all duration-300 border-b ${
    isScrolled 
      ? 'bg-white/80 backdrop-blur-md border-gray-200 shadow-sm py-2' 
      : isHome 
        ? 'bg-transparent border-transparent py-4' 
        : 'bg-white border-gray-100 py-3'
  }`;

  const textColor = (!isScrolled && isHome) ? 'text-white' : 'text-gray-900';
  const logoColor = (!isScrolled && isHome) ? 'text-white' : 'text-blue-600';
  const linkColor = (!isScrolled && isHome) ? 'text-white hover:text-white/80' : 'text-gray-600 hover:text-blue-600';

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className={`text-2xl font-black tracking-tighter ${logoColor} transition-colors`}>
              LuxeStay<span className="text-gold-400">.</span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-medium text-sm transition-colors ${linkColor}`}>Home</Link>
            <Link to="/hotels" className={`font-medium text-sm transition-colors ${linkColor}`}>Explore Hotels</Link>
          </div>

          {/* Desktop Right side (Auth/User) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                
                {isAdmin && (
                  <Link to="/admin" className={`flex items-center space-x-1.5 font-bold text-sm transition-colors px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200`}>
                    <ShieldAlert size={16} />
                    <span>Admin Panel</span>
                  </Link>
                )}

                <Link to="/my-bookings" className={`flex items-center space-x-1.5 font-medium text-sm transition-colors ${linkColor}`}>
                  <Calendar size={18} />
                  <span>My Bookings</span>
                </Link>
                <div className={`flex items-center space-x-2 font-medium text-sm ${textColor}`}>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span>{user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 text-sm font-medium text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors border border-red-100"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className={`font-medium text-sm transition-colors px-4 py-2 ${(!isScrolled && isHome) ? 'text-white hover:underline' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg shadow-blue-600/20 px-5 py-2 rounded-xl text-sm font-semibold transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={textColor}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu (simplified) */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 py-4 px-4 flex flex-col space-y-4 rounded-b-2xl">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-medium">Home</Link>
            <Link to="/hotels" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-medium">Explore Hotels</Link>
            <hr className="border-gray-100" />
            {isAuthenticated ? (
              <>
                 {isAdmin && (
                   <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-purple-700 font-bold flex items-center"><ShieldAlert size={18} className="mr-2"/> Admin Panel</Link>
                 )}
                 <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-medium flex items-center"><Calendar size={18} className="mr-2"/> My Bookings</Link>
                 <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-red-600 font-medium text-left flex items-center"><LogOut size={18} className="mr-2"/> Logout</button>
              </>
            ) : (
               <>
                 <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-gray-800 font-medium">Log in</Link>
                 <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-blue-600 font-medium">Sign Up</Link>
               </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
