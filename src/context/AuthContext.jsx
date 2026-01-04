import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService } from '../services/auth.service';
import PaymentService from '../services/payment.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage on mount
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');
    if (token) {
        // Optional: validate token expiry here if needed
       setIsAuthenticated(true);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = async (data) => {
    try {
      const response = await loginService(data);
       if (response.success) {
            setIsAuthenticated(true);
         setUser(response.data.user);
         localStorage.setItem('accessToken', response.data.accessToken);
         localStorage.setItem('user', JSON.stringify(response.data.user)); // Persist user
        }
      return response;
    } catch (error) {
       throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Refresh user data (e.g., after payment to update paid status)
  const refreshUser = async () => {
    try {
      const response = await PaymentService.getSubscriptionStatus();
      if (response.data.data) {
        const updatedUser = { ...user, paid: response.data.data.isPremium };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to refresh user data', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, login, logout, loading, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

