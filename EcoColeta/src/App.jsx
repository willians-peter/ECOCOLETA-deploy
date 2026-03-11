import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import CriarConta from './pages/CriarConta';
import MinhasSolicitacoes from './pages/MinhasSolicitacoes';
import FormularioSolicitacao from './pages/FormularioSolicitacao';
import SolicitacoesColetor from './pages/SolicitacoesColetor';

function App() {
  const { usuario } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/criar-conta" element={<CriarConta />} />

      <Route path="/minhas-solicitacoes" element={
        <ProtectedRoute perfil="RESIDENCIAL">
          <MinhasSolicitacoes />
        </ProtectedRoute>
      } />
      <Route path="/nova-solicitacao" element={
        <ProtectedRoute perfil="RESIDENCIAL">
          <FormularioSolicitacao />
        </ProtectedRoute>
      } />
      <Route path="/editar-solicitacao/:id" element={
        <ProtectedRoute perfil="RESIDENCIAL">
          <FormularioSolicitacao />
        </ProtectedRoute>
      } />

      <Route path="/solicitacoes" element={
        <ProtectedRoute perfil="COLETOR">
          <SolicitacoesColetor />
        </ProtectedRoute>
      } />

      <Route path="/" element={
        usuario
          ? usuario.perfil === 'RESIDENCIAL'
            ? <Navigate to="/minhas-solicitacoes" replace />
            : <Navigate to="/solicitacoes" replace />
          : <Navigate to="/login" replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
