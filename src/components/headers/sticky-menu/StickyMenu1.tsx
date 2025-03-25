import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// StickyMenu1 için responsive stil tanımlamaları
const MenuWrapper = styled.div`
  width: 100%;
  position: relative;
  height: 4.375rem; // 70px'i rem cinsine çevirdik
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    height: 3.75rem;
  }
`;

interface MenuContainerProps {
  bgColor: string;
  isSticky: boolean;
  stickyBgColor: string;
}

const MenuContainer = styled.header<MenuContainerProps>`
  width: 100%;
  background-color: ${props => props.isSticky ? props.stickyBgColor : props.bgColor};
  padding: ${props => props.isSticky ? '0.625rem 1.875rem' : '0.9375rem 1.875rem'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  position: ${props => props.isSticky ? 'fixed' : 'absolute'};
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: ${props => props.isSticky ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'};
  box-sizing: border-box;
  max-width: 100vw;
  overflow-x: hidden;
  
  @media (max-width: 992px) {
    padding: ${props => props.isSticky ? '0.5rem 1.25rem' : '0.75rem 1.25rem'};
  }
  
  @media (max-width: 768px) {
    padding: ${props => props.isSticky ? '0.5rem 1rem' : '0.625rem 1rem'};
    flex-wrap: wrap;
  }
`;

interface LogoProps {
  color: string;
  isSticky: boolean;
  stickyColor: string;
}

const Logo = styled.div<LogoProps>`
  font-size: ${props => props.isSticky ? '1.3rem' : '1.5rem'};
  font-weight: bold;
  color: ${props => props.isSticky ? props.stickyColor : props.color};
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    font-size: ${props => props.isSticky ? '1.1rem' : '1.3rem'};
  }
`;

const Nav = styled.nav<{ isMenuOpen: boolean }>`
  display: flex;
  gap: 1.25rem;
  box-sizing: border-box;
  max-width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
    padding-top: ${props => props.isMenuOpen ? '0.75rem' : '0'};
    max-height: ${props => props.isMenuOpen ? '300px' : '0'};
    overflow: hidden;
    transition: all 0.3s ease;
    visibility: ${props => props.isMenuOpen ? 'visible' : 'hidden'};
    opacity: ${props => props.isMenuOpen ? '1' : '0'};
    margin-top: ${props => props.isMenuOpen ? '0.75rem' : '0'};
  }
`;

interface NavItemProps {
  color: string;
  fontSize: string;
  isSticky: boolean;
  stickyColor: string;
  stickyFontSize: string;
}

const NavItem = styled.a<NavItemProps>`
  color: ${props => props.isSticky ? props.stickyColor : props.color};
  text-decoration: none;
  font-size: ${props => props.isSticky ? props.stickyFontSize : props.fontSize};
  transition: all 0.3s ease;
  box-sizing: border-box;
  white-space: nowrap;
  
  &:hover {
    color: #3498db;
  }
  
  @media (max-width: 992px) {
    font-size: calc(${props => props.isSticky ? props.stickyFontSize : props.fontSize} * 0.9);
  }
  
  @media (max-width: 768px) {
    display: block;
    padding: 0.5rem 0;
  }
`;

const MobileMenuToggle = styled.button<{ isSticky: boolean; color: string; stickyColor: string }>`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${props => props.isSticky ? props.stickyColor : props.color};
  transition: color 0.3s ease;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

// StickyMenu1 komponenti için props tanımı
export interface StickyMenu1Props {
  logoText: string;
  logoColor: string;
  stickyLogoColor: string;
  backgroundColor: string;
  stickyBackgroundColor: string;
  textColor: string;
  stickyTextColor: string;
  fontSize: string;
  stickyFontSize: string;
  scrollThreshold: number;
  menuItems: Array<{
    id: string;
    label: string;
    link: string;
  }>;
}

// Varsayılan props değerleri
const defaultProps: StickyMenu1Props = {
  logoText: 'Logo',
  logoColor: '#ffffff',
  stickyLogoColor: '#333333',
  backgroundColor: 'transparent',
  stickyBackgroundColor: '#ffffff',
  textColor: '#ffffff',
  stickyTextColor: '#333333',
  fontSize: '16px',
  stickyFontSize: '14px',
  scrollThreshold: 100,
  menuItems: [
    { id: '1', label: 'Ana Sayfa', link: '/' },
    { id: '2', label: 'Hakkımızda', link: '/about' },
    { id: '3', label: 'Hizmetler', link: '/services' },
    { id: '4', label: 'İletişim', link: '/contact' }
  ]
};

// StickyMenu1 komponenti
const StickyMenu1: React.FC<StickyMenu1Props> = (props) => {
  // Varsayılan değerlerle birleştirme
  const { 
    logoText, 
    logoColor,
    stickyLogoColor,
    backgroundColor, 
    stickyBackgroundColor,
    textColor, 
    stickyTextColor,
    fontSize,
    stickyFontSize,
    scrollThreshold,
    menuItems 
  } = {
    ...defaultProps,
    ...props
  };

  // Menünün yapışkan durumunu kontrol etmek için state
  const [isSticky, setIsSticky] = useState(false);
  // Mobil menü açık/kapalı durumu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll eventini dinleyerek yapışkan durumu güncelleme
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Component unmount edildiğinde cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollThreshold]);

  // Mobil menüyü aç/kapat
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <MenuWrapper>
      <MenuContainer 
        bgColor={backgroundColor}
        stickyBgColor={stickyBackgroundColor}
        isSticky={isSticky}
      >
        <Logo 
          color={logoColor}
          stickyColor={stickyLogoColor}
          isSticky={isSticky}
        >
          {logoText}
        </Logo>
        
        <MobileMenuToggle 
          onClick={toggleMenu}
          isSticky={isSticky}
          color={textColor}
          stickyColor={stickyTextColor}
        >
          {isMenuOpen ? '✕' : '☰'}
        </MobileMenuToggle>
        
        <Nav isMenuOpen={isMenuOpen}>
          {menuItems.map(item => (
            <NavItem 
              key={item.id} 
              href={item.link} 
              color={textColor}
              stickyColor={stickyTextColor}
              fontSize={fontSize}
              stickyFontSize={stickyFontSize}
              isSticky={isSticky}
            >
              {item.label}
            </NavItem>
          ))}
        </Nav>
      </MenuContainer>
    </MenuWrapper>
  );
};

export default StickyMenu1; 