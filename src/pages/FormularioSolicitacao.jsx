import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Container, Box, Typography, TextField, Button, Paper, IconButton, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const materiaisConfig = [
  { tipo: 'PLASTICO', label: 'Plástico', icon: '🧴' },
  { tipo: 'VIDRO', label: 'Vidro', icon: '🍶' },
  { tipo: 'PAPEL', label: 'Papel', icon: '📄' },
  { tipo: 'METAL', label: 'Metal', icon: '🥫' },
];

export default function FormularioSolicitacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdicao = !!id;
  const [materiais, setMateriais] = useState(
    materiaisConfig.map(m => ({ tipo: m.tipo, quantidade: 1, estado: 'BOM' }))
  );
  const [dataAgendada, setDataAgendada] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (isEdicao) {
      carregarSolicitacao();
    }
  }, [id]);

  const carregarSolicitacao = () => {
    const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
    const sol = solicitacoes.find(s => s.id === parseInt(id));
    if (sol) {
      setDataAgendada(sol.dataAgendada);
      setObservacoes(sol.observacoes || '');
      const mat = materiaisConfig.map(mc => {
        const item = sol.itens.find(i => i.tipo === mc.tipo);
        return { tipo: mc.tipo, quantidade: item ? parseFloat(item.quantidadeEstimadaKg) : 1, estado: item ? item.estado : 'BOM' };
      });
      setMateriais(mat);
    }
  };

  const updateMaterial = (idx, field, value) => {
    const updated = [...materiais];
    updated[idx] = { ...updated[idx], [field]: value };
    setMateriais(updated);
  };

  const adjustQty = (idx, delta) => {
    const updated = [...materiais];
    const newVal = Math.max(1, updated[idx].quantidade + delta);
    updated[idx] = { ...updated[idx], quantidade: newVal };
    setMateriais(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');
    if (!dataAgendada) {
      setErro('Data agendada é obrigatória.');
      return;
    }
    const itens = materiais
      .filter(m => m.quantidade > 0)
      .map(m => ({ tipo: m.tipo, quantidadeEstimadaKg: m.quantidade, estado: m.estado }));
    if (itens.length === 0) {
      setErro('Selecione pelo menos um material.');
      return;
    }
    try {
      const payload = { id: isEdicao ? parseInt(id) : Date.now(), dataAgendada, observacoes, itens };
      const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
      if (isEdicao) {
        const index = solicitacoes.findIndex(s => s.id === parseInt(id));
        solicitacoes[index] = payload;
      } else {
        solicitacoes.push(payload);
      }
      localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
      navigate('/minhas-solicitacoes');
    } catch (err) {
      setErro('Erro ao salvar solicitação.');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
            {isEdicao ? 'Editar solicitação' : 'Vamos iniciar a sua coleta?'}
          </Typography>

          {erro && (
            <Typography color="error" sx={{ mb: 2 }}>{erro}</Typography>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {materiaisConfig.map((mc, idx) => (
                <Grid size={{ xs: 12, sm: 6 }} key={mc.tipo}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" fontWeight="bold">{mc.label}</Typography>
                    <Typography sx={{ fontSize: '2rem' }}>{mc.icon}</Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, my: 1 }}>
                      <IconButton onClick={() => adjustQty(idx, -1)} size="small">
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        size="small"
                        value={materiais[idx].quantidade}
                        onChange={(e) => updateMaterial(idx, 'quantidade', Math.max(1, parseInt(e.target.value) || 1))}
                        sx={{ width: 80, textAlign: 'center' }}
                        inputProps={{ style: { textAlign: 'center' } }}
                      />
                      <Typography variant="caption">KG</Typography>
                      <IconButton onClick={() => adjustQty(idx, 1)} size="small">
                        <AddIcon />
                      </IconButton>
                    </Box>

                    <FormControl>
                      <FormLabel sx={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Estado dos materiais</FormLabel>
                      <RadioGroup row value={materiais[idx].estado}
                        onChange={(e) => updateMaterial(idx, 'estado', e.target.value)}>
                        <FormControlLabel value="RUIM" control={<Radio size="small" />} label="Ruim" />
                        <FormControlLabel value="BOM" control={<Radio size="small" />} label="Bom" />
                        <FormControlLabel value="OTIMO" control={<Radio size="small" />} label="Ótimo" />
                      </RadioGroup>
                    </FormControl>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
              Qual melhor dia para irmos buscamos?
            </Typography>
            <TextField
              type="date"
              fullWidth
              value={dataAgendada}
              onChange={(e) => setDataAgendada(e.target.value)}
              required
            />

            <TextField
              label="Observação"
              multiline
              rows={3}
              fullWidth
              margin="normal"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button type="submit" variant="contained"
                sx={{ bgcolor: '#7b1fa2', '&:hover': { bgcolor: '#6a1b9a' }, px: 5 }}>
                {isEdicao ? 'Salvar' : 'Cadastrar'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
