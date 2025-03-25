import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { RegisterData } from '../../types/user';

// Stiller
const RegisterContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 24px;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.9rem;
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 10px;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
  color: #666;
`;

const LoginButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

interface RegisterPageProps {
  onLoginClick: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onLoginClick }) => {
  const { register, error, loading, clearError } = useAuth();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    passwordConfirm: '',
    companyName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      // Başarılı kayıt - yönlendirme App tarafında yapılacak
    } catch (err) {
      // Hata işleme AuthContext içinde yapılıyor
    }
  };

  return (
    <RegisterContainer>
      <Title>Ücretsiz Kayıt Ol</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="firstName">Ad</Label>
          <Input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Adınız"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="lastName">Soyad</Label>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Soyadınız"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="companyName">Firma Adı</Label>
          <Input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Firma Adınız"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">E-posta Adresi</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ornek@firma.com"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Şifre</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Şifreniz"
            minLength={6}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="passwordConfirm">Şifre Tekrar</Label>
          <Input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            placeholder="Şifrenizi tekrar girin"
            minLength={6}
            required
          />
        </FormGroup>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Kaydediliyor...' : 'Ücretsiz Kayıt Ol'}
        </Button>
      </Form>
      
      <LoginLink>
        Zaten hesabınız var mı?{' '}
        <LoginButton type="button" onClick={onLoginClick}>Giriş Yap</LoginButton>
      </LoginLink>
    </RegisterContainer>
  );
};

export default RegisterPage; 