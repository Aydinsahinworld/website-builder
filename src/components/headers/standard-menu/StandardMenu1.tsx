import React from 'react';
import styled from 'styled-components';

// StandardMenu1 komponenti için stil tanımlamaları
const MenuContainer = styled.header<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.color};
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavItem = styled.a<{ color: string; fontSize: string }>`
  color: ${props => props.color};
  text-decoration: none;
  font-size: ${props => props.fontSize};
  transition: color 0.3s;
  
  &:hover {
    color: #3498db;
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