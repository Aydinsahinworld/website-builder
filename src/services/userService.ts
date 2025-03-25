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
  try {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    if (!usersJson) {
      console.log('Henüz kayıtlı kullanıcı yok, boş dizi dönüyorum.');
      return [];
    }
    const users = JSON.parse(usersJson);
    console.log(`${users.length} kullanıcı yüklendi.`);
    return users;
  } catch (error) {
    console.error('Kullanıcılar yüklenirken hata oluştu:', error);
    return [];
  }
};

// LocalStorage'a kullanıcıları kaydet
const saveUsers = (users: User[]): void => {
  try {
    if (!Array.isArray(users)) {
      console.error('saveUsers için geçersiz veri tipi:', users);
      return;
    }
    const usersJson = JSON.stringify(users);
    localStorage.setItem(USERS_STORAGE_KEY, usersJson);
    console.log(`${users.length} kullanıcı kaydedildi.`);
  } catch (error) {
    console.error('Kullanıcılar kaydedilirken hata oluştu:', error);
  }
};

// LocalStorage'dan siteleri getir
const getSites = (): { [key: string]: SiteData } => {
  try {
    const sitesJson = localStorage.getItem(SITES_STORAGE_KEY);
    if (!sitesJson) {
      console.log('Henüz kayıtlı site yok, boş obje dönüyorum.');
      return {};
    }
    const sites = JSON.parse(sitesJson);
    console.log(`${Object.keys(sites).length} site yüklendi.`);
    return sites;
  } catch (error) {
    console.error('Siteler yüklenirken hata oluştu:', error);
    return {};
  }
};

// LocalStorage'a siteleri kaydet
const saveSites = (sites: { [key: string]: SiteData }): void => {
  try {
    if (typeof sites !== 'object' || sites === null) {
      console.error('saveSites için geçersiz veri tipi:', sites);
      return;
    }
    const sitesJson = JSON.stringify(sites);
    localStorage.setItem(SITES_STORAGE_KEY, sitesJson);
    console.log(`${Object.keys(sites).length} site kaydedildi.`);
    
    // Hızlı bir doğrulama yapalım
    const verificationJson = localStorage.getItem(SITES_STORAGE_KEY);
    if (verificationJson) {
      const verification = JSON.parse(verificationJson);
      const siteCount = Object.keys(verification).length;
      const originalCount = Object.keys(sites).length;
      if (siteCount !== originalCount) {
        console.error(`Site kayıt doğrulama hatası: Kaydedilecek ${originalCount} site varken sadece ${siteCount} site kaydedildi.`);
      }
    }
  } catch (error) {
    console.error('Siteler kaydedilirken hata oluştu:', error);
  }
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
    if (!userJson) {
      return null;
    }
    
    const currentUser = JSON.parse(userJson);
    
    // Kullanıcının güncel veri tabanı kaydını kontrol edelim
    const users = getUsers();
    const dbUser = users.find(u => u.id === currentUser.id);
    
    if (dbUser) {
      // Eğer veritabanında kayıt bulunursa, site listesini güncelleyelim
      // Böylece kullanıcının site listesi her zaman güncel olur
      const updatedUser = {
        ...currentUser,
        sites: dbUser.sites
      };
      
      // Güncel kullanıcıyı kaydet
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      
      console.log('getCurrentUser: Kullanıcı güncel site listesi ile döndürüldü:', updatedUser);
      return updatedUser;
    }
    
    console.log('getCurrentUser: Normal kullanıcı döndürüldü:', currentUser);
    return currentUser;
  },
  
  // Kullanıcının sitelerini getir
  getUserSites: async (userId: string): Promise<SiteData[]> => {
    console.log('getUserSites çağrıldı. userId:', userId);
    
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      console.error('Kullanıcı bulunamadı, userId:', userId);
      console.log('Mevcut kullanıcılar:', users);
      throw new Error('Kullanıcı bulunamadı');
    }
    
    console.log('Bulunan kullanıcı:', user);
    console.log('Kullanıcının site ID listesi:', user.sites);
    
    const allSites = getSites();
    console.log('Tüm siteler:', allSites);
    
    const userSites = user.sites
      .map(siteId => {
        const site = allSites[siteId];
        if (!site) {
          console.warn(`Site ID: ${siteId} için site verisi bulunamadı!`);
        }
        return site;
      })
      .filter(Boolean);
    
    console.log('Yüklenen kullanıcı siteleri:', userSites);
    return userSites;
  },
  
  // Kullanıcı için site oluştur/güncelle
  saveSite: async (userId: string, site: SiteData): Promise<SiteData> => {
    try {
      console.log('===== KAYDETME İŞLEMİ BAŞLADI =====');
      console.log('Kaydedilecek site:', JSON.stringify(site, null, 2));
      
      // 1. Kullanıcıyı bul
      const users = getUsers();
      const userIndex = users.findIndex(u => u.id === userId);
      
      if (userIndex === -1) {
        throw new Error(`Kullanıcı bulunamadı! UserId: ${userId}`);
      }
      
      // 2. Site ID'si yoksa oluştur
      let isNewSite = false;
      if (!site.id) {
        isNewSite = true;
        site.id = `site_${Date.now()}`;
        site.createdAt = new Date().toISOString();
        console.log('Yeni site ID oluşturuldu:', site.id);
      }
      
      // 3. Zaman damgasını güncelle
      site.updatedAt = new Date().toISOString();
      
      // 4. Tüm siteleri al
      const allSites = getSites();
      
      // 5. Siteyi kaydet (deep copy yaparak)
      allSites[site.id] = JSON.parse(JSON.stringify(site));
      
      // 6. Kullanıcının site listesini kontrol et
      if (isNewSite || !users[userIndex].sites.includes(site.id)) {
        users[userIndex].sites.push(site.id);
        console.log('Kullanıcının site listesi güncellendi:', users[userIndex].sites);
      }
      
      // 7. KAYDETME İŞLEMİ - Önce kullanıcıları, sonra siteleri kaydet
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      localStorage.setItem(SITES_STORAGE_KEY, JSON.stringify(allSites));
      
      // 8. Mevcut kullanıcıyı güncelle
      const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
      if (currentUser && currentUser.id === userId) {
        const updatedUser = {
          ...currentUser,
          sites: users[userIndex].sites
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
        console.log('Mevcut kullanıcı güncellendi:', updatedUser);
      }
      
      // 9. Kayıt doğrulama
      const verifyUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      const verifySites = JSON.parse(localStorage.getItem(SITES_STORAGE_KEY) || '{}');
      
      const verifyUser = verifyUsers.find((u: any) => u.id === userId);
      const verifySite = verifySites[site.id];
      
      console.log('Doğrulama - Kullanıcının site listesi:', verifyUser?.sites);
      console.log('Doğrulama - Site kaydedildi mi:', !!verifySite, verifySite ? verifySite.id : 'Yok');
      
      if (!verifyUser?.sites.includes(site.id)) {
        console.error('KRİTİK HATA: Kullanıcının site listesine site ID eklenmedi!');
      }
      
      if (!verifySite) {
        console.error('KRİTİK HATA: Site kaydedilemedi!');
      }
      
      console.log('===== KAYDETME İŞLEMİ TAMAMLANDI =====');
      
      return site;
    } catch (error) {
      console.error('KAYDETME HATASI:', error);
      throw error;
    }
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