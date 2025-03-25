import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SitePreview from './SitePreview';
import { SiteData, emptySiteData } from '../../types';
import styled from 'styled-components';

// LocalStorage'dan siteleri almak için yardımcı fonksiyon
const getSiteFromStorage = (siteId: string): SiteData | null => {
  try {
    const sitesJson = localStorage.getItem('website_builder_sites');
    if (!sitesJson) return null;
    
    const sites = JSON.parse(sitesJson);
    return sites[siteId] || null;
  } catch (error) {
    console.error('Site yüklenirken hata:', error);
    return null;
  }
};

// Yükleme göstergesi için stil
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: #f8f9fa;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: #fff5f5;
  color: #e53e3e;
  text-align: center;
  padding: 20px;
`;

// PreviewPage bileşeni
const PreviewPage: React.FC = () => {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // URL'den site ID'sini al
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const siteId = queryParams.get('siteId');
  
  useEffect(() => {
    const loadSite = async () => {
      try {
        setLoading(true);
        
        if (!siteId) {
          setError('Site ID belirtilmedi');
          setLoading(false);
          return;
        }
        
        // Site verilerini localStorage'dan al
        const site = getSiteFromStorage(siteId);
        
        if (!site) {
          setError(`Site bulunamadı (ID: ${siteId})`);
          setLoading(false);
          return;
        }
        
        setSiteData(site);
        setLoading(false);
      } catch (err) {
        console.error('Önizleme sayfası yüklenirken hata:', err);
        setError('Site yüklenirken bir hata oluştu');
        setLoading(false);
      }
    };
    
    loadSite();
  }, [siteId]);
  
  // Yükleniyor durumu
  if (loading) {
    return (
      <LoadingContainer>
        <h2>Site Yükleniyor...</h2>
        <p>Lütfen bekleyin.</p>
      </LoadingContainer>
    );
  }
  
  // Hata durumu
  if (error || !siteData) {
    return (
      <ErrorContainer>
        <h2>Hata</h2>
        <p>{error || 'Bilinmeyen bir hata oluştu'}</p>
        <p>Lütfen daha sonra tekrar deneyin.</p>
      </ErrorContainer>
    );
  }
  
  // Site önizlemesi
  return <SitePreview siteData={siteData} />;
};

export default PreviewPage; 