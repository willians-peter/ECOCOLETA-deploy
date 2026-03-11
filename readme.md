# EcoColeta
**Uma Joinville mais verde, uma cidade mais limpa!**

## A solução para suas coletas seletivas

Você já teve dificuldade para saber quando o coletor passará? Ou ficou na dúvida de como separar corretamente seus materiais recicláveis? 

Não se preocupe mais! O EcoColeta veio para transformar essa experiência. 

Conectamos moradores que querem fazer a diferença com coletores dedicados, tornando a reciclagem algo simples, rápido e eficiente. Agora você pode:

🏠 **Solicitar coletas** com poucos cliques  
📅 **Acompanhar em tempo real** o status da sua solicitação  
🌱 **Contribuir** para uma Joinville mais verde e sustentável  
♻️ **Transformar lixo** em oportunidade de um futuro melhor

Chega de incertezas e complicações. Com o EcoColeta, sua contribuição para o meio ambiente nunca foi tão prática!

## Técnicas e tecnologias
- **React 18** com Hooks (useState, useEffect)
- **React Router DOM** para navegação entre páginas
- **Material UI (MUI)** para interface moderna e responsiva
- **Axios** para comunicação com API REST
- **Context API** para gerenciamento de estado de autenticação
- **JavaScript ES6+** com sintaxe moderna
- **CSS-in-JS** através do sistema de styled components do MUI

## Arquitetura (visão rápida)
Fluxo principal da aplicação:
1. Componentes de página consomem a API via Axios
2. Context API gerencia estado global de autenticação
3. React Router controla navegação e rotas protegidas
4. Material UI fornece componentes consistentes e responsivos

Estrutura de pastas (principais):
```
src/
├── components/     # Componentes reutilizáveis (Navbar, etc.)
├── contexts/       # Contextos React (AuthContext)
├── pages/          # Páginas principais da aplicação
├── services/       # Configuração da API (Axios)
└── App.jsx         # Configuração de rotas e temas
```

## Funcionalidades implementadas

### Autenticação e Cadastro
- **Login** (`/login`): Autenticação de usuários com redirecionamento por perfil
- **Criar Conta** (`/criar-conta`): Cadastro completo com validação de CEP e localização

### Área do Residencial
- **Minhas Solicitações** (`/minhas-solicitacoes`): Listagem de coletas do usuário
- **Nova Solicitação** (`/nova-solicitacao`): Formulário para criar pedidos de coleta
- **Editar Solicitação** (`/editar-solicitacao/:id`): Edição de solicitações existentes

### Área do Coletor
- **Solicitações Disponíveis** (`/solicitacoes`): Painel para visualizar e gerenciar coletas
- **Filtros**: Por data e status das solicitações
- **Validação de Materiais**: Confirmação de itens coletados
- **Feedback**: Sistema de avaliação pós-coleta

## Dados iniciais (seed)

Ao subir a aplicação, é executado um `DataSeeder` que cria coletores iniciais (se ainda não existirem):

- **coletor1** / senha: `coletor1` 
- **coletor2** / senha: `coletor2` 
- **coletor3** / senha: `coletor3` 

Essas contas podem ser usadas para testar a funcionalidade do coletor no sistema.

## Como executar (local)

### Requisitos
- **Node.js 18+** instalado e configurado
- **npm** ou **yarn** para gerenciamento de pacotes
- **API Backend** rodando em `http://localhost:8080`

### Instalação e execução
Na raiz do projeto:

```bash
# Instalar dependências
npm install

### Instalação de dependências
Este projeto utiliza Material UI para a interface. Instale as dependências necessárias:

```bash
# Instalar dependências do Material UI
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

# Iniciar servidor de desenvolvimento
npm start
```

A aplicação estará disponível em:
- `http://localhost:5173`

### Variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```
REACT_APP_API_URL=http://localhost:8080
```

## Como testar rapidamente

### Fluxo completo de teste:
1. **Criar conta de morador**:
   - Acesse `/criar-conta`
   - Preencha o formulário com dados válidos
   - Confirme a localização no mapa

2. **Fazer login**:
   - Acesse `/login`
   - Use as credenciais criadas

3. **Criar solicitação**:
   - Clique em "Novo" 
   - Adicione materiais para coleta
   - Agende uma data

4. **Simular coleta**:
   - Faça login como coletor
   - Visualize solicitações disponíveis
   - Aceite e finalize uma coleta

## Telas e Componentes

### Página de Login
- Formulário de autenticação com Material UI
- Redirecionamento automático por perfil (RESIDENTIAL/COLLECTOR)
- Tratamento de erros e validações

### Dashboard Residencial
- Cards responsivos para cada solicitação
- Status visual com chips coloridos
- Ações contextuais (editar/cancelar/feedback)
- Exibição de datas formatadas e relativas

### Painel do Coletor
- Listagem com filtros avançados
- Modal de validação de materiais
- Sistema de feedback pós-coleta
- Interface otimizada para mobile

## Melhorias sugeridas (próximos passos)
- **Adicionar testes unitários** com Jest e React Testing Library
- **Implementar tema dark mode** para melhor acessibilidade
- **Otimizar performance** com lazy loading de componentes
- **Adicionar notificações** push para novas solicitações
- **Implementar offline support** com Service Workers
- **Melhorar acessibilidade** com ARIA labels e navegação por teclado
- **Adicionar animações** e micro-interações
- **Implementar sistema de avaliação** com estrelas
- **Criar dashboard administrativo** com gráficos e métricas

## Deploy
Para produção:
```bash
# Build para produção
npm run build

# O build será gerado na pasta /build
# Configure seu servidor para servir os arquivos estáticos
```

## Contribuição
Este projeto foi desenvolvido pelo Squad 2 durante o Módulo 3 do programa FuturoDEV Joinville.

### 👥 Desenvolvedores

- **[Peter]** - [https://github.com/willians-peter]
- **[Mayara]** - [https://github.com/MayTorq]
- **[Fernando]** - [https://github.com/FernandoBack]
- **[Leonardo]** - [https://github.com/leonardosantos-hdsd]

---

**Tecnologia a serviço do meio ambiente! 🌱♻️**
