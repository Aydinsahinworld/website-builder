import React from 'react';
import styled from 'styled-components';
import ComponentsListPanel from './ComponentsList';
import EditorCanvas from './EditorCanvas';
import { useSite } from '../../context/SiteContext';
import ComponentEditor from './ComponentEditor';
import { useAuth } from '../../context/AuthContext';

// Editör sayfasının ana container'ı
const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  width: 100%;
  background-color: #f9f9f9;
`;

// Üst kısım: Canvas ve komponent seçici
const TopSection = styled.div`
  display: flex;
  height: 60%;
  border-bottom: 1px solid #ddd;
`;

// Alt kısım: Düzenleme alanı
const BottomSection = styled.div`
  height: 40%;
  padding: 1rem;
  background-color: #f0f0f0;
  overflow-y: auto;
`;

// Canvas alanı
const CanvasSection = styled.div`
  flex: 2;
  border-right: 1px solid #ddd;
  background-color: white;
  overflow: auto;
`;

// Komponent seçici alanı
const ComponentPickerSection = styled.div`
  flex: 1;
  background-color: #f5f5f5;
  overflow-y: auto;
`;

// Editör alanı başlığı
const EditorTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Üst menü için stil
const TopBar = styled.div`
  height: 60px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserName = styled.span`
  font-size: 0.9rem;
  color: #ecf0f1;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

const NoSelectionMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #666;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
`;

// Editör sayfasının ana bileşeni
interface EditorPageProps {
  onBack: () => void;
}

const EditorPage: React.FC<EditorPageProps> = ({ onBack }) => {
  const { site, selectedComponentId, getSelectedComponent, saveSite } = useSite();
  const { user, logout } = useAuth();
  
  // Seçilen komponent
  const selectedComponent = getSelectedComponent();
  
  // Siteyi kaydet
  const handleSave = async () => {
    try {
      await saveSite();
      console.log('Site başarıyla kaydedildi');
      // Başarılı kayıt bildirimi gösterelim
      alert('Site başarıyla kaydedildi!');
    } catch (error) {
      console.error('Site kaydedilirken hata oluştu:', error);
      // Hata durumunda kullanıcıya bildirelim
      alert('Site kaydedilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };
  
  // Önizleme için yönlendirme
  const handlePreview = async () => {
    try {
      // Önce siteyi otomatik olarak kaydet
      await saveSite();
      
      // Site ID kontrolü - Kayıt işleminden sonra site ID'si mutlaka olmalı
      if (!site.id) {
        alert('Site kaydı tamamlanırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        return;
      }
      
      // Önizleme URL'si oluştur
      const previewUrl = `/preview?siteId=${site.id}`;
      
      // Yeni sekmede önizleme sayfasını aç
      window.open(previewUrl, '_blank');
      console.log('Önizleme açıldı:', previewUrl);
    } catch (error) {
      console.error('Önizleme açılırken hata oluştu:', error);
      alert('Önizleme açılırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };
  
  // Dışa aktarma işlemi
  const handleExport = () => {
    // Gerçek uygulamada dışa aktarma mantığı burada olacak
    alert('Dışa aktarma fonksiyonu henüz eklenmedi.');
  };

  // Çıkış işlemi - önce siteyi kaydet, sonra çıkış yap
  const handleLogout = async () => {
    try {
      // Önce siteyi kaydedelim
      await saveSite();
      console.log('Site kaydedildi, çıkış yapılıyor...');
      
      // Sonra çıkış yapalım
      logout();
      onBack();
    } catch (error) {
      console.error('Çıkış yaparken hata oluştu:', error);
      // Hata oluşsa bile çıkış yapalım
      logout();
      onBack();
    }
  };

  return (
    <div>
      <TopBar>
        <Logo>Website Builder</Logo>
        <UserInfo>
          <UserName>
            {user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : user?.companyName || user?.email}
          </UserName>
          <ActionButtons>
            <Button onClick={onBack}>Ana Sayfa</Button>
            <Button onClick={handlePreview}>Önizleme</Button>
            <Button onClick={handleSave}>Kaydet</Button>
            <Button onClick={handleExport}>Dışa Aktar</Button>
            <Button onClick={handleLogout}>Güvenli Çıkış</Button>
          </ActionButtons>
        </UserInfo>
      </TopBar>
      
      <EditorContainer>
        <TopSection>
          <CanvasSection>
            <EditorCanvas />
          </CanvasSection>
          <ComponentPickerSection>
            <ComponentsListPanel />
          </ComponentPickerSection>
        </TopSection>
        
        <BottomSection>
          <EditorTitle>
            Komponent Düzenleyici
            {selectedComponent && (
              <span>{selectedComponent.type} - {selectedComponent.id}</span>
            )}
          </EditorTitle>
          
          {selectedComponent ? (
            <ComponentEditor 
              component={selectedComponent}
            />
          ) : (
            <NoSelectionMessage>
              <p>Düzenlemek için canvas'tan bir komponent seçin.</p>
            </NoSelectionMessage>
          )}
        </BottomSection>
      </EditorContainer>
    </div>
  );
};

export default EditorPage; 