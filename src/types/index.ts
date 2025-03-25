// Genel bileşen türleri
export type ComponentCategory = 
  | 'header'     // Üst menüler
  | 'slider'     // Sliderlar
  | 'content'    // İçerik bölümleri
  | 'contact'    // İletişim bölümleri
  | 'footer';    // Alt menüler

// Üst menü için bileşen türleri
export type HeaderComponentType = 
  | 'standard-menu-1'
  | 'standard-menu-2'
  | 'sticky-menu-1'
  | 'mega-menu-1';

// Bileşen veri yapısı
export interface ComponentData {
  id: string;
  type: string;
  category: ComponentCategory;
  position: number;
  props: {
    [key: string]: any;
  };
}

// Site verisi
export interface SiteData {
  id: string;
  name: string;
  components: ComponentData[];
  createdAt: string;
  updatedAt: string;
}

// Boş/yeni bir site şablonu
export const emptySiteData: SiteData = {
  id: `site-${Date.now()}`,
  name: 'Yeni Site',
  components: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Bileşen eklemek için yardımcı fonksiyon
export const createComponent = (
  type: string, 
  category: ComponentCategory, 
  position: number, 
  props: any = {}
): ComponentData => {
  return {
    id: `component-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    category,
    position,
    props
  };
}; 