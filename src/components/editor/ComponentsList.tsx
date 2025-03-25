import React, { useState } from 'react';
import styled from 'styled-components';
import { useSite } from '../../context/SiteContext';
import { headerComponentsData } from '../headers/HeaderComponents';

// Bileşen listesi container'ının stilleri
const ComponentsContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  padding: 1rem;
  overflow-y: auto;
`;

const ComponentsTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #333;
`;

// Kategori başlığı stil - tıklanabilir hale getirildi
const CategoryTitle = styled.div`
  margin: 1rem 0 0.5rem;
  font-size: 1rem;
  color: #555;
  border-bottom: 1px solid #ddd;
  padding: 8px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  
  &:hover {
    color: #2980b9;
  }
`;

// Açılma/kapanma ikonu
const ToggleIcon = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
  transition: transform 0.3s ease;
`;

// Komponent listesi stil
const ComponentsList = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'flex' : 'none'};
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
  overflow: hidden;
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  transition: max-height 0.3s ease;
`;

// Komponent öğesi stil
const ComponentItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e9f5ff;
    border-color: #3498db;
  }
`;

const ComponentName = styled.span`
  font-size: 0.9rem;
`;

const ComponentDescription = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: 3px;
`;

// Komponent için thumbnail stil
const ComponentThumbnail = styled.div`
  width: 50px;
  height: 40px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: #777;
`;

// Ana kategori grup stil
const CategoryGroup = styled.div`
  margin-bottom: 10px;
`;

// Grup başlığı stil
const GroupTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background-color: #d0d0d0;
  }
`;

const GroupIcon = styled.span`
  margin-right: 10px;
  font-weight: bold;
  transition: transform 0.3s ease;
`;

const GroupName = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
`;

const SubCategories = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  padding-left: 1rem;
  overflow: hidden;
  max-height: ${props => props.isOpen ? '2000px' : '0'};
  transition: max-height 0.3s ease;
`;

// Kategori grubu
interface CategoryGroupProps {
  title: string;
  children: React.ReactNode;
}

const CategoryGroupComponent: React.FC<CategoryGroupProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <CategoryGroup>
      <GroupTitle onClick={() => setIsOpen(!isOpen)}>
        <GroupIcon style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</GroupIcon>
        <GroupName>{title}</GroupName>
      </GroupTitle>
      <SubCategories isOpen={isOpen}>
        {children}
      </SubCategories>
    </CategoryGroup>
  );
};

// Tek bir kategori
interface CategoryProps {
  title: string;
  children: React.ReactNode;
}

const Category: React.FC<CategoryProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <CategoryTitle onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <ToggleIcon style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</ToggleIcon>
      </CategoryTitle>
      <ComponentsList isOpen={isOpen}>
        {children}
      </ComponentsList>
    </div>
  );
};

// Tek bir komponent öğesi
interface ComponentProps {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  type: string;
  onClick: () => void;
}

const Component: React.FC<ComponentProps> = ({ 
  id, 
  name, 
  description, 
  thumbnail, 
  type, 
  onClick 
}) => {
  return (
    <ComponentItem onClick={onClick}>
      <ComponentThumbnail>{type[0].toUpperCase()}</ComponentThumbnail>
      <div>
        <ComponentName>{name}</ComponentName>
        <ComponentDescription>{description}</ComponentDescription>
      </div>
    </ComponentItem>
  );
};

// Bileşen listesi komponentinin tanımı
const ComponentsListPanel: React.FC = () => {
  const { addComponent } = useSite();

  // Komponent eklemek için fonksiyon
  const handleAddComponent = (type: string, name: string) => {
    console.log(`Komponent ekleniyor: ${type} - ${name}`);
    // Varsayılan props ile 'header' kategorisindeki bir komponenti ekle
    addComponent(type, 'header');
  };

  return (
    <ComponentsContainer>
      <ComponentsTitle>Site Komponentleri</ComponentsTitle>
      
      <CategoryGroupComponent title="Üst Menü">
        {headerComponentsData.categories.map(category => (
          <Category key={category.id} title={category.name}>
            {category.components.map(component => (
              <Component 
                key={component.id}
                id={component.id}
                name={component.name}
                description={component.description}
                thumbnail={component.thumbnail}
                type={component.type}
                onClick={() => handleAddComponent(component.type, component.name)}
              />
            ))}
          </Category>
        ))}
      </CategoryGroupComponent>
      
      {/* Slider/Banner bölümünü içerik bölümünden önceye taşıyorum */}
      <CategoryGroupComponent title="Slider/Banner">
        <p style={{ padding: '10px', color: '#666', fontStyle: 'italic' }}>Slider/Banner komponentleri henüz eklenmedi</p>
      </CategoryGroupComponent>
      
      {/* İçerik bölümü artık Slider/Banner'dan sonra geliyor */}
      <CategoryGroupComponent title="İçerik Bölümleri">
        <p style={{ padding: '10px', color: '#666', fontStyle: 'italic' }}>İçerik bölümleri henüz eklenmedi</p>
      </CategoryGroupComponent>
      
      <CategoryGroupComponent title="Galeri/Portfolyo">
        <p style={{ padding: '10px', color: '#666', fontStyle: 'italic' }}>Galeri/Portfolyo komponentleri henüz eklenmedi</p>
      </CategoryGroupComponent>
      
      <CategoryGroupComponent title="Alt Menü">
        <p style={{ padding: '10px', color: '#666', fontStyle: 'italic' }}>Alt menü komponentleri henüz eklenmedi</p>
      </CategoryGroupComponent>
    </ComponentsContainer>
  );
};

export default ComponentsListPanel; 