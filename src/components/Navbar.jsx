import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!usuario) return null;

  return (
    <AppBar position="static" sx={{ bgcolor: '#fff', color: '#333', boxShadow: 1 }}>
      <Toolbar>
        {usuario.perfil === 'RESIDENCIAL' && (
          <Button color="inherit" onClick={() => navigate('/minhas-solicitacoes')}
            sx={{ fontWeight: 'bold', color: '#7b1fa2' }}>
            Minhas solicitações
          </Button>
        )}
        {usuario.perfil === 'COLETOR' && (
          <Button color="inherit" onClick={() => navigate('/solicitacoes')}
            sx={{ fontWeight: 'bold', color: '#7b1fa2' }}>
            Solicitações
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" onClick={handleLogout}
          sx={{ fontWeight: 'bold', color: '#7b1fa2' }}>
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
}
