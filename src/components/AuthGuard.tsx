import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '../lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const {  loading, setUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Tenta recuperar o usuário do localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // Se existir um usuário no localStorage, setamos ele no estado
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  // Se estiver carregando, mostra o spinner
  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Se o usuário não estiver logado, redireciona para a página de login
  if (!localStorage.getItem('user')) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Se tudo estiver certo, renderiza o conteúdo protegido
  return <>{children}</>;
};

export default AuthGuard;
