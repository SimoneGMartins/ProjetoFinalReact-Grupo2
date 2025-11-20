# Blog Jardim - Projeto Final React

## 📌 Descrição

O **Blog Jardim** é uma aplicação web completa construída em **React**, desenvolvida como projeto final da disciplina de React 2025-2. O projeto é um blog interativo que permite aos usuários criar, editar, visualizar e buscar posts sobre jardinagem e temas relacionados. A aplicação inclui sistema de autenticação, perfil de usuário, chatbot assistente com IA, modo escuro/claro e uma interface moderna e responsiva.

## 🛠️ Tecnologias

- **React 19.1.1** - Biblioteca JavaScript para construção de interfaces
- **React Router DOM 7.9.5** - Roteamento e navegação
- **Vite 7.1.7** - Build tool e servidor de desenvolvimento
- **Axios 1.13.2** - Cliente HTTP para requisições à API
- **React Hook Form 7.66.0** - Gerenciamento de formulários
- **Yup 1.7.1** - Validação de esquemas
- **React Toastify 11.0.5** - Notificações toast
- **Lucide React 0.553.0** - Ícones modernos
- **CSS Modules** - Estilização com escopo local
- **n8n** - Automação de workflows para o chatbot (via webhook)

## 🚀 Funcionalidades

### Autenticação e Usuários

- ✅ Sistema de login e cadastro de novos usuários
- ✅ Perfil de usuário com edição de dados pessoais
- ✅ Rotas protegidas (requerem autenticação)
- ✅ Persistência de sessão via localStorage
- ✅ Context API para gerenciamento de estado de autenticação

### Posts

- ✅ Listagem de todos os posts na página inicial
- ✅ Visualização detalhada de posts individuais
- ✅ Criação de novos posts (apenas usuários autenticados)
- ✅ Edição de posts existentes
- ✅ Sistema de busca e filtros (por título ou autor)
- ✅ Paginação com carregamento progressivo (5 posts por vez)
- ✅ Exibição de informações do autor, data de publicação e curtidas

### Interface e UX

- ✅ Modo escuro/claro com persistência de preferência
- ✅ Layout responsivo com Header, Sidebar e Footer
- ✅ Componentes reutilizáveis (InputEmail, InputPassword)
- ✅ Validação de formulários com React Hook Form + Yup
- ✅ Feedback visual com notificações toast
- ✅ Loading states e estados vazios

### Chatbot Assistente

- ✅ Chatbot integrado com IA via n8n webhook
- ✅ Respostas baseadas no contexto dos posts do blog
- ✅ Sugestão de posts relacionados às perguntas
- ✅ Interface de chat moderna e intuitiva
- ✅ Disponível apenas para usuários autenticados

## 💻 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18+ recomendada)
- [Git](https://git-scm.com/)
- [n8n](https://n8n.io/) (opcional, apenas se quiser usar o chatbot localmente)

## 📂 Como clonar o projeto

Abra o terminal na pasta desejada e digite:

```bash
git clone https://github.com/SimoneGMartins/ProjetoFinalReact-Grupo2.git
cd ProjetoFinalReact-Grupo2
```

## ⚡ Instalação

Instale as dependências do projeto com:

```bash
npm install
```

## 🔧 Configuração

### Variáveis de Ambiente

Para usar o chatbot, você precisa configurar a URL do webhook do n8n. Crie um arquivo `.env` na raiz do projeto:

```env
VITE_N8N_WEBHOOK_URL=https://seu-webhook-n8n.com/webhook-test/seu-id
```

**Nota:** Se você estiver usando o n8n localmente, a URL será algo como:

```env
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook-test/seu-id
```

Para mais detalhes sobre a configuração do webhook, consulte o arquivo [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md).

## 🏃‍♂️ Rodando o projeto

Para iniciar a aplicação em modo de desenvolvimento:

```bash
npm run dev
```

Depois abra o navegador em `http://localhost:5173/`.

### Outros comandos disponíveis

```bash
# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Executar linter
npm run lint
```

## 📝 Estrutura de Pastas

```text
ProjetoFinalReact-Grupo2/
│
├─ public/              # Arquivos públicos
├─ src/
│   ├─ assets/         # Imagens e recursos estáticos
│   ├─ components/     # Componentes reutilizáveis
│   │   ├─ Chatbot/    # Componente do chatbot assistente
│   │   ├─ Footer/     # Rodapé da aplicação
│   │   ├─ Header/     # Cabeçalho da aplicação
│   │   ├─ ProtectedRoute/  # Componente de rota protegida
│   │   ├─ Sidebar/    # Barra lateral de navegação
│   │   └─ ui/         # Componentes de UI (InputEmail, InputPassword)
│   ├─ context/        # Context API (AuthContext)
│   ├─ layout/         # Layouts da aplicação (MainLayout, LoginLayout)
│   ├─ routes/         # Configuração de rotas (AppRouter)
│   ├─ screens/        # Páginas/telas da aplicação
│   │   ├─ CreatePost/ # Criar novo post
│   │   ├─ EditPost/   # Editar post existente
│   │   ├─ Home/       # Página inicial com listagem de posts
│   │   ├─ Login/      # Página de login
│   │   ├─ NewAccount/ # Página de cadastro
│   │   ├─ PostDetails/# Detalhes de um post específico
│   │   └─ Profile/    # Perfil do usuário
│   ├─ styles/         # Estilos globais (Global.css, normalize.css)
│   ├─ App.jsx         # Componente principal
│   └─ main.jsx        # Ponto de entrada do React
├─ .gitignore
├─ eslint.config.js
├─ package.json
├─ README.md
├─ vite.config.js
└─ WEBHOOK_SETUP.md    # Documentação de configuração do webhook
```

## 🔌 APIs Utilizadas

### Backend de Posts

- **URL:** `https://blogjardim.onrender.com`
- **Descrição:** API REST para gerenciamento de posts (CRUD completo)

### MockAPI (Usuários)

- **URL:** `https://6910d54c7686c0e9c20bd4c8.mockapi.io`
- **Descrição:** API para gerenciamento de usuários (autenticação e perfil)

### n8n Webhook (Chatbot)

- **URL:** Configurável via variável de ambiente `VITE_N8N_WEBHOOK_URL`
- **Descrição:** Webhook para processamento de mensagens do chatbot com IA

## 🎨 Recursos Visuais

- Design moderno e limpo
- Suporte a modo escuro/claro
- Interface responsiva para diferentes tamanhos de tela
- Componentes com animações suaves
- Ícones da biblioteca Lucide React

## 🔐 Rotas da Aplicação

### Rotas Públicas

- `/` - Página inicial com listagem de posts
- `/login` - Página de login
- `/new-account` - Página de cadastro

### Rotas Protegidas (requerem autenticação)

- `/create-post` - Criar novo post
- `/edit-post/:id` - Editar post existente
- `/post-details/:id` - Visualizar detalhes de um post
- `/profile` - Perfil do usuário

## 🤝 Contribuidores

- Amanda Lisboa Ramos
- Bruno Ireno do Nascimento
- Lucas Gomes
- Renan Melo
- Simone Gomes Martins

## 📄 Licença

Este projeto foi desenvolvido como trabalho acadêmico para a disciplina de React 2025-2.

---

## 💝 Desenvolvido com ❤️ pelo Grupo 2
