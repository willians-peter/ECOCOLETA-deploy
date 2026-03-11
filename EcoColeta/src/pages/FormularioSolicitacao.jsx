import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Container, Box, Typography, TextField, Button, Paper, IconButton, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Grid, } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const materialConfig = [
  { type: "PLASTIC", label: "Plástico", icon: "🧴" },
  { type: "GLASS", label: "Vidro", icon: "🍶" },
  { type: "PAPER", label: "Papel", icon: "📄" },
  { type: "METAL", label: "Metal", icon: "🥫" },
];

export default function FormularioSolicitacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [materials, setMaterials] = useState(
    materialConfig.map((m) => ({ type: m.type, quantity: 1, condition: "GOOD", }),
    ));
  const [scheduledDate, setScheduledDate] = useState("");
  const [observations, setObservations] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (isEditing) {
      carregarSolicitacao();
    }
  }, [id]);

  const carregarSolicitacao = async () => {
    try {
      const res = await api.get("/coletas/minhas");
      const sol = res.data.find((s) => s.id === parseInt(id));
      if (sol) {
        setScheduledDate(sol.dataAgendada);
        setObservations(sol.observacoes || "");
        const mat = materialConfig.map((mc) => {
          const item = sol.itens.find((i) => i.tipo === mc.type);
          return { type: mc.type, quantity: item ? parseFloat(item.quantidadeEstimadaKg) : 1, condition: item ? item.estado : "GOOD", };
        });
        setMaterials(mat);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateMaterial = (idx, field, value) => {
    const updated = [...materials];
    updated[idx] = { ...updated[idx], [field]: value };
    setMaterials(updated);
  };

  const adjustQty = (idx, delta) => {
    const updated = [...materials];
    const newVal = Math.max(1, updated[idx].quantity + delta);
    updated[idx] = { ...updated[idx], quantity: newVal };
    setMaterials(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    if (!scheduledDate) {
      setErro("Data agendada é obrigatória.");
      return;
    }
    const itens = materials
      .filter((m) => m.quantity > 0)
      .map((m) => ({ type: m.type, quantidadeEstimadaKg: m.quantity, condition: m.condition, }));
    if (itens.length === 0) {
      setErro("Selecione pelo menos um material.");
      return;
    }
    try {
      const payload = { scheduledDate, observations, itens };
      if (isEditing) {
        await api.put(`/coletas/minhas/${id}`, payload);
      } else {
        await api.post("/coletas", payload);
      }
      navigate("/minhas-solicitacoes");
    } catch (err) {
      setErro(err.response?.data?.erro || "Erro ao salvar solicitação.");
    }
  };

 return (
  <>
    <Navbar />
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: "bold" }} >
          {isEditing ? "Editar solicitação" : "Vamos iniciar a sua coleta?"}
        </Typography>
        {erro && (
          <Typography color="error" sx={{ mb: 2 }}>
            {erro}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {materialConfig.map((mc, idx) => (
              <Grid size={{ xs: 12, sm: 6 }} key={mc.type}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h6" fontWeight="bold">
                    {mc.label}
                  </Typography>
                  <Typography sx={{ fontSize: "2rem" }}>{mc.icon}</Typography>
                  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, my: 1, }} >
                    <IconButton onClick={() => adjustQty(idx, -1)} size="small" >
                      <RemoveIcon />
                    </IconButton>
                    <TextField size="small" value={materials[idx].quantity} onChange={(e) => updateMaterial(
                        idx,
                        "quantity",
                        Math.max(1, parseInt(e.target.value) || 1),
                      ) } sx={{ width: 80, textAlign: "center" }} inputProps={{ style: { textAlign: "center" } }} />
                    <Typography variant="caption">KG</Typography>
                    <IconButton onClick={() => adjustQty(idx, 1)} size="small" >
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <FormControl>
                    <FormLabel sx={{ fontSize: "0.85rem", fontWeight: "bold" }} >
                      Estado dos materiais
                    </FormLabel>
                    <RadioGroup row value={materials[idx].condition} onChange={(e) => updateMaterial(idx, "condition", e.target.value) } >
                      <FormControlLabel value="RUIM" control={<Radio size="small" />} label="Ruim" />
                      <FormControlLabel value="BOM" control={<Radio size="small" />} label="Bom" />
                      <FormControlLabel value="OTIMO" control={<Radio size="small" />} label="Ótimo" />
                    </RadioGroup>
                  </FormControl>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: "bold" }}>
            Qual melhor dia para irmos buscamos?
          </Typography>
          <TextField type="date" fullWidth value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} required />
          <TextField label="Observação" multiline rows={3} fullWidth margin="normal" value={observations} onChange={(e) => setObservations(e.target.value)} />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button type="submit" variant="contained" sx={{ bgcolor: "#7b1fa2", "&:hover": { bgcolor: "#6a1b9a" }, px: 5, }} >
              {isEditing ? "Salvar" : "Cadastrar"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  </>
);
}
