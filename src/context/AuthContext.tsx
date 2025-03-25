import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../types/user';
import { userService } from '../services/userService';

// Auth Context için tip
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Context oluşturma
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Başlangıçta mevcut kullanıcıyı kontrol et
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const currentUser = userService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Kimlik doğrulama hatası:', err);
        setError('Oturum bilgileri yüklenemedi');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Giriş işlemi
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const loggedInUser = await userService.login(credentials);
      setUser(loggedInUser);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Giriş yapılırken bir hata oluştu');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Kayıt işlemi
  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await userService.register(data);
      setUser(newUser);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Kayıt olurken bir hata oluştu');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Çıkış işlemi
  const logout = () => {
    userService.logout();
    setUser(null);
  };

  // Hata temizleme
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth hook must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 