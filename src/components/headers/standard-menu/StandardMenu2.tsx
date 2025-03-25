import React, { useState } from 'react';
import styled from 'styled-components';

// StandardMenu2 komponenti için responsive stil tanımlamaları
const MenuContainer = styled.header<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  padding: 1.25rem 2.5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: hidden;
  
  @media (max-width: 992px) {
    padding: 1rem 1.5rem;
    justify-content: space-between;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${props => props.color};
  margin-right: 3rem;
  box-sizing: border-box;
  
  @media (max-width: 992px) {
    margin-right: 0;
    font-size: 1.5rem;
  }
`;

const Nav = styled.nav<{ isOpen: boolean }>`
  display: flex;
  gap: 1.875rem;
  box-sizing: border-box;
  max-width: 100%;
  
  @media (max-width: 992px) {
    gap: 1.25rem;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 1rem;
    display: ${props => props.isOpen ? 'flex' : 'none'};
  }
`;

const NavItem = styled.a<{ color: string; fontSize: string }>`
  color: ${props => props.color};
  text-decoration: none;
  font-size: ${props => props.fontSize};
  transition: all 0.3s;
  position: relative;
  box-sizing: border-box;
  white-space: nowrap;
  
  &:hover {
    color: #e74c3c;
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -5px;
    left: 0;
    background-color: #e74c3c;
    transition: width 0.3s;
  }
  
  &:hover:after {
    width: 100%;
  }
  
  @media (max-width: 992px) {
    font-size: calc(${props => props.fontSize} * 0.9);
  }
`;

const ContactButton = styled.a<{ bgColor: string; textColor: string }>`
  margin-left: auto;
  padding: 0.5rem 1.25rem;
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor};
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
  box-sizing: border-box;
  white-space: nowrap;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    margin-left: 0;
    align-self: flex-start;
    padding: 0.5rem 1rem;
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
    position: absolute;
    right: 1.5rem;
    top: 1.25rem;
  }
`;

// StandardMenu2 komponenti için props tanımı
export interface StandardMenu2Props {
  logoText: string;
  logoColor: string;
  backgroundColor: string;
  textColor: string;
  fontSize: string;
  buttonColor: string;
  buttonTextColor: string;
  showContactButton: boolean;
  contactButtonText: string;
  contactButtonLink: string;
  menuItems: Array<{
    id: string;
    label: string;
    link: string;
  }>;
}

// Varsayılan props değerleri
const defaultProps: StandardMenu2Props = {
  logoText: 'Logo',
  logoColor: '#333333',
  backgroundColor: '#ffffff',
  textColor: '#333333',
  fontSize: '16px',
  buttonColor: '#e74c3c',
  buttonTextColor: '#ffffff',
  showContactButton: true,
  contactButtonText: 'İletişim',
  contactButtonLink: '/contact',
  menuItems: [
    { id: '1', label: 'Ana Sayfa', link: '/' },
    { id: '2', label: 'Hakkımızda', link: '/about' },
    { id: '3', label: 'Hizmetler', link: '/services' },
    { id: '4', label: 'Ürünler', link: '/products' }
  ]
};

// StandardMenu2 komponenti
const StandardMenu2: React.FC<StandardMenu2Props> = (props) => {
  // Mobil menü durum kontrolü için state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Varsayılan değerlerle birleştirme
  const { 
    logoText, 
    logoColor, 
    backgroundColor, 
    textColor, 
    fontSize, 
    buttonColor,
    buttonTextColor,
    showContactButton,
    contactButtonText,
    contactButtonLink,
    menuItems 
  } = {
    ...defaultProps,
    ...props
  };

  // Mobil menü açma/kapama
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <MenuContainer bgColor={backgroundColor}>
      <Logo color={logoColor}>{logoText}</Logo>
      
      <MobileMenuToggle onClick={toggleMenu}>
        {isMenuOpen ? '✕' : '☰'}
      </MobileMenuToggle>
      
      <Nav isOpen={isMenuOpen}>
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
      
      {showContactButton && (
        <ContactButton 
          href={contactButtonLink}
          bgColor={buttonColor}
          textColor={buttonTextColor}
        >
          {contactButtonText}
        </ContactButton>
      )}
    </MenuContainer>
  );
};

export default StandardMenu2; 