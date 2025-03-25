import React, { useEffect } from 'react';
import { SiteData } from '../../types';
import { renderHeaderComponent, HeaderComponentType } from '../headers/HeaderComponents';
import styled from 'styled-components';

// Önizleme stilleri - Responsive tasarım ve taşma sorunu düzeltmesi
const PreviewContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  overflow-x: hidden; // Yatay kaydırmayı engelle
`;

const SiteContent = styled.div`
  width: 100%;
  padding: 0;
  max-width: 100%;
  margin: 0 auto;
  overflow-x: hidden;
  box-sizing: border-box;
  
  // Tüm alt bileşenlerin kenar sınırlaması
  & > div {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
  }
`;

// SitePreview bileşeninin prop tipleri
interface SitePreviewProps {
  siteData: SiteData;
}

// Komponenti render eden yardımcı fonksiyon
const renderComponent = (component: any) => {
  const componentType = component.type as HeaderComponentType['type'];
  
  return renderHeaderComponent({
    type: componentType,
    props: component.props
  });
};

// SitePreview bileşeni
const SitePreview: React.FC<SitePreviewProps> = ({ siteData }) => {
  useEffect(() => {
    // Sayfa başlığını site adına göre ayarla
    document.title = `${siteData.name} - Önizleme`;
  }, [siteData.name]);

  // Komponentleri kategorilerine göre sırala
  const headerComponents = siteData.components
    .filter(comp => comp.category === 'header')
    .sort((a, b) => a.position - b.position);
  
  // Diğer kategoriler için de aynısını yapabiliriz
  // const contentComponents = siteData.components.filter(comp => comp.category === 'content');
  // const footerComponents = siteData.components.filter(comp => comp.category === 'footer');
  
  return (
    <PreviewContainer>
      <SiteContent>
        {/* Header komponentlerini render et */}
        {headerComponents.map(component => (
          <div key={component.id} className="component-wrapper">
            {renderComponent(component)}
          </div>
        ))}
        
        {/* İçerik ve diğer bölümler buraya eklenecek */}
        {headerComponents.length === 0 && (
          <div style={{ padding: '50px 20px', textAlign: 'center', color: '#999' }}>
            <h3>Henüz herhangi bir komponent eklenmemiş</h3>
            <p>Bu site henüz yapım aşamasında. Lütfen daha sonra tekrar ziyaret edin.</p>
          </div>
        )}
      </SiteContent>
    </PreviewContainer>
  );
};

export default SitePreview; 