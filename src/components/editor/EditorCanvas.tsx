import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useSite } from '../../context/SiteContext';
import { renderHeaderComponent, HeaderComponentType } from '../headers/HeaderComponents';

// Canvas'ın stillerini tanımlıyoruz
const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  overflow: auto;
  padding: 20px;
`;

const SitePreview = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const EmptyCanvasMessage = styled.div`
  padding: 50px 20px;
  text-align: center;
  color: #999;
`;

// Komponent wrapper
const ComponentWrapper = styled.div<{ isSelected: boolean }>`
  position: relative;
  border: ${props => props.isSelected ? '2px solid #3498db' : 'none'};
  margin-bottom: ${props => props.isSelected ? '5px' : '0'};
  
  &:hover {
    outline: 1px dashed #ddd;
  }
`;

// Önizleme modu için kapsamlı bir overlay ekliyoruz.
// Bu overlay, component linkleri etkisiz hale getirecek.
const PreviewOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5; // Komponentlerin üzerinde ama kontrol butonlarının altında
  background-color: transparent;
  cursor: pointer;
`;

const ComponentControls = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  gap: 5px;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ddd;
  z-index: 10; // Overlay'in üstünde olmalı
`;

const ControlButton = styled.button`
  padding: 3px 8px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background-color: #e9ecef;
  }
`;

// Komponenti render et
const renderComponent = (component: any) => {
  // Gerçek dosyalardaki property isimlerine göre düzeltilmiş props
  const componentType = component.type as HeaderComponentType['type'];
  
  // Propları olduğu gibi geçir, dönüşüm yapmadan
  return renderHeaderComponent({
    type: componentType,
    props: component.props
  });
};

// Canvas bileşeninin ana yapısı
const EditorCanvas: React.FC = () => {
  const { site, selectedComponentId, selectComponent, removeComponent, moveComponent } = useSite();
  const sitePreviewRef = useRef<HTMLDivElement>(null);

  // Header komponentlerini render etme
  const headerComponents = site.components
    .filter(component => component.category === 'header')
    .sort((a, b) => a.position - b.position);

  // Canvas içindeki linklerin tıklanmasını engelleme
  useEffect(() => {
    // Site preview ref mevcutsa
    if (sitePreviewRef.current) {
      // Link tıklamalarını yakalayan fonksiyon
      const handleLinkClick = (e: Event) => {
        // Eğer tıklanan element veya üst elementi bir <a> (link) ise
        const isLink = (el: Element | null): boolean => {
          if (!el) return false;
          return el.tagName === 'A' || isLink(el.parentElement);
        };
        
        const target = e.target as Element;
        if (isLink(target)) {
          // Link tıklamasını engelle
          e.preventDefault();
          console.log('Önizleme modunda link tıklaması engellendi');
        }
      };

      // Canvas içindeki tüm tıklamaları yakalayalım
      const sitePreview = sitePreviewRef.current;
      sitePreview.addEventListener('click', handleLinkClick, true);
      
      // Cleanup fonksiyonu
      return () => {
        sitePreview.removeEventListener('click', handleLinkClick, true);
      };
    }
  }, []);

  const handleSelectComponent = (id: string) => {
    selectComponent(id);
  };

  const handleRemoveComponent = (id: string) => {
    if (window.confirm('Bu komponenti silmek istediğinize emin misiniz?')) {
      removeComponent(id);
    }
  };

  const handleMoveUp = (id: string) => {
    const component = site.components.find(c => c.id === id);
    if (component) {
      moveComponent(id, component.position - 1);
    }
  };

  const handleMoveDown = (id: string) => {
    const component = site.components.find(c => c.id === id);
    if (component) {
      moveComponent(id, component.position + 1);
    }
  };

  return (
    <CanvasContainer>
      <SitePreview ref={sitePreviewRef}>
        {headerComponents.length > 0 ? (
          <>
            {headerComponents.map(component => (
              <ComponentWrapper 
                key={component.id} 
                isSelected={component.id === selectedComponentId}
                onClick={() => handleSelectComponent(component.id)}
              >
                {/* Overlay ekleyerek linkleri etkisiz hale getiriyoruz */}
                <PreviewOverlay onClick={() => handleSelectComponent(component.id)} />
                
                {component.id === selectedComponentId && (
                  <ComponentControls>
                    <ControlButton onClick={() => handleMoveUp(component.id)}>↑</ControlButton>
                    <ControlButton onClick={() => handleMoveDown(component.id)}>↓</ControlButton>
                    <ControlButton onClick={() => handleRemoveComponent(component.id)}>×</ControlButton>
                  </ComponentControls>
                )}
                {renderComponent(component)}
              </ComponentWrapper>
            ))}
            
            {/* Diğer komponent kategorileri burada render edilecek */}
          </>
        ) : (
          <EmptyCanvasMessage>
            <h3>Boş Canvas</h3>
            <p>Sağ taraftan komponent seçerek sitenizi oluşturmaya başlayın.</p>
          </EmptyCanvasMessage>
        )}
      </SitePreview>
    </CanvasContainer>
  );
};

export default EditorCanvas; 