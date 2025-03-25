import React, { createContext, useContext, useState, useCallback } from 'react';
import { SiteData, ComponentData, ComponentCategory, emptySiteData, createComponent } from '../types';

// Context için tip tanımı
interface SiteContextType {
  site: SiteData;
  selectedComponentId: string | null;
  // Site yönetimi
  resetSite: () => void;
  setSiteName: (name: string) => void;
  saveSite: () => void;
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
  // Site verisi state'i
  const [site, setSite] = useState<SiteData>(emptySiteData);
  
  // Seçili komponent ID'si
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // Siteyi sıfırlama
  const resetSite = useCallback(() => {
    setSite(emptySiteData);
    setSelectedComponentId(null);
  }, []);

  // Site ismini güncelleme
  const setSiteName = useCallback((name: string) => {
    setSite(prev => ({
      ...prev,
      name,
      updatedAt: new Date().toISOString()
    }));
  }, []);

  // Siteyi kaydetme - şu an için sadece console'a yazdırıyoruz
  // Gerçek uygulamada burada localStorage, API çağrısı vs. olabilir
  const saveSite = useCallback(() => {
    console.log('Site kaydediliyor:', site);
    
    // Gerçek uygulamada:
    // localStorage.setItem('savedSite', JSON.stringify(site));
    // veya
    // apiClient.saveSite(site);
    
    // Başarılı kayıt durumunda:
    setSite(prev => ({
      ...prev,
      updatedAt: new Date().toISOString()
    }));
  }, [site]);

  // Siteyi yükleme
  const loadSite = useCallback((siteData: SiteData) => {
    setSite(siteData);
    setSelectedComponentId(null);
  }, []);

  // Komponent ekleme
  const addComponent = useCallback((type: string, category: ComponentCategory, props: any = {}) => {
    // Yeni komponentin pozisyonunu belirle
    const categoryComponents = site.components.filter(comp => comp.category === category);
    const position = categoryComponents.length > 0 
      ? Math.max(...categoryComponents.map(comp => comp.position)) + 1 
      : 0;
    
    // Yeni komponenti oluştur
    const newComponent = createComponent(type, category, position, props);
    
    // Site verisini güncelle
    setSite(prev => ({
      ...prev,
      components: [...prev.components, newComponent],
      updatedAt: new Date().toISOString()
    }));
    
    // Yeni komponenti seç
    setSelectedComponentId(newComponent.id);
    
    return newComponent.id;
  }, [site]);

  // Komponent güncelleme
  const updateComponent = useCallback((id: string, newProps: any) => {
    setSite(prev => ({
      ...prev,
      components: prev.components.map(comp => 
        comp.id === id 
          ? { ...comp, props: { ...comp.props, ...newProps } } 
          : comp
      ),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  // Komponent silme
  const removeComponent = useCallback((id: string) => {
    setSite(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== id),
      updatedAt: new Date().toISOString()
    }));
    
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  }, [selectedComponentId]);

  // Komponent pozisyonunu değiştirme
  const moveComponent = useCallback((id: string, newPosition: number) => {
    setSite(prev => {
      const componentIndex = prev.components.findIndex(comp => comp.id === id);
      if (componentIndex === -1) return prev;
      
      const component = prev.components[componentIndex];
      const category = component.category;
      
      // Aynı kategorideki bileşenleri filtrele
      const categoryComponents = prev.components.filter(comp => comp.category === category);
      
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
      const otherComponents = prev.components.filter(comp => comp.category !== category);
      
      return {
        ...prev,
        components: [...otherComponents, ...updatedCategoryComponents],
        updatedAt: new Date().toISOString()
      };
    });
  }, []);

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