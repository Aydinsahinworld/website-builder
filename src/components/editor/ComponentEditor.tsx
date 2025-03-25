import React, { useState } from 'react';
import styled from 'styled-components';
import { useSite } from '../../context/SiteContext';
import { ComponentData } from '../../types';
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

// Component Editor bileşeni
interface ComponentEditorProps {
  component: ComponentData;
}

const ComponentEditor: React.FC<ComponentEditorProps> = ({ component }) => {
  const { updateComponent } = useSite();
  const [logoType, setLogoType] = useState<'text' | 'image'>('text');
  
  const handleLogoTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLogoType = e.target.value as 'text' | 'image';
    setLogoType(newLogoType);
    
    // Burada komponentteki logoType değerini de güncelliyoruz
    const updatedProps = {
      ...component.props,
      logoType: newLogoType
    };
    
    updateComponent(component.id, {
      ...component,
      props: updatedProps
    });
  };
  
  return (
    <EditorContainer>
      <FormGroup>
        <Label>Logo Türü:</Label>
        <CompactSelect 
          value={logoType} 
          onChange={handleLogoTypeChange}
        >
          <option value="text">Yazı Logo</option>
          <option value="image">Resim Logo</option>
        </CompactSelect>
      </FormGroup>
    </EditorContainer>
  );
};

export default ComponentEditor; 