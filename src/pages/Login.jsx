import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Alert, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [nomeDeUsuario, setNomeDeUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const user = await login(nomeDeUsuario, senha);
      if (user.perfil === 'RESIDENCIAL') {
        navigate('/minhas-solicitacoes');
      } else if (user.perfil === 'COLETOR') {
        navigate('/solicitacoes');
      }
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h4" align="center" sx={{ mb: 3, color: '#7b1fa2', fontWeight: 'bold' }}>
            Login
          </Typography>
          {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField label="Usuário" fullWidth margin="normal" value={nomeDeUsuario} onChange={(e) => setNomeDeUsuario(e.target.value)} required />
            <TextField label="Senha" type="password" fullWidth margin="normal" value={senha} onChange={(e) => setSenha(e.target.value)} required />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 2, bgcolor: '#7b1fa2', '&:hover': { bgcolor: '#6a1b9a' } }}>
              Logar
            </Button>
          </Box>
          <Typography align="center">
            <Link to="/criar-conta" style={{ color: '#7b1fa2' }}>
              Ainda não tem conta?
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}