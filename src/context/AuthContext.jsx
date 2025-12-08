import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService } from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage on mount
    const token = localStorage.getItem('accessToken');
    if (token) {
        // Optional: validate token expiry here if needed
       setIsAuthenticated(true);
       // In a real app, you might want to fetch the user profile here using the token
    }
    setLoading(false);
  }, []);

  const login = async (data) => {
    try {
      const response = await loginService(data);
       if (response.success) {
            setIsAuthenticated(true);
            // You might want to set user data if returned from login
            // setUser(response.data.user);
        }
      return response;
    } catch (error) {
       throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
