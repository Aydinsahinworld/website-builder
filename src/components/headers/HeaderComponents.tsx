import React from 'react';
import StandardMenu1, { StandardMenu1Props } from './standard-menu/StandardMenu1';
import StandardMenu2, { StandardMenu2Props } from './standard-menu/StandardMenu2';
import StickyMenu1, { StickyMenu1Props } from './sticky-menu/StickyMenu1';
import MegaMenu1, { MegaMenu1Props } from './mega-menu/MegaMenu1';

// Tüm header komponentleri için ortak tip
export type HeaderComponentType = 
  | { type: 'standard-menu-1'; props: StandardMenu1Props }
  | { type: 'standard-menu-2'; props: StandardMenu2Props }
  | { type: 'sticky-menu-1'; props: StickyMenu1Props }
  | { type: 'mega-menu-1'; props: MegaMenu1Props };

// Header komponenti renderlamak için fonksiyon
export const renderHeaderComponent = (component: HeaderComponentType) => {
  switch (component.type) {
    case 'standard-menu-1':
      return <StandardMenu1 {...component.props} />;
    case 'standard-menu-2':
      return <StandardMenu2 {...component.props} />;
    case 'sticky-menu-1':
      return <StickyMenu1 {...component.props} />;
    case 'mega-menu-1':
      return <MegaMenu1 {...component.props} />;
    default:
      return null;
  }
};

// Komponentlerin bilgileri
export const headerComponentsData = {
  categories: [
    {
      id: 'standard-menu',
      name: 'Standart Üst Menü',
      description: 'Basit, kullanımı kolay üst menü komponentleri',
      components: [
        {
          id: 'standard-menu-1',
          name: 'Standart Menü 1',
          description: 'Basit ve net bir üst menü',
          thumbnail: '/thumbnails/standard-menu-1.png', // Thumbnail resmi eklenmeli
          type: 'standard-menu-1' as const
        },
        {
          id: 'standard-menu-2',
          name: 'Standart Menü 2',
          description: 'İletişim butonu içeren standart menü',
          thumbnail: '/thumbnails/standard-menu-2.png', // Thumbnail resmi eklenmeli
          type: 'standard-menu-2' as const
        }
      ]
    },
    {
      id: 'sticky-menu',
      name: 'Yapışkan Menü',
      description: 'Sayfa kaydırıldığında üstte sabitlenen menüler',
      components: [
        {
          id: 'sticky-menu-1',
          name: 'Yapışkan Menü 1',
          description: 'Sayfa kaydırıldığında stilleri değişen yapışkan menü',
          thumbnail: '/thumbnails/sticky-menu-1.png', // Thumbnail resmi eklenmeli
          type: 'sticky-menu-1' as const
        }
      ]
    },
    {
      id: 'mega-menu',
      name: 'Mega Menü',
      description: 'Çoklu kategoriler için ideal, geniş açılır menüler',
      components: [
        {
          id: 'mega-menu-1',
          name: 'Mega Menü 1',
          description: 'Çoklu kategorili geniş açılır menü',
          thumbnail: '/thumbnails/mega-menu-1.png', // Thumbnail resmi eklenmeli
          type: 'mega-menu-1' as const
        }
      ]
    }
  ]
};

export default {
  renderHeaderComponent,
  headerComponentsData
}; 