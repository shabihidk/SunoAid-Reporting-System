import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: string;
  is_verified: boolean;
  created_at: string;
  location?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/auth/me');
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await axios.post('/auth/login', { email, password });
    setUser(response.data.user);
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    console.log('🔍 Frontend: Starting registration...', { name, email, phone });
    try {
      const response = await axios.post('/auth/register', { name, email, password, phone });
      console.log('🔍 Frontend: Registration response:', response);
      setUser(response.data.user);
    } catch (error) {
      console.error('🔍 Frontend: Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await axios.post('/auth/logout');
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    const response = await axios.put('/auth/profile', data);
    setUser(response.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
