import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../lib/auth';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();  // Agora pegamos o "user" do auth
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Novo campo para o nome
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/');  // Se o usuário estiver logado, redireciona para a página principal
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isSignUp) {
        await signUp(email, password, name);  // Passa o nome durante o cadastro
        setError('Check your email for verification link');
      } else {
        await signIn(email, password);
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          mx: 2,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
          {isSignUp
            ? 'Sign up to start managing your MySQL databases'
            : 'Sign in to your account to continue'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {isSignUp && (
              <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />
            )}
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
              fullWidth
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </Stack>
        </form>

        <Divider sx={{ my: 3 }} />

        <Typography align="center" variant="body2">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <Button
            variant="text"
            onClick={() => setIsSignUp(!isSignUp)}
            sx={{ textTransform: 'none' }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Button>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Auth;
