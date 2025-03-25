import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSite } from '../../context/SiteContext';
import { ComponentData, ComponentCategory } from '../../types';
import { StandardMenu1Props } from '../headers/standard-menu/StandardMenu1';
import { StandardMenu2Props } from '../headers/standard-menu/StandardMenu2';
import { StickyMenu1Props } from '../headers/sticky-menu/StickyMenu1';
import { MegaMenu1Props } from '../headers/mega-menu/MegaMenu1';

// Ana düzenleyici konteyner
const EditorContainer = styled.div`
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

// Form elemanları
const FormGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 1rem;
  color: #333;
  width: 100px;
  margin-right: 15px;
`;

const CompactSelect = styled.select`
  width: 200px;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Input = styled.input`
  width: 200px;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ColorInput = styled.input.attrs({ type: 'color' })`
  width: 200px;
  height: 36px;
  padding: 2px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const EditorTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const EditorSection = styled.div`
  margin-bottom: 25px;
`;

const SectionTitle = styled.h4`
  margin-bottom: 15px;
  color: #555;
`;

// Header düzenleyici bileşeni (Tüm üst menü tipleri için)
interface HeaderEditorProps {
  component: ComponentData;
}

const HeaderEditor: React.FC<HeaderEditorProps> = ({ component }) => {
  const { updateComponent } = useSite();
  const [logoType, setLogoType] = useState<'text' | 'image'>('text');
  const [logoText, setLogoText] = useState('');
  const [logoColor, setLogoColor] = useState('#333333');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#333333');
  const [fontSize, setFontSize] = useState('16px');
  
  // Komponent tipine özel ek alanlar için state'ler
  const [stickyBgColor, setStickyBgColor] = useState('#ffffff');
  const [stickyTextColor, setStickyTextColor] = useState('#333333');
  const [dropdownBgColor, setDropdownBgColor] = useState('#ffffff');
  const [buttonColor, setButtonColor] = useState('#3498db');
  const [buttonTextColor, setButtonTextColor] = useState('#ffffff');
  const [showContactButton, setShowContactButton] = useState(false);
  
  // Komponent props'larını yükle
  useEffect(() => {
    if (component && component.props) {
      const props = component.props;
      
      // Temel ortak alanlar
      if (props.logoText) setLogoText(props.logoText);
      if (props.logoColor) setLogoColor(props.logoColor);
      if (props.backgroundColor) setBackgroundColor(props.backgroundColor);
      if (props.textColor) setTextColor(props.textColor);
      if (props.fontSize) setFontSize(props.fontSize);
      if (props.logoType) setLogoType(props.logoType);
      
      // Komponent tipine özel alanlar
      if (component.type === 'sticky-menu-1') {
        if (props.stickyBackgroundColor) setStickyBgColor(props.stickyBackgroundColor);
        if (props.stickyTextColor) setStickyTextColor(props.stickyTextColor);
      }
      
      if (component.type === 'mega-menu-1') {
        if (props.dropdownBgColor) setDropdownBgColor(props.dropdownBgColor);
      }
      
      if (component.type === 'standard-menu-2') {
        if (props.buttonColor) setButtonColor(props.buttonColor);
        if (props.buttonTextColor) setButtonTextColor(props.buttonTextColor);
        if (props.showContactButton !== undefined) setShowContactButton(props.showContactButton);
      }
    }
  }, [component]);
  
  // Değişiklikleri kaydet
  const updateComponentProps = (field: string, value: any) => {
    const updatedProps = { ...component.props, [field]: value };
    updateComponent(component.id, { ...component, props: updatedProps });
  };
  
  // Logo türü değiştiğinde
  const handleLogoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLogoType = e.target.value as 'text' | 'image';
    setLogoType(newLogoType);
    updateComponentProps('logoType', newLogoType);
  };
  
  // Metin logo değiştiğinde
  const handleLogoTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoText(e.target.value);
    updateComponentProps('logoText', e.target.value);
  };
  
  // Logo rengi değiştiğinde
  const handleLogoColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoColor(e.target.value);
    updateComponentProps('logoColor', e.target.value);
  };
  
  // Arka plan rengi değiştiğinde
  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(e.target.value);
    updateComponentProps('backgroundColor', e.target.value);
  };
  
  // Metin rengi değiştiğinde
  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
    updateComponentProps('textColor', e.target.value);
  };
  
  // Font boyutu değiştiğinde
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(e.target.value);
    updateComponentProps('fontSize', e.target.value);
  };
  
  // Yapışkan menü arka plan rengi değiştiğinde
  const handleStickyBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStickyBgColor(e.target.value);
    updateComponentProps('stickyBackgroundColor', e.target.value);
  };
  
  // Yapışkan menü metin rengi değiştiğinde
  const handleStickyTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStickyTextColor(e.target.value);
    updateComponentProps('stickyTextColor', e.target.value);
  };
  
  // Dropdown arka plan rengi değiştiğinde
  const handleDropdownBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDropdownBgColor(e.target.value);
    updateComponentProps('dropdownBgColor', e.target.value);
  };
  
  // Buton rengi değiştiğinde
  const handleButtonColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setButtonColor(e.target.value);
    updateComponentProps('buttonColor', e.target.value);
  };
  
  // Buton metin rengi değiştiğinde
  const handleButtonTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setButtonTextColor(e.target.value);
    updateComponentProps('buttonTextColor', e.target.value);
  };
  
  // İletişim butonu gösterme durumu değiştiğinde
  const handleShowContactButtonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowContactButton(e.target.checked);
    updateComponentProps('showContactButton', e.target.checked);
  };
  
  return (
    <>
      <EditorTitle>Üst Menü Düzenleyicisi</EditorTitle>
      
      <EditorSection>
        <SectionTitle>Logo Ayarları</SectionTitle>
        <FormGroup>
          <Label>Logo Türü:</Label>
          <CompactSelect value={logoType} onChange={handleLogoTypeChange}>
            <option value="text">Yazı Logo</option>
            <option value="image">Resim Logo</option>
          </CompactSelect>
        </FormGroup>
        
        {logoType === 'text' && (
          <>
            <FormGroup>
              <Label>Logo Metni:</Label>
              <Input 
                type="text" 
                value={logoText} 
                onChange={handleLogoTextChange}
                placeholder="Logo metnini girin"
              />
            </FormGroup>
            <FormGroup>
              <Label>Logo Rengi:</Label>
              <ColorInput 
                value={logoColor} 
                onChange={handleLogoColorChange}
              />
            </FormGroup>
          </>
        )}
        
        {logoType === 'image' && (
          <FormGroup>
            <Label>Logo URL:</Label>
            <Input 
              type="text" 
              value={component.props.logoUrl || ''} 
              onChange={(e) => updateComponentProps('logoUrl', e.target.value)}
              placeholder="Logo URL'sini girin"
            />
          </FormGroup>
        )}
      </EditorSection>
      
      <EditorSection>
        <SectionTitle>Genel Menü Ayarları</SectionTitle>
        <FormGroup>
          <Label>Arkaplan:</Label>
          <ColorInput 
            value={backgroundColor} 
            onChange={handleBackgroundColorChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Metin Rengi:</Label>
          <ColorInput 
            value={textColor} 
            onChange={handleTextColorChange}
          />
        </FormGroup>
        <FormGroup>
          <Label>Font Boyutu:</Label>
          <Input 
            type="text" 
            value={fontSize} 
            onChange={handleFontSizeChange}
            placeholder="ör: 16px"
          />
        </FormGroup>
      </EditorSection>
      
      {/* StickyMenu1 tipi için özel ayarlar */}
      {component.type === 'sticky-menu-1' && (
        <EditorSection>
          <SectionTitle>Yapışkan Menü Ayarları</SectionTitle>
          <FormGroup>
            <Label>Yapışkan Arkaplan:</Label>
            <ColorInput 
              value={stickyBgColor} 
              onChange={handleStickyBgColorChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Yapışkan Metin:</Label>
            <ColorInput 
              value={stickyTextColor} 
              onChange={handleStickyTextColorChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Eşik Değeri:</Label>
            <Input 
              type="number" 
              value={component.props.scrollThreshold || 100} 
              onChange={(e) => updateComponentProps('scrollThreshold', Number(e.target.value))}
              placeholder="ör: 100"
            />
          </FormGroup>
        </EditorSection>
      )}
      
      {/* MegaMenu1 tipi için özel ayarlar */}
      {component.type === 'mega-menu-1' && (
        <EditorSection>
          <SectionTitle>Mega Menü Ayarları</SectionTitle>
          <FormGroup>
            <Label>Dropdown Arkaplan:</Label>
            <ColorInput 
              value={dropdownBgColor} 
              onChange={handleDropdownBgColorChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Dropdown Başlık:</Label>
            <ColorInput 
              value={component.props.dropdownTitleColor || '#333333'} 
              onChange={(e) => updateComponentProps('dropdownTitleColor', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Dropdown Metin:</Label>
            <ColorInput 
              value={component.props.dropdownTextColor || '#666666'} 
              onChange={(e) => updateComponentProps('dropdownTextColor', e.target.value)}
            />
          </FormGroup>
        </EditorSection>
      )}
      
      {/* StandardMenu2 tipi için özel ayarlar */}
      {component.type === 'standard-menu-2' && (
        <EditorSection>
          <SectionTitle>İletişim Butonu Ayarları</SectionTitle>
          <FormGroup>
            <Label>Butonu Göster:</Label>
            <input 
              type="checkbox" 
              checked={showContactButton} 
              onChange={handleShowContactButtonChange}
            />
          </FormGroup>
          
          {showContactButton && (
            <>
              <FormGroup>
                <Label>Buton Metni:</Label>
                <Input 
                  type="text" 
                  value={component.props.contactButtonText || 'İletişim'} 
                  onChange={(e) => updateComponentProps('contactButtonText', e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Buton Rengi:</Label>
                <ColorInput 
                  value={buttonColor} 
                  onChange={handleButtonColorChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Buton Metin:</Label>
                <ColorInput 
                  value={buttonTextColor} 
                  onChange={handleButtonTextColorChange}
                />
              </FormGroup>
              <FormGroup>
                <Label>Buton Link:</Label>
                <Input 
                  type="text" 
                  value={component.props.contactButtonLink || '/contact'} 
                  onChange={(e) => updateComponentProps('contactButtonLink', e.target.value)}
                />
              </FormGroup>
            </>
          )}
        </EditorSection>
      )}
    </>
  );
};

// İçerik bölümleri için düzenleyici (Basit bir örnek)
interface ContentEditorProps {
  component: ComponentData;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ component }) => {
  const { updateComponent } = useSite();
  
  const updateComponentProps = (field: string, value: any) => {
    const updatedProps = { ...component.props, [field]: value };
    updateComponent(component.id, { ...component, props: updatedProps });
  };
  
  return (
    <>
      <EditorTitle>İçerik Bölümü Düzenleyicisi</EditorTitle>
      
      <EditorSection>
        <SectionTitle>İçerik Ayarları</SectionTitle>
        <FormGroup>
          <Label>Başlık:</Label>
          <Input 
            type="text" 
            value={component.props.title || ''} 
            onChange={(e) => updateComponentProps('title', e.target.value)}
            placeholder="Bölüm başlığını girin"
          />
        </FormGroup>
        <FormGroup>
          <Label>Alt Başlık:</Label>
          <Input 
            type="text" 
            value={component.props.subtitle || ''} 
            onChange={(e) => updateComponentProps('subtitle', e.target.value)}
            placeholder="Alt başlığı girin (isteğe bağlı)"
          />
        </FormGroup>
        <FormGroup>
          <Label>Arkaplan:</Label>
          <ColorInput 
            value={component.props.backgroundColor || '#ffffff'} 
            onChange={(e) => updateComponentProps('backgroundColor', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Metin Rengi:</Label>
          <ColorInput 
            value={component.props.textColor || '#333333'} 
            onChange={(e) => updateComponentProps('textColor', e.target.value)}
          />
        </FormGroup>
      </EditorSection>
    </>
  );
};

// Galeri/Portfolyo düzenleyici (Basit bir örnek)
interface GalleryEditorProps {
  component: ComponentData;
}

const GalleryEditor: React.FC<GalleryEditorProps> = ({ component }) => {
  const { updateComponent } = useSite();
  
  const updateComponentProps = (field: string, value: any) => {
    const updatedProps = { ...component.props, [field]: value };
    updateComponent(component.id, { ...component, props: updatedProps });
  };
  
  return (
    <>
      <EditorTitle>Galeri Düzenleyicisi</EditorTitle>
      
      <EditorSection>
        <SectionTitle>Galeri Ayarları</SectionTitle>
        <FormGroup>
          <Label>Başlık:</Label>
          <Input 
            type="text" 
            value={component.props.title || ''} 
            onChange={(e) => updateComponentProps('title', e.target.value)}
            placeholder="Galeri başlığını girin"
          />
        </FormGroup>
        <FormGroup>
          <Label>Sütun Sayısı:</Label>
          <CompactSelect 
            value={component.props.columns || '3'}
            onChange={(e) => updateComponentProps('columns', e.target.value)}
          >
            <option value="2">2 Sütun</option>
            <option value="3">3 Sütun</option>
            <option value="4">4 Sütun</option>
          </CompactSelect>
        </FormGroup>
        <FormGroup>
          <Label>Arkaplan:</Label>
          <ColorInput 
            value={component.props.backgroundColor || '#ffffff'} 
            onChange={(e) => updateComponentProps('backgroundColor', e.target.value)}
          />
        </FormGroup>
      </EditorSection>
    </>
  );
};

// Slider/Banner düzenleyici (Basit bir örnek)
interface SliderEditorProps {
  component: ComponentData;
}

const SliderEditor: React.FC<SliderEditorProps> = ({ component }) => {
  const { updateComponent } = useSite();
  
  const updateComponentProps = (field: string, value: any) => {
    const updatedProps = { ...component.props, [field]: value };
    updateComponent(component.id, { ...component, props: updatedProps });
  };
  
  return (
    <>
      <EditorTitle>Slider/Banner Düzenleyicisi</EditorTitle>
      
      <EditorSection>
        <SectionTitle>Slider Ayarları</SectionTitle>
        <FormGroup>
          <Label>Başlık:</Label>
          <Input 
            type="text" 
            value={component.props.title || ''} 
            onChange={(e) => updateComponentProps('title', e.target.value)}
            placeholder="Slider başlığını girin"
          />
        </FormGroup>
        <FormGroup>
          <Label>Arka Plan:</Label>
          <Input 
            type="text" 
            value={component.props.backgroundUrl || ''} 
            onChange={(e) => updateComponentProps('backgroundUrl', e.target.value)}
            placeholder="Arkaplan görsel URL'si"
          />
        </FormGroup>
        <FormGroup>
          <Label>Metin Rengi:</Label>
          <ColorInput 
            value={component.props.textColor || '#ffffff'} 
            onChange={(e) => updateComponentProps('textColor', e.target.value)}
          />
        </FormGroup>
      </EditorSection>
    </>
  );
};

// Alt Menü düzenleyici (Basit bir örnek)
interface FooterEditorProps {
  component: ComponentData;
}

const FooterEditor: React.FC<FooterEditorProps> = ({ component }) => {
  const { updateComponent } = useSite();
  
  const updateComponentProps = (field: string, value: any) => {
    const updatedProps = { ...component.props, [field]: value };
    updateComponent(component.id, { ...component, props: updatedProps });
  };
  
  return (
    <>
      <EditorTitle>Alt Menü Düzenleyicisi</EditorTitle>
      
      <EditorSection>
        <SectionTitle>Alt Menü Ayarları</SectionTitle>
        <FormGroup>
          <Label>Logo Metni:</Label>
          <Input 
            type="text" 
            value={component.props.logoText || ''} 
            onChange={(e) => updateComponentProps('logoText', e.target.value)}
            placeholder="Alt menü logo metni"
          />
        </FormGroup>
        <FormGroup>
          <Label>Telif Hakkı:</Label>
          <Input 
            type="text" 
            value={component.props.copyright || ''} 
            onChange={(e) => updateComponentProps('copyright', e.target.value)}
            placeholder="Telif hakkı metni"
          />
        </FormGroup>
        <FormGroup>
          <Label>Arkaplan:</Label>
          <ColorInput 
            value={component.props.backgroundColor || '#222222'} 
            onChange={(e) => updateComponentProps('backgroundColor', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Metin Rengi:</Label>
          <ColorInput 
            value={component.props.textColor || '#ffffff'} 
            onChange={(e) => updateComponentProps('textColor', e.target.value)}
          />
        </FormGroup>
      </EditorSection>
    </>
  );
};

// Component Editor bileşeni - Ana bileşen
interface ComponentEditorProps {
  component: ComponentData;
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({ component }) => {
  // Kategori bazlı düzenleyiciyi seç
  const renderEditorForCategory = () => {
    switch(component.category) {
      case 'header':
        return <HeaderEditor component={component} />;
      case 'content':
        return <ContentEditor component={component} />;
      case 'slider':
        return <SliderEditor component={component} />;
      case 'footer':
        return <FooterEditor component={component} />;
      default:
        // Standart bir editorü göster veya kategoriye göre farklı bir editor
        if (component.type.includes('gallery')) {
          return <GalleryEditor component={component} />;
        }
        return (
          <div>
            <EditorTitle>Bileşen Düzenleyici</EditorTitle>
            <p>Bu bileşen tipi için özel düzenleyici bulunamadı.</p>
          </div>
        );
    }
  };
  
  return (
    <EditorContainer>
      {renderEditorForCategory()}
    </EditorContainer>
  );
};

export default ComponentEditor; 