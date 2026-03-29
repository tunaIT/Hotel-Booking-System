import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getToken, removeToken, setToken } from '../utils/token';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = getToken();
      if (token) {
        try {
          const decoded = jwtDecode(token);
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            setUser({ id: decoded.id, username: decoded.sub, roles: decoded.roles || [] });
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token) => {
    setToken(token);
    try {
      const decoded = jwtDecode(token);
      setUser({ id: decoded.id, username: decoded.sub, roles: decoded.roles || [] });
    } catch (e) {
      console.error('Invalid token');
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
        {!loading && children}
    </AuthContext.Provider>
  );
};
