import React from 'react';
import styled from 'styled-components';

// StandardMenu1 komponenti için responsive stil tanımlamaları
const MenuContainer = styled.header<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  padding: 1rem 2rem; // Piksel yerine rem kullanıldı
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: hidden;
  
  // Mobil görünüm için esnek düzen
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.color};
  box-sizing: border-box;
  
  // Küçük ekranlar için font boyutu
  @media (max-width: 576px) {
    font-size: 1.2rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.25rem; // Piksel yerine rem kullanıldı
  flex-wrap: wrap; // Küçük ekranlarda sarmalama
  justify-content: center;
  box-sizing: border-box;
  max-width: 100%;
  
  // Tablet görünüm için
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-around;
  }
  
  // Mobil görünüm için
  @media (max-width: 576px) {
    gap: 0.75rem;
  }
`;

const NavItem = styled.a<{ color: string; fontSize: string }>`
  color: ${props => props.color};
  text-decoration: none;
  font-size: ${props => props.fontSize};
  transition: color 0.3s;
  padding: 0.5rem;
  box-sizing: border-box;
  white-space: nowrap; // Öğelerin bütün olarak satıra sığmasını sağlar
  
  &:hover {
    color: #3498db;
  }
  
  // Tablet ve mobil görünüm için font boyutu ölçeklendirme
  @media (max-width: 768px) {
    font-size: calc(${props => props.fontSize} * 0.9);
  }
  
  @media (max-width: 576px) {
    font-size: calc(${props => props.fontSize} * 0.8);
    padding: 0.25rem;
  }
`;

// StandardMenu1 komponenti için props tanımı
export interface StandardMenu1Props {
  logoText: string;
  logoColor: string;
  backgroundColor: string;
  textColor: string;
  fontSize: string;
  menuItems: Array<{
    id: string;
    label: string;
    link: string;
  }>;
}

// Varsayılan props değerleri
const defaultProps: StandardMenu1Props = {
  logoText: 'Logo',
  logoColor: '#333333',
  backgroundColor: '#ffffff',
  textColor: '#333333',
  fontSize: '16px',
  menuItems: [
    { id: '1', label: 'Ana Sayfa', link: '/' },
    { id: '2', label: 'Hakkımızda', link: '/about' },
    { id: '3', label: 'Hizmetler', link: '/services' },
    { id: '4', label: 'İletişim', link: '/contact' }
  ]
};

// StandardMenu1 komponenti
const StandardMenu1: React.FC<StandardMenu1Props> = (props) => {
  // Varsayılan değerlerle birleştirme
  const { logoText, logoColor, backgroundColor, textColor, fontSize, menuItems } = {
    ...defaultProps,
    ...props
  };

  return (
    <MenuContainer bgColor={backgroundColor}>
      <Logo color={logoColor}>{logoText}</Logo>
      <Nav>
        {menuItems.map(item => (
          <NavItem 
            key={item.id} 
            href={item.link} 
            color={textColor}
            fontSize={fontSize}
          >
            {item.label}
          </NavItem>
        ))}
      </Nav>
    </MenuContainer>
  );
};

export default StandardMenu1; 