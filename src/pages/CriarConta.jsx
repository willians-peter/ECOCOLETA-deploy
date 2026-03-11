import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Alert, Paper, MenuItem, Select, InputLabel, FormControl, FormControlLabel, Checkbox, Grid } from '@mui/material';

const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SE', 'SP', 'TO'
];

export default function CriarConta() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nomeDeUsuario: '',
    senha: '',
    confirmarSenha: '',
    cep: '',
    logradouro: '',
    estado: '',
    cidade: '',
    bairro: '',
    numero: '',
    complemento: '',
    latitude: '',
    longitude: ''
  });
  const [confirmaLocalizacao, setConfirmaLocalizacao] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setForm(prev => ({
            ...prev,
            logradouro: data.logradouro || '',
            estado: data.uf || '',
            cidade: data.localidade || '',
            bairro: data.bairro || ''
          }));
        }
      } catch (e) {
        // ignore
      }
    }
  };

  const handleCepChange = (e) => {
    const val = e.target.value;
    setForm({ ...form, cep: val });
    buscarCep(val);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setErro('');
  setSucesso('');
  if (form.senha !== form.confirmarSenha) {
    setErro('As senhas não coincidem.');
    return;
  }
  if (form.senha.length < 10) {
    setErro('A senha deve ter no mínimo 10 caracteres.');
    return;
  }
  if (!confirmaLocalizacao) {
    setErro('Confirme que a localização exibida no mapa está correta.');
    return;
  }
  console.log('Submit');
  try {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push({
      nomeDeUsuario: form.nomeDeUsuario,
      senha: form.senha,
      perfil: 'RESIDENCIAL',
      endereco: {
        cep: form.cep.replace(/\D/g, ''),
        logradouro: form.logradouro,
        estado: form.estado,
        cidade: form.cidade,
        bairro: form.bairro,
        numero: form.numero,
        complemento: form.complemento,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude)
        
      }
     
    });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    setSucesso('Conta criada com sucesso!');
    setTimeout(() => navigate('/login'), 1500);
  } catch (err) {
    setErro('Erro ao criar conta.');
  }
};


  


  const mapSrc = form.latitude && form.longitude ? `https://maps.google.com/maps?q=${form.latitude},${form.longitude}&z=15&output=embed` : null;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" sx={{ mb: 3, color: '#7b1fa2', fontWeight: 'bold' }}>
            Criar conta  Ecocolleta
          </Typography>

          {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>}
          {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>Dados da conta</Typography>
            <TextField label="Nome de usuário" fullWidth margin="normal"
              value={form.nomeDeUsuario} onChange={handleChange('nomeDeUsuario')} required />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Senha" type="password" fullWidth margin="normal"
                  value={form.senha} onChange={handleChange('senha')} required
                  helperText="Mínimo 10 caracteres" />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Confirmar senha" type="password" fullWidth margin="normal"
                  value={form.confirmarSenha} onChange={handleChange('confirmarSenha')} required />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Endereço</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField label="CEP" fullWidth margin="normal"
                  value={form.cep} onChange={handleCepChange} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField label="Logradouro" fullWidth margin="normal"
                  value={form.logradouro} onChange={handleChange('logradouro')} />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Estado</InputLabel>
                  <Select value={form.estado} label="Estado" onChange={handleChange('estado')}>
                    {ESTADOS_BR.map(uf => (
                      <MenuItem key={uf} value={uf}>{uf}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField label="Cidade" fullWidth margin="normal"
                  value={form.cidade} onChange={handleChange('cidade')} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField label="Bairro" fullWidth margin="normal"
                  value={form.bairro} onChange={handleChange('bairro')} required />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField label="Número" fullWidth margin="normal"
                  value={form.numero} onChange={handleChange('numero')} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField label="Complemento" fullWidth margin="normal"
                  value={form.complemento} onChange={handleChange('complemento')} />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold', color: '#e65100' }}>
              GeoLocalização
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Latitude" fullWidth margin="normal" type="number"
                  inputProps={{ step: 'any' }}
                  value={form.latitude} onChange={handleChange('latitude')} required />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Longitude" fullWidth margin="normal" type="number"
                  inputProps={{ step: 'any' }}
                  value={form.longitude} onChange={handleChange('longitude')} required />
              </Grid>
            </Grid>

            {mapSrc && (
              <Box sx={{ mt: 2 }}>
                <iframe
                  id="mapa"
                  src={mapSrc}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Mapa de localização"
                />
              </Box>
            )}

            <FormControlLabel
              control={
                <Checkbox checked={confirmaLocalizacao}
                  onChange={(e) => setConfirmaLocalizacao(e.target.checked)} />
              }
              label="Confirmo que essa é a localização informada"
              sx={{ mt: 1 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <Button variant="outlined" onClick={() => navigate('/login')}>Cancelar</Button>
              <Button type="submit" variant="contained"
                sx={{ bgcolor: '#e65100', '&:hover': { bgcolor: '#d84315' } }}>
                Cadastrar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
