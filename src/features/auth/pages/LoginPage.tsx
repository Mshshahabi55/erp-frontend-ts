import { useState } from 'react';
import { Box, Container } from '@mui/material';
import { LoginForm } from '../components/LoginForm/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { LoginFormData } from '../types/auth.schema';
import { getErrorMessage } from '@/shared/utils/getErrorMessage';

export const LoginPage = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      await login(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
      </Box>
    </Container>
  );
};

export default LoginPage;