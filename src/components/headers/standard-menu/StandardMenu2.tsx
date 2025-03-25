import React from 'react';
import styled from 'styled-components';

// StandardMenu2 komponenti için stil tanımlamaları
const MenuContainer = styled.header<{ bgColor: string }>`
  background-color: ${props => props.bgColor};
  padding: 20px 40px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${props => props.color};
  margin-right: 50px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 30px;
`;

const NavItem = styled.a<{ color: string; fontSize: string }>`
  color: ${props => props.color};
  text-decoration: none;
  font-size: ${props => props.fontSize};
  transition: all 0.3s;
  position: relative;
  
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
`;

const ContactButton = styled.a<{ bgColor: string; textColor: string }>`
  margin-left: auto;
  padding: 8px 20px;
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor};
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
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