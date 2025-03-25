import { User, LoginCredentials, RegisterData } from '../types/user';
import { SiteData } from '../types';

// Basit bir şifre hash fonksiyonu (güvenli değil, sadece demo amaçlı)
// Gerçek uygulamada bcrypt gibi güvenli bir yöntem kullanılmalı
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

// Local storage anahtarları
const USERS_STORAGE_KEY = 'website_builder_users';
const CURRENT_USER_KEY = 'website_builder_current_user';
const SITES_STORAGE_KEY = 'website_builder_sites';

// LocalStorage'dan kullanıcıları getir
const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

// LocalStorage'a kullanıcıları kaydet
const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// LocalStorage'dan siteleri getir
const getSites = (): { [key: string]: SiteData } => {
  const sitesJson = localStorage.getItem(SITES_STORAGE_KEY);
  return sitesJson ? JSON.parse(sitesJson) : {};
};

// LocalStorage'a siteleri kaydet
const saveSites = (sites: { [key: string]: SiteData }): void => {
  localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(sites));
};

// Kullanıcı servisi
export const userService = {
  // Kullanıcı kaydı
  register: async (data: RegisterData): Promise<User> => {
    // Giriş verilerini doğrula
    if (data.password !== data.passwordConfirm) {
      throw new Error('Şifreler eşleşmiyor');
    }
    
    if (!data.email || !data.password || !data.companyName || !data.firstName || !data.lastName) {
      throw new Error('Tüm alanları doldurun');
    }
    
    // Email formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Geçerli bir email adresi girin');
    }
    
    // Kullanıcıları getir
    const users = getUsers();
    
    // Email zaten kullanılıyor mu kontrol et
    if (users.some(user => user.email === data.email)) {
      throw new Error('Bu email adresi zaten kullanılıyor');
    }
    
    // Yeni kullanıcı oluştur
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      passwordHash: hashPassword(data.password),
      createdAt: new Date().toISOString(),
      sites: []
    };
    
    // Kullanıcıyı kaydet
    users.push(newUser);
    saveUsers(users);
    
    // Mevcut kullanıcı olarak ayarla
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    
    return newUser;
  },
  
  // Kullanıcı girişi
  login: async (credentials: LoginCredentials): Promise<User> => {
    const { email, password } = credentials;
    
    if (!email || !password) {
      throw new Error('Email ve şifre gerekli');
    }
    
    // Kullanıcıları getir
    const users = getUsers();
    
    // Email ve şifreyi kontrol et
    const user = users.find(
      user => user.email === email && user.passwordHash === hashPassword(password)
    );
    
    if (!user) {
      throw new Error('Email veya şifre hatalı');
    }
    
    // Mevcut kullanıcı olarak ayarla
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    
    return user;
  },
  
  // Çıkış yap
  logout: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },
  
  // Mevcut kullanıcıyı getir
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },
  
  // Kullanıcının sitelerini getir
  getUserSites: async (userId: string): Promise<SiteData[]> => {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }
    
    const allSites = getSites();
    return user.sites.map(siteId => allSites[siteId]).filter(Boolean);
  },
  
  // Kullanıcı için site oluştur/güncelle
  saveSite: async (userId: string, site: SiteData): Promise<SiteData> => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Kullanıcı bulunamadı');
    }
    
    const sites = getSites();
    
    // Site ID'si yoksa yeni site oluştur
    if (!site.id) {
      site.id = `site_${Date.now()}`;
      site.createdAt = new Date().toISOString();
      users[userIndex].sites.push(site.id);
      saveUsers(users);
    }
    
    site.updatedAt = new Date().toISOString();
    sites[site.id] = site;
    saveSites(sites);
    
    return site;
  },
  
  // Kullanıcı için siteyi sil
  deleteSite: async (userId: string, siteId: string): Promise<void> => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Kullanıcı bulunamadı');
    }
    
    // Kullanıcının site listesinden siteyi kaldır
    users[userIndex].sites = users[userIndex].sites.filter(id => id !== siteId);
    saveUsers(users);
    
    // Siteler listesinden de kaldır
    const sites = getSites();
    delete sites[siteId];
    saveSites(sites);
  },
}; 