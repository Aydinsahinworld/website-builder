import React, { useState } from 'react';
import styled from 'styled-components';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

// Container stil
const UserManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
`;

// Tab stilleri
const TabContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 12px;
  background-color: ${props => props.active ? '#3498db' : '#e0e0e0'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: ${props => props.active ? '8px 8px 0 0' : '0'};
  
  &:first-child {
    border-radius: ${props => props.active ? '8px 0 0 0' : '0'};
  }
  
  &:last-child {
    border-radius: ${props => props.active ? '0 8px 0 0' : '0'};
  }
  
  &:hover {
    background-color: ${props => props.active ? '#2980b9' : '#d0d0d0'};
  }
`;

// Kullanıcı yönetimi sayfası
const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const switchToLogin = () => setActiveTab('login');
  const switchToRegister = () => setActiveTab('register');

  return (
    <UserManagementContainer>
      <TabContainer>
        <Tab 
          active={activeTab === 'login'} 
          onClick={switchToLogin}
        >
          Giriş Yap
        </Tab>
        <Tab 
          active={activeTab === 'register'} 
          onClick={switchToRegister}
        >
          Kayıt Ol
        </Tab>
      </TabContainer>
      
      {activeTab === 'login' ? (
        <LoginPage onRegisterClick={switchToRegister} />
      ) : (
        <RegisterPage onLoginClick={switchToLogin} />
      )}
    </UserManagementContainer>
  );
};

export default UserManagement; 