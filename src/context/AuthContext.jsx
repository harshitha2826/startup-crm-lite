import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('crm-token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Validate session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('crm-token');
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      try {
        const responseData = await authService.getProfile();
        // Backend returns { success: true, message: "...", data: userObject }
        setUser(responseData.data);
        setToken(storedToken);
      } catch (error) {
        console.error('Session restoration failed:', error);
        // Clear invalid token
        authService.logout();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Login handler
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const responseData = await authService.login(email, password);
      // Backend returns { success: true, message: "...", data: { token, user } }
      const { token: receivedToken, user: userData } = responseData.data;

      localStorage.setItem('crm-token', receivedToken);
      setToken(receivedToken);
      setUser(userData);
      
      toast.success(responseData.message || 'Login successful!');
      navigate('/');
      return responseData.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Invalid email or password.';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Registration handler
  const register = useCallback(async (name, email, password) => {
    setIsLoading(true);
    try {
      const responseData = await authService.register(name, email, password);
      // Backend returns { success: true, message: "...", data: { token, user } }
      const { token: receivedToken, user: userData } = responseData.data;

      localStorage.setItem('crm-token', receivedToken);
      setToken(receivedToken);
      setUser(userData);

      toast.success(responseData.message || 'Registration successful!');
      navigate('/');
      return responseData.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Registration failed.';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Logout handler
  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully.');
    navigate('/login');
  }, [navigate]);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
