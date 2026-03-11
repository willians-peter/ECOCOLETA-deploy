import { createContext, useContext, useState, useEffect } from "react"; // Adicionado useEffect
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem("usuario");
    return saved ? JSON.parse(saved) : null;
  });

  // --- LÓGICA DE SEED PARA APRESENTAÇÃO ---
  useEffect(() => {
    const DB_USERS = 'joingreen_users';
    const existingUsers = localStorage.getItem(DB_USERS);

    if (!existingUsers || JSON.parse(existingUsers).length === 0) {
      const initialUsers = [
        { id: 101, username: 'coletor1', password: 'coletor12345', perfil: 'COLETOR', nome: 'Carlos Coletor' },
        { id: 102, username: 'coletor2', password: 'coletor12345', perfil: 'COLETOR', nome: 'Marcos Coletor' },
        { id: 103, username: 'coletor3', password: 'coletor12345', perfil: 'COLETOR', nome: 'Julia Coletora' },
        // Adicionei um usuário residencial para facilitar seus testes também
        { id: 201, username: 'user1', password: '123', perfil: 'RESIDENCIAL', nome: 'Miguel Silva' }
      ];
      localStorage.setItem(DB_USERS, JSON.stringify(initialUsers));
      console.log("✅ Dados de demonstração carregados no LocalStorage!");
    }
  }, []);
  // ---------------------------------------

  const login = async (username, password) => {
    const response = await api.post("/login", { username, password });
    const user = response.data;
    setUsuario(user);
    localStorage.setItem("usuario", JSON.stringify(user));
    return user;
  };

  const logout = async () => {
    // Como estamos mockando, apenas limpamos o estado e o storage
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}