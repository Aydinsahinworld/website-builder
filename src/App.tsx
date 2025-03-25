import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EditorPage from './components/editor/EditorPage';
import { SiteProvider } from './context/SiteContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import UserManagement from './components/auth/UserManagement';
import PreviewPage from './components/preview/PreviewPage';

// Ana container stil
const AppContainer = styled.div`
  font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
  height: 100vh;
  width: 100%;
`;

// Giriş sayfası stilleri
const HomePage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fa;
  text-align: center;
  padding: 20px;
`;

const HomeTitle = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 600px;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: #95a5a6;
  
  &:hover {
    background-color: #7f8c8d;
  }
`;

// Sayfa tiplerini tanımlama
type PageType = 'home' | 'auth' | 'editor';

// Ana sayfa bileşeni
const Home: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  
  // Sayfa yönlendirmeleri
  const goToAuth = () => setCurrentPage('auth');
  const goToEditor = () => {
    if (user) {
      setCurrentPage('editor');
    } else {
      setCurrentPage('auth');
    }
  };
  
  if (currentPage === 'auth') {
    return <Navigate to="/auth" />;
  }
  
  if (currentPage === 'editor') {
    return <Navigate to="/editor" />;
  }
  
  return (
    <HomePage>
      <HomeTitle>Website Builder</HomeTitle>
      <Description>
        Modern ve kullanımı kolay web sitesi oluşturma aracına hoş geldiniz.
        Sürükle-bırak arabirimini kullanarak dakikalar içinde profesyonel 
        web siteleri oluşturun, hiçbir kodlama bilgisi gerektirmez.
      </Description>
      <ButtonGroup>
        <Button onClick={goToEditor}>
          {user ? 'Editöre Git' : 'Yeni Site Oluştur'}
        </Button>
        {!user && (
          <SecondaryButton onClick={goToAuth}>
            Giriş Yap / Kayıt Ol
          </SecondaryButton>
        )}
      </ButtonGroup>
    </HomePage>
  );
};

// Yükleme sayfası
const LoadingPage: React.FC = () => (
  <HomePage>
    <HomeTitle>Yükleniyor...</HomeTitle>
  </HomePage>
);

// Korumalı route için wrapper
const ProtectedRoute: React.FC<{ 
  element: React.ReactNode
}> = ({ element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingPage />;
  }
  
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  return <>{element}</>;
};

// App içeriği - Router ile yapılandırılmış
const AppContent: React.FC = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return <LoadingPage />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<UserManagement />} />
      <Route 
        path="/editor" 
        element={
          <ProtectedRoute 
            element={
              <SiteProvider>
                <EditorPage onBack={() => <Navigate to="/" />} />
              </SiteProvider>
            } 
          />
        } 
      />
      <Route path="/preview" element={<PreviewPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

// Ana uygulama bileşeni
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContainer>
          <AppContent />
        </AppContainer>
      </AuthProvider>
    </Router>
  );
};

export default App;
