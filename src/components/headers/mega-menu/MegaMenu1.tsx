import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

// MegaMenu1 için responsive stil tanımlamaları
const MenuContainer = styled.header<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: hidden;
  
  @media (max-width: 992px) {
    padding: 0.75rem 1.5rem;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.75rem 1rem;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.color};
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
  }
`;

const NavWrapper = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Nav = styled.nav<{ isOpen: boolean }>`
  display: flex;
  gap: 1.25rem;
  position: relative;
  box-sizing: border-box;
  max-width: 100%;
  
  @media (max-width: 992px) {
    gap: 1rem;
  }
  
  @media (max-width: 768px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    background-color: ${props => props.theme.backgroundColor || '#fff'};
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    max-height: ${props => props.isOpen ? '500px' : '0'};
    overflow: hidden;
    transition: max-height 0.3s ease;
    z-index: 1000;
    padding: ${props => props.isOpen ? '0.5rem 1rem' : '0 1rem'};
    width: 100%;
  }
`;

const NavItem = styled.div<{ color: string; fontSize: string; active: boolean }>`
  color: ${props => props.active ? '#3498db' : props.color};
  font-size: ${props => props.fontSize};
  cursor: pointer;
  transition: color 0.3s;
  position: relative;
  padding: 0.5rem 0;
  box-sizing: border-box;
  white-space: nowrap;
  
  &:hover {
    color: #3498db;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 0;
    border-bottom: 1px solid #eee;
    width: 100%;
  }
`;

const MegaMenuDropdown = styled.div<{ dropdownBgColor: string; visible: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: ${props => props.dropdownBgColor};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  display: ${props => props.visible ? 'flex' : 'none'};
  padding: 1.25rem;
  margin-top: 0.625rem;
  z-index: 1001;
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: hidden;
  flex-wrap: wrap;
  
  @media (max-width: 992px) {
    padding: 1rem;
  }
  
  @media (max-width: 768px) {
    position: relative;
    box-shadow: none;
    margin-top: 0;
    padding: 0.5rem 0 0.5rem 1rem;
    flex-direction: column;
  }
`;

const DropdownSection = styled.div`
  flex: 1;
  padding: 0 1.25rem;
  box-sizing: border-box;
  min-width: 200px;
  max-width: 100%;
  
  @media (max-width: 992px) {
    padding: 0 0.75rem;
    flex: 0 0 50%;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem 0;
    margin-bottom: 1rem;
    flex: 0 0 100%;
  }
`;

const SectionTitle = styled.h4<{ color: string }>`
  color: ${props => props.color};
  margin-bottom: 0.9375rem;
  font-size: 1.1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    margin-bottom: 0.625rem;
    font-size: 1rem;
  }
`;

const SubItemsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
`;

const SubItem = styled.li`
  margin-bottom: 0.625rem;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }
`;

const SubItemLink = styled.a<{ color: string; fontSize: string }>`
  color: ${props => props.color};
  text-decoration: none;
  font-size: ${props => props.fontSize};
  transition: color 0.3s;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  
  &:hover {
    color: #3498db;
    padding-left: 5px;
  }
  
  @media (max-width: 992px) {
    font-size: calc(${props => props.fontSize} * 0.9);
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

// MegaMenu1 komponenti için props tanımı
export interface MegaMenu1Props {
  logoText: string;
  logoColor: string;
  backgroundColor: string;
  textColor: string;
  dropdownBgColor: string;
  dropdownTitleColor: string;
  dropdownTextColor: string;
  fontSize: string;
  dropdownFontSize: string;
  menuItems: Array<{
    id: string;
    label: string;
    hasMegaMenu: boolean;
    link?: string;
    sections?: Array<{
      id: string;
      title: string;
      items: Array<{
        id: string;
        label: string;
        link: string;
      }>;
    }>;
  }>;
}

// Varsayılan props değerleri
const defaultProps: MegaMenu1Props = {
  logoText: 'Logo',
  logoColor: '#333333',
  backgroundColor: '#ffffff',
  textColor: '#333333',
  dropdownBgColor: '#ffffff',
  dropdownTitleColor: '#333333',
  dropdownTextColor: '#666666',
  fontSize: '16px',
  dropdownFontSize: '14px',
  menuItems: [
    { 
      id: '1', 
      label: 'Ana Sayfa', 
      hasMegaMenu: false,
      link: '/' 
    },
    { 
      id: '2', 
      label: 'Ürünler', 
      hasMegaMenu: true,
      sections: [
        {
          id: 's1',
          title: 'Kategori 1',
          items: [
            { id: 'i1', label: 'Ürün 1.1', link: '/products/1.1' },
            { id: 'i2', label: 'Ürün 1.2', link: '/products/1.2' },
            { id: 'i3', label: 'Ürün 1.3', link: '/products/1.3' }
          ]
        },
        {
          id: 's2',
          title: 'Kategori 2',
          items: [
            { id: 'i4', label: 'Ürün 2.1', link: '/products/2.1' },
            { id: 'i5', label: 'Ürün 2.2', link: '/products/2.2' },
            { id: 'i6', label: 'Ürün 2.3', link: '/products/2.3' }
          ]
        },
        {
          id: 's3',
          title: 'Kategori 3',
          items: [
            { id: 'i7', label: 'Ürün 3.1', link: '/products/3.1' },
            { id: 'i8', label: 'Ürün 3.2', link: '/products/3.2' },
            { id: 'i9', label: 'Ürün 3.3', link: '/products/3.3' }
          ]
        }
      ]
    },
    { 
      id: '3', 
      label: 'Hizmetler', 
      hasMegaMenu: true,
      sections: [
        {
          id: 's4',
          title: 'Kurumsal Hizmetler',
          items: [
            { id: 'i10', label: 'Danışmanlık', link: '/services/consulting' },
            { id: 'i11', label: 'Eğitim', link: '/services/training' },
            { id: 'i12', label: 'Destek', link: '/services/support' }
          ]
        },
        {
          id: 's5',
          title: 'Bireysel Hizmetler',
          items: [
            { id: 'i13', label: 'Teknik Servis', link: '/services/technical' },
            { id: 'i14', label: 'Montaj', link: '/services/installation' },
            { id: 'i15', label: 'Bakım', link: '/services/maintenance' }
          ]
        }
      ]
    },
    { 
      id: '4', 
      label: 'İletişim', 
      hasMegaMenu: false,
      link: '/contact' 
    }
  ]
};

// MegaMenu1 komponenti
const MegaMenu1: React.FC<MegaMenu1Props> = (props) => {
  // Varsayılan değerlerle birleştirme
  const { 
    logoText, 
    logoColor, 
    backgroundColor, 
    textColor, 
    dropdownBgColor,
    dropdownTitleColor,
    dropdownTextColor,
    fontSize,
    dropdownFontSize,
    menuItems 
  } = {
    ...defaultProps,
    ...props
  };

  // Açık mega menü için state
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  // Mobil menu açık/kapalı durumu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Nav üzerinde bir tıklama olduğunda dışarı tıklamaları takip etmek için ref
  const navRef = useRef<HTMLDivElement>(null);

  // Menü öğesine tıklama işleyicisi
  const handleMenuItemClick = (id: string, hasMegaMenu: boolean, link?: string) => {
    if (hasMegaMenu) {
      setActiveMegaMenu(activeMegaMenu === id ? null : id);
    } else if (link) {
      // Link varsa yönlendir - gerçek uygulamada bu window.location veya router ile yapılabilir
      console.log(`Navigating to: ${link}`);
    }
  };
  
  // Mobil menüyü aç/kapat
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (activeMegaMenu) {
      setActiveMegaMenu(null);
    }
  };
  
  // Dışarı tıklandığında menüyü kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMegaMenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <MenuContainer bgColor={backgroundColor}>
      <NavWrapper>
        <Logo color={logoColor}>{logoText}</Logo>
        <MobileMenuToggle onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </MobileMenuToggle>
      </NavWrapper>
      <Nav ref={navRef} isOpen={isMobileMenuOpen} theme={{ backgroundColor }}>
        {menuItems.map(item => (
          <React.Fragment key={item.id}>
            <NavItem 
              color={textColor}
              fontSize={fontSize}
              active={activeMegaMenu === item.id}
              onClick={() => handleMenuItemClick(item.id, item.hasMegaMenu, item.link)}
            >
              {item.label}
            </NavItem>
            {item.hasMegaMenu && item.sections && (
              <MegaMenuDropdown 
                dropdownBgColor={dropdownBgColor} 
                visible={activeMegaMenu === item.id}
              >
                {item.sections.map(section => (
                  <DropdownSection key={section.id}>
                    <SectionTitle color={dropdownTitleColor}>
                      {section.title}
                    </SectionTitle>
                    <SubItemsList>
                      {section.items.map(subItem => (
                        <SubItem key={subItem.id}>
                          <SubItemLink 
                            href={subItem.link}
                            color={dropdownTextColor}
                            fontSize={dropdownFontSize}
                          >
                            {subItem.label}
                          </SubItemLink>
                        </SubItem>
                      ))}
                    </SubItemsList>
                  </DropdownSection>
                ))}
              </MegaMenuDropdown>
            )}
          </React.Fragment>
        ))}
      </Nav>
    </MenuContainer>
  );
};

export default MegaMenu1; 