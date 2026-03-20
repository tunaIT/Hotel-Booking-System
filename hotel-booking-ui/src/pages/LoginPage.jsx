import LoginForm from '../features/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-2">Hotel Booking</h1>
          <p className="text-gray-500">Sign in to manage your bookings</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
