import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Container, Box, Typography, Button, Card, CardContent, Chip, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FeedbackIcon from '@mui/icons-material/RateReview';
import CloseIcon from '@mui/icons-material/Close';

const materialIcons = {
  PLASTICO: '🧴',
  VIDRO: '🍶',
  PAPEL: '📄',
  METAL: '🥫'
};

const materialNames = {
  PLASTICO: 'plástico',
  VIDRO: 'vidro',
  PAPEL: 'papel',
  METAL: 'metal'
};

function diasRelativo(dataStr) {
  const data = new Date(dataStr);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  data.setHours(0, 0, 0, 0);
  const diff = Math.round((data - hoje) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `Daqui ${diff} dia${diff > 1 ? 's' : ''}`;
  if (diff < 0) return `Há ${Math.abs(diff)} dia${Math.abs(diff) > 1 ? 's' : ''}`;
  return 'Hoje';
}

function formatarData(dataStr) {
  const data = new Date(dataStr);
  return data.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function MinhasSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const navigate = useNavigate();

  const carregar = () => {
    const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
    setSolicitacoes(solicitacoes);
  };

  useEffect(() => {
    carregar();
  }, []);

  const cancelar = (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar esta solicitação?')) return;
    const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
    const index = solicitacoes.findIndex(s => s.id === id);
    if (index !== -1) {
      solicitacoes.splice(index, 1);
      localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
      carregar();
    }
  };

  const statusColor = (status) => {
    const map = { AGUARDANDO: 'warning', ACEITA: 'info', COLETADA: 'primary', FINALIZADA: 'success', CANCELADA: 'error' };
    return map[status] || 'default';
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" fontWeight="bold">Minhas Solicitações</Typography>
          <Button variant="contained" onClick={() => navigate('/nova-solicitacao')}
            sx={{ bgcolor: '#e65100', '&:hover': { bgcolor: '#d84315' } }}>
            Novo
          </Button>
        </Box>

        <Grid container spacing={2}>
          {solicitacoes.map((s) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={s.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">#{s.id}</Typography>
                    <Chip label={s.status} color={statusColor(s.status)} size="small" />
                  </Box>

                  {s.itens.map((item, idx) => (
                    <Typography key={idx} variant="body2" sx={{ mb: 0.5 }}>
                      {materialIcons[item.tipo]} {item.quantidadeEstimadaKg} kg de {materialNames[item.tipo]}
                    </Typography>
                  ))}

                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    {s.status === 'COLETADA' || s.status === 'FINALIZADA'
                      ? `Coletado em ${formatarData(s.dataAgendada)}`
                      : `Agendado para ${formatarData(s.dataAgendada)}`
                    }
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {diasRelativo(s.dataAgendada)}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                    {s.status === 'AGUARDANDO' && (
                      <>
                        <Button size="small" variant="contained" color="error"
                          startIcon={<DeleteIcon />} onClick={() => cancelar(s.id)}>
                          Cancelar
                        </Button>
                        <Button size="small" variant="contained"
                          startIcon={<EditIcon />}
                          sx={{ bgcolor: '#424242', '&:hover': { bgcolor: '#333' } }}
                          onClick={() => navigate(`/editar-solicitacao/${s.id}`)}>
                          Editar
                        </Button>
                      </>
                    )}
                    {(s.status === 'COLETADA' || s.status === 'FINALIZADA') && s.feedback && (
                      <Button size="small" variant="outlined" startIcon={<FeedbackIcon />}
                        onClick={() => setFeedbackModal(s)}>
                        Feedback do coletor
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {solicitacoes.length === 0 && (
          <Typography align="center" sx={{ mt: 4, color: 'text.secondary' }}>
            Nenhuma solicitação encontrada. Clique em "Novo" para criar uma.
          </Typography>
        )}

        <Dialog open={!!feedbackModal} onClose={() => setFeedbackModal(null)} maxWidth="sm" fullWidth>
          <DialogTitle>
            #{feedbackModal?.id}
            <IconButton onClick={() => setFeedbackModal(null)}
              sx={{ position: 'absolute', right: 8, top: 8 }}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography>{feedbackModal?.feedback}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFeedbackModal(null)}>Fechar</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
