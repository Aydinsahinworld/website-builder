import { SiteData } from './index';

// Kullanıcı bilgileri tipi
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  passwordHash: string;
  createdAt: string;
  sites: string[]; // Site ID'leri
}

// Giriş bilgileri
export interface LoginCredentials {
  email: string;
  password: string;
}

// Kayıt bilgileri
export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
  companyName: string;
}

// Kullanıcı servisi için tip
export interface UserService {
  register: (data: RegisterData) => Promise<User>;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
  getCurrentUser: () => User | null;
  getUserSites: (userId: string) => Promise<SiteData[]>;
} 