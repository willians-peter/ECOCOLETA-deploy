import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Container, Box, Typography, Button, Card, CardContent, Chip, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FeedbackIcon from '@mui/icons-material/RateReview';
import CloseIcon from '@mui/icons-material/Close';

const materialIconsMap = {
  PLASTICO: '🧴',
  VIDRO: '🍶',
  PAPEL: '📄',
  METAL: '🥫'
};

const materialNamesMap = {
  PLASTICO: 'plástico',
  VIDRO: 'vidro',
  PAPEL: 'papel',
  METAL: 'metal'
};

function relativeDays(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const diff = Math.round((date - today) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `Daqui ${diff} dia${diff > 1 ? 's' : ''}`;
  if (diff < 0) return `Há ${Math.abs(diff)} dia${Math.abs(diff) > 1 ? 's' : ''}`;
  return 'Hoje';
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function MinhasSolicitacoes() {
  const [requests, setRequests] = useState([]);
  const [feedbackDialog, setFeedbackDialog] = useState(null);
  const navigate = useNavigate();

  const loadRequests = async () => {
    try {
      const res = await api.get('/coletas/minhas');
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const cancelRequest = async (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta solicitação?')) return;
    try {
      await api.patch(`/coletas/${id}/cancelar`);
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao cancelar.');
    }
  };

  const statusColorMap = {
    AGUARDANDO: 'warning',
    ACEITA: 'info',
    COLETADA: 'primary',
    FINALIZADA: 'success',
    CANCELADA: 'error'
  };

return (
  <>
    <Navbar />
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Minhas Solicitações</Typography>
        <Button variant="contained" onClick={() => navigate('/nova-solicitacao')} sx={{ bgcolor: '#e65100', '&:hover': { bgcolor: '#d84315' } }}>
          Novo
        </Button>
      </Box>
      <Grid container spacing={2}>
        {requests.map((s) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={s.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" fontWeight="bold">#{s.id}</Typography>
                  <Chip label={s.status} color={statusColorMap[s.status]} size="small" />
                </Box>
                {s.items.map((item, idx) => (
                  <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                    {materialIconsMap[item.type]} {item.estimatedQuantityKg} kg de {materialNamesMap[item.type]}
                  </Typography>
                ))}
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  {s.status === 'COLETADA' || s.status === 'FINALIZADA' ? `Coletado em ${formatDate(s.scheduledDate)}` : `Agendado para ${formatDate(s.scheduledDate)}`}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {relativeDays(s.scheduledDate)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  {s.status === 'AGUARDANDO' && (
                    <>
                      <Button size="small" variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => cancelRequest(s.id)}>
                        Cancelar
                      </Button>
                      <Button size="small" variant="contained" startIcon={<EditIcon />} sx={{ bgcolor: '#424242', '&:hover': { bgcolor: '#333' } }} onClick={() => navigate(`/editar-solicitacao/${s.id}`)}>
                        Editar
                      </Button>
                    </>
                  )}
                  {(s.status === 'COLETADA' || s.status === 'FINALIZADA') && s.feedback && (
                    <Button size="small" variant="outlined" startIcon={<FeedbackIcon />} onClick={() => setFeedbackDialog(s)}>
                      Feedback do coletor
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {requests.length === 0 && (
        <Typography align="center" sx={{ mt: 4, color: 'text.secondary' }}>
          Nenhuma solicitação encontrada. Clique em "Novo" para criar uma.
        </Typography>
      )}
      <Dialog open={!!feedbackDialog} onClose={() => setFeedbackDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          #{feedbackDialog?.id}
          <IconButton onClick={() => setFeedbackDialog(null)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography>{feedbackDialog?.feedback}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  </>
);
}