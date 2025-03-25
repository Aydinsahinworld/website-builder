import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// StickyMenu1 için stil tanımlamaları
const MenuWrapper = styled.div`
  width: 100%;
  position: relative;
  height: 70px;
`;

interface MenuContainerProps {
  bgColor: string;
  isSticky: boolean;
  stickyBgColor: string;
}

const MenuContainer = styled.header<MenuContainerProps>`
  width: 100%;
  background-color: ${props => props.isSticky ? props.stickyBgColor : props.bgColor};
  padding: ${props => props.isSticky ? '10px 30px' : '15px 30px'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  position: ${props => props.isSticky ? 'fixed' : 'absolute'};
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: ${props => props.isSticky ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'};
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
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
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
  
  &:hover {
    color: #3498db;
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
        <Nav>
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