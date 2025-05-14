import React, { useState } from 'react';
import { Button, Container, Paper, TextField, Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        identifier,
        password
      });

      const { access_token } = response.data;

      // Save token to AuthContext and redirect
      login(access_token);
      console.log('Login successful:', access_token);

      const decoded = JSON.parse(atob(access_token.split('.')[1]));
      console.log('Decoded JWT:', decoded);
      if (decoded.role === 'admin') {
        console.log('Admin login successful');
        navigate('/admin');
      } else {
        console.log('User login successful');
        navigate('/user');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ mt: 8, p: 4 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username or Email"
            fullWidth
            margin="normal"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
