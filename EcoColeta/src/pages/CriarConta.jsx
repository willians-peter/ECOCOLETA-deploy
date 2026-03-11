import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
import api from '../services/api'; 
import { Container, Box, TextField, Button, Typography, Alert, Paper, MenuItem, Select, InputLabel, FormControl, FormControlLabel, Checkbox, Grid } from '@mui/material'; 

const ESTADOS_BR = [ 
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA', 
  'PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SE','SP','TO' 
]; 

export default function CriarConta() { 
  const navigate = useNavigate(); 
  const [form, setForm] = useState({ 
    username: '', 
    password: '', 
    confirmPassword: '', 
    zipCode: '', 
    street: '', 
    state: '', 
    city: '', 
    neighborhood: '', 
    number: '', 
    complement: '', 
    latitude: '', 
    longitude: '' 
  }); 
  const [confirmaLocalizacao, setConfirmaLocalizacao] = useState(false); 
  const [erro, setErro] = useState(''); 
  const [sucesso, setSucesso] = useState(''); 

  const handleChange = (field) => (e) => { 
    setForm({ ...form, [field]: e.target.value }); 
  }; 

  const buscarCep = async (zipCode) => { 
    const cepLimpo = zipCode.replace(/\D/g, ''); 
    if (cepLimpo.length === 8) { 
      try { 
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`); 
        const data = await res.json(); 
        if (!data.erro) { 
          setForm(prev => ({ 
            ...prev, 
            street: data.logradouro || '', 
            state: data.uf || '', 
            city: data.localidade || '', 
            neighborhood: data.bairro || '' 
          })); 
        } 
      } catch (e) { 
        // ignore 
      } 
    } 
  }; 

  const handleCepChange = (e) => { 
    const val = e.target.value; 
    setForm({ ...form, zipCode: val }); 
    buscarCep(val); 
  }; 

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    setErro(''); 
    setSucesso(''); 

    if (form.password !== form.confirmPassword) { 
      setErro('As senhas não coincidem.'); 
      return; 
    } 

    if (form.password.length < 10) { 
      setErro('A senha deve ter no mínimo 10 caracteres.'); 
      return; 
    } 

if (!confirmaLocalizacao) {
  setErro('Confirme que a localização exibida no mapa está correta.');
  return;
}
    try { 
      await api.post('/usuarios', { 
        username: form.username, 
        password: form.password, 
        address: { 
          zipCode: form.zipCode.replace(/\D/g, ''), 
          street: form.street, 
          state: form.state, 
          city: form.city, 
          neighborhood: form.neighborhood, 
          number: form.number, 
          complement: form.complement, 
          latitude: parseFloat(form.latitude), 
          longitude: parseFloat(form.longitude) 
        } 
      }); 

      setSucesso('Conta criada com sucesso!'); 
      setTimeout(() => navigate('/login'), 1500); 
    } catch (err) { 
      const data = err.response?.data; 
      if (data?.erro) setErro(data.erro); 
      else if (typeof data === 'object') setErro(Object.values(data).join(', ')); 
      else setErro('Erro ao criar conta.'); 
    } 
  }; 

  const mapSrc = form.latitude && form.longitude ? 
    `https://maps.google.com/maps?q=${form.latitude},${form.longitude}&z=15&output=embed` : null; 

  return ( 
    <Container maxWidth="md"> 
      <Box sx={{ mt: 4, mb: 4 }}> 
        <Paper elevation={3} sx={{ p: 4 }}> 
          <Typography variant="h4" align="center" sx={{ mb: 3, color: '#7b1fa2', fontWeight: 'bold' }}> 
            Criar conta Ecocoleta
          </Typography> 
          {erro && <Alert severity="error" sx={{ mb: 2 }}>{erro}</Alert>} 
          {sucesso && <Alert severity="success" sx={{ mb: 2 }}>{sucesso}</Alert>} 
          <Box component="form" onSubmit={handleSubmit}> 
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>Dados da conta</Typography> 
            <TextField 
              label="Username" 
              fullWidth 
              margin="normal" 
              value={form.username} 
              onChange={handleChange('username')} 
              required 
            /> 
            <Grid container spacing={2}> 
              <Grid size={{ xs: 12, sm: 6 }}> 
                <TextField 
                  label="Password" 
                  type="password" 
                  fullWidth 
                  margin="normal" 
                  value={form.password} 
                  onChange={handleChange('password')} 
                  required 
                  helperText="Mínimo 10 caracteres" 
                /> 
              </Grid> 
              <Grid size={{ xs: 12, sm: 6 }}> 
                <TextField 
                  label="Confirm Password" 
                  type="password" 
                  fullWidth 
                  margin="normal" 
                  value={form.confirmPassword} 
                  onChange={handleChange('confirmPassword')} 
                  required 
                /> 
              </Grid> 
            </Grid> 
            <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Endereço</Typography> 
            <Grid container spacing={2}> 
              <Grid size={{ xs: 12, sm: 4 }}> 
                <TextField 
                  label="Zip Code" 
                  fullWidth 
                  margin="normal" 
                  value={form.zipCode} 
                  onChange={handleCepChange} 
                  required 
                /> 
              </Grid> 
              <Grid size={{ xs: 12, sm: 8 }}> 
                <TextField 
                  label="Street" 
                  fullWidth 
                  margin="normal" 
                  value={form.street} 
                  onChange={handleChange('street')} 
                /> 
              </Grid> 
            </Grid> 
            <Grid container spacing={2}> 
              <Grid size={{ xs: 12, sm: 4 }}> 
                <FormControl fullWidth margin="normal"> 
                  <InputLabel>State</InputLabel> 
                  <Select 
                    value={form.state} 
                    label="State" 
                    onChange={handleChange('state')} 
                  > 
                    {ESTADOS_BR.map(uf => ( 
                      <MenuItem key={uf} value={uf}>{uf}</MenuItem> 
                    ))} 
                 </Select>
                </FormControl> 
              </Grid> 
              <Grid size={{ xs: 12, sm: 4 }}> 
                <TextField 
                  label="City" 
                  fullWidth 
                  margin="normal" 
                  value={form.city} 
                  onChange={handleChange('city')} 
                  required 
                /> 
              </Grid> 
              <Grid size={{ xs: 12, sm: 4 }}> 
                <TextField 
                  label="Neighborhood" 
                  fullWidth 
                  margin="normal" 
                  value={form.neighborhood} 
                  onChange={handleChange('neighborhood')} 
                  required 
                /> 
              </Grid> 
            </Grid> 
            <Grid container spacing={2}> 
              <Grid size={{ xs: 12, sm: 4 }}> 
                <TextField 
                  label="Number" 
                  fullWidth 
                  margin="normal" 
                  value={form.number} 
                  onChange={handleChange('number')} 
                  required 
                /> 
              </Grid> 
              <Grid size={{ xs: 12, sm: 8 }}> 
                <TextField 
                  label="Complement" 
                  fullWidth 
                  margin="normal" 
                  value={form.complement} 
                  onChange={handleChange('complement')} 
                /> 
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
