import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import HotelList from '../pages/HotelList';
import HotelDetail from '../pages/HotelDetail';
import CheckoutPage from '../pages/CheckoutPage';
import BookingSuccessPage from '../pages/BookingSuccessPage';
import MyBookingsPage from '../pages/MyBookingsPage';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) {
     return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;
  }
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />
      
      {/* Protected Routes using MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels" element={<HotelList />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/checkout/:roomId" element={<CheckoutPage />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Add more protected routes here like /bookings */}
        </Route>
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
