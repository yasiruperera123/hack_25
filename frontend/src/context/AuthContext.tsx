import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ICart, ICartItem } from '../types/cart'; // Assuming you have cart types defined
import { cartService } from '../services/cartService';
import { authService } from '../services/authService'; // Import authService
// Removed: import { useAuth } from './AuthContext'; // Self-referential import
// Assuming you have a user type defined somewhere, e.g., in types/user.ts
// import { IUser } from '../types/user';

// Placeholder User type for now (should match backend user structure and frontend user type)
interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  // Add other user properties as needed
}

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>; // Replace any with specific registration data type
  checkAuth: () => Promise<void>; // Add checkAuth function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Implement actual login function using authService
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.token); // Store token
      // Optional: localStorage.setItem('refreshToken', response.refreshToken); // Store refresh token if used

      setUser(response.user);
      setIsAuthenticated(true);

    } catch (err: any) {
      setError(err.message || 'Login failed');
      console.error('Login error:', err);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token'); // Clear token on failed login
      // localStorage.removeItem('refreshToken');
      // Consider redirecting to login page here if needed
    } finally {
      setLoading(false);
    }
  };

  // Placeholder logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token'); // Clear token on logout
    // localStorage.removeItem('refreshToken');
    // TODO: Implement actual backend logout if necessary
    console.log('Logged out');
  };

  // Placeholder register function
  const register = async (userData: any) => {
     setLoading(true);
     setError(null);
     try {
       // TODO: Implement actual registration logic using authService
       console.log('Attempting registration with:', userData);
       // On success:
       // const newUser = await authService.register(userData);
       // setUser(newUser); // Maybe auto-login after registration
       // setIsAuthenticated(true);
       // localStorage.setItem('token', newUser.token); // Store token

       // Simulate successful registration for now:
       const dummyUser: IUser = { _id: '456', name: userData.name || 'New User', email: userData.email, role: 'user' };
       setUser(dummyUser);
       setIsAuthenticated(true);
       // localStorage.setItem('token', 'dummy-new-user-token');

     } catch (err: any) {
       setError(err.message || 'Registration failed');
       console.error('Registration error:', err);
       setUser(null);
       setIsAuthenticated(false);
       // localStorage.removeItem('token');
     } finally {
       setLoading(false);
     }
  };

  // Function to check authentication status (e.g., on app load)
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Implement backend call to validate token and get user info
      // This would typically involve a GET /auth/me or similar protected endpoint
      console.log('Checking auth status with existing token...');
      setLoading(true);
      setError(null);
      try {
          // For now, simulate a valid token check and set a dummy user
          // In a real app, you'd call a backend endpoint here:
          // const userData = await authService.checkToken(token);
          // setUser(userData);
          // setIsAuthenticated(true);

           // Simulate a successful check:
           const dummyUser: IUser = { _id: '123', name: 'Logged In User', email: 'user@example.com', role: 'user' };
           setUser(dummyUser);
           setIsAuthenticated(true);

      } catch (err: any) {
          console.error('Token validation failed:', err);
          localStorage.removeItem('token'); // Clear invalid token
          // localStorage.removeItem('refreshToken');
          setUser(null);
          setIsAuthenticated(false);
          setError('Session expired. Please log in again.');
      } finally {
          setLoading(false);
      }

    } else {
      // No token found, user is not authenticated
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  // Effect to check auth status on initial app load
  useEffect(() => {
    checkAuth();
  }, []); // Run only once on mount

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        register,
        checkAuth, // Include checkAuth in context value
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 