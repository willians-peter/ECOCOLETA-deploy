import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import {
  Container, Box, Typography, TextField, MenuItem, Select, FormControl,
  InputLabel, Card, CardContent, Button, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid
} from '@mui/material';

const materialIcons = {
  PLASTICO: '🧴', VIDRO: '🍶', PAPEL: '📄', METAL: '🥫'
};
const materialNames = {
  PLASTICO: 'plástico', VIDRO: 'vidro', PAPEL: 'papel', METAL: 'metal'
};

export default function SolicitacoesColetor() {
  const { usuario } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [filtroData, setFiltroData] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [validarModal, setValidarModal] = useState(null);
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [itensValidacao, setItensValidacao] = useState([]);

  const carregar = async () => {
    try {
      const params = {};
      if (filtroStatus) params.status = filtroStatus;
      if (filtroData) params.data = filtroData;
      const res = await api.get('/coletas/disponiveis', { params });
      setSolicitacoes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { carregar(); }, [filtroData, filtroStatus]);

  const coletar = async (id) => {
    try {
      await api.patch(`/coletas/${id}/aceitar`);
      carregar();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao coletar.');
    }
  };

  const abrirValidacao = (sol) => {
    setValidarModal(sol);
    setItensValidacao(sol.itens.map(i => ({
      itemId: i.id,
      quantidadeValidadaKg: i.quantidadeEstimadaKg,
      estado: i.estado
    })));
  };

  const finalizarColeta = async () => {
    try {
      await api.patch(`/coletas/${validarModal.id}/finalizar`, { itens: itensValidacao });
      setValidarModal(null);
      carregar();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao finalizar.');
    }
  };

  const abrirFeedback = (sol) => {
    setFeedbackModal(sol);
    setFeedbackText('');
  };

  const enviarFeedback = async () => {
    try {
      await api.patch(`/coletas/${feedbackModal.id}/feedback`, { feedback: feedbackText });
      setFeedbackModal(null);
      carregar();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao enviar feedback.');
    }
  };

  const statusColor = (status) => {
    const map = {
      AGUARDANDO: 'warning', ACEITA: 'info', COLETADA: 'primary',
      FINALIZADA: 'success', CANCELADA: 'error'
    };
    return map[status] || 'default';
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Bem vindo, Coletor {usuario?.nomeDeUsuario}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField type="date" label="Data" size="small"
            value={filtroData} onChange={(e) => setFiltroData(e.target.value)}
            InputLabelProps={{ shrink: true }} />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filtroStatus} label="Status" onChange={(e) => setFiltroStatus(e.target.value)}>
              <MenuItem value="">TODOS</MenuItem>
              <MenuItem value="AGUARDANDO">AGUARDANDO</MenuItem>
              <MenuItem value="COLETADA">COLETADO</MenuItem>
              <MenuItem value="FINALIZADA">FINALIZADO</MenuItem>
              <MenuItem value="CANCELADA">CANCELADO</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={2}>
          {solicitacoes.map((s) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={s.id}>
              <Card>
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
                    Data: {new Date(s.dataAgendada).toLocaleDateString('pt-BR')}
                  </Typography>

                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {s.status === 'AGUARDANDO' && (
                      <Button size="small" variant="contained" onClick={() => coletar(s.id)}
                        sx={{ bgcolor: '#ff9800', '&:hover': { bgcolor: '#f57c00' } }}>
                        Coletar
                      </Button>
                    )}
                    {s.status === 'COLETADA' && (
                      <>
                        <Button size="small" variant="outlined" onClick={() => abrirValidacao(s)}>
                          Validar
                        </Button>
                        <Button size="small" variant="outlined" color="secondary"
                          onClick={() => abrirFeedback(s)}>
                          Feedback
                        </Button>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {solicitacoes.length === 0 && (
          <Typography align="center" sx={{ mt: 4, color: 'text.secondary' }}>
            Nenhuma solicitação encontrada.
          </Typography>
        )}

        {/* Modal para Validar Coleta */}
        <Dialog open={!!validarModal} onClose={() => setValidarModal(null)} maxWidth="sm" fullWidth>
          <DialogTitle>Validar Coleta #{validarModal?.id}</DialogTitle>
          <DialogContent>
            {itensValidacao.map((item, idx) => {
              const original = validarModal?.itens.find(i => i.id === item.itemId);
              return (
                <Box key={idx} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                  <Typography fontWeight="bold">
                    {materialIcons[original?.tipo]} {materialNames[original?.tipo]}
                  </Typography>
                  <TextField label="Quantidade Validada (kg)" type="number" fullWidth size="small"
                    margin="dense" value={item.quantidadeValidadaKg}
                    onChange={(e) => {
                      const updated = [...itensValidacao];
                      updated[idx] = { ...updated[idx], quantidadeValidadaKg: parseFloat(e.target.value) };
                      setItensValidacao(updated);
                    }} />
                  <FormControl fullWidth size="small" margin="dense">
                    <InputLabel>Estado</InputLabel>
                    <Select value={item.estado} label="Estado"
                      onChange={(e) => {
                        const updated = [...itensValidacao];
                        updated[idx] = { ...updated[idx], estado: e.target.value };
                        setItensValidacao(updated);
                      }}>
                      <MenuItem value="RUIM">Ruim</MenuItem>
                      <MenuItem value="BOM">Bom</MenuItem>
                      <MenuItem value="OTIMO">Ótimo</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              );
            })}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setValidarModal(null)}>Cancelar</Button>
            <Button variant="contained" onClick={finalizarColeta}>Finalizar</Button>
          </DialogActions>
        </Dialog>

        {/* Modal para o Feedback */}
        <Dialog open={!!feedbackModal} onClose={() => setFeedbackModal(null)} maxWidth="sm" fullWidth>
          <DialogTitle>Feedback da Coleta #{feedbackModal?.id}</DialogTitle>
          <DialogContent>
            <TextField label="Feedback" multiline rows={4} fullWidth margin="normal"
              value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFeedbackModal(null)}>Cancelar</Button>
            <Button variant="contained" onClick={enviarFeedback}
              disabled={!feedbackText.trim()}>
              Enviar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
