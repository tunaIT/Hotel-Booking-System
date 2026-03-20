import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user?.username}!</h1>
        <p className="text-gray-600 mb-8">You have successfully logged in.</p>
        
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
