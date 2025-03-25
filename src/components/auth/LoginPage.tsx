import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

// Stiller
const LoginContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: white;
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
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border 0.3s;
  
  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  margin: 10px 0;
  text-align: center;
`;

const RegisterLink = styled.p`
  margin-top: 20px;
  text-align: center;
`;

const RegisterButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

interface LoginPageProps {
  onRegisterClick: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, error, loading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form doğrulama
    if (!email || !password) {
      setLocalError('Lütfen tüm alanları doldurun.');
      return;
    }
    
    setIsLoading(true);
    setLocalError('');
    
    try {
      // Doğru formatta login fonksiyonunu çağırıyoruz
      await login({ email, password });
      // Başarılı giriş - yönlendirme AuthContext tarafından işlenecek
    } catch (err) {
      setLocalError('Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol edin.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <Title>Giriş Yap</Title>
      
      {(localError || error) && <ErrorMessage>{localError || error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Şifre</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifreniz"
            required
          />
        </FormGroup>
        
        <Button type="submit" disabled={loading || isLoading}>
          {loading || isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </Button>
      </Form>
      
      <RegisterLink>
        Hesabınız yok mu?{' '}
        <RegisterButton type="button" onClick={onRegisterClick}>
          Kayıt Ol
        </RegisterButton>
      </RegisterLink>
    </LoginContainer>
  );
};

export default LoginPage; 