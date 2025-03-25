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
  padding: 10px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 80px);
  overflow-y: auto;
`;

// Form elemanları
const FormGroup = styled.div`
  margin-bottom: 8px;
  display: flex;
  align-items: center;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.85rem;
  color: #333;
  width: 80px;
  margin-right: 8px;
`;

const CompactSelect = styled.select`
  width: 120px;
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Input = styled.input`
  width: 120px;
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.8rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ColorInput = styled.input.attrs({ type: 'color' })`
  width: 120px;
  height: 25px;
  padding: 1px;
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
  margin-bottom: 10px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 6px;
  font-size: 1rem;
`;

const EditorSection = styled.div`
  margin-bottom: 15px;
`;

const SectionTitle = styled.h4`
  margin-bottom: 8px;
  color: #555;
  font-size: 0.9rem;
`;

// Grid düzen için stil tanımları
const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  width: 100%;
`;

// Grup için konteyner
const ControlGroup = styled.div`
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 8px;
  background-color: #fafafa;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  cursor: pointer;
  margin-left: 8px;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 6px;
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
      
      <GridContainer>
        {/* Logo ayarları */}
        <ControlGroup>
          <SectionTitle>Logo</SectionTitle>
          <FormGroup>
            <Label>Tür:</Label>
            <CompactSelect value={logoType} onChange={handleLogoTypeChange}>
              <option value="text">Yazı Logo</option>
              <option value="image">Resim Logo</option>
            </CompactSelect>
          </FormGroup>
          
          {logoType === 'text' && (
            <>
              <FormGroup>
                <Label>Metin:</Label>
                <Input 
                  type="text" 
                  value={logoText} 
                  onChange={handleLogoTextChange}
                  placeholder="Logo metni"
                />
              </FormGroup>
              <FormGroup>
                <Label>Renk:</Label>
                <ColorInput 
                  value={logoColor} 
                  onChange={handleLogoColorChange}
                />
              </FormGroup>
            </>
          )}
          
          {logoType === 'image' && (
            <FormGroup>
              <Label>URL:</Label>
              <Input 
                type="text" 
                value={component.props.logoUrl || ''} 
                onChange={(e) => updateComponentProps('logoUrl', e.target.value)}
                placeholder="Logo URL"
              />
            </FormGroup>
          )}
        </ControlGroup>
        
        {/* Genel menü ayarları */}
        <ControlGroup>
          <SectionTitle>Genel Menü</SectionTitle>
          <FormGroup>
            <Label>Arkaplan:</Label>
            <ColorInput 
              value={backgroundColor} 
              onChange={handleBackgroundColorChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Metin:</Label>
            <ColorInput 
              value={textColor} 
              onChange={handleTextColorChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>Font:</Label>
            <Input 
              type="text" 
              value={fontSize} 
              onChange={handleFontSizeChange}
              placeholder="ör: 16px"
            />
          </FormGroup>
        </ControlGroup>
        
        {/* StickyMenu1 tipi için özel ayarlar */}
        {component.type === 'sticky-menu-1' && (
          <ControlGroup>
            <SectionTitle>Yapışkan Menü</SectionTitle>
            <FormGroup>
              <Label>Arkaplan:</Label>
              <ColorInput 
                value={stickyBgColor} 
                onChange={handleStickyBgColorChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Metin:</Label>
              <ColorInput 
                value={stickyTextColor} 
                onChange={handleStickyTextColorChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>Eşik:</Label>
              <Input 
                type="number" 
                value={component.props.scrollThreshold || 100} 
                onChange={(e) => updateComponentProps('scrollThreshold', Number(e.target.value))}
                placeholder="ör: 100"
              />
            </FormGroup>
          </ControlGroup>
        )}
        
        {/* MegaMenu1 tipi için özel ayarlar */}
        {component.type === 'mega-menu-1' && (
          <ControlGroup>
            <SectionTitle>Mega Menü</SectionTitle>
            <FormGroup>
              <Label>Dropdown:</Label>
              <ColorInput 
                value={dropdownBgColor} 
                onChange={handleDropdownBgColorChange}
              />
            </FormGroup>
            <FormGroup>
              <Label>D. Başlık:</Label>
              <ColorInput 
                value={component.props.dropdownTitleColor || '#333333'} 
                onChange={(e) => updateComponentProps('dropdownTitleColor', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>D. Metin:</Label>
              <ColorInput 
                value={component.props.dropdownTextColor || '#666666'} 
                onChange={(e) => updateComponentProps('dropdownTextColor', e.target.value)}
              />
            </FormGroup>
          </ControlGroup>
        )}
        
        {/* StandardMenu2 tipi için özel ayarlar */}
        {component.type === 'standard-menu-2' && (
          <ControlGroup>
            <SectionTitle>İletişim Butonu</SectionTitle>
            <FormGroup>
              <CheckboxLabel>
                <Checkbox 
                  checked={showContactButton} 
                  onChange={handleShowContactButtonChange}
                />
                Butonu Göster
              </CheckboxLabel>
            </FormGroup>
            
            {showContactButton && (
              <>
                <FormGroup>
                  <Label>Metin:</Label>
                  <Input 
                    type="text" 
                    value={component.props.contactButtonText || 'İletişim'} 
                    onChange={(e) => updateComponentProps('contactButtonText', e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Renk:</Label>
                  <ColorInput 
                    value={buttonColor} 
                    onChange={handleButtonColorChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>B. Metin:</Label>
                  <ColorInput 
                    value={buttonTextColor} 
                    onChange={handleButtonTextColorChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Link:</Label>
                  <Input 
                    type="text" 
                    value={component.props.contactButtonLink || '/contact'} 
                    onChange={(e) => updateComponentProps('contactButtonLink', e.target.value)}
                  />
                </FormGroup>
              </>
            )}
          </ControlGroup>
        )}
      </GridContainer>
    </>
  );
};

// İçerik bölümleri için düzenleyici
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
      
      <GridContainer>
        <ControlGroup>
          <SectionTitle>Metin İçeriği</SectionTitle>
          <FormGroup>
            <Label>Başlık:</Label>
            <Input 
              type="text" 
              value={component.props.title || ''} 
              onChange={(e) => updateComponentProps('title', e.target.value)}
              placeholder="Başlık"
            />
          </FormGroup>
          <FormGroup>
            <Label>Alt Başlık:</Label>
            <Input 
              type="text" 
              value={component.props.subtitle || ''} 
              onChange={(e) => updateComponentProps('subtitle', e.target.value)}
              placeholder="Alt başlık"
            />
          </FormGroup>
        </ControlGroup>
        
        <ControlGroup>
          <SectionTitle>Renk & Stil</SectionTitle>
          <FormGroup>
            <Label>Arkaplan:</Label>
            <ColorInput 
              value={component.props.backgroundColor || '#ffffff'} 
              onChange={(e) => updateComponentProps('backgroundColor', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Metin:</Label>
            <ColorInput 
              value={component.props.textColor || '#333333'} 
              onChange={(e) => updateComponentProps('textColor', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Dolgu:</Label>
            <Input 
              type="text" 
              value={component.props.padding || '20px'} 
              onChange={(e) => updateComponentProps('padding', e.target.value)}
              placeholder="20px"
            />
          </FormGroup>
        </ControlGroup>
      </GridContainer>
    </>
  );
};

// Galeri/Portfolyo düzenleyici
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
      
      <GridContainer>
        <ControlGroup>
          <SectionTitle>Galeri Başlığı</SectionTitle>
          <FormGroup>
            <Label>Başlık:</Label>
            <Input 
              type="text" 
              value={component.props.title || ''} 
              onChange={(e) => updateComponentProps('title', e.target.value)}
              placeholder="Başlık"
            />
          </FormGroup>
          <FormGroup>
            <Label>Alt Başlık:</Label>
            <Input 
              type="text" 
              value={component.props.subtitle || ''} 
              onChange={(e) => updateComponentProps('subtitle', e.target.value)}
              placeholder="Alt başlık"
            />
          </FormGroup>
        </ControlGroup>
        
        <ControlGroup>
          <SectionTitle>Galeri Yapısı</SectionTitle>
          <FormGroup>
            <Label>Sütun:</Label>
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
            <Label>Boşluk:</Label>
            <Input 
              type="text" 
              value={component.props.gap || '10px'} 
              onChange={(e) => updateComponentProps('gap', e.target.value)}
              placeholder="10px"
            />
          </FormGroup>
        </ControlGroup>
        
        <ControlGroup>
          <SectionTitle>Renk & Stil</SectionTitle>
          <FormGroup>
            <Label>Arkaplan:</Label>
            <ColorInput 
              value={component.props.backgroundColor || '#ffffff'} 
              onChange={(e) => updateComponentProps('backgroundColor', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Dolgu:</Label>
            <Input 
              type="text" 
              value={component.props.padding || '20px'} 
              onChange={(e) => updateComponentProps('padding', e.target.value)}
              placeholder="20px"
            />
          </FormGroup>
        </ControlGroup>
      </GridContainer>
    </>
  );
};

// Slider/Banner düzenleyici
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
      
      <GridContainer>
        <ControlGroup>
          <SectionTitle>Slider İçeriği</SectionTitle>
          <FormGroup>
            <Label>Başlık:</Label>
            <Input 
              type="text" 
              value={component.props.title || ''} 
              onChange={(e) => updateComponentProps('title', e.target.value)}
              placeholder="Başlık"
            />
          </FormGroup>
          <FormGroup>
            <Label>Alt Metin:</Label>
            <Input 
              type="text" 
              value={component.props.subtitle || ''} 
              onChange={(e) => updateComponentProps('subtitle', e.target.value)}
              placeholder="Alt metin"
            />
          </FormGroup>
        </ControlGroup>
        
        <ControlGroup>
          <SectionTitle>Arka Plan</SectionTitle>
          <FormGroup>
            <Label>Görsel:</Label>
            <Input 
              type="text" 
              value={component.props.backgroundUrl || ''} 
              onChange={(e) => updateComponentProps('backgroundUrl', e.target.value)}
              placeholder="Görsel URL"
            />
          </FormGroup>
          <FormGroup>
            <Label>Yükseklik:</Label>
            <Input 
              type="text" 
              value={component.props.height || '400px'} 
              onChange={(e) => updateComponentProps('height', e.target.value)}
              placeholder="400px"
            />
          </FormGroup>
        </ControlGroup>
        
        <ControlGroup>
          <SectionTitle>Renk & Stil</SectionTitle>
          <FormGroup>
            <Label>Metin:</Label>
            <ColorInput 
              value={component.props.textColor || '#ffffff'} 
              onChange={(e) => updateComponentProps('textColor', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Konum:</Label>
            <CompactSelect 
              value={component.props.textPosition || 'center'}
              onChange={(e) => updateComponentProps('textPosition', e.target.value)}
            >
              <option value="left">Sol</option>
              <option value="center">Orta</option>
              <option value="right">Sağ</option>
            </CompactSelect>
          </FormGroup>
        </ControlGroup>
      </GridContainer>
    </>
  );
};

// Alt Menü düzenleyici
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
      
      <GridContainer>
        <ControlGroup>
          <SectionTitle>Logo & Telif</SectionTitle>
          <FormGroup>
            <Label>Logo:</Label>
            <Input 
              type="text" 
              value={component.props.logoText || ''} 
              onChange={(e) => updateComponentProps('logoText', e.target.value)}
              placeholder="Logo metni"
            />
          </FormGroup>
          <FormGroup>
            <Label>Telif:</Label>
            <Input 
              type="text" 
              value={component.props.copyright || ''} 
              onChange={(e) => updateComponentProps('copyright', e.target.value)}
              placeholder="Telif metni"
            />
          </FormGroup>
        </ControlGroup>
        
        <ControlGroup>
          <SectionTitle>Renk & Stil</SectionTitle>
          <FormGroup>
            <Label>Arkaplan:</Label>
            <ColorInput 
              value={component.props.backgroundColor || '#222222'} 
              onChange={(e) => updateComponentProps('backgroundColor', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Metin:</Label>
            <ColorInput 
              value={component.props.textColor || '#ffffff'} 
              onChange={(e) => updateComponentProps('textColor', e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label>Dolgu:</Label>
            <Input 
              type="text" 
              value={component.props.padding || '30px'} 
              onChange={(e) => updateComponentProps('padding', e.target.value)}
              placeholder="30px"
            />
          </FormGroup>
        </ControlGroup>
        
        <ControlGroup>
          <SectionTitle>Sosyal Medya</SectionTitle>
          <FormGroup>
            <Label>Göster:</Label>
            <CompactSelect 
              value={component.props.showSocial ? 'true' : 'false'}
              onChange={(e) => updateComponentProps('showSocial', e.target.value === 'true')}
            >
              <option value="true">Evet</option>
              <option value="false">Hayır</option>
            </CompactSelect>
          </FormGroup>
          <FormGroup>
            <Label>Simge Renk:</Label>
            <ColorInput 
              value={component.props.socialIconColor || '#ffffff'} 
              onChange={(e) => updateComponentProps('socialIconColor', e.target.value)}
            />
          </FormGroup>
        </ControlGroup>
      </GridContainer>
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