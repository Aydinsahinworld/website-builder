import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SiteData, ComponentData, ComponentCategory, emptySiteData, createComponent } from '../types';
import { useAuth } from './AuthContext';
import { userService } from '../services/userService';

// Context için tip tanımı
interface SiteContextType {
  site: SiteData;
  selectedComponentId: string | null;
  // Site yönetimi
  resetSite: () => void;
  setSiteName: (name: string) => void;
  saveSite: () => Promise<void>;
  loadSite: (siteData: SiteData) => void;
  // Komponent yönetimi
  addComponent: (type: string, category: ComponentCategory, props?: any) => string;
  updateComponent: (id: string, newProps: any) => void;
  removeComponent: (id: string) => void;
  moveComponent: (id: string, newPosition: number) => void;
  // Seçim yönetimi
  selectComponent: (id: string | null) => void;
  getSelectedComponent: () => ComponentData | null;
}

// Context oluşturma
const SiteContext = createContext<SiteContextType | undefined>(undefined);

// Context Provider bileşeni
export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth Context'ten kullanıcı bilgilerini alalım
  const { user } = useAuth();
  
  // Site verisi state'i
  const [site, setSite] = useState<SiteData>(emptySiteData);
  
  // Seçili komponent ID'si
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // Kullanıcı oturum açtığında siteleri yükleyelim
  useEffect(() => {
    const loadUserSites = async () => {
      if (user) {
        try {
          // Kullanıcının sitelerini getir
          const userSites = await userService.getUserSites(user.id);
          
          // Eğer kullanıcının siteleri varsa ilk siteyi yükle
          if (userSites.length > 0) {
            setSite(userSites[0]);
            console.log('Kullanıcı sitesi yüklendi:', userSites[0]);
          } else {
            // Kullanıcının sitesi yoksa yeni boş bir site oluştur
            const newSite = {
              ...emptySiteData,
              name: user.companyName ? `${user.companyName} Web Sitesi` : 'Yeni Web Sitesi'
            };
            setSite(newSite);
          }
        } catch (error) {
          console.error('Kullanıcının siteleri yüklenemedi:', error);
          alert('Siteleriniz yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
      }
    };
    
    loadUserSites();
  }, [user]);

  // Siteyi sıfırlama
  const resetSite = useCallback(() => {
    // Kullanıcı bilgisine göre boş site oluştur
    const newSite = user 
      ? { ...emptySiteData, name: `${user.companyName || 'Yeni'} Web Sitesi` }
      : emptySiteData;
      
    setSite(newSite);
    setSelectedComponentId(null);
  }, [user]);

  // Site ismini güncelleme
  const setSiteName = useCallback((name: string) => {
    setSite(prev => ({
      ...prev,
      name,
      updatedAt: new Date().toISOString()
    }));
  }, []);

  // Siteyi kaydetme - kullanıcı hesabına kaydediyoruz
  const saveSite = useCallback(async () => {
    // Kullanıcı giriş yapmışsa siteyi kaydet
    if (user) {
      try {
        // Konsol çıktısı ekleyelim
        console.log('SiteContext: Kaydedilecek site verisi:', site);
        
        // userService ile siteyi kaydet
        const savedSite = await userService.saveSite(user.id, site);
        console.log('SiteContext: Site kullanıcı hesabına kaydedildi:', savedSite);
        
        // Başarılı kayıt durumunda güncelleme zamanını güncelle
        setSite(prev => {
          const updatedSite = {
            ...prev,
            id: savedSite.id // ID'yi güncelle (ilk kayıtta ID değişebilir)
          };
          console.log('SiteContext: Site state güncellendi:', updatedSite);
          return updatedSite;
        });
        
        // Interface'deki tanıma göre void dönüş tipi kullanıyoruz
        return;
      } catch (error) {
        console.error('SiteContext: Site kaydedilemedi:', error);
        // Hata oluştuğunda sadece konsola yazdıralım, alert göstermeyelim
        throw error; // Hatayı üst seviyeye ileterek ele alınabilmesini sağlayalım
      }
    } else {
      console.warn('SiteContext: Site kaydetmek için giriş yapmalısınız.');
      throw new Error('Kullanıcı giriş yapmamış');
    }
  }, [site, user]);

  // Siteyi yükleme
  const loadSite = useCallback((siteData: SiteData) => {
    setSite(siteData);
    setSelectedComponentId(null);
  }, []);

  // Komponent ekle ve otomatik kaydet
  const addComponent = useCallback((type: string, category: ComponentCategory, props: any = {}) => {
    console.log('addComponent çağrıldı, yeni komponent ekleniyor...');
    
    // Yeni komponentin pozisyonunu belirle
    const categoryComponents = site.components.filter(comp => comp.category === category);
    const position = categoryComponents.length > 0 
      ? Math.max(...categoryComponents.map(comp => comp.position)) + 1 
      : 0;
    
    // Yeni komponenti oluştur
    const newComponent = createComponent(type, category, position, props);
    console.log('Oluşturulan yeni komponent:', newComponent);
    
    // Yeni Site objesi oluştur
    const newSite: SiteData = {
      ...site,
      components: [...site.components, newComponent],
      updatedAt: new Date().toISOString()
    };
    
    // State'i güncelle
    setSite(newSite);
    console.log('Site state güncellendi:', newSite);
    
    // Yeni komponenti seç
    setSelectedComponentId(newComponent.id);
    
    // Kullanıcı giriş yapmışsa manuel olarak siteyi kaydet
    if (user) {
      // Direk olarak saveSite'ı çağır
      saveSite()
        .then(() => console.log('Komponent ekleme sonrası site başarıyla kaydedildi'))
        .catch(err => console.error('Komponent ekleme sonrası site kaydederken hata:', err));
    }
    
    return newComponent.id;
  }, [site, user, saveSite]);

  // Komponent güncelleme ve otomatik kaydetme
  const updateComponent = useCallback((id: string, newProps: any) => {
    console.log('updateComponent çağrıldı, komponent güncelleniyor:', id);
    
    // Önce yeni site objesini oluşturalım
    const updatedSite = {
      ...site,
      components: site.components.map(comp => 
        comp.id === id 
          ? { ...comp, props: { ...comp.props, ...newProps } } 
          : comp
      ),
      updatedAt: new Date().toISOString()
    };
    
    // State'i güncelleyelim
    setSite(updatedSite);
    console.log('Site state güncellendi:', updatedSite);
    
    // Kullanıcı giriş yapmışsa manuel olarak siteyi kaydet
    if (user) {
      // Direk olarak saveSite'ı çağır
      saveSite()
        .then(() => console.log('Komponent güncelleme sonrası site başarıyla kaydedildi'))
        .catch(err => console.error('Komponent güncelleme sonrası site kaydederken hata:', err));
    }
  }, [site, user, saveSite]);

  // Komponent silme ve otomatik kaydetme
  const removeComponent = useCallback((id: string) => {
    console.log('removeComponent çağrıldı, komponent siliniyor:', id);
    
    // Önce yeni site objesini oluşturalım
    const updatedSite = {
      ...site,
      components: site.components.filter(comp => comp.id !== id),
      updatedAt: new Date().toISOString()
    };
    
    // State'i güncelleyelim
    setSite(updatedSite);
    console.log('Site state güncellendi:', updatedSite);
    
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
    
    // Kullanıcı giriş yapmışsa manuel olarak siteyi kaydet
    if (user) {
      // Direk olarak saveSite'ı çağır
      saveSite()
        .then(() => console.log('Komponent silme sonrası site başarıyla kaydedildi'))
        .catch(err => console.error('Komponent silme sonrası site kaydederken hata:', err));
    }
  }, [site, selectedComponentId, user, saveSite]);

  // Komponent pozisyonunu değiştirme ve otomatik kaydetme
  const moveComponent = useCallback((id: string, newPosition: number) => {
    console.log('moveComponent çağrıldı, komponent taşınıyor:', id, 'yeni pozisyon:', newPosition);
    
    const componentIndex = site.components.findIndex(comp => comp.id === id);
    if (componentIndex === -1) return;
    
    const component = site.components[componentIndex];
    const category = component.category;
    
    // Aynı kategorideki bileşenleri filtrele
    const categoryComponents = site.components.filter(comp => comp.category === category);
    
    // Yeni pozisyon sınırlarını kontrol et
    const adjustedPosition = Math.max(0, Math.min(newPosition, categoryComponents.length - 1));
    
    // Mevcut bileşeni listeden çıkart
    const withoutCurrent = categoryComponents.filter(comp => comp.id !== id);
    
    // Yeni pozisyonda bileşeni ekle
    const reordered = [
      ...withoutCurrent.slice(0, adjustedPosition),
      { ...component, position: adjustedPosition },
      ...withoutCurrent.slice(adjustedPosition)
    ];
    
    // Pozisyonları güncelle
    const updatedCategoryComponents = reordered.map((comp, index) => ({
      ...comp,
      position: index
    }));
    
    // Diğer kategorilerin bileşenleri
    const otherComponents = site.components.filter(comp => comp.category !== category);
    
    // Yeni site objesini oluşturalım
    const updatedSite = {
      ...site,
      components: [...otherComponents, ...updatedCategoryComponents],
      updatedAt: new Date().toISOString()
    };
    
    // State'i güncelleyelim
    setSite(updatedSite);
    console.log('Site state güncellendi:', updatedSite);
    
    // Kullanıcı giriş yapmışsa manuel olarak siteyi kaydet
    if (user) {
      // Direk olarak saveSite'ı çağır
      saveSite()
        .then(() => console.log('Komponent taşıma sonrası site başarıyla kaydedildi'))
        .catch(err => console.error('Komponent taşıma sonrası site kaydederken hata:', err));
    }
  }, [site, user, saveSite]);

  // Komponent seçme
  const selectComponent = useCallback((id: string | null) => {
    setSelectedComponentId(id);
  }, []);

  // Seçili komponenti getirme
  const getSelectedComponent = useCallback(() => {
    if (!selectedComponentId) return null;
    return site.components.find(comp => comp.id === selectedComponentId) || null;
  }, [site, selectedComponentId]);

  // Context değerleri
  const contextValue: SiteContextType = {
    site,
    selectedComponentId,
    resetSite,
    setSiteName,
    saveSite,
    loadSite,
    addComponent,
    updateComponent,
    removeComponent,
    moveComponent,
    selectComponent,
    getSelectedComponent
  };

  return (
    <SiteContext.Provider value={contextValue}>
      {children}
    </SiteContext.Provider>
  );
};

// Context hook'u
export const useSite = (): SiteContextType => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};

export default SiteContext; 