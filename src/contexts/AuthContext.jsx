import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem("usuario");
    return saved ? JSON.parse(saved) : null;
  });

  const [coletas, setColetas] = useState(() => {
    const saved = localStorage.getItem("coletas");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuarios.length === 0) {
      const usuariosIniciais = [
        {
          nomeDeUsuario: "usuario1",
          senha: "usuario12345",
          perfil: "RESIDENCIAL",
          endereco: {
            cep: "89202050",
            logradouro: "Rua Doutor Plácido Gomes",
            estado: "SC",
            cidade: "Joinville",
          },
        },
        {
          nomeDeUsuario: "usuario2",
          senha: "usuario12345",
          perfil: "RESIDENCIAL",
          endereco: {
            cep: "89202050",
            logradouro: "Rua Doutor Plácido Gomes",
            estado: "SC",
            cidade: "Joinville",
          },
        },
        {
          nomeDeUsuario: "usuario3",
          senha: "usuario12345",
          perfil: "RESIDENCIAL",
          endereco: {
            cep: "89202050",
            logradouro: "Rua Doutor Plácido Gomes",
            estado: "SC",
            cidade: "Joinville",
          },
        },
        {
          nomeDeUsuario: "coletor1",
          senha: "12345coletor",
          perfil: "COLETOR",
          endereco: {
            cep: "89202050",
            logradouro: "Rua Doutor Plácido Gomes",
            estado: "SC",
            cidade: "Joinville",
          },
        },
        {
          nomeDeUsuario: "coletor2",
          senha: "12345coletor",
          perfil: "COLETOR",
          endereco: {
            cep: "89202050",
            logradouro: "Rua Doutor Plácido Gomes",
            estado: "SC",
            cidade: "Joinville",
          },
        },
        {
          nomeDeUsuario: "coletor3",
          senha: "12345coletor",
          perfil: "COLETOR",
          endereco: {
            cep: "89202050",
            logradouro: "Rua Doutor Plácido Gomes",
            estado: "SC",
            cidade: "Joinville",
          },
        },
      
     ];
      localStorage.setItem("usuarios", JSON.stringify(usuariosIniciais));
    }

    const coletasIniciais = [
      { id: 1772823608640, dataAgendada: "2026-03-27", observacoes: "ok" },
      { id: 1772823628922, dataAgendada: "2026-04-08", observacoes: "2" },
      { id: 1772823645682, dataAgendada: "2026-03-16", observacoes: "3" },
    ];
    if (coletas.length === 0) {
      localStorage.setItem('coletas', JSON.stringify(coletasIniciais));
      setColetas(coletasIniciais);
    }
  }, []);

  

  const login = (nomeDeUsuario, senha) => {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const user = usuarios.find(
      (u) => u.nomeDeUsuario === nomeDeUsuario && u.senha === senha,
    );
    if (user) {
      setUsuario(user);
      localStorage.setItem("usuario", JSON.stringify(user));
      return user;
    } else {
      throw new Error("Usuário ou senha inválidos");
    }
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ usuario, coletas, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
