// src/services/api.js
const DB_KEYS = {
  USERS: 'joingreen_users',
  COLETAS: 'joingreen_coletas'
};

// Funções auxiliares para simular o banco
const getDb = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const saveDb = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const api = {
  // Simulação de POST
  post: async (url, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url === '/usuarios') {
          const users = getDb(DB_KEYS.USERS);
          const newUser = { ...data, id: Date.now(), perfil: 'RESIDENCIAL' };
          users.push(newUser);
          saveDb(DB_KEYS.USERS, users);
          resolve({ data: newUser });
        }
        
        if (url === '/login') {
          const users = getDb(DB_KEYS.USERS);
          const user = users.find(u => u.username === data.username && u.password === data.password);
          // Adicionamos um usuário padrão caso o banco esteja vazio para a sua demo
          if (!user && data.username === 'admin') {
             resolve({ data: { username: 'admin', perfil: 'RESIDENCIAL', id: 1 } });
          }
          user ? resolve({ data: user }) : reject({ response: { data: { erro: 'Usuário ou senha inválidos' } } });
        }

        if (url === '/coletas') {
          const coletas = getDb(DB_KEYS.COLETAS);
          const novaColeta = { 
            ...data, 
            id: Math.floor(Math.random() * 1000), 
            status: 'AGUARDANDO',
            items: data.itens // Ajuste para bater com o mapeamento do seu componente
          };
          coletas.push(novaColeta);
          saveDb(DB_KEYS.COLETAS, coletas);
          resolve({ data: novaColeta });
        }
      }, 500); // Delay de 500ms para parecer real
    });
  },

  // Simulação de GET
  get: async (url, config) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url === '/coletas/minhas' || url === '/coletas/disponiveis') {
          resolve({ data: getDb(DB_KEYS.COLETAS) });
        }
      }, 400);
    });
  },

  // Simulação de PATCH (Status e Feedback)
  patch: async (url, data) => {
    const coletas = getDb(DB_KEYS.COLETAS);
    const id = parseInt(url.split('/')[2]);
    const index = coletas.findIndex(c => c.id === id);

    if (url.includes('cancelar')) coletas[index].status = 'CANCELADA';
    if (url.includes('aceitar')) coletas[index].status = 'ACEITA';
    if (url.includes('finalizar')) coletas[index].status = 'FINALIZADA';
    if (url.includes('feedback')) coletas[index].feedback = data.feedback;

    saveDb(DB_KEYS.COLETAS, coletas);
    return { data: coletas[index] };
  }
};

export default api;